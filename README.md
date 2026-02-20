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

### Panel Administrativo (Completados)
- **Dashboard**: Vista principal con estadísticas
- **Usuarios**: Gestión de usuarios administradores
- **Géneros**: CRUD de géneros artísticos con características
- **Artistas**: CRUD de artistas con biografía y géneros
- **Obras**: CRUD de obras con precio, estatus y características
- **Compradores**: Gestión de compradores con membresías
- **Facturación**: Generación de facturas con cálculo de IVA y ganancia
- **Reportes**: Consultas de obras vendidas, facturación y membresías

### Sitio Público (Pendientes)
- Catálogo de Obras
- Perfil de Artista
- Registro de Compradores
- Login de Compradores
- Proceso de Compra

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

### Panel Administrativo
- `/login` - Página de inicio de sesión
- `/` - Dashboard (home)
- `/usuarios` - Gestión de usuarios
- `/generos` - Gestión de géneros artísticos
- `/artistas` - Gestión de artistas
- `/obras` - Gestión de obras de arte
- `/compradores` - Gestión de compradores
- `/facturacion` - Generación de facturas
- `/reportes` - Reportes y consultas

## Próximos Módulos

Los siguientes módulos del sitio público están pendientes:

1. Catálogo Público de Obras
2. Perfil de Artista (vista pública)
3. Registro de Compradores
4. Login de Compradores
5. Proceso de Compra

## Estado del Proyecto

✅ **Panel Administrativo**: 100% completado
- Todos los módulos CRUD implementados
- Sistema de facturación con cálculos automáticos
- Reportes y consultas por período
- Diseño responsive en todos los módulos

⏳ **Sitio Público**: Pendiente
- Catálogo de obras para visitantes
- Sistema de registro y compra para clientes

## Notas

- Actualmente usa datos estáticos (mock data)
- La base de datos se integrará posteriormente
- Todos los módulos siguen el patrón responsive establecido
