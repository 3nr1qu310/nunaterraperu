# Nuna Terra Perú — Astro + Supabase

Proyecto base de la web de Nuna Terra Perú conectado a Supabase.

## 1. Instalación

```bash
npm install
npm run dev
```

## 2. Variables de entorno

Crea un archivo `.env` en la raíz del proyecto.

Astro recomienda variables públicas con prefijo `PUBLIC_`:

```env
PUBLIC_SUPABASE_URL=https://frreioqumxzvxfrdxqqo.supabase.co
PUBLIC_SUPABASE_ANON_KEY=TU_PUBLISHABLE_KEY
```

El código también acepta nombres estilo Next.js:

```env
NEXT_PUBLIC_SUPABASE_URL=https://frreioqumxzvxfrdxqqo.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=TU_PUBLISHABLE_KEY
```

## 3. Base de datos

En Supabase, abre **SQL Editor** y ejecuta:

1. `supabase/schema.sql`
2. `supabase/seed.sql` opcional para cargar datos demo.

## 4. Qué ya está conectado

- `/` carga regiones, destinos, paquetes y tours desde Supabase.
- `/paquetes` carga productos con `product_type = package`.
- `/paquetes/[slug]` carga el paquete por slug.
- `/tours` carga productos con `product_type = tour`.
- `/tours/[slug]` carga el tour por slug.
- `/destinos` carga regiones y destinos.
- `/destinos/[slug]` resuelve tanto regiones como destinos.
- `/contacto` envía leads a la tabla `leads` mediante `/api/leads`.

Si Supabase no está configurado o la base está vacía, se muestran datos mock de respaldo.

## 5. Deploy

El proyecto usa Astro SSR con `@astrojs/node` para que las páginas dinámicas lean Supabase en tiempo real.

```bash
npm run build
npm run preview
```

Si vas a desplegar en Vercel, Netlify u otro entorno, puede requerirse cambiar el adapter de Astro.

## Panel de administración funcional

El panel ya incluye login con Supabase Auth y CRUD inicial para:

- Paquetes
- Tours
- Destinos
- Regiones
- Consultas/leads
- Configuración web

### 1. Variables de entorno

Crea un archivo `.env` en la raíz:

```env
PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
PUBLIC_SUPABASE_ANON_KEY=TU_SUPABASE_PUBLISHABLE_KEY
```

### 2. Base de datos

Ejecuta en Supabase SQL Editor:

1. `supabase/schema.sql`
2. `supabase/admin_policies.sql`
3. Opcional: `supabase/seed.sql`

Cuando Supabase pregunte por RLS, selecciona **Run and enable RLS** y luego ejecuta `admin_policies.sql`.

### 3. Crear usuario administrador

En Supabase:

`Authentication → Users → Add user`

Crea un correo y contraseña para entrar al panel.

### 4. Entrar al panel

```txt
http://localhost:4321/admin/login
```

Después de iniciar sesión, podrás administrar contenido desde:

```txt
/admin
/admin/paquetes
/admin/tours
/admin/destinos
/admin/regiones
/admin/leads
/admin/configuracion
```

### Nota de seguridad

Las políticas incluidas permiten que cualquier usuario autenticado administre contenido. Para producción, mantén desactivado el registro público de usuarios o restringe las políticas usando la tabla `admins`.
