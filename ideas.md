# Ideas de Diseño - Melissa Cuartas 11:13

## Enfoque Seleccionado: "Espiritualidad Contemporánea Minimalista"

### Filosofía de Diseño
Este enfoque combina la elegancia del minimalismo moderno con elementos espirituales sutiles. Refleja la propuesta de Melissa: trabajar tanto con herramientas técnicas prácticas como con creencias y energía. El diseño no es frío ni corporativo, sino cálido, accesible y profundo.

### Principios Fundamentales
1. **Contraste Intencional**: Fondos oscuros (azul medianoche) alternados con espacios claros (niebla), creando ritmo visual
2. **Tipografía Jerárquica**: Georgia serif para titulares (elegancia, autoridad espiritual) + DM Sans para cuerpo (legibilidad, modernidad)
3. **Espacio Negativo Generoso**: Amplios márgenes y padding que respiran, no amontonamiento
4. **Gradientes Sutiles**: Púrpura → Teal solo en elementos clave (CTAs, líneas decorativas), no saturados

### Filosofía de Color
- **Azul Medianoche (#0D1B3E)**: Fondo principal, profundidad, confianza, introversión introspectiva
- **Teal/Turquesa (#0CBFBF)**: Acento principal, transformación, energía renovadora
- **Púrpura (#7B5CE7)**: Espiritualidad, intuición, lo metafísico
- **Lavanda (#C4B3E8)**: Suavidad, accesibilidad, lo femenino sin ser frívolo
- **Niebla (#F0F3FA)**: Claridad, apertura, esperanza

**Intención Emocional**: Los colores oscuros crean un espacio seguro para la introspección; el teal y púrpura inyectan esperanza y transformación.

### Paradigma de Layout
- **Hero**: Asimétrico - texto a la izquierda (ancho 55%), foto de Melissa a la derecha (ancho 45%), con números "11" y "13" como watermarks sutiles de fondo
- **Sobre Mí**: Alternancia - foto a la izquierda, texto a la derecha, con 3 pilares en grid horizontal debajo
- **Recursos**: Grid de 3 tarjetas en desktop, 1 en móvil, con hover effects que revelan gradientes
- **Mentoría**: Sección con descripción + bullets + CTA flotante a la derecha
- **Testimonios**: Grid asimétrico (2 tarjetas grandes, 1 pequeña) cuando haya contenido real
- **Footer**: Dos columnas - links a la izquierda, redes + contacto a la derecha

### Elementos Distintivos
1. **Líneas Decorativas Teal**: Líneas finas horizontales que separan secciones, a veces con pequeños puntos
2. **Números "11" y "13"**: Aparecen sutilmente como watermarks, en hero y en detalles de tarjetas
3. **Gradiente MC**: Monograma con gradiente púrpura → teal, usado en logo y ocasionalmente en botones principales

### Filosofía de Interacción
- **Botones**: Cambio de color suave (teal a púrpura) en hover, sin escala agresiva
- **Tarjetas**: Elevación sutil (shadow aumenta) y fondo se ilumina levemente en hover
- **Modales**: Entrada suave desde el centro con fade-in, overlay semi-transparente
- **Links**: Subrayado teal que aparece en hover, no cambio de color

### Animaciones
- **Scroll Reveal**: Elementos aparecen con fade-in + slide-up suave (200ms ease-out) cuando entran en viewport
- **Hover States**: Transiciones de 150ms en todos los elementos interactivos
- **Modales**: Entrada 250ms ease-out desde escala 0.95, salida 150ms ease-in
- **Botones**: Presión visual con scale(0.98) en :active, transición 100ms
- **Respeto a prefers-reduced-motion**: Todas las animaciones respetan la preferencia del usuario

### Sistema Tipográfico
- **Display (Títulos Principales)**: Georgia Bold, 48px desktop / 32px móvil, line-height 1.2
- **Títulos Secundarios**: Georgia Regular, 28px desktop / 20px móvil, line-height 1.3
- **Cuerpo**: DM Sans Regular, 16px desktop / 14px móvil, line-height 1.6
- **Énfasis**: DM Sans Medium para destacados dentro de párrafos
- **Números Especiales (11:13)**: Georgia Bold, 24px, color teal con tracking aumentado
- **Botones**: DM Sans Medium, 14px, uppercase con letter-spacing 0.05em

### Paleta Extendida
- Blanco puro: #FFFFFF (solo para iconografía)
- Gris oscuro: #1A2847 (textos sobre teal)
- Gris claro: #E8EAEF (bordes sutiles en fondo claro)
- Azul medio: #5A8FE0 (links secundarios)

### Accesibilidad
- Contraste mínimo 4.5:1 en todos los textos
- Botones con mínimo 44x44px en móvil
- Todas las imágenes con alt text descriptivo
- Navegación por teclado completa
- Focus rings visibles en teal

---

## Notas de Implementación
- No usar Bootstrap ni frameworks CSS pesados
- Vanilla CSS con custom properties para el sistema de diseño
- Vanilla JS para interacciones (modales, formularios, animaciones)
- Imágenes en WebP con lazy loading
- Fuentes cargadas con font-display: swap
- Meta tags completos para SEO bilingüe
- Schema markup de Person para Melissa
