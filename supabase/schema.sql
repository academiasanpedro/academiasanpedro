-- ==========================================
-- ACADEMIA SAN PEDRO - DATABASE SCHEMA (base)
-- Instalación nueva: ejecutar este fichero y después supabase/migrations/*.sql en orden.
-- Resumen consolidado: AcademiaSanPedro/05_Database.md
-- ==========================================

-- 1. Custom Types (Enums)
CREATE TYPE public.user_role AS ENUM ('student', 'admin');
CREATE TYPE public.test_status AS ENUM ('pending_review', 'evaluated');

-- 2. Profiles Table (Extends auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    role public.user_role DEFAULT 'student'::public.user_role NOT NULL,
    test_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Leads Questionnaire Table
CREATE TABLE public.leads_questionnaire (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    target_language TEXT NOT NULL,
    current_level TEXT,
    goals TEXT,
    preferred_schedule TEXT,
    internal_note TEXT, -- Admin notes
    status TEXT DEFAULT 'Interesado', -- e.g. Interesado, Contactado, Matriculado
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Level Tests Table
CREATE TABLE public.level_tests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    language TEXT NOT NULL,
    score INTEGER DEFAULT 0,
    max_score INTEGER DEFAULT 40,
    answers JSONB NOT NULL DEFAULT '{}'::jsonb,
    assigned_level TEXT, -- B1, B2, etc. (Assigned by admin)
    status public.test_status DEFAULT 'pending_review'::public.test_status NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Función para comprobar si es admin sin causar recursión infinita
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Habilitar RLS en todas las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads_questionnaire ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.level_tests ENABLE ROW LEVEL SECURITY;

-- Políticas para Profiles
-- Admin puede ver y editar todo. Usuarios ven y editan su propio perfil.
CREATE POLICY "Users can view own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
    ON public.profiles FOR SELECT 
    USING (public.is_admin());

CREATE POLICY "Admins can update all profiles" 
    ON public.profiles FOR UPDATE 
    USING (public.is_admin());

-- Políticas para Leads Questionnaire
CREATE POLICY "Users can view own questionnaire" 
    ON public.leads_questionnaire FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own questionnaire" 
    ON public.leads_questionnaire FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all questionnaires" 
    ON public.leads_questionnaire FOR SELECT 
    USING (public.is_admin());

CREATE POLICY "Admins can update questionnaires" 
    ON public.leads_questionnaire FOR UPDATE 
    USING (public.is_admin());

-- Políticas para Level Tests
CREATE POLICY "Users can view own tests" 
    ON public.level_tests FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tests" 
    ON public.level_tests FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all tests" 
    ON public.level_tests FOR SELECT 
    USING (public.is_admin());

CREATE POLICY "Admins can update tests" 
    ON public.level_tests FOR UPDATE 
    USING (public.is_admin());

-- ==========================================
-- TRIGGERS PARA AUTH.USERS
-- ==========================================
-- Cuando un usuario se registra en Supabase Auth, se crea su perfil automáticamente.

CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        new.id, 
        new.email, 
        new.raw_user_meta_data->>'full_name'
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger firing when a user is inserted into auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
