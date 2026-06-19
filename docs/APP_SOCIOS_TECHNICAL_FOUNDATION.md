# APP_SOCIOS_TECHNICAL_FOUNDATION.md
## Contrato Técnico Definitivo — App del Socio Vida & Luz

**Versión:** 1.0  
**Fecha:** 2026-06-19  
**Estado:** APROBADO — Base para inicio de desarrollo  
**Autor:** Lead React Native Architect

---

## ÍNDICE

1. [Stack Tecnológico](#1-stack-tecnológico)
2. [Estructura de Carpetas](#2-estructura-de-carpetas)
3. [Expo Router — Arquitectura de Rutas](#3-expo-router--arquitectura-de-rutas)
4. [Sistema de Tema (Theme)](#4-sistema-de-tema-theme)
5. [Navegación](#5-navegación)
6. [Gestión de Estado](#6-gestión-de-estado)
7. [API Layer](#7-api-layer)
8. [Auth Layer](#8-auth-layer)
9. [Estrategia Offline](#9-estrategia-offline)
10. [Convenciones de Código](#10-convenciones-de-código)
11. [Roadmap de Implementación por Fases](#11-roadmap-de-implementación-por-fases)

---

## 1. Stack Tecnológico

### Decisiones definitivas

| Categoría | Tecnología | Versión | Justificación |
|---|---|---|---|
| Runtime | **Expo SDK** | 52 | Ecosistema completo, EAS Build, actualizaciones OTA |
| Framework | **React Native** | 0.76 | New Architecture activa por defecto |
| Lenguaje | **TypeScript** | 5.x (strict) | Contrato de tipos, seguridad en compilación |
| Routing | **Expo Router** | v4 | File-based routing, deep linking nativo, URL sharing |
| Estilos | **NativeWind** | v4 + Tailwind CSS 3 | Validado en auditoría, clases utilitarias, dark mode trivial |
| Estado servidor | **TanStack Query** | v5 | Cache, background sync, offline support integrado |
| Estado cliente | **Zustand** | v5 | Mínima boilerplate, sin Provider hell, Devtools |
| HTTP Client | **Axios** | v1 | Interceptors, transformers, cancel tokens |
| Formularios | **React Hook Form** | v7 | Performance superior, zero re-renders innecesarios |
| Validación | **Zod** | v3 | Schema-first, inferencia de tipos automática |
| Almacenamiento seguro | **expo-secure-store** | — | Tokens JWT y PIN hash en Keychain/Keystore |
| Caché persistente | **AsyncStorage** | — | Persistencia de Query Cache para offline |
| Biometría | **expo-local-authentication** | — | Face ID / Huella dactilar |
| Gráficos | **Victory Native XL** | — | Gráfico de barras de aportes, moderno y performante |
| Animaciones | **react-native-reanimated** | v3 | Shimmer effects, transiciones de navegación |
| Conectividad | **@react-native-community/netinfo** | — | Detección de red para modo offline |
| Feedback háptico | **expo-haptics** | — | Confirmación en PIN, acciones críticas |

### Paquetes excluidos (y por qué)
- **Redux / Redux Toolkit**: Innecesario; Zustand + TanStack Query cubren todos los casos de uso con menor complejidad.
- **React Navigation standalone**: Expo Router v4 ya lo encapsula; duplicar no aporta valor.
- **UI Kitten / React Native Paper / Tamagui**: La app tendrá su propio Design System construido sobre NativeWind, alineado al UX/UI aprobado. Librerías externas introduciría conflictos visuales.
- **Firebase Auth**: La autenticación es por CI + PIN contra el backend de la Cooperativa, no por proveedor externo.

---

## 2. Estructura de Carpetas

```
vida-luz-app/
│
├── app/                              # Expo Router — Todas las rutas de la app
│   ├── _layout.tsx                   # Root Layout: providers, auth gate
│   ├── index.tsx                     # Entry point: redirige según sesión
│   │
│   ├── (auth)/                       # Grupo NO autenticado (sin Tab Bar)
│   │   ├── _layout.tsx               # Stack layout para flujo de auth
│   │   ├── login.tsx                 # Pantalla: CI + PIN
│   │   └── recuperar-pin.tsx         # Pantalla: Recuperación de PIN
│   │
│   └── (app)/                        # Grupo AUTENTICADO (protegido)
│       ├── _layout.tsx               # Tab Bar Navigator (5 tabs)
│       │
│       ├── (home)/
│       │   ├── _layout.tsx
│       │   └── index.tsx             # Dashboard principal
│       │
│       ├── (creditos)/
│       │   ├── _layout.tsx
│       │   ├── index.tsx             # Lista de créditos
│       │   ├── [id].tsx              # Detalle de crédito específico
│       │   └── solicitar.tsx         # Simulador y solicitud de crédito
│       │
│       ├── (aportes)/
│       │   ├── _layout.tsx
│       │   └── index.tsx             # Historial y gráfico de aportes
│       │
│       ├── (notificaciones)/
│       │   ├── _layout.tsx
│       │   └── index.tsx             # Listado de notificaciones
│       │
│       └── (perfil)/
│           ├── _layout.tsx
│           ├── index.tsx             # Menú de perfil
│           ├── datos-personales.tsx
│           ├── beneficiarios.tsx
│           ├── documentos.tsx
│           ├── cambiar-pin.tsx
│           └── biometria.tsx
│
├── src/
│   │
│   ├── components/                   # Componentes UI reutilizables
│   │   │
│   │   ├── ui/                       # Design System base (átomos)
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── Skeleton.tsx          # Shimmer loading
│   │   │   ├── Typography.tsx
│   │   │   └── Divider.tsx
│   │   │
│   │   ├── auth/                     # Componentes exclusivos de auth
│   │   │   ├── PinPad.tsx            # Teclado numérico PIN
│   │   │   └── BiometricButton.tsx
│   │   │
│   │   ├── home/                     # Componentes del dashboard
│   │   │   ├── BalanceCard.tsx
│   │   │   ├── QuickActions.tsx
│   │   │   └── CoopScoreMeter.tsx    # Medidor semicircular de score
│   │   │
│   │   ├── creditos/                 # Componentes de créditos
│   │   │   ├── CreditCard.tsx
│   │   │   ├── CreditTimeline.tsx
│   │   │   └── CreditSimulator.tsx
│   │   │
│   │   ├── aportes/                  # Componentes de aportes
│   │   │   ├── AportesBarChart.tsx
│   │   │   └── AporteListRow.tsx
│   │   │
│   │   └── shared/                   # Componentes globales de layout
│   │       ├── ScreenWrapper.tsx     # SafeAreaView + scroll base
│   │       ├── EmptyState.tsx
│   │       ├── ErrorState.tsx
│   │       ├── OfflineBanner.tsx
│   │       └── AppHeader.tsx
│   │
│   ├── features/                     # Lógica de negocio por dominio
│   │   │                             # (hooks que usan services + store)
│   │   ├── auth/
│   │   │   ├── useAuthSession.ts     # Hook principal de sesión
│   │   │   ├── usePinLogin.ts
│   │   │   └── useBiometrics.ts
│   │   │
│   │   ├── home/
│   │   │   └── useHomeSummary.ts
│   │   │
│   │   ├── creditos/
│   │   │   ├── useCreditList.ts
│   │   │   ├── useCreditDetail.ts
│   │   │   └── useCreditSimulator.ts
│   │   │
│   │   ├── aportes/
│   │   │   └── useAportes.ts
│   │   │
│   │   ├── notificaciones/
│   │   │   └── useNotificaciones.ts
│   │   │
│   │   └── perfil/
│   │       ├── usePerfil.ts
│   │       └── useChangePin.ts
│   │
│   ├── services/                     # Capa de acceso a datos (API)
│   │   ├── api/
│   │   │   ├── client.ts             # Instancia Axios + interceptors
│   │   │   ├── endpoints.ts          # Constantes de rutas del backend
│   │   │   └── transformers.ts       # Mapeo response → domain model
│   │   │
│   │   ├── authService.ts
│   │   ├── socioService.ts
│   │   ├── creditosService.ts
│   │   ├── aportesService.ts
│   │   └── notificacionesService.ts
│   │
│   ├── store/                        # Zustand stores (estado cliente)
│   │   ├── auth.store.ts             # Token, datos del socio autenticado
│   │   └── ui.store.ts               # Estado global de UI (toasts, overlays)
│   │
│   ├── theme/                        # Design tokens centralizados
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   ├── shadows.ts
│   │   ├── radius.ts
│   │   └── index.ts                  # Re-export unificado
│   │
│   ├── hooks/                        # Hooks genéricos reutilizables
│   │   ├── useNetworkStatus.ts
│   │   ├── useSecureStorage.ts
│   │   └── useAppStateChange.ts
│   │
│   ├── utils/                        # Funciones puras de utilidad
│   │   ├── format.ts                 # Moneda (USD), fechas
│   │   ├── validation.ts             # Validar CI ecuatoriana
│   │   └── security.ts              # Hash de PIN (SHA-256)
│   │
│   ├── types/                        # Tipos TypeScript globales
│   │   ├── api.types.ts              # ApiResponse<T>, ApiError
│   │   ├── auth.types.ts             # Session, Credentials
│   │   ├── socio.types.ts            # Socio, Perfil
│   │   ├── credito.types.ts          # Credito, Cuota, Estado
│   │   └── aporte.types.ts           # Aporte, ResumenMensual
│   │
│   └── constants/
│       ├── config.ts                 # ENV vars tipadas
│       └── queryKeys.ts              # Claves de TanStack Query
│
├── assets/
│   ├── fonts/                        # Inter (400, 500, 700)
│   ├── icons/                        # SVG/PNG iconografía app
│   └── images/                       # Logo, splash, ilustraciones
│
├── docs/                             # Documentación del proyecto
│
├── .env.example                      # Variables de entorno de referencia
├── .env.local                        # Variables locales (gitignored)
├── app.config.ts                     # Expo config dinámico (lee .env)
├── babel.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 3. Expo Router — Arquitectura de Rutas

### Principio fundamental
Expo Router v4 usa el sistema de archivos como definición de rutas. Los **grupos de rutas** `(auth)` y `(app)` son carpetas que agrupan pantallas bajo un layout compartido sin añadir segmentos a la URL.

### Árbol de navegación

```
Root Layout (_layout.tsx)
│   Providers: QueryClient, Zustand
│   Auth Gate: verifica sesión al iniciar
│
├── (auth) — Stack Navigator
│   ├── /login
│   └── /recuperar-pin
│
└── (app) — Bottom Tab Navigator
    ├── /(home)/          → Tab "Inicio"
    ├── /(creditos)/      → Tab "Créditos"
    │   ├── /             → Lista
    │   ├── /[id]         → Detalle (ruta dinámica)
    │   └── /solicitar    → Simulador
    ├── /(aportes)/       → Tab "Aportes"
    ├── /(notificaciones)/→ Tab "Notificaciones"
    └── /(perfil)/        → Tab "Perfil"
        ├── /
        ├── /datos-personales
        ├── /cambiar-pin
        └── /biometria
```

### Auth Gate (Root Layout)
El archivo `app/_layout.tsx` implementa la lógica de redirección:
- Si hay sesión válida → `/(app)/`
- Si no hay sesión → `/(auth)/login`
- Si hay sesión expirada → intento de refresh → si falla → `/(auth)/login`

La verificación ocurre **antes del primer render** usando `expo-router/server` hooks para evitar flash de pantalla.

---

## 4. Sistema de Tema (Theme)

### Fuente de verdad: Design tokens en `src/theme/`

Todos los valores de diseño se definen como constantes TypeScript y se sincronizan con la configuración de Tailwind CSS para que NativeWind los consuma como clases.

### `src/theme/colors.ts`
```
BRAND
  primary:   #0A2342   (Azul Institucional)
  accent:    #F2C94C   (Dorado / CTA)

NEUTRAL
  white:     #FFFFFF
  gray-50:   #F8F9FA   (Fondos de cards)
  gray-200:  #E9ECEF
  gray-500:  #6C757D   (Texto secundario)
  gray-900:  #1A1A1A   (Texto principal)

SEMANTIC
  success:   #28A745   (Crédito al día)
  warning:   #FD7E14   (Pendiente)
  danger:    #DC3545   (Rechazado / Cerrar sesión)
  info:      #17A2B8
```

### `src/theme/typography.ts`
```
Familia: Inter
  Regular (400): cuerpo, descripciones
  Medium  (500): subtítulos, botones, etiquetas
  Bold    (700): títulos, saldo principal

Escala:
  xs:   12px / 16px line-height
  sm:   14px / 20px
  base: 16px / 24px
  lg:   18px / 28px
  xl:   20px / 28px
  2xl:  24px / 32px
  3xl:  30px / 36px
```

### `src/theme/spacing.ts`
Base unit: 4px. Escala: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64.

### `src/theme/radius.ts`
```
sm:   8px   (inputs, badges)
md:  12px   (botones)
lg:  16px   (cards)
xl:  24px   (cards grandes, bottom sheets)
full: 9999px (chips, avatares)
```

### `tailwind.config.js` (extensión de tokens)
Los tokens de `src/theme/` se importan y extienden el `theme.extend` de Tailwind para que sean accesibles como clases NativeWind: `bg-brand-primary`, `text-brand-accent`, `rounded-card`, etc.

---

## 5. Navegación

### Capa 1: Root — Auth Gate
`app/_layout.tsx` actúa como shell global. Envuelve toda la app en:
1. `QueryClientProvider` (TanStack Query)
2. Lógica de sesión (leer token de `expo-secure-store`)
3. Redirección declarativa con `<Redirect>` de Expo Router

### Capa 2: Auth — Stack Navigator
`app/(auth)/_layout.tsx` presenta un Stack sin header visible (pantallas a full screen). Animaciones de slide horizontal entre login y recuperación de PIN.

### Capa 3: App — Bottom Tab Bar
`app/(app)/_layout.tsx` implementa el Tab Bar con las siguientes especificaciones exactas del UX/UI:

| Tab | Ícono inactivo | Ícono activo | Ruta |
|---|---|---|---|
| Inicio | home-outline | home-solid (#0A2342) | /(home)/ |
| Créditos | card-outline | card-solid (#0A2342) | /(creditos)/ |
| Aportes | trending-up-outline | trending-up-solid (#0A2342) | /(aportes)/ |
| Notificaciones | bell-outline | bell-solid (#0A2342) | /(notificaciones)/ |
| Perfil | user-outline | user-solid (#0A2342) | /(perfil)/ |

- Fondo Tab Bar: `#FFFFFF`
- Badge de notificaciones: círculo rojo sobre el ícono de bell
- Tab Bar height: 60px + SafeAreaInsets bottom

### Capa 4: Modal / Sheet
Para flujos secundarios (confirmaciones, detalles rápidos) se usará `expo-router`'s modal presentation combinado con `react-native-reanimated` Bottom Sheet. No es un tab; se invoca desde cualquier pantalla.

---

## 6. Gestión de Estado

### Modelo mental: Separación estricta de responsabilidades

```
┌─────────────────────────────────────────────────────────┐
│  ESTADO SERVIDOR  →  TanStack Query v5                  │
│  (datos de la API: créditos, aportes, perfil, saldo)    │
├─────────────────────────────────────────────────────────┤
│  ESTADO CLIENTE   →  Zustand v5                         │
│  (sesión activa, preferencias UI, overlays)             │
├─────────────────────────────────────────────────────────┤
│  ESTADO PERSISTIDO SEGURO  →  expo-secure-store         │
│  (JWT tokens, PIN hash)                                 │
├─────────────────────────────────────────────────────────┤
│  ESTADO PERSISTIDO NO SENSIBLE  →  AsyncStorage         │
│  (caché de Query, tema, idioma)                         │
└─────────────────────────────────────────────────────────┘
```

### TanStack Query v5 — Configuración global

```
defaultOptions:
  queries:
    staleTime:   5 minutos   (datos financieros)
    gcTime:     30 minutos
    retry:       2 intentos
    refetchOnWindowFocus: true
    refetchOnReconnect:   true   ← clave para offline recovery
```

### Zustand Stores

**`auth.store.ts`**
```
State:
  socio: Socio | null
  accessToken: string | null
  isAuthenticated: boolean

Actions:
  login(token, socio) → void
  logout()            → void
  updateSocio(data)   → void
```

**`ui.store.ts`**
```
State:
  isLoading: boolean        (overlay global)
  toast: Toast | null

Actions:
  showLoading() / hideLoading()
  showToast(message, type)
  dismissToast()
```

### React Query Keys — `src/constants/queryKeys.ts`
```
AUTH:         ['auth', 'session']
SOCIO:        ['socio', socioId]
HOME_SUMMARY: ['home', 'summary', socioId]
CREDITOS:     ['creditos', socioId]
CREDITO:      ['credito', creditoId]
APORTES:      ['aportes', socioId, year]
NOTIFICACIONES: ['notificaciones', socioId]
```

---

## 7. API Layer

### Flujo de datos

```
Backend API
    ↓ HTTP (JSON)
Axios Client (client.ts)
    ↓ interceptors: auth header, 401 refresh, error normalize
Service Layer (creditosService.ts, etc.)
    ↓ transformers: snake_case → camelCase, tipos DTO → Domain
Feature Hooks (useCreditList.ts)
    ↓ useQuery / useMutation con React Query
Componentes React Native
```

### `src/services/api/client.ts` — Responsabilidades

1. **Base URL**: Leída de `src/constants/config.ts` (que lee `process.env.EXPO_PUBLIC_API_URL`)
2. **Request Interceptor**: Inyecta `Authorization: Bearer <token>` desde `auth.store`
3. **Response Interceptor — 401 handling**:
   - Detecta 401 en cualquier respuesta
   - Intenta `POST /auth/refresh` con refresh token
   - Si el refresh tiene éxito: actualiza tokens y reintenta la request original
   - Si el refresh falla: llama `logout()` del store y redirige a `/login`
4. **Error Normalizer**: Convierte todos los errores en un objeto `ApiError` consistente con `{ code, message, statusCode }`

### `src/services/api/endpoints.ts`
```
AUTH:
  POST /auth/login
  POST /auth/refresh
  POST /auth/logout
  POST /auth/validate-ci

SOCIO:
  GET  /socios/me
  PUT  /socios/me

CREDITOS:
  GET  /creditos
  GET  /creditos/:id
  GET  /creditos/:id/cronograma
  POST /creditos/simular
  POST /creditos/solicitar

APORTES:
  GET  /aportes
  GET  /aportes/resumen

NOTIFICACIONES:
  GET  /notificaciones
  PUT  /notificaciones/:id/leer
```

### Transformers
Los servicios mapean las respuestas del backend (snake_case, formatos de fecha del servidor) a los tipos de dominio de la app (camelCase, objetos `Date`, formatos monetarios normalizados). Los componentes nunca ven respuestas crudas de la API.

---

## 8. Auth Layer

### Flujo completo de autenticación

```
┌──────────────────────────────────────────────┐
│ PRIMER LOGIN                                  │
│                                               │
│  1. Usuario ingresa CI + PIN                  │
│  2. PIN se hashea (SHA-256) en el cliente     │
│  3. POST /auth/login → { accessToken,         │
│       refreshToken, socio }                   │
│  4. Tokens → expo-secure-store                │
│  5. Socio → auth.store (Zustand)              │
│  6. Ofrecer configurar biometría              │
│  7. Redirigir a /(app)/                       │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ REAPERTURA DE APP (sesión persistida)         │
│                                               │
│  1. Root layout lee token de secure-store     │
│  2. Verifica expiración del JWT               │
│  3a. Token válido → cargar socio → /(app)/   │
│  3b. Token expirado → POST /auth/refresh      │
│    3b-ok  → nuevo token → /(app)/            │
│    3b-fail → limpiar store → /(auth)/login   │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ ACCESO BIOMÉTRICO                             │
│                                               │
│  1. expo-local-authentication.authenticate() │
│  2. Si éxito local → leer token de            │
│     secure-store (el token real)              │
│  3. Validar token (o refresh si expirado)     │
│  4. Acceso directo a /(app)/                  │
│                                               │
│  IMPORTANTE: La biometría NO autentica en el  │
│  servidor. Solo desbloquea el token local.    │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ LOGOUT                                        │
│                                               │
│  1. POST /auth/logout (invalida refresh)      │
│  2. expo-secure-store.deleteItemAsync(token)  │
│  3. auth.store.logout() → limpia Zustand      │
│  4. queryClient.clear() → limpia React Query  │
│  5. router.replace('/(auth)/login')           │
└──────────────────────────────────────────────┘
```

### Seguridad del PIN
- El PIN **nunca viaja en texto plano** ni se almacena en la app.
- Se aplica `SHA-256` al PIN antes de enviarlo al servidor.
- La verificación de PIN correcto/incorrecto ocurre únicamente en el servidor.
- `expo-secure-store` usa AES-256 (Android Keystore / iOS Keychain).

### Límite de intentos fallidos
- Máximo 5 intentos de PIN incorrectos consecutivos.
- Al 5to fallo: bloqueo de pantalla por 5 minutos (countdown visible).
- El contador de intentos persiste en `expo-secure-store`.

---

## 9. Estrategia Offline

### Filosofía
La app es **read-first offline**: los socios pueden consultar sus datos financieros aunque no tengan conexión. Las acciones de escritura (solicitar crédito, cambiar PIN) requieren conexión y muestran feedback claro cuando no la hay.

### Capas de la estrategia

**Capa 1 — Detección de red**
`@react-native-community/netinfo` observa el estado de conectividad globalmente.
- `ui.store` almacena `isOnline: boolean`
- `OfflineBanner.tsx` se muestra en todas las pantallas protegidas cuando `isOnline === false`

**Capa 2 — Caché de TanStack Query**
```
Caché en memoria (por sesión):
  staleTime configurado por tipo de dato:
  
  CRÍTICO (sin caché offline): auth/tokens
  ALTO    (staleTime: 5min)  : saldo, créditos activos
  MEDIO   (staleTime: 30min) : historial créditos, aportes
  BAJO    (staleTime: 24h)   : perfil, notificaciones leídas
```

**Capa 3 — Persistencia de caché entre sesiones**
`@tanstack/query-async-storage-persister` + `AsyncStorage`:
- La caché de Query se serializa y persiste al cerrar la app
- Al reabrir sin conexión, los datos persisted se presentan con indicador "Datos de última sincronización: [fecha]"
- `maxAge`: 24 horas (datos más viejos se descartan para evitar mostrar información financiera obsoleta)

**Capa 4 — Comportamiento de mutaciones offline**
Para acciones de escritura cuando no hay conexión:
- Se muestra un `Toast` informativo: "Necesitas conexión para [acción]"
- Los botones de acción crítica se deshabilitan visualmente cuando `isOnline === false`
- No se usa `optimisticUpdates` en datos financieros para evitar inconsistencias

**Capa 5 — Sincronización al reconectar**
- `refetchOnReconnect: true` en TanStack Query
- Al detectar reconexión: se invalidan las queries de `ALTO` prioridad automáticamente
- Notificación sutil al usuario: "Sincronizando datos..."

---

## 10. Convenciones de Código

### TypeScript
- Modo `strict: true` en `tsconfig.json`. Sin excepciones.
- Prohibido el tipo `any`. Usar `unknown` y narrowing, o tipos específicos.
- `interface` para formas de objetos. `type` para uniones, intersecciones, primitivos.
- Tipos de respuesta de API siempre en `src/types/`. Los componentes usan Domain Types, no DTO types.

### Nomenclatura de archivos

| Artefacto | Convención | Ejemplo |
|---|---|---|
| Componentes | PascalCase | `CreditCard.tsx` |
| Hooks | camelCase con prefijo `use` | `useCreditList.ts` |
| Stores | camelCase con sufijo `.store` | `auth.store.ts` |
| Servicios | camelCase con sufijo `Service` | `creditosService.ts` |
| Tipos | camelCase con sufijo `.types` | `credito.types.ts` |
| Utilidades | camelCase | `format.ts` |
| Rutas (Expo Router) | kebab-case | `datos-personales.tsx` |

### Componentes
- Solo componentes funcionales. Cero componentes de clase.
- **Named exports** en todos los archivos salvo rutas de Expo Router (que requieren `default export`).
- Props tipadas con `interface` local si son complejas, o inline si son simples.
- Ningún componente tiene lógica de negocio directa: accede a datos mediante feature hooks.

### Path Aliases
Configurados en `tsconfig.json` y `babel.config.js`:
```
@/components  →  src/components
@/features    →  src/features
@/services    →  src/services
@/store       →  src/store
@/theme       →  src/theme
@/hooks       →  src/hooks
@/utils       →  src/utils
@/types       →  src/types
@/constants   →  src/constants
```

### Estilos
- **Prohibidos los `StyleSheet.create` locales** en nuevos componentes. Todo a través de clases NativeWind.
- Si se necesitan valores dinámicos imposibles de expresar con clases, usar el atributo `style` con tokens de `@/theme`.
- Nunca valores mágicos inline (`style={{ color: '#0A2342' }}`). Siempre desde el theme.

### Comentarios
- No comentar qué hace el código (los nombres lo explican).
- Solo comentar el **por qué** cuando hay una restricción oculta, invariante sutil o workaround.

### Variables de entorno
- Todas las variables en `.env.local` (gitignored).
- Acceso **solo** a través de `src/constants/config.ts` (tipado).
- Variables públicas (frontend): prefijo `EXPO_PUBLIC_`.
- Variables privadas (EAS secrets): sin prefijo público.

```
# .env.example
EXPO_PUBLIC_API_URL=https://api.vidaluz.coop/v1
EXPO_PUBLIC_APP_ENV=development
```

### Commits
Formato Conventional Commits:
```
feat(creditos): add credit simulator with slider inputs
fix(auth): handle refresh token rotation on 401
chore(deps): upgrade expo-sdk to 52.1.0
```

---

## 11. Roadmap de Implementación por Fases

### Visión general
```
Fase 0  → Fundación      (Semana 1)
Fase 1  → Auth           (Semana 2)
Fase 2  → Home Dashboard (Semana 3)
Fase 3  → Créditos       (Semana 4)
Fase 4  → Aportes        (Semana 5)
Fase 5  → Notif + Perfil (Semana 6)
Fase 6  → Offline+Polish (Semana 7)
Fase 7  → QA + Release   (Semana 8)
```

---

### Fase 0 — Fundación del Proyecto
**Objetivo**: Repositorio con toda la infraestructura técnica lista. Cero pantallas de producto, pero el "esqueleto" funciona.

**Entregables:**
- [ ] `npx create-expo-app` con template en blanco + TypeScript
- [ ] Instalar y configurar todas las dependencias del Stack
- [ ] Configurar NativeWind 4 + `tailwind.config.js` con los design tokens
- [ ] Configurar `tsconfig.json` con path aliases
- [ ] Configurar `babel.config.js` con plugin de NativeWind y módule resolver
- [ ] Crear `src/theme/` completo (colors, typography, spacing, radius, shadows)
- [ ] Cargar fuente Inter con `expo-font`
- [ ] Construir todos los componentes de `src/components/ui/` (Button, Card, Input, Badge, ProgressBar, Skeleton, Typography)
- [ ] Configurar TanStack Query (QueryClient con defaults globales)
- [ ] Configurar Zustand stores (auth, ui)
- [ ] Configurar Axios client con interceptors (sin rutas reales aún)
- [ ] Crear `src/constants/queryKeys.ts` y `config.ts`
- [ ] `app/_layout.tsx` vacío con providers
- [ ] Screen de prueba visual del design system

**Criterio de salida**: Un "Storybook" informal: pantalla que muestra todos los componentes UI con el tema correcto.

---

### Fase 1 — Auth Layer
**Objetivo**: Flujo completo de login funcional con backend real (o mock).

**Entregables:**
- [ ] `app/(auth)/_layout.tsx` — Stack navigator
- [ ] `app/(auth)/login.tsx` — Pantalla CI + PinPad
- [ ] `src/components/auth/PinPad.tsx` — Teclado numérico custom
- [ ] `src/components/auth/BiometricButton.tsx`
- [ ] `src/features/auth/usePinLogin.ts` (integrado con authService)
- [ ] `src/features/auth/useBiometrics.ts`
- [ ] `src/services/authService.ts` (login, refresh, logout endpoints)
- [ ] `auth.store.ts` funcional con persistencia en `expo-secure-store`
- [ ] Root Layout auth gate (redirección según sesión)
- [ ] Límite de 5 intentos de PIN con bloqueo temporal
- [ ] `app/(auth)/recuperar-pin.tsx` — flujo básico

**Criterio de salida**: Desde pantalla en blanco → login con CI+PIN → llega a /(app)/ vacío. Logout regresa al login. Biometría funcional en dispositivo físico.

---

### Fase 2 — Home Dashboard
**Objetivo**: Pantalla principal con datos reales del socio.

**Entregables:**
- [ ] `app/(app)/_layout.tsx` — Tab Bar Navigator con 5 tabs
- [ ] `app/(app)/(home)/index.tsx` — Dashboard
- [ ] `src/components/shared/AppHeader.tsx` (saludo + avatar + bell)
- [ ] `src/components/home/BalanceCard.tsx` (carrusel de cards)
- [ ] `src/components/home/QuickActions.tsx` (grid de acciones)
- [ ] `src/components/home/CoopScoreMeter.tsx` (medidor semicircular)
- [ ] `src/features/home/useHomeSummary.ts`
- [ ] `src/services/socioService.ts` (GET /socios/me)
- [ ] Shimmer loading states en todas las cards
- [ ] `src/components/shared/OfflineBanner.tsx`
- [ ] `useNetworkStatus.ts` hook

**Criterio de salida**: Dashboard muestra datos reales del socio. Shimmer visible en carga lenta. Banner offline visible sin conexión.

---

### Fase 3 — Módulo de Créditos
**Objetivo**: Flujo completo de consulta y simulación de créditos.

**Entregables:**
- [ ] `app/(app)/(creditos)/index.tsx` — Lista de créditos
- [ ] `app/(app)/(creditos)/[id].tsx` — Detalle + timeline
- [ ] `app/(app)/(creditos)/solicitar.tsx` — Simulador
- [ ] `src/components/creditos/CreditCard.tsx` (estado, barra de progreso)
- [ ] `src/components/creditos/CreditTimeline.tsx` (cuotas pagadas/pendientes)
- [ ] `src/components/creditos/CreditSimulator.tsx` (sliders monto/plazo)
- [ ] `src/features/creditos/useCreditList.ts`
- [ ] `src/features/creditos/useCreditDetail.ts`
- [ ] `src/features/creditos/useCreditSimulator.ts`
- [ ] `src/services/creditosService.ts`
- [ ] Empty state para "sin créditos activos"
- [ ] Caché offline con datos de última sincronización

**Criterio de salida**: Socio ve lista de créditos, entra al detalle, visualiza el timeline, usa el simulador con sliders y ve la cuota calculada en tiempo real.

---

### Fase 4 — Módulo de Aportes
**Objetivo**: Historial visual de aportes del socio.

**Entregables:**
- [ ] `app/(app)/(aportes)/index.tsx`
- [ ] `src/components/aportes/AportesBarChart.tsx` (últimos 6 meses con Victory Native XL)
- [ ] `src/components/aportes/AporteListRow.tsx`
- [ ] `src/features/aportes/useAportes.ts`
- [ ] `src/services/aportesService.ts`

**Criterio de salida**: Gráfico de barras renderiza con datos reales. Lista de historial paginada. Funciona offline con datos cacheados.

---

### Fase 5 — Notificaciones y Perfil
**Objetivo**: Sistema de notificaciones y gestión de cuenta del socio.

**Entregables:**
- [ ] `app/(app)/(notificaciones)/index.tsx` — Lista de notificaciones
- [ ] `src/features/notificaciones/useNotificaciones.ts`
- [ ] Badge de notificaciones no leídas en Tab Bar
- [ ] `app/(app)/(perfil)/index.tsx` — Menú de perfil (estilo Settings iOS)
- [ ] `app/(app)/(perfil)/datos-personales.tsx`
- [ ] `app/(app)/(perfil)/cambiar-pin.tsx`
- [ ] `app/(app)/(perfil)/biometria.tsx`
- [ ] `src/features/perfil/useChangePin.ts`
- [ ] Botón de "Cerrar Sesión" con confirmación
- [ ] Flujo de logout completo (limpia todo el estado)

**Criterio de salida**: Socio puede ver y marcar notificaciones como leídas. Puede cambiar su PIN. Puede activar/desactivar biometría. Logout funciona completamente.

---

### Fase 6 — Offline Polish & Animaciones
**Objetivo**: Experiencia premium y resiliencia ante condiciones de red.

**Entregables:**
- [ ] Configurar `@tanstack/query-async-storage-persister` (persistencia entre sesiones)
- [ ] Indicador "Última sincronización" en pantallas con caché
- [ ] Auto-refetch de queries prioritarias al reconectar
- [ ] Shimmer effects refinados en todos los estados de carga
- [ ] Animaciones de transición entre tabs (reanimated)
- [ ] Animaciones de CreditCard hover/press
- [ ] Haptic feedback en PIN pad y acciones críticas
- [ ] Splash screen animada (fade in al logo)
- [ ] Error boundaries globales con pantalla de error amigable
- [ ] Empty states con ilustraciones en todos los módulos

**Criterio de salida**: App se siente fluida y premium. Modo offline muestra datos con fecha. Al reconectar, datos se actualizan automáticamente.

---

### Fase 7 — QA, Performance y Release Prep
**Objetivo**: App lista para distribución a usuarios reales.

**Entregables:**
- [ ] Pruebas de flujo completo en dispositivos físicos iOS y Android
- [ ] Auditoría de performance (Flashlist donde aplique, memo donde necesario)
- [ ] Revisión de seguridad: verificar que ningún dato sensible quede en logs o AsyncStorage sin cifrar
- [ ] Configurar **EAS Build** (eas.json: development, staging, production)
- [ ] Configurar **EAS Update** para OTA updates
- [ ] Configurar variables de entorno por environment en EAS
- [ ] Generar assets de App Store: iconos, screenshots, splash screens en todas las resoluciones
- [ ] Configurar `app.config.ts` dinámico para los 3 environments
- [ ] Crear build de staging para UAT (User Acceptance Testing) con el equipo de la Cooperativa
- [ ] Documentar proceso de release en `docs/RELEASE_PROCESS.md`

**Criterio de salida**: Build de producción generado y probado. App pasa revisión interna de la Cooperativa. Listo para submit a App Store y Google Play.

---

## Apéndice A — Variables de Entorno Requeridas

```bash
# .env.example

# API
EXPO_PUBLIC_API_URL=https://api.vidaluz.coop/v1
EXPO_PUBLIC_APP_ENV=development            # development | staging | production

# Feature Flags (opcionales por fase)
EXPO_PUBLIC_FF_BIOMETRICS=true
EXPO_PUBLIC_FF_CREDIT_REQUEST=false        # Desactivado hasta Fase 3
```

---

## Apéndice B — Dependencias del `package.json`

```json
{
  "dependencies": {
    "expo": "^52.0.0",
    "react-native": "0.76.6",
    "expo-router": "~4.0.17",
    "nativewind": "^4.0.0",
    "tailwindcss": "^3.4.0",
    "@tanstack/react-query": "^5.0.0",
    "@tanstack/query-async-storage-persister": "^5.0.0",
    "@tanstack/react-query-persist-client": "^5.0.0",
    "zustand": "^5.0.0",
    "axios": "^1.7.0",
    "react-hook-form": "^7.0.0",
    "zod": "^3.0.0",
    "expo-secure-store": "~14.0.0",
    "expo-local-authentication": "~15.0.0",
    "expo-font": "~13.0.0",
    "expo-haptics": "~14.0.0",
    "@react-native-async-storage/async-storage": "^2.0.0",
    "@react-native-community/netinfo": "^11.0.0",
    "react-native-reanimated": "~3.16.0",
    "victory-native": "^41.0.0"
  }
}
```

---

## Apéndice C — Checklist de Arranque (Día 1)

Antes de escribir código de producto, verificar:

- [ ] Node.js ≥ 20 instalado
- [ ] EAS CLI instalado (`npm install -g eas-cli`)
- [ ] Cuenta Expo configurada (`eas login`)
- [ ] Dispositivo físico o simulador listo para pruebas
- [ ] Variables de entorno en `.env.local` completadas
- [ ] Acceso al backend de la Cooperativa (o mock server configurado)
- [ ] Fuente Inter descargada en `assets/fonts/`
- [ ] Repositorio clonado y branch de feature creado

---

*Este documento es el contrato técnico de referencia. Cualquier desviación significativa de la arquitectura aquí definida debe ser discutida y aprobada antes de implementarse, actualizando este documento como fuente de verdad.*
