# 🎓 Academia de Idiomas San Pedro — Plataforma Web

Plataforma web integral para la **Academia de Idiomas San Pedro**, diseñada con una arquitectura modular y asistida por IA para maximizar la calidad del software, optimizar ventanas de contexto y facilitar el desarrollo iterativo.

---

## 📑 Tabla de Contenidos
1. [Visión General](#-visión-general)
2. [Stack Tecnológico](#-stack-tecnológico)
3. [Estructura del Proyecto](#-estructura-del-proyecto)
4. [El Vault de Obsidian (`AcademiaSanPedro/`)](#-el-vault-de-obsidian-academiasanpedro)
5. [Puesta en Marcha Local](#-puesta-en-marcha-local)
6. [Autenticación y Supabase](#-autenticación-y-supabase)
7. [Próximos Pasos (Hoja de Ruta)](#-próximos-pasos-hoja-de-ruta)

---

## 🌟 Visión General

La plataforma está orientada a la captación y gestión formativa de alumnos, ofreciendo:
- **Portal público**: Presentación de cursos, metodología y contacto.
- **Autenticación segura**: Registro y login con Supabase Auth (Email + Google OAuth).
- **Cuestionario de Onboarding**: Captación de objetivos, disponibilidad y nivel estimado.
- **Test de Nivel Online**: Evaluación asíncrona cuyos resultados son revisados por el equipo docente.
- **Área privada (Dashboard)**: Gestión del progreso y seguimiento formativo del alumno.

---

## 🛠️ Stack Tecnológico

- **Frontend & Framework**: [Next.js](https://nextjs.org/) (App Router, Server Actions, React 19).
- **Tipado**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode).
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/) v4 con tokens de diseño centralizados.
- **Formularios & Validación**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/).
- **Backend & Auth**: [Supabase](https://supabase.com/) (PostgreSQL, Auth con SSR vía `@supabase/ssr`, RLS).
- **Despliegue objetivo**: [Vercel](https://vercel.com/).

---

## 📂 Estructura del Proyecto

```text
academiasanpedro/
├── .gitignore                   # Protección de variables de entorno y artefactos
├── README.md                    # Documentación general del proyecto
├── netlify.toml                 # Configuración de despliegue en Netlify
│
└── web/                         # 💻 Aplicación Next.js
    ├── src/
    │   ├── app/
    │   │   ├── (auth)/          # Rutas de autenticación (Login, Registro con split layout)
    │   │   ├── auth/callback/   # Handler para redirección OAuth
    │   │   ├── dashboard/       # Área privada protegida para alumnos
    │   │   ├── globals.css      # Tokens de diseño y fuentes
    │   │   └── layout.tsx       # Layout raíz con configuración SEO y tipografía
    │   ├── components/
    │   │   ├── features/        # Componentes de negocio (LoginForm, RegistroForm)
    │   │   └── ui/              # Componentes visuales reutilizables (Button, InputField, etc.)
    │   ├── lib/
    │   │   ├── supabase/        # Clientes Supabase para Client y Server
    │   │   └── validators/      # Esquemas de validación Zod
    │   └── middleware.ts        # Protección de rutas protegidas y redirecciones
    ├── package.json
    └── tsconfig.json
```

---

## 🚀 Puesta en Marcha Local

### 1. Prerrequisitos
- Node.js (v18.18+ o v20+)
- Gestor de paquetes npm / pnpm

### 2. Configuración de Variables de Entorno
Crea el archivo `.env.local` dentro de la carpeta `web/` tomando como referencia `.env.example`:

```bash
cd web
cp .env.example .env.local
```

Configura tus credenciales de Supabase en `web/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

### 3. Instalación e Inicio del Servidor
```bash
cd web
npm install
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).
- Login: `http://localhost:3000/auth/login`
- Registro: `http://localhost:3000/auth/registro`
- Dashboard (protegido): `http://localhost:3000/dashboard`

---

## 🔐 Autenticación y Supabase

- **Confirmación de Email**: Supabase activa por defecto la confirmación por correo al registrarse. El formulario informa al usuario que revise su bandeja de entrada si esto está activado.
- **Modo Desarrollo rápido**: Puedes deshabilitar temporalmente la confirmación en *Supabase Dashboard → Authentication → Providers → Email → Confirm email (OFF)* para acceder directamente al crear una cuenta.
- **Mapeo de Rutas y Middleware**: `middleware.ts` intercepta peticiones a `/dashboard` sin sesión para redirigir a `/auth/login`, y redirige usuarios autenticados fuera de las pantallas de login.

---

## 📌 Próximos Pasos (Hoja de Ruta)

- [ ] **Identidad visual definitiva**: Ajuste de paleta cromática, logo corporativo e iconografía.
- [ ] **Plantillas de Email**: Configuración del correo de confirmación y bienvenida en Supabase.
- [ ] **Cuestionario Post-Registro**: Implementación interactiva en `/dashboard/cuestionario`.
- [ ] **Test de Nivel Online**: Flujo de evaluación en `/dashboard/level-test`.
- [ ] **Páginas públicas**: Maquetación de la Landing page, catálogo de idiomas y formulario de contacto.
