# 🏥 MediTriage - Aplicación de Triage Médico

Una aplicación móvil moderna de triage médico que evalúa síntomas y guía a los usuarios hacia la atención médica adecuada.

## 📱 Características Principales

### ✨ Pantallas Implementadas

1. **Splash Screen** - Pantalla de bienvenida animada
2. **Home Screen** - Pantalla principal con acciones rápidas
3. **Evaluación de Síntomas** - Cuestionario interactivo paso a paso
4. **Resultado de Gravedad** - Clasificación por colores con recomendaciones
5. **Mapa Sanitario** - Mapa interactivo de centros médicos en Tandil
6. **Historial** - Registro de evaluaciones anteriores
7. **Configuración** - Preferencias y ajustes de la app

### 🎨 Sistema de Clasificación por Colores

- 🔴 **ROJO** - Emergencia (requiere atención inmediata)
- 🟠 **NARANJA** - Urgente (atención en 2-4 horas)
- 🟡 **AMARILLO** - Consulta médica (programar cita)
- 🟢 **VERDE** - Autocuidado (manejar en casa)

### 🗺️ Mapa Sanitario

Ubicaciones reales en Tandil, Buenos Aires, Argentina:
- Hospitales con emergencias 24hs
- Clínicas y centros médicos
- Farmacias
- Servicios de emergencia (SAME)

Incluye:
- Geolocalización en tiempo real
- Cálculo de distancias
- Filtros por tipo de establecimiento
- Botones para llamar y obtener direcciones

### 🎯 Funcionalidades

- ✅ Evaluación inteligente de síntomas
- ✅ Navegación fluida con React Router
- ✅ Animaciones suaves con Motion
- ✅ Diseño mobile-first responsivo
- ✅ Sistema de componentes reutilizables
- ✅ Geolocalización y mapas interactivos (Leaflet)
- ✅ Colores semánticos por nivel de gravedad
- ✅ Bottom navigation tabs
- ✅ Loading skeletons
- ✅ Recomendaciones personalizadas
- ✅ Sugerencias de medicación OTC

### 🏗️ Arquitectura

```
src/app/
├── components/        # Componentes reutilizables
│   ├── ui/           # Design system components
│   ├── BottomTabBar.tsx
│   ├── LocationCard.tsx
│   ├── SeverityBadge.tsx
│   └── LoadingSkeleton.tsx
├── pages/            # Pantallas de la aplicación
│   ├── SplashScreen.tsx
│   ├── HomeScreen.tsx
│   ├── SymptomEvaluation.tsx
│   ├── SeverityResult.tsx
│   ├── MapScreen.tsx
│   ├── HistoryScreen.tsx
│   └── SettingsScreen.tsx
├── data/             # Datos mock
│   ├── questions.ts
│   └── locations.ts
├── services/         # Lógica de negocio
│   └── triageService.ts
├── hooks/            # Hooks personalizados
│   └── useGeolocation.ts
├── types/            # TypeScript types
│   └── index.ts
├── routes.tsx        # Configuración de rutas
└── App.tsx           # Componente principal
```

### 🎨 Design System

- Utiliza componentes de UI con Radix UI
- Sistema de temas con CSS variables
- Tailwind CSS v4
- Diseño mobile-first
- Colores semánticos para niveles de gravedad

### 🚀 Tecnologías

- **React** - Framework principal
- **TypeScript** - Tipado estático
- **React Router** - Navegación
- **Motion** (Framer Motion) - Animaciones
- **Leaflet** - Mapas interactivos
- **Tailwind CSS v4** - Estilos
- **Radix UI** - Componentes accesibles
- **Lucide React** - Iconos

### ⚠️ Disclaimer

Esta aplicación es una **herramienta de orientación** y NO reemplaza:
- Atención médica profesional
- Diagnóstico médico
- Tratamiento médico

**En caso de emergencia, llama al 107 o acude al hospital más cercano.**

### 📝 Notas de Implementación

- La geolocalización usa la ubicación por defecto de Tandil si el usuario no permite permisos
- Los mapas utilizan OpenStreetMap gratuito
- Las ubicaciones son reales y verificadas de Tandil, Buenos Aires
- El historial actualmente usa datos mock (ready para integración con backend)
- Dark mode está preparado pero deshabilitado
- Soporte multiidioma está estructurado para implementación futura

### 🔮 Funcionalidades Futuras

- [ ] Integración con IA médica
- [ ] Backend con Supabase para persistencia
- [ ] Push notifications
- [ ] Modo offline completo
- [ ] Soporte multiidioma
- [ ] Exportar historial a PDF
- [ ] Compartir resultados con médico
- [ ] Integración con calendarios
- [ ] Dark mode activado

---

**Desarrollado con ❤️ para mejorar el acceso a la atención médica**
