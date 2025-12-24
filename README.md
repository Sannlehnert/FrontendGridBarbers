# 🛠️ Grid Barbers - Sistema de Turnos para Barbería

Un sistema moderno y elegante de reservas de turnos para barberías, construido con React y Vite. Incluye interfaz de cliente intuitiva y panel administrativo completo.

![Grid Barbers](https://img.shields.io/badge/Grid-Barbers-red?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-18.2.0-blue?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-4.4.5-646CFF?style=flat-square&logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.3-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Características Principales

### 🎨 **Interfaz de Usuario Premium**
- **Diseño Responsive**: Funciona perfectamente en móvil, tablet y desktop
- **Modo Oscuro**: Tema oscuro/light con persistencia automática
- **Animaciones Suaves**: Transiciones elegantes y efectos hover premium
- **UX Intuitiva**: Flujo de reserva en 5 pasos simples

### 📅 **Sistema de Reservas**
- **Selección de Barbero**: Elige entre múltiples barberos profesionales
- **Servicios Variados**: Corte clásico, moderno, barba, combos
- **Calendario Interactivo**: Selección de fecha con restricciones inteligentes
- **Horarios Disponibles**: Sistema de slots con validación en tiempo real
- **Confirmación Instantánea**: Reserva confirmada con detalles completos

### 👨‍💼 **Panel Administrativo**
- **Gestión de Barberos**: CRUD completo con fotos y datos
- **Control de Turnos**: Ver, confirmar y cancelar reservas
- **Estadísticas en Tiempo Real**: Métricas de rendimiento
- **Autenticación Segura**: Login con credenciales mock
- **Vista de Calendario**: Turnos organizados por fecha

### 🔧 **Arquitectura Técnica**
- **Offline-First**: Funciona completamente sin backend (datos mock)
- **Local Storage**: Persistencia automática de datos
- **Context API**: Gestión de estado global (tema, notificaciones)
- **Componentes Reutilizables**: Arquitectura modular y escalable
- **TypeScript-Ready**: Preparado para migración a TypeScript

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 16+
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone <repository-url>
cd TurneroBarberia/TurneroFrontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de producción
npm run preview
```

### Acceso al Sistema

#### 👤 **Vista Cliente**
- Accede directamente a la aplicación
- Usa el botón "🛠️ Acceso Staff" para ir al panel admin

#### 👨‍💼 **Panel Administrativo**
- **Usuario**: `admin` o `staff`
- **Contraseña**: `admin123` o `staff123`

## 📁 Estructura del Proyecto

```
frontend/
├── public/
│   ├── img/
│   │   └── logo.png          # Logo de la barbería
│   └── _redirects            # Configuración Netlify
├── src/
│   ├── components/           # Componentes React
│   │   ├── AdminLogin.jsx    # Login administrativo
│   │   ├── AdminPanel.jsx    # Panel de administración
│   │   ├── AppointmentForm.jsx # Formulario de reserva
│   │   ├── BarberSelection.jsx # Selección de barbero
│   │   ├── DatePicker.jsx    # Selector de fecha
│   │   ├── Notification.jsx  # Componente de notificaciones
│   │   ├── ServiceSelection.jsx # Selección de servicio
│   │   ├── ThemeToggle.jsx   # Toggle modo oscuro
│   │   └── TimeSlot.jsx      # Selector de horario
│   ├── contexts/             # Context API
│   │   ├── NotificationContext.jsx # Gestión notificaciones
│   │   └── ThemeContext.jsx  # Gestión tema oscuro
│   ├── services/             # Servicios y API
│   │   ├── api.js            # Configuración API (mock)
│   │   └── mockData.js       # Datos simulados
│   ├── App.jsx               # Componente principal
│   ├── index.css             # Estilos globales
│   └── main.jsx              # Punto de entrada
├── package.json              # Dependencias y scripts
├── tailwind.config.js        # Configuración Tailwind
├── vite.config.js            # Configuración Vite
└── README.md                 # Este archivo
```

## 🎯 Funcionalidades Detalladas

### Cliente - Flujo de Reserva
1. **Selección de Barbero**: Elige tu barbero preferido
2. **Elección de Servicio**: Selecciona el servicio deseado
3. **Fecha Disponible**: Calendario con fechas válidas
4. **Horario Perfecto**: Slots disponibles en tiempo real
5. **Confirmación Final**: Detalles completos y opciones

### Administrador - Gestión Completa
- **📊 Dashboard**: Estadísticas y métricas
- **👥 Gestión de Barberos**: Crear, editar, eliminar
- **📅 Control de Turnos**: Ver todos los turnos por fecha
- **✅ Confirmar/Cancelar**: Gestión de estado de reservas
- **🔍 Filtrado**: Búsqueda por fecha y barbero

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18**: Framework principal
- **Vite**: Build tool ultrarrápido
- **TailwindCSS**: Framework CSS utility-first
- **React Router**: Navegación (preparado)
- **Context API**: Gestión de estado global

### Utilidades
- **Axios**: Cliente HTTP (configurado para mock)
- **PropTypes**: Validación de props
- **ESLint**: Linting y calidad de código
- **PostCSS**: Procesamiento CSS

### Características Especiales
- **Modo Offline**: Funciona sin backend
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Tema oscuro completo
- **Notificaciones**: Sistema de toast messages
- **Animaciones**: CSS transitions suaves

## 🎨 Personalización

### Colores y Tema
Los colores están definidos en variables CSS en `index.css`:
```css
:root {
  --barber-red: #dc2626;
  --barber-blue: #2563eb;
  --barber-cream: #fef7ed;
  --barber-dark: #1f2937;
  --barber-gray: #6b7280;
}
```

### Servicios y Precios
Configurados en `mockData.js` - fácilmente modificables:
```javascript
let mockServices = [
  {
    id: 1,
    name: 'Corte Clásico',
    price: 15000,
    duration: 30
  }
  // ... más servicios
];
```

### Credenciales Admin
Configuradas en `mockData.js`:
```javascript
let mockAdminUsers = [
  {
    username: 'admin',
    password: 'admin123',
    name: 'Administrador'
  }
];
```

## 🚀 Despliegue

### Netlify (Recomendado)
1. Conecta tu repositorio a Netlify
2. Configura build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Agrega variables de entorno si es necesario

### Vercel
1. Importa el proyecto en Vercel
2. Configura build settings automáticamente
3. Deploy listo en segundos

### Build Manual
```bash
# Construir para producción
npm run build

# Los archivos estarán en la carpeta 'dist'
# Sirve con cualquier servidor web estático
```

## 🔧 Desarrollo

### Scripts Disponibles
```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run preview  # Vista previa build
npm run lint     # Ejecutar ESLint
```

### Agregar Nuevos Servicios
1. Edita `mockData.js`
2. Agrega el nuevo servicio al array `mockServices`
3. Reinicia la aplicación

### Personalizar Tema
1. Modifica variables CSS en `index.css`
2. Actualiza colores en `tailwind.config.js`
3. Prueba en ambos modos (claro/oscuro)

## 📱 Responsive Design

El sistema está optimizado para:
- **📱 Móviles**: 320px - 768px
- **📟 Tablets**: 768px - 1024px
- **💻 Desktop**: 1024px+

### Breakpoints
- `sm:` 640px+
- `md:` 768px+
- `lg:` 1024px+
- `xl:` 1280px+

## 🐛 Solución de Problemas

### Problemas Comunes

**El modo oscuro no funciona**
- Verifica que `ThemeProvider` envuelva la app
- Revisa localStorage por tema guardado

**Notificaciones no aparecen**
- Confirma `NotificationProvider` esté configurado
- Verifica imports en componentes

**Datos no se guardan**
- Revisa localStorage keys en `mockData.js`
- Confirma permisos de localStorage

**Errores de build**
```bash
# Limpiar cache y reinstalar
rm -rf node_modules package-lock.json
npm install
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Grid Barbers Team**
- Proyecto desarrollado para barberías modernas
- Diseño UX/UI premium
- Arquitectura escalable

---

⭐ **Si te gusta el proyecto, dale una estrella!**
