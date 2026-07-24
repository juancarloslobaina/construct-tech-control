# CLAUDE.md

Guía de contexto para trabajar en este proyecto.

## Proyecto

Panel de administración construido sobre la plantilla TailAdmin (Angular + Tailwind CSS), con
autenticación real vía Supabase. El código de la app vive en `src/`. El directorio
`free-angular-tailwind-dashboard-main/` es la plantilla original de referencia — no tiene
relación con la app real ni con Supabase.

## Stack y comandos

- Angular 22 (componentes standalone, control flow `@if`/`@for`), Tailwind CSS 4,
  `@supabase/supabase-js`, Vitest.
- `npm start` — `ng serve`, sirve en `http://localhost:4200`.
- `npm run build` — build de producción (usa `environment.prod.ts` vía `fileReplacements`
  en `angular.json`).
- `npm test` — tests con Vitest.
- Despliegue en Vercel, proyecto `construct-tech-control`.

## Autenticación (Supabase)

- Cliente único: `src/app/shared/services/supabase.service.ts` (`createClient`).
- Lógica de auth: `src/app/shared/services/auth.service.ts` — envuelve `signUp`,
  `signInWithPassword`, `signInWithOAuth` (Google), `resetPasswordForEmail`, `updateUser`,
  `exchangeCodeForSession`.
- Las redirecciones de email (`emailRedirectTo` / `redirectTo`) se construyen con
  `window.location.origin` en runtime — funcionan en local y producción sin hardcodear URLs.
  El "Site URL" y la allowlist de "Redirect URLs" se gestionan en el Dashboard de Supabase
  (proyecto `jgxrlncdgfgpbcgqgtnc`), no en el repo.
- Callback de confirmación/OAuth: `src/app/pages/auth-pages/auth-callback/auth-callback.component.ts`
  (ruta `/auth/callback`), maneja el flujo PKCE (`?code=`).
- Rutas protegidas usan `authGuard`; `/signin` y `/signup` usan `publicOnlyGuard`
  (`src/app/shared/guards/auth.guard.ts`).
- Las páginas de login y registro (`signin-form.component.html`, `signup-form.component.html`)
  no tienen enlace "Back to dashboard": no aplica antes de autenticarse.

## Sidebar / navegación

- Toda la data del menú vive en `src/app/shared/layout/app-sidebar/app-sidebar.component.ts`,
  en dos arrays: `navItems` (sección "Menu") y `othersItems` (sección "Others"). El template
  (`app-sidebar.component.html`) es genérico — solo itera sobre esos arrays, no hay items
  hardcodeados en el HTML.
- Actualmente `navItems` solo contiene **Dashboard** (desplegable) → **Ecommerce** (`/`).
  `othersItems` está vacío; su sección está condicionada con `@if (othersItems.length > 0)`
  para no dejar un encabezado "Others" huérfano cuando el array está vacío.
- No hay banner promocional en el sidebar (se eliminó `app-sidebar-widget.component.ts`,
  publicidad de la plantilla TailAdmin).
- Otras páginas heredadas de la plantilla (Calendar, Forms, Tables, Charts, UI Elements,
  páginas demo de Authentication, etc.) siguen existiendo en `app.routes.ts` y son accesibles
  por URL directa, pero ya no aparecen en el menú. Para reactivar alguna, añadir su item de
  vuelta a `navItems` / `othersItems`.
