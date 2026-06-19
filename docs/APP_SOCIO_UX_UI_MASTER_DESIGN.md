# Master Design System - App del Socio Vida & Luz

Este documento establece los lineamientos visuales y de experiencia de usuario (UX/UI) para la aplicación móvil V1 de la Cooperativa Vida & Luz. El objetivo es ofrecer una experiencia premium, clara y moderna, inspirada en referentes como Nubank, Ueno e Itaú Digital.

## 🎨 Exploración Visual y Mockups

A continuación, se presentan los mockups de alta fidelidad que definen la línea gráfica del proyecto.

````carousel
![Dashboard Principal - App del Socio](C:\Users\daaguilera\.gemini\antigravity\brain\5a28c83d-12ef-4971-a96c-b9209db7fdbd\vida_luz_home_dashboard_1781898177153.png)
<!-- slide -->
![Pantalla de Login](C:\Users\daaguilera\.gemini\antigravity\brain\5a28c83d-12ef-4971-a96c-b9209db7fdbd\vida_luz_login_screen_1781898187014.png)
<!-- slide -->
![Gestión de Créditos](C:\Users\daaguilera\.gemini\antigravity\brain\5a28c83d-12ef-4971-a96c-b9209db7fdbd\vida_luz_credits_screen_1781898197889.png)
<!-- slide -->
![Sistema de Diseño (Componentes y Colores)](C:\Users\daaguilera\.gemini\antigravity\brain\5a28c83d-12ef-4971-a96c-b9209db7fdbd\vida_luz_design_system_1781898208295.png)
````

---

## 1. Sistema de Diseño (Design System)

### 1.1 Paleta de Colores
- **Color Principal (Brand Primary):** Azul Institucional Vida & Luz (ej. `#0A2342`) - Transmite seguridad, confianza y solidez.
- **Color Secundario (Accent):** Dorado/Amarillo sutil (ej. `#F2C94C`) - Para destacar llamadas a la acción (CTAs) y acentos.
- **Fondo (Background):** Blanco puro (`#FFFFFF`) y grises extra claros (`#F8F9FA`) para diferenciar tarjetas y contenedores en Modo Claro.
- **Textos (Typography Colors):**
  - Textos principales: Gris oscuro / Casi negro (`#1A1A1A`)
  - Textos secundarios: Gris medio (`#6C757D`)
- **Estados (Semantic):**
  - Éxito (Aprobado): Verde (`#28A745`)
  - Alerta/Pendiente: Naranja (`#FD7E14`)
  - Error/Rechazado: Rojo (`#DC3545`)

### 1.2 Tipografía
- **Familia Tipográfica:** *Inter* o *Roboto* (limpia, moderna, excelente legibilidad en pantallas móviles).
- **Pesos:**
  - `Bold (700)` para Títulos grandes (H1, H2) y Saldo principal.
  - `Medium (500)` para Subtítulos, etiquetas de botones y nombres de secciones.
  - `Regular (400)` para cuerpos de texto, descripciones y detalles.

### 1.3 Componentes Base
- **Botones:** Bordes suavemente redondeados (radius de `12px` o `16px`). Botones primarios rellenos del color de marca; botones secundarios con borde (outline) o de texto.
- **Cards (Tarjetas):** Fondos blancos sobre fondo gris claro (`#F8F9FA`), con sombras muy sutiles (`box-shadow: 0 4px 12px rgba(0,0,0,0.05)`) y bordes redondeados (`16px` o `24px`).
- **Estados Vacíos (Empty States):** Ilustraciones minimalistas que acompañan mensajes amigables (ej. "Aún no tienes créditos activos").
- **Loading (Carga):** Shimmer effects (esqueletos de carga) para transiciones fluidas en lugar de simples spinners circulares.

---

## 2. Flujos de Pantallas y Navegación

### 2.1 Splash Screen y Login
- **Splash Screen:** Fondo en el color primario (`#0A2342`), logo central de Vida & Luz en blanco. Transición suave (fade in) hacia el login.
- **Login:**
  - Campo para Número de Socio o CI.
  - Teclado numérico en pantalla para el PIN.
  - Icono flotante o secundario para **Acceso Biométrico** (Face ID / Huella).
  - Enlace inferior discreto: "¿Olvidaste tu PIN? Recupéralo aquí".

### 2.2 Home Dashboard
- **Header:** Saludo ("Hola, [Nombre]"), icono de perfil y campanita de notificaciones.
- **Score Cooperativo:** Medidor visual semicircular o barra de progreso mostrando la calificación del socio.
- **Resumen Financiero (Cards tipo Carrusel):**
  - *Card 1:* Saldo de aportes acumulados.
  - *Card 2:* Próxima cuota de crédito a vencer.
- **Acciones Rápidas (Grid de Iconos):** "Transferir", "Pagar Cuota", "Solicitar Crédito", "Extractos".

### 2.3 Navegación Principal (Bottom Tab Bar)
Menú inferior fijo, fondo blanco, iconos sin relleno (outline) que se rellenan (solid) y cambian al color primario cuando están activos:
1. **Inicio** (Home)
2. **Créditos** (Mis Créditos)
3. **Aportes** (Mis Aportes)
4. **Notificaciones** (Campanita)
5. **Perfil** (Usuario)

### 2.4 Aportes y Créditos
- **Mis Aportes:** Gráfico de barras simple mostrando los últimos 6 meses. Lista del historial mensual de pagos.
- **Mis Créditos:** Lista de tarjetas. Cada tarjeta indica el estado (Al día, Atrasado), porcentaje pagado mediante una barra de progreso, y la próxima cuota.
- **Detalle de Crédito / Solicitar Crédito:**
  - Cronograma estilo línea de tiempo vertical (timeline) para cuotas pagadas (check verde) y pendientes (círculo gris).
  - Simulador de crédito interactivo con deslizadores (sliders) para el Monto y el Plazo, calculando la cuota aproximada en tiempo real.

### 2.5 Perfil y Ajustes
Lista limpia (tipo *Settings* de iOS) separada por bloques:
- **Cuenta:** Datos personales, Beneficiarios, Mis Documentos.
- **Seguridad:** Cambiar PIN, Configurar Biometría.
- **Ayuda:** Contacto con la Cooperativa, Preguntas Frecuentes.
- Botón de "Cerrar Sesión" en rojo en la parte inferior.
