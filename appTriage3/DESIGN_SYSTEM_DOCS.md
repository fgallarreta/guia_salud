# Guía Salud - Design System Documentation

## Índice

1. [Introducción](#introducción)
2. [Foundations](#foundations)
3. [Componentes](#componentes)
4. [Patrones de diseño](#patrones-de-diseño)
5. [Accesibilidad](#accesibilidad)
6. [Naming Convention](#naming-convention)

---

## Introducción

**Guía Salud** es un sistema de diseño completo para una aplicación móvil de salud digital. Este design system está construido sobre principios de:

- ✅ **Accesibilidad WCAG AA**
- ✅ **Mobile-first**
- ✅ **Minimalismo moderno**
- ✅ **Inspiración en shadcn/ui**
- ✅ **Dark mode incluido**

### Personalidad de marca

- Seguridad y confianza
- Claridad y profesionalismo
- Empatía y modernidad
- Simplicidad y accesibilidad

---

## Foundations

### Design Tokens

Todos los tokens están definidos en `/src/styles/theme.css` usando CSS Custom Properties.

#### Color Tokens

##### Brand Colors

```css
--brand-primary: #2563eb        /* Azul principal */
--brand-primary-foreground: #ffffff
--brand-secondary: #f1f5f9      /* Gris claro */
--brand-accent: #3b82f6         /* Azul acento */
--brand-muted: #e2e8f0          /* Gris suave */
```

##### Semantic Colors

```css
--success: #10b981              /* Verde - operaciones exitosas */
--warning: #f59e0b              /* Amarillo - advertencias */
--danger: #ef4444               /* Rojo - errores/destrucción */
--info: #3b82f6                 /* Azul - información */
```

##### Triage System Colors

El sistema de triage es el corazón de la aplicación:

**Verde - Autocuidado** (Baja urgencia)
```css
--triage-green: #10b981
--triage-green-bg: #d1fae5
--triage-green-border: #6ee7b7
```

**Amarillo - Consulta médica** (Evaluación profesional requerida)
```css
--triage-yellow: #f59e0b
--triage-yellow-bg: #fef3c7
--triage-yellow-border: #fcd34d
```

**Rojo - Atención inmediata** (Urgencia médica)
```css
--triage-red: #ef4444
--triage-red-bg: #fee2e2
--triage-red-border: #fca5a5
```

##### Neutral Scale

Escala de 11 valores (50-950) con contraste WCAG AA:

```css
--neutral-50: #f8fafc
--neutral-100: #f1f5f9
--neutral-200: #e2e8f0
--neutral-300: #cbd5e1
--neutral-400: #94a3b8
--neutral-500: #64748b
--neutral-600: #475569
--neutral-700: #334155
--neutral-800: #1e293b
--neutral-900: #0f172a
--neutral-950: #020617
```

#### Typography

Escala modular optimizada para mobile:

| Token | Size | Weight | Line Height | Uso |
|-------|------|--------|-------------|-----|
| `--text-display` | 2.5rem (40px) | 600 | 1.25 | Títulos hero |
| `--text-h1` | 2rem (32px) | 600 | 1.25 | Títulos principales |
| `--text-h2` | 1.5rem (24px) | 600 | 1.5 | Subtítulos |
| `--text-h3` | 1.25rem (20px) | 600 | 1.5 | Secciones |
| `--text-title` | 1.125rem (18px) | 500 | 1.5 | Títulos de card |
| `--text-body-large` | 1.0625rem (17px) | 400 | 1.75 | Cuerpo grande |
| `--text-body` | 1rem (16px) | 400 | 1.75 | Cuerpo estándar |
| `--text-body-small` | 0.875rem (14px) | 400 | 1.5 | Cuerpo pequeño |
| `--text-caption` | 0.75rem (12px) | 400 | 1.5 | Leyendas |
| `--text-label` | 0.875rem (14px) | 500 | 1.5 | Etiquetas |

**Font Weights:**
- Normal: 400
- Medium: 500
- Semibold: 600
- Bold: 700

#### Spacing Scale

Basado en sistema de 8pt grid:

```css
--spacing-1: 4px
--spacing-2: 8px
--spacing-3: 12px
--spacing-4: 16px
--spacing-6: 24px
--spacing-8: 32px
--spacing-10: 40px
--spacing-12: 48px
--spacing-16: 64px
--spacing-20: 80px
```

**Uso recomendado:**
- Padding interno de componentes: 12px-16px
- Gaps entre elementos: 8px-16px
- Márgenes de sección: 24px-32px
- Padding de página: 16px

#### Border Radius

```css
--radius-sm: 6px      /* Elementos pequeños */
--radius-md: 8px      /* Estándar (botones, inputs) */
--radius-lg: 12px     /* Cards */
--radius-xl: 16px     /* Contenedores grandes */
```

#### Shadows

Elevación minimalista:

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1)
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)
```

**Uso:**
- sm: Hover states, elementos sutiles
- md: Cards, dropdowns
- lg: Modals, overlays

#### Touch Targets

Mínimo WCAG requerido:
```css
--touch-target-min: 44px
```

**Aplicar a:**
- Todos los botones
- Áreas táctiles
- Elementos interactivos

---

## Componentes

### Atoms (Componentes base)

#### Button
**Archivo:** `/src/app/components/ui/button.tsx`

**Variantes:**
- `default` - Botón primario (azul)
- `secondary` - Botón secundario (gris)
- `outline` - Botón con borde
- `ghost` - Botón transparente
- `destructive` - Acciones destructivas (rojo)

**Tamaños:**
- `sm` - Pequeño
- `default` - Estándar
- `lg` - Grande
- `icon` - Solo icono

**Uso:**
```tsx
<Button variant="default" size="lg">
  Continuar
</Button>
```

#### Input
**Archivo:** `/src/app/components/ui/input.tsx`

Campo de entrada de texto con fondo subtle y borde claro.

#### Badge
**Archivo:** `/src/app/components/ui/badge.tsx`

Indicadores de estado compactos.

#### Switch, Checkbox, Radio
Controles de formulario accesibles con área táctil de 44px mínimo.

---

### Molecules (Componentes compuestos)

#### TriageBadge
**Archivo:** `/src/app/components/triage-badge.tsx`

Badge especializado para sistema de triage con 3 niveles.

**Props:**
```tsx
interface TriageBadgeProps {
  level: 'green' | 'yellow' | 'red';
  className?: string;
  showIcon?: boolean;
}
```

**Uso:**
```tsx
<TriageBadge level="yellow" showIcon={true} />
```

#### QuestionCard
**Archivo:** `/src/app/components/question-card.tsx`

Tarjeta seleccionable para el flujo de evaluación.

**Props:**
```tsx
interface QuestionCardProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}
```

**Estados:**
- Default (blanco/border gris)
- Selected (borde azul, fondo azul/5)
- Disabled (opacidad 50%)

**Características:**
- Mínimo 44px de altura
- Iconografía opcional
- Accesible (focus ring, keyboard navigation)

---

### Organisms (Componentes complejos)

#### TriageResultCard
**Archivo:** `/src/app/components/triage-result-card.tsx`

Tarjeta de resultado del sistema de triage.

**Secciones:**
1. Header con icono y badge
2. Explicación del nivel
3. Lista de próximos pasos
4. CTA principal

**Props:**
```tsx
interface TriageResultCardProps {
  level: 'green' | 'yellow' | 'red';
  explanation: string;
  nextSteps: string[];
  ctaLabel: string;
  onCtaClick: () => void;
}
```

#### MedicalFacilityCard
**Archivo:** `/src/app/components/medical-facility-card.tsx`

Tarjeta de centro médico con información y acciones.

**Información mostrada:**
- Nombre del centro
- Tipo (hospital/clínica/farmacia)
- Distancia
- Dirección (opcional)
- Horario (opcional)
- Estado (abierto/cerrado/cierra pronto)

**Acciones:**
- Navegar (Google Maps)
- Llamar (teléfono)

#### TranslationCard
**Archivo:** `/src/app/components/translation-card.tsx`

Tarjeta para mostrar traducciones médicas.

**Funcionalidades:**
- Muestra frase original y traducción
- Botón copiar al portapapeles
- Botón reproducir audio (opcional)
- Indicador de idioma

#### ChatMessage
**Archivo:** `/src/app/components/chat-message.tsx`

Componente de mensaje para chat con IA.

**Variantes:**
- Mensaje de usuario (derecha, azul)
- Mensaje de asistente (izquierda, gris)

**Incluye:**
- `ChatMessage` - Mensaje individual
- `TypingIndicator` - Indicador de escritura

#### MobileNav
**Archivo:** `/src/app/components/mobile-nav.tsx`

Navegación inferior fija para mobile.

**Items:**
- Inicio
- Evaluación
- Mapa
- Traducir
- Chat IA

**Características:**
- Fixed bottom
- Auto-highlight página activa
- Touch targets de 44px mínimo
- Iconos + texto

---

## Patrones de diseño

### Onboarding Flow
1. Splash screen con logo
2. Explicación de funcionalidades
3. Permisos (ubicación)
4. Configuración inicial

### Symptom Evaluation Flow
1. Selección de síntoma principal
2. Preguntas de seguimiento (3-5)
3. Barra de progreso
4. Resultado de triage

### Triage Result Flow
1. Tarjeta de resultado con nivel
2. Explicación clara
3. Próximos pasos numerados
4. CTA basado en nivel:
   - Verde: "Volver al inicio"
   - Amarillo: "Buscar centros médicos"
   - Rojo: "Llamar al 911" / "Buscar hospital"

### Chat Flow
1. Mensaje de bienvenida
2. Preguntas sugeridas
3. Conversación natural
4. Disclaimer visible

### Map Flow
1. Detección de ubicación
2. Búsqueda y filtros
3. Lista de resultados ordenada por distancia
4. Acciones rápidas (navegar/llamar)

---

## Accesibilidad

### WCAG AA Compliance

#### Contraste de color
✅ Todos los colores cumplen ratio 4.5:1 mínimo
✅ Texto grande: ratio 3:1
✅ Íconos importantes: ratio 3:1

#### Touch Targets
✅ Mínimo 44x44px en todos los elementos interactivos
✅ Espaciado adecuado entre elementos táctiles

#### Keyboard Navigation
✅ Todos los elementos interactivos accesibles por teclado
✅ Focus ring visible (2px outline)
✅ Orden lógico de tabulación

#### Screen Readers
✅ Etiquetas aria adecuadas
✅ Roles semánticos correctos
✅ Alt text en todas las imágenes

#### Señales no basadas solo en color
✅ Iconos + texto en badges de triage
✅ Estados de error con iconos y texto
✅ Estados de éxito con múltiples indicadores

#### Responsive Text
✅ Sin zoom bloqueado
✅ Texto escalable hasta 200%
✅ No truncado en zoom

### Consideraciones para adultos mayores

- Tipografía de 16px mínimo
- Contraste elevado
- Botones grandes (mínimo 44px)
- Lenguaje claro y directo
- Iconografía reconocible
- Sin dependencia de gestos complejos

---

## Naming Convention

### Archivos

**Componentes:**
```
kebab-case.tsx
Ejemplo: triage-badge.tsx, question-card.tsx
```

**Páginas:**
```
PascalCase.tsx
Ejemplo: Home.tsx, Evaluation.tsx
```

**Utilidades:**
```
kebab-case.ts
Ejemplo: use-mobile.ts, utils.ts
```

### Componentes React

```
PascalCase
Ejemplo: TriageBadge, QuestionCard, MedicalFacilityCard
```

### Props Interfaces

```
{ComponentName}Props
Ejemplo: TriageBadgeProps, QuestionCardProps
```

### CSS Custom Properties

```
--{category}-{property}-{modifier}
Ejemplos:
--triage-green-bg
--text-body-large
--spacing-4
```

### Clases de Tailwind

Orden recomendado:
1. Layout (flex, grid)
2. Sizing (w-, h-)
3. Spacing (p-, m-)
4. Typography (text-, font-)
5. Colors (bg-, text-, border-)
6. Effects (shadow-, opacity-)
7. States (hover:, focus:, dark:)

---

## Implementación en React Native

Este design system está preparado para migrar a React Native:

### Tokens CSS → React Native

```typescript
// theme.ts
export const colors = {
  brand: {
    primary: '#2563eb',
    secondary: '#f1f5f9',
    // ...
  },
  triage: {
    green: '#10b981',
    yellow: '#f59e0b',
    red: '#ef4444',
    // ...
  },
};

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  // ...
};
```

### Componentes adaptables

Todos los componentes están diseñados con:
- Estructura declarativa compatible con React Native
- Props explícitas sin dependencia del DOM
- Lógica separada de la presentación
- Estilos inline evitables

---

## Escalabilidad

Este design system está preparado para:

✅ **Agregar nuevos componentes** siguiendo atomic design
✅ **Temas personalizados** (white label)
✅ **Múltiples idiomas** (i18n ready)
✅ **Modo offline** (estructura lista)
✅ **Analytics** (eventos de tracking)
✅ **Testing** (componentes testables)

---

## Créditos y referencias

- **Inspiración:** shadcn/ui
- **Iconografía:** Lucide React
- **Framework:** React + Tailwind CSS v4
- **Router:** React Router v7
- **Accesibilidad:** WCAG 2.1 Level AA

---

Última actualización: Junio 2026
