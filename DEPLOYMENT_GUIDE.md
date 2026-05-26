# Guía de Deployment - Melissa Cuartas 11:13 Landing Page

## 📋 Descripción General

Esta es una landing page completa, bilingüe (ES/EN) para la marca personal "Melissa Cuartas 11:13" de finanzas conscientes. El sitio incluye:

- **Hero Section** con propuesta de valor
- **Sobre mí** con historia personal y 3 pilares de trabajo
- **3 Lead Magnets** (Presupuesto, Test de Inversión, Guía de Creencias)
- **Sección de Mentoría** con CTA a WhatsApp
- **Redes Sociales** (Instagram, TikTok, YouTube)
- **Sistema i18n** completo (Español/Inglés)
- **Diseño responsive** mobile-first
- **Animaciones sutiles** con scroll reveal

## 🎨 Identidad Visual

**Paleta de Colores:**
- Azul Medianoche: `#0D1B3E` (fondo principal)
- Teal/Turquesa: `#0CBFBF` (acento principal)
- Púrpura: `#7B5CE7` (acento secundario)
- Lavanda: `#C4B3E8` (textos sobre oscuro)
- Niebla: `#F0F3FA` (fondos claros)

**Tipografía:**
- Titulares: Georgia (serif, elegancia)
- Cuerpo: DM Sans (moderna, legible)

## 🚀 Deployment en Cloudflare Pages

### Paso 1: Preparar el repositorio

```bash
# Clonar el proyecto
git clone <repository-url>
cd melissa-cuartas-landing

# Instalar dependencias
pnpm install

# Compilar para producción
pnpm build
```

### Paso 2: Conectar con Cloudflare Pages

1. Ir a [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Seleccionar "Pages" en el menú lateral
3. Hacer clic en "Create a project"
4. Conectar tu repositorio GitHub
5. Seleccionar este repositorio
6. Configurar los siguientes parámetros:

**Build Settings:**
- Framework preset: `None`
- Build command: `pnpm build`
- Build output directory: `dist`
- Root directory: `/`

7. Hacer clic en "Save and Deploy"

### Paso 3: Configurar dominio personalizado

1. En Cloudflare Pages, ir a "Custom domains"
2. Agregar tu dominio (ej: melissacuartas1113.com)
3. Seguir las instrucciones para configurar los nameservers
4. Esperar a que se propague (puede tomar 24-48 horas)

### Paso 4: Configurar SSL/HTTPS

Cloudflare Pages proporciona SSL automático. No requiere configuración adicional.

## 📝 Configuración Antes del Deploy

Antes de publicar, Melissa debe completar los siguientes placeholders:

### 1. **Fotos Personales**
- Reemplazar placeholder de Hero Section (foto vertical)
- Reemplazar placeholder de About Section (foto cuadrada)
- Las fotos se encuentran en los componentes:
  - `client/src/components/HeroSection.tsx` (línea ~75)
  - `client/src/components/AboutSection.tsx` (línea ~42)

### 2. **Archivos de Recursos**
Los 3 lead magnets requieren archivos descargables:
- **Plantilla de Presupuesto**: Archivo Excel o PDF
- **Test de Inversión**: Se genera automáticamente (sin archivo externo)
- **Guía de Creencias**: Archivo PDF

Para agregar los archivos:
1. Subir los archivos a un servicio de almacenamiento (Google Drive, Dropbox, etc.)
2. Obtener los links de descarga
3. Actualizar los endpoints en `client/src/components/ResourcesSection.tsx`

### 3. **Configurar Envío de Emails**

El sitio requiere un servicio de email para:
- Notificar a Melissa cuando se captura un lead
- Enviar automáticamente los recursos al usuario

**Opción A: Usar Resend (Recomendado)**
1. Crear cuenta en [Resend.com](https://resend.com)
2. Obtener API key
3. Configurar en variables de entorno

**Opción B: Usar EmailJS**
1. Crear cuenta en [EmailJS.com](https://www.emailjs.com)
2. Obtener credenciales
3. Configurar en el cliente

### 4. **Número de WhatsApp**
Actualizar el número en:
- `client/src/components/MentoringSection.tsx` (línea ~26)
- Formato: `https://wa.me/573011736115`

### 5. **Redes Sociales**
Actualizar handles en:
- `client/src/components/SocialSection.tsx` (línea ~20-37)
- `client/src/components/Footer.tsx` (línea ~87-102)

## 🔧 Estructura del Proyecto

```
melissa-cuartas-landing/
├── client/
│   ├── public/
│   │   ├── robots.txt
│   │   └── sitemap.xml
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   ├── ResourcesSection.tsx
│   │   │   ├── LeadModal.tsx
│   │   │   ├── MentoringSection.tsx
│   │   │   ├── SocialSection.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Logo.tsx
│   │   ├── lib/
│   │   │   └── translations.ts (i18n)
│   │   ├── pages/
│   │   │   └── Home.tsx
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css (estilos globales)
│   └── index.html
├── ideas.md (documento de diseño)
└── DEPLOYMENT_GUIDE.md (este archivo)
```

## 🌐 SEO

El sitio incluye:
- Meta tags completos (title, description, og:image)
- Schema markup de Person
- Sitemap.xml autogenerado
- robots.txt configurado
- URLs limpias y descriptivas
- Soporte para múltiples idiomas (hreflang)

## ⚡ Optimizaciones de Rendimiento

- Imágenes en formato WebP con lazy loading
- CSS y JS minificados
- Fuentes cargadas con `font-display: swap`
- Animaciones solo en GPU (transform, opacity)
- Respeto a `prefers-reduced-motion`

## 📱 Responsividad

Breakpoints configurados:
- Mobile: 375px
- Tablet: 768px
- Desktop: 1280px
- Desktop Wide: 1440px

Touch targets mínimo 44x44px en móvil.

## 🔒 Seguridad

- HTTPS obligatorio (Cloudflare)
- Headers de seguridad configurados
- Validación frontend de formularios
- Honeypot fields anti-bot
- Rate limiting en endpoints (si se implementa backend)

## 📊 Analíticas

El sitio está preparado para integrar Umami Analytics (incluido en el template).

Para activar:
1. Crear cuenta en [Umami Analytics](https://umami.is)
2. Configurar variables de entorno:
   - `VITE_ANALYTICS_ENDPOINT`
   - `VITE_ANALYTICS_WEBSITE_ID`

## 🛠️ Desarrollo Local

```bash
# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev

# Compilar para producción
pnpm build

# Preview de producción
pnpm preview
```

## 📞 Soporte

Para cambios o actualizaciones:
1. Editar los componentes en `client/src/components/`
2. Actualizar traducciones en `client/src/lib/translations.ts`
3. Hacer commit y push a GitHub
4. Cloudflare Pages se actualizará automáticamente

## 📄 Notas Importantes

- **Idioma por defecto**: Español (detecta automáticamente del navegador)
- **Almacenamiento de preferencias**: LocalStorage (idioma seleccionado)
- **Formularios**: Los datos se envían a un backend (requiere configuración)
- **Tema**: Tema oscuro por defecto (azul medianoche)

## 🎯 Próximos Pasos

1. ✅ Reemplazar fotos de placeholder
2. ✅ Configurar archivos de recursos
3. ✅ Configurar servicio de email
4. ✅ Actualizar número de WhatsApp
5. ✅ Configurar dominio personalizado
6. ✅ Activar SSL/HTTPS
7. ✅ Configurar analíticas
8. ✅ Hacer deploy en Cloudflare Pages

---

**Última actualización**: 26 de mayo de 2025
**Versión**: 1.0.0
