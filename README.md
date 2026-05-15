# 📍 Enlace San Juan - Directorio Local

<<<<<<< HEAD
Bienvenido al proyecto de **Enlace San Juan**, un directorio digital premium diseñado específicamente para San Juan del Río, Querétaro. 

Este proyecto está construido con un stack moderno y escalable:
=======
Bienvenido al proyecto de **Enlace San Juan**, un directorio digital premium diseñado específicamente para San Juan del Río, Querétaro.

Este proyecto está construido con un stack moderno y escalable:

>>>>>>> 56f280e928b510cd316e3d7a637182573aeb8b42
- **Framework:** Next.js 14 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Backend/Auth:** Supabase (PostgreSQL + Auth + Storage)
- **Mapas:** Leaflet.js & OpenStreetMap

---

## 🚀 Guía de Instalación y Configuración

### 1. Configuración de Supabase (Backend)
<<<<<<< HEAD
=======

>>>>>>> 56f280e928b510cd316e3d7a637182573aeb8b42
1. **Crear Proyecto:** Ve a [Supabase Dashboard](https://supabase.com/dashboard) y crea un nuevo proyecto.
2. **Ejecutar SQL:** Copia el contenido de `/supabase/schema.sql` y ejecútalo en el **SQL Editor** de tu panel de Supabase. Esto creará las tablas `businesses`, `categories` y las políticas de seguridad (RLS).
3. **Buckets de Storage:** Crea un bucket llamado `business-assets` con las siguientes carpetas internas:
   - `logos/`
   - `covers/`
   - `gallery/`
   - `catalogs/`
<<<<<<< HEAD
   - *Nota:* Asegúrate de que el bucket sea **público** para lectura o configura las políticas correspondientes.
4. **Usuario Admin:** Ve a `Authentication -> Users` y crea un usuario manual `admin@enlacesanjuan.com.mx`.

### 2. Variables de Entorno
Copia el archivo `.env.local.example` a un nuevo archivo llamado `.env.local` y completa las claves que se encuentran en `Settings -> API` de tu Supabase Dashboard.

### 3. Ejecución Local 
*Nota: Se detectó que la terminal actual no tiene Node.js instalado globalmente. Asegúrate de tener instalado Node.js (v18+) en tu sistema antes de continuar.*
=======
   - _Nota:_ Asegúrate de que el bucket sea **público** para lectura o configura las políticas correspondientes.
4. **Usuario Admin:** Ve a `Authentication -> Users` y crea un usuario manual `admin@enlacesanjuan.com.mx`.

### 2. Variables de Entorno

Copia el archivo `.env.local.example` a un nuevo archivo llamado `.env.local` y completa las claves que se encuentran en `Settings -> API` de tu Supabase Dashboard.

### 3. Ejecución Local

_Nota: Se detectó que la terminal actual no tiene Node.js instalado globalmente. Asegúrate de tener instalado Node.js (v18+) en tu sistema antes de continuar._
>>>>>>> 56f280e928b510cd316e3d7a637182573aeb8b42

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev
```

El sitio estará disponible en: `http://localhost:3000`

---

## 🎨 Identidad Visual Aplicada

El diseño utiliza los colores e identidad solicitados:
<<<<<<< HEAD
=======

>>>>>>> 56f280e928b510cd316e3d7a637182573aeb8b42
- **Verde Principal (Brand):** `#2A7A3B`
- **Títulos:** Outfit (900 weight)
- **Cuerpo:** Plus Jakarta Sans
- **Cards:** Bordes `#DAEADD`, radio `16px`, sombras suaves `shadow-sm`.

---

## 🛠️ Estructura del Proyecto

- `/app`: Rutas del App Router (Públicas y Administrador).
- `/components`: Botones, Cards, Hero sections y Forms reutilizables.
- `/lib`: Configuración del cliente de Supabase.
- `/utils`: Funciones para slugs, horarios (`isOpenNow`) y Tailwind.
- `/types`: Definiciones de interfaces TypeScript.
- `/supabase`: Scripts de base de datos.

### Acceso Administrativo
<<<<<<< HEAD
=======

>>>>>>> 56f280e928b510cd316e3d7a637182573aeb8b42
Ruta: `/admin/login`
Credenciales: Las que configures manualmente en Supabase Auth.
El acceso está protegido por un middleware que verifica la sesión en tiempo real.

---
<<<<<<< HEAD
*Desarrollado con ❤️ para San Juan del Río.*
=======

_Desarrollado con ❤️ para San Juan del Río._
>>>>>>> 56f280e928b510cd316e3d7a637182573aeb8b42
