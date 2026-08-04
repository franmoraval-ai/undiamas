# UN DÍA MÁS

Un espacio anónimo y moderado para leer, dejar y acompañar voces sin perfiles, comentarios ni métricas sociales. Está construido con Next.js 15, TypeScript, Tailwind CSS 4, Framer Motion, Supabase, Lucide y componentes compatibles con shadcn/ui.

## Arquitectura

- `src/app`: rutas App Router, APIs y metadatos. Las experiencias son inicio, voces, detalle, escribir y apoyo.
- `src/components`: primitivas de UI, navegación, movimiento con respeto a `prefers-reduced-motion` y componentes de voces.
- `src/lib`: dominio de voces, cliente Supabase de servidor y utilidades de estilos.
- `supabase/migrations`: modelo de datos, índices, RLS y función atómica para `yo_tambien`.

Las lecturas públicas solo pueden mostrar voces con estado `aprobada`. Las publicaciones entran como `pendiente`; requieren una decisión de moderación antes de poder aparecer. La API nunca recibe un nombre y, cuando se configura `IP_HASH_SALT`, almacena solo una huella hash de IP para prevención de abuso.

## Arquitectura visual y navegación

La experiencia usa concreto tenue para el entorno y papeles de distinta escala, tono y rotación para las voces. La carta de bienvenida es un componente estático, no un registro de base de datos, por lo que permanece siempre como primera pieza del muro.

El recorrido es `inicio -> voces -> detalle o escribir -> apoyo`. No existen perfiles, comentarios, seguidores ni métricas de popularidad. `Yo también` es una señal privada de acompañamiento y solo puede registrarse una vez por voz e identidad hasheada.

## Estructura y datos

```text
src/app          Rutas, Route Handlers y composición de pantalla
src/components   UI, movimiento accesible y piezas de voces
src/lib          Acceso a Supabase, validación, seguridad y dominio
supabase         Migraciones, RLS, límites y auditoría de moderación
```

`voces` contiene el texto, estado de moderación y contador agregado. `reportes` recibe alertas de contenido. `moderacion` registra cada transición de estado. `reacciones_voz` impone una reacción única sin almacenar IP en claro. `request_rate_limits` aplica límites temporales a mutaciones públicas.

## Desarrollo

```bash
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

## Configurar Supabase

1. Crea un proyecto de Supabase.
2. Ejecuta todas las migraciones de [supabase/migrations/](C:/Users/marco/OneDrive/Desktop/un-dia-mas.worktrees/security-policy-improvements-ci-cd-setup/supabase/migrations) en orden, incluyendo [20260803000000_initial_schema.sql](C:/Users/marco/OneDrive/Desktop/un-dia-mas.worktrees/security-policy-improvements-ci-cd-setup/supabase/migrations/20260803000000_initial_schema.sql) y [20260804000000_hardening.sql](C:/Users/marco/OneDrive/Desktop/un-dia-mas.worktrees/security-policy-improvements-ci-cd-setup/supabase/migrations/20260804000000_hardening.sql), desde el SQL Editor o mediante la CLI de Supabase.
3. Copia `.env.example` a `.env.local` y completa las variables.
4. Revisa las nuevas filas en `voces` y cambia `estado` a `aprobada` cuando corresponda. El trigger de base de datos registra cada cambio de estado en `moderacion`.

`SUPABASE_SERVICE_ROLE_KEY` solo se usa en handlers de servidor. No la expongas con prefijo `NEXT_PUBLIC_` ni en código cliente.

## Despliegue en Vercel

Importa el repositorio en Vercel y configura las cuatro variables de `.env.example` en Project Settings > Environment Variables. Vercel detecta Next.js y utiliza `npm run build` automáticamente. Aplica la migración antes del primer despliegue para habilitar voces y reportes.

## Verificación

```bash
npm run lint
npm test
npm run build
```

Las pruebas actuales cubren validaciones con Zod, helpers de seguridad y los handlers públicos de creación de voces, reportes y `yo también`.

`Yo también` sigue funcionando aunque el backend de rate limiting falle temporalmente; en ese caso prioriza la reacción y registra el fallo en logs para no bloquear la experiencia.

## CI

El workflow [ci.yml](C:/Users/marco/OneDrive/Desktop/un-dia-mas.worktrees/security-policy-improvements-ci-cd-setup/.github/workflows/ci.yml) ejecuta `npm run lint`, `npm test` y `npm run build` en cada `push` y `pull_request`.

## SEO técnico

La URL pública canónica se define desde [layout.tsx](C:/Users/marco/OneDrive/Desktop/un-dia-mas.worktrees/security-policy-improvements-ci-cd-setup/src/app/layout.tsx) con base en [site.ts](C:/Users/marco/OneDrive/Desktop/un-dia-mas.worktrees/security-policy-improvements-ci-cd-setup/src/lib/site.ts). Además, [robots.ts](C:/Users/marco/OneDrive/Desktop/un-dia-mas.worktrees/security-policy-improvements-ci-cd-setup/src/app/robots.ts) publica la política de rastreo y [sitemap.ts](C:/Users/marco/OneDrive/Desktop/un-dia-mas.worktrees/security-policy-improvements-ci-cd-setup/src/app/sitemap.ts) expone las rutas estáticas y cada voz aprobada.
