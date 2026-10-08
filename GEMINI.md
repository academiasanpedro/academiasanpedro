# Academia San Pedro - AI Context

**Stack**: Next.js 16 (App Router), Tailwind CSS v4, Supabase (RLS required).
**UI/UX**: Ultra-modern SaaS aesthetic (glassmorphism, gradients, `font-black` typography, micro-animations).

## 🗺️ Vault Index (Single Source of Truth)
To save tokens and avoid hallucinations, **do not guess** requirements, database schemas, or colors. Use your file reading tools (`view_file` or equivalent) to read the specific document from the list below that matches your current task.

### 🎨 Core & UI
- `AcademiaSanPedro/00_Meta/00_Project_Rules.md` -> Reglas del proyecto
- `AcademiaSanPedro/00_Meta/01_Tech_Stack.md` -> Stack y dependencias
- `AcademiaSanPedro/00_Meta/02_UI_UX_Guidelines.md` -> Colores HEX, diseño y tipografía

### 🏢 Business & Flows
- `AcademiaSanPedro/01_Requirements/01.1_Business_Profile.md` -> Copy, idiomas y lógica de negocio (Lee esto para textos de UI)
- `AcademiaSanPedro/01_Requirements/01_User_Flow_Login.md` -> Flujo de Autenticación
- `AcademiaSanPedro/01_Requirements/02_User_Flow_Level_Test.md` -> Flujo del Test de Nivel Online
- `AcademiaSanPedro/01_Requirements/03_User_Flow_Questionnaire.md` -> Flujo de Cuestionario Inicial

### ⚙️ Database & Routing
- `AcademiaSanPedro/02_Architecture/schema.sql` -> Esquema SQL exacto (Tablas, Triggers, RLS)
- `AcademiaSanPedro/02_Architecture/00_Database_Schema.md` -> Relaciones y lógica de BBDD
- `AcademiaSanPedro/02_Architecture/01_API_Endpoints.md` -> Definición de Server Actions
- `AcademiaSanPedro/02_Architecture/02_Frontend_Routes.md` -> Mapa de rutas de Next.js

## ⚡ Agent Instructions
1. **Identify**: Look at the user's prompt.
2. **Fetch Context**: Pick 1-2 files from the index above that are strictly necessary and read them.
3. **Execute**: Write code using the exact Hex colors, database table names, and routing structure defined in the Vault.

*(For detailed agent guidelines, read `AcademiaSanPedro/AGENTS.md`)*
