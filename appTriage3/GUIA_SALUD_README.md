# Guía Salud - Design System

> Sistema de diseño completo para aplicación móvil de salud digital

![WCAG AA](https://img.shields.io/badge/WCAG-AA-green)
![Mobile First](https://img.shields.io/badge/Mobile-First-blue)
![React](https://img.shields.io/badge/React-18.3-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8)

## 🎯 Descripción

Guía Salud es una aplicación móvil de asistencia médica que proporciona:

- ✅ Evaluación guiada de síntomas
- ✅ Sistema de triage de 3 niveles (verde, amarillo, rojo)
- ✅ Geolocalización de centros médicos
- ✅ Traducción de frases médicas
- ✅ Chat con IA para consultas de salud

## 🎨 Características del Design System

### Foundations
- **Design Tokens completos** - Colores, tipografía, espaciado, etc.
- **Light & Dark Mode** - Soporte completo de temas
- **Accesibilidad WCAG AA** - Contraste, touch targets, keyboard nav
- **Mobile-first** - Optimizado para dispositivos móviles
- **8pt Grid System** - Espaciado consistente

### Componentes

#### Atoms (Básicos)
- Button (5 variantes)
- Input, Textarea
- Badge, Avatar
- Switch, Checkbox, Radio
- Progress, Separator

#### Molecules (Compuestos)
- **TriageBadge** - Badge especializado del sistema de triage
- **QuestionCard** - Tarjeta seleccionable para evaluaciones
- Search Bar, Form Field

#### Organisms (Complejos)
- **TriageResultCard** - Resultado completo del triage
- **MedicalFacilityCard** - Información de centros médicos
- **TranslationCard** - Traducciones médicas
- **ChatMessage** - Mensajes del chat con IA
- **MobileNav** - Navegación inferior móvil

## 📁 Estructura del proyecto

```
/src
├── /app
│   ├── App.tsx                 # Entry point con RouterProvider
│   ├── routes.tsx              # Configuración de rutas
│   ├── /components
│   │   ├── /ui                 # Componentes base (shadcn/ui)
│   │   ├── triage-badge.tsx    # Sistema de triage
│   │   ├── question-card.tsx   # Tarjeta de pregunta
│   │   ├── triage-result-card.tsx
│   │   ├── medical-facility-card.tsx
│   │   ├── translation-card.tsx
│   │   ├── chat-message.tsx
│   │   └── mobile-nav.tsx
│   └── /pages
│       ├── Root.tsx            # Layout raíz
│       ├── Home.tsx            # Pantalla de inicio
│       ├── Evaluation.tsx      # Evaluación de síntomas
│       ├── TriageResult.tsx    # Resultado del triage
│       ├── Map.tsx             # Mapa de centros médicos
│       ├── Translate.tsx       # Traductor médico
│       ├── Chat.tsx            # Chat con IA
│       └── NotFound.tsx        # 404
└── /styles
    ├── theme.css               # Design tokens + dark mode
    ├── tailwind.css
    ├── fonts.css
    └── index.css
```

## 🎨 Design Tokens

### Colores del Sistema de Triage

```css
/* Verde - Autocuidado */
--triage-green: #10b981
--triage-green-bg: #d1fae5
--triage-green-border: #6ee7b7

/* Amarillo - Consulta médica */
--triage-yellow: #f59e0b
--triage-yellow-bg: #fef3c7
--triage-yellow-border: #fcd34d

/* Rojo - Atención inmediata */
--triage-red: #ef4444
--triage-red-bg: #fee2e2
--triage-red-border: #fca5a5
```

### Tipografía

Escala modular optimizada para mobile:

| Elemento | Tamaño | Peso | Uso |
|----------|--------|------|-----|
| Display | 40px | 600 | Hero titles |
| H1 | 32px | 600 | Page titles |
| H2 | 24px | 600 | Section titles |
| H3 | 20px | 600 | Subsections |
| Body | 16px | 400 | Texto principal |
| Caption | 12px | 400 | Metadata |

### Espaciado (8pt grid)

```
4px, 8px, 12px, 16px, 24px, 32px, 40px, 48px, 64px, 80px
```

## 🚀 Uso de componentes

### TriageBadge

```tsx
import { TriageBadge } from './components/triage-badge';

<TriageBadge level="yellow" showIcon={true} />
```

### QuestionCard

```tsx
import { QuestionCard } from './components/question-card';
import { Thermometer } from 'lucide-react';

<QuestionCard
  icon={Thermometer}
  title="Fiebre"
  description="Temperatura elevada"
  selected={selected === 'fever'}
  onClick={() => setSelected('fever')}
/>
```

### TriageResultCard

```tsx
import { TriageResultCard } from './components/triage-result-card';

<TriageResultCard
  level="yellow"
  explanation="Recomendamos consultar con un profesional médico..."
  nextSteps={[
    'Agenda una cita médica',
    'Monitorea tus síntomas',
    'Mantente hidratado'
  ]}
  ctaLabel="Buscar centros médicos"
  onCtaClick={() => navigate('/map')}
/>
```

### MedicalFacilityCard

```tsx
import { MedicalFacilityCard } from './components/medical-facility-card';

<MedicalFacilityCard
  name="Hospital General"
  type="hospital"
  distance="1.2 km"
  address="Av. Principal 123"
  hours="Abierto 24 horas"
  status="open"
  phone="+1234567890"
  onNavigate={() => openMaps()}
  onCall={() => makeCall()}
/>
```

### ChatMessage

```tsx
import { ChatMessage, TypingIndicator } from './components/chat-message';

<ChatMessage
  role="assistant"
  content="¿Cómo puedo ayudarte?"
  timestamp="10:30"
/>

<TypingIndicator />
```

## 🎯 Flujos de navegación

### 1. Evaluación de síntomas
```
Home → Evaluation (preguntas) → TriageResult → Map/Chat
```

### 2. Búsqueda de atención
```
Home → Map (centros médicos cercanos)
```

### 3. Traducción médica
```
Home → Translate (frases médicas)
```

### 4. Chat con IA
```
Home → Chat (conversación)
```

## ♿ Accesibilidad

### WCAG AA Compliance

✅ **Contraste de color:** Ratio mínimo 4.5:1  
✅ **Touch targets:** Mínimo 44x44px  
✅ **Keyboard navigation:** Todos los elementos accesibles  
✅ **Screen readers:** Labels ARIA correctos  
✅ **Focus indicators:** Visible en todos los elementos  
✅ **No solo color:** Iconos + texto en indicadores críticos  

### Adultos mayores

- Tipografía grande (16px mínimo)
- Botones grandes (44px+)
- Contraste elevado
- Lenguaje claro
- Iconografía reconocible

## 🌓 Dark Mode

El sistema soporta modo oscuro completo:

```tsx
// Dark mode se activa automáticamente según preferencia del sistema
// o manualmente agregando clase "dark" al elemento root

<html class="dark">
  {/* Todo el contenido se adapta */}
</html>
```

Todos los colores, incluyendo los del sistema de triage, están optimizados para dark mode.

## 📱 Navegación móvil

La navegación inferior (`MobileNav`) incluye 5 secciones principales:

1. **Inicio** - Dashboard principal
2. **Evaluación** - Flujo de síntomas
3. **Mapa** - Centros médicos
4. **Traducir** - Traductor médico
5. **Chat IA** - Asistente virtual

## 🔧 Tecnologías

- **React 18.3** - Framework UI
- **React Router 7** - Navegación
- **Tailwind CSS v4** - Estilos
- **Radix UI** - Componentes accesibles
- **Lucide React** - Iconografía
- **TypeScript** - Type safety

## 📖 Documentación completa

Ver [DESIGN_SYSTEM_DOCS.md](./DESIGN_SYSTEM_DOCS.md) para documentación detallada de:

- Todos los design tokens
- Guía de uso de componentes
- Patrones de diseño
- Naming conventions
- Guía de migración a React Native

## ⚠️ Avisos importantes

**Esta aplicación NO reemplaza atención médica profesional.**

- Incluir disclaimers visibles en todas las pantallas críticas
- Botón de emergencia (911) accesible
- Información orientativa, no diagnóstica

## 🎨 Inspiración

Este design system está inspirado en:

- **shadcn/ui** - Componentes base
- **Sistemas de salud modernos** - UX patterns
- **Material Design** - Principios de accesibilidad
- **Apple Health** - Claridad visual

## 📝 Licencia

Proyecto educativo - Design System para Guía Salud

---

**Desarrollado con ❤️ para mejorar el acceso a información de salud**
