-- ==========================================
-- 001 · Endurecimiento de seguridad y tablas que faltaban
-- Ejecutar UNA vez en Supabase → SQL Editor. Es idempotente (se puede repetir).
-- ==========================================

-- 1. Consentimiento de comunicaciones comerciales (LSSI/RGPD)
ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS marketing_consent BOOLEAN NOT NULL DEFAULT false;

-- 2. Alta de perfil: copia nombre (email o Google) y consentimiento desde la metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, marketing_consent)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
        COALESCE((new.raw_user_meta_data->>'marketing_consent')::boolean, false)
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN new;
END;
$$;

-- 3. Un alumno no puede ascenderse a admin ni cambiar su email desde la API.
--    Solo actúa en peticiones de usuarios autenticados (el SQL Editor no se ve afectado).
CREATE OR REPLACE FUNCTION public.protect_profile_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF auth.uid() IS NOT NULL AND NOT public.is_admin() THEN
        new.role := old.role;
        new.email := old.email;
        new.test_enabled := old.test_enabled;
    END IF;
    new.updated_at := now();
    RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS protect_profile_columns ON public.profiles;
CREATE TRIGGER protect_profile_columns
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.protect_profile_columns();

-- 4. Valores iniciales forzados en inserciones de alumnos
CREATE OR REPLACE FUNCTION public.protect_questionnaire_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF auth.uid() IS NOT NULL AND NOT public.is_admin() THEN
        new.status := 'Interesado';
        new.internal_note := NULL;
    END IF;
    RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS protect_questionnaire_insert ON public.leads_questionnaire;
CREATE TRIGGER protect_questionnaire_insert
    BEFORE INSERT ON public.leads_questionnaire
    FOR EACH ROW EXECUTE FUNCTION public.protect_questionnaire_insert();

CREATE OR REPLACE FUNCTION public.protect_level_test_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF auth.uid() IS NOT NULL AND NOT public.is_admin() THEN
        new.status := 'pending_review';
        new.assigned_level := NULL;
        new.completed_at := now();
    END IF;
    RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS protect_level_test_insert ON public.level_tests;
CREATE TRIGGER protect_level_test_insert
    BEFORE INSERT ON public.level_tests
    FOR EACH ROW EXECUTE FUNCTION public.protect_level_test_insert();

-- 5. Tablas usadas por la app que no estaban en schema.sql
CREATE TABLE IF NOT EXISTS public.global_test (
    id INTEGER PRIMARY KEY DEFAULT 1,
    test_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO public.global_test (id, test_data)
SELECT 1, '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.global_test WHERE id = 1);

CREATE TABLE IF NOT EXISTS public.legal_pages (
    slug TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL DEFAULT '',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO public.legal_pages (slug, title, content)
SELECT v.slug, v.title, ''
FROM (VALUES
    ('aviso-legal', 'Aviso Legal'),
    ('privacidad', 'Política de Privacidad'),
    ('cookies', 'Política de Cookies')
) AS v(slug, title)
WHERE NOT EXISTS (SELECT 1 FROM public.legal_pages p WHERE p.slug = v.slug);

-- 6. RLS de global_test y legal_pages: se eliminan políticas previas (pudieran ser permisivas)
DO $$
DECLARE p RECORD;
BEGIN
    FOR p IN
        SELECT policyname, tablename FROM pg_policies
        WHERE schemaname = 'public' AND tablename IN ('global_test', 'legal_pages')
    LOOP
        EXECUTE format('DROP POLICY %I ON public.%I', p.policyname, p.tablename);
    END LOOP;
END $$;

ALTER TABLE public.global_test ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read level test"
    ON public.global_test FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Admins manage level test"
    ON public.global_test FOR ALL TO authenticated
    USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Anyone can read legal pages"
    ON public.legal_pages FOR SELECT
    USING (true);

CREATE POLICY "Admins manage legal pages"
    ON public.legal_pages FOR ALL TO authenticated
    USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 7. Índices para las consultas del panel
CREATE INDEX IF NOT EXISTS leads_questionnaire_user_id_idx ON public.leads_questionnaire (user_id);
CREATE INDEX IF NOT EXISTS level_tests_user_id_idx ON public.level_tests (user_id);
CREATE INDEX IF NOT EXISTS level_tests_status_completed_idx ON public.level_tests (status, completed_at DESC);
