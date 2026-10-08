# 🎓 Academia de Idiomas San Pedro — Plataforma Web

Web de captación y gestión de alumnos de la Academia de Idiomas San Pedro (Huelva): landing comercial, registro, cuestionario inicial, test de nivel online evaluado por profesores y panel de administración (CRM, tests, mailing y textos legales).

## 🛠️ Stack

- **Next.js 16** (App Router, Server Actions, React 19) + **TypeScript** estricto
- **Tailwind CSS v4** con tokens de diseño en `web/src/app/globals.css`
- **Supabase**: Auth (email + Google), Postgres con RLS
- **React Hook Form + Zod** (mismos esquemas en cliente y servidor)
- **Nodemailer (Gmail)** para emails · **Playwright** para tests e2e
- Despliegue en **Netlify** (`netlify.toml`)

## 📂 Estructura

```text
academiasanpedro/
├── CLAUDE.md / GEMINI.md / .cursorrules   # Contexto para agentes IA (idénticos)
├── AcademiaSanPedro/                      # Vault de Obsidian (local, no se sube a git)
├── supabase/
│   ├── schema.sql                         # Esquema base
│   └── migrations/                        # Cambios posteriores, en orden
└── web/                                   # Aplicación Next.js
    ├── src/app/
    │   ├── (site)/        # Landing y páginas legales (header + footer)
    │   ├── (auth)/auth/   # Login, registro, verificación y recuperación de contraseña
    │   ├── auth/          # Callback OAuth/email y cierre de sesión (POST)
    │   ├── dashboard/     # Área del alumno: panel, cuestionario, test de nivel, perfil
    │   ├── admin/         # Panel admin: resumen, tests, CRM, mailing, legal, configuración
    │   └── actions/       # Server Actions (única vía de escritura)
    ├── src/components/    # ui (primitivas) · features · landing · layout · admin · dashboard
    ├── src/lib/           # auth, email, constantes de negocio, validadores Zod, Supabase
    ├── src/proxy.ts       # Protección de /dashboard y /admin
    └── tests/             # Tests e2e (Playwright)
```

## 🚀 Puesta en marcha

1. **Base de datos** (Supabase → SQL Editor): ejecuta `supabase/schema.sql` si es un proyecto nuevo y, después, cada fichero de `supabase/migrations/` en orden. En un proyecto existente basta con las migraciones pendientes.
2. **Auth** (Supabase → Authentication → URL Configuration): añade `http://localhost:3000/auth/callback` y `https://<tu-dominio>/auth/callback` a *Redirect URLs*.
3. **Variables de entorno**:
   ```bash
   cd web
   cp .env.example .env.local   # y rellena los valores
   ```
4. **Arrancar**:
   ```bash
   npm install
   npm run dev        # http://localhost:3000
   ```
5. **Primer administrador**: regístrate en la web y ejecuta en el SQL Editor  
   `update public.profiles set role = 'admin' where email = 'tu@email.com';`

## ✅ Calidad

```bash
npm run lint                 # ESLint (incluye reglas del React Compiler)
npm run build                # Build de producción + type check
npx playwright test          # Tests e2e (arranca el servidor de desarrollo)
```

## 🔐 Seguridad

- Toda escritura pasa por Server Actions con validación Zod y comprobación de sesión/rol en servidor.
- RLS en todas las tablas; triggers impiden que un alumno cambie su rol o fuerce estados (`supabase/migrations/001_hardening.sql`).
- Las respuestas correctas del test nunca se envían al navegador; la corrección se hace en el servidor.
- Mailing solo a usuarios con consentimiento, en copia oculta y por lotes.

Documentación funcional y técnica detallada: vault `AcademiaSanPedro/` (ver índice en `CLAUDE.md`).
