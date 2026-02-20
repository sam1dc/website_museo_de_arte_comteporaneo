# Museo de Arte Contemporáneo (MAC) - Sistema de Gestión

Sistema web para la gestión y venta de obras de arte del Museo de Arte Contemporáneo.

## Tecnologías

- **React 18** + **Vite** - Framework y build tool
- **React Router DOM** - Navegación y rutas
- **Material-UI (MUI)** - Componentes UI
- **Tailwind CSS** - Estilos utility-first
- **ESLint** - Linting de código

## Estructura del Proyecto

```
src/
├── layouts/          # Layouts de la aplicación
│   └── MainLayout.jsx
├── routes/           # Configuración de rutas
│   ├── AppRoutes.jsx
│   └── ProtectedRoute.jsx
├── views/            # Vistas/páginas principales
│   ├── LoginView.jsx
│   ├── UsuariosView.jsx
│   └── GenerosView.jsx
├── components/       # Componentes reutilizables
│   ├── Sidebar.jsx
│   ├── Navbar.jsx
│   ├── LoginForm.jsx
│   ├── DashboardContent.jsx
│   ├── GenerosContent.jsx
│   └── ...
├── hooks/            # Custom hooks
│   ├── useAuth.jsx
│   └── useForm.jsx
└── utils/            # Utilidades y datos mock
    └── mockData.js
```

## Características Implementadas

### Autenticación
- Login con persistencia de sesión (localStorage)
- Rutas protegidas
- Logout con redirección

### Dashboard
- Layout responsive con sidebar y navbar
- Navegación entre módulos
- Diseño minimalista siguiendo guías MAC

### Módulos
- **Dashboard**: Vista principal con estadísticas
- **Usuarios**: Gestión de usuarios administradores
- **Géneros**: CRUD de géneros artísticos con características

## Guías de Diseño

El proyecto sigue las guías de diseño documentadas en `DESIGN_GUIDELINES.md`:

- Diseño minimalista (negro, blanco, grises)
- Responsive design obligatorio
- Tipografía ligera con tracking amplio
- Bordes rectos (sin border-radius)

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

## Credenciales de Prueba

- **Email**: admin@museo.com
- **Password**: admin123

## Rutas

- `/login` - Página de inicio de sesión
- `/` - Dashboard (home)
- `/usuarios` - Gestión de usuarios
- `/generos` - Gestión de géneros artísticos

## Próximos Módulos

Según `proyecto.md`, los siguientes módulos están pendientes:

1. Gestión de Artistas
2. Gestión de Obras
3. Gestión de Compradores
4. Facturación
5. Reportes/Consultas
6. Catálogo Público
7. Registro de Compradores
8. Proceso de Compra

## Notas

- Actualmente usa datos estáticos (mock data)
- La base de datos se integrará posteriormente
- Todos los módulos siguen el patrón responsive establecido
