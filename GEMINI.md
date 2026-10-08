# Academia San Pedro — Contexto IA

Web de captación y gestión de alumnos de una academia de idiomas (Huelva). App en `web/`: Next.js 16 (App Router, React 19), Tailwind v4, Supabase (Auth + Postgres con RLS), Zod + React Hook Form, Nodemailer (Gmail). Toda la UI en español.

## Reglas críticas
- Next 16: `src/proxy.ts` (no `middleware`); `params`/`searchParams` son `Promise`. Ante dudas de API lee `web/node_modules/next/dist/docs/`.
- Escrituras solo vía Server Actions (`src/app/actions/`): Zod + `requireUser()`/`requireAdmin()` (`src/lib/auth.ts`). Nunca confiar en ids/emails del cliente.
- Ficheros `"use server"` solo exportan actions; emails con `src/lib/email.ts` (server-only) y `escapeHtml()`.
- Colores y sombras solo con tokens de `globals.css`; reutiliza `src/components/ui` antes de crear estilos nuevos.
- Copy, cifras y testimonios solo de `02_Business.md`. No inventar.
- Si cambias rutas, tablas, flujos o tokens, actualiza el doc del vault afectado.

## Vault `AcademiaSanPedro/` (lee solo lo necesario)
- `00_Rules.md` — estructura, convenciones, comandos, env
- `01_Design.md` — tokens, primitivas UI, patrones, a11y
- `02_Business.md` — copy, oferta, contacto, datos verificados
- `03_Flows.md` — flujos alumno/admin y reglas de negocio
- `04_Routes.md` — rutas, layouts, proxy, server actions
- `05_Database.md` — tablas, RLS, JSON (DDL: `supabase/`)
- `06_Backlog.md` — pendientes, límites conocidos, decisiones
