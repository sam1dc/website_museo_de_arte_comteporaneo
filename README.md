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
│   ├── MainLayout.jsx      # Layout panel admin
│   └── PublicLayout.jsx    # Layout sitio público
├── routes/           # Configuración de rutas
│   ├── AppRoutes.jsx
│   └── ProtectedRoute.jsx
├── views/            # Vistas/páginas principales
│   ├── LoginView.jsx
│   ├── CatalogoView.jsx
│   ├── DetalleObraView.jsx
│   ├── ArtistaPerfilView.jsx
│   ├── CheckoutView.jsx
│   ├── ConfirmacionCompraView.jsx
│   ├── MisComprasView.jsx
│   └── ...
├── components/       # Componentes reutilizables
│   ├── Sidebar.jsx
│   ├── Navbar.jsx
│   ├── LoginForm.jsx
│   ├── RegistroForm.jsx
│   └── ...
├── hooks/            # Custom hooks
│   ├── useAuth.jsx
│   └── useForm.jsx
└── utils/            # Utilidades y datos mock
    └── mockData.js
```

## Características Implementadas

### Autenticación Unificada
- Login/Registro en una sola vista con toggle
- Detección automática de tipo de usuario (admin vs comprador)
- Admin: `admin@museo.com` / Comprador: cualquier otro email
- Persistencia de sesión (localStorage)
- Rutas protegidas
- Logout con redirección

### Panel Administrativo
- Layout responsive con sidebar y navbar
- Dashboard con estadísticas
- Módulos: Usuarios, Géneros, Artistas, Obras, Compradores, Facturación, Reportes
- Diseño minimalista siguiendo guías MAC

### Sitio Público (Completado)
- **Catálogo de Obras**: Grid con filtros por género y disponibilidad
- **Detalle de Obra**: Información completa, link a artista, botón de compra
- **Perfil de Artista**: Biografía, datos y obras del artista
- **Checkout**: Formulario de pago y dirección de envío
- **Confirmación**: Mensaje de compra exitosa con número de orden
- **Mis Compras**: Historial de compras del usuario

## Guías de Diseño

El proyecto sigue las guías de diseño minimalistas:

- Paleta: negro, blanco, grises
- Responsive design en todas las vistas
- Tipografía ligera con tracking amplio
- Bordes rectos (sin border-radius)
- Imágenes estandarizadas con altura fija

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

## Credenciales de Prueba

**Administrador:**
- Email: `admin@museo.com`
- Password: `admin123`

**Comprador:**
- Email: cualquier email válido
- Password: cualquier contraseña

## Rutas

### Autenticación
- `/login` - Login/Registro unificado

### Panel Administrativo
- `/` - Dashboard (protegido)
- `/usuarios` - Gestión de usuarios
- `/generos` - Gestión de géneros artísticos
- `/artistas` - Gestión de artistas
- `/obras` - Gestión de obras de arte
- `/compradores` - Gestión de compradores
- `/facturacion` - Generación de facturas
- `/reportes` - Reportes y consultas

### Sitio Público
- `/museo-de-arte-contemporaneo` - Catálogo de obras
- `/museo-de-arte-contemporaneo/obra/:id` - Detalle de obra
- `/museo-de-arte-contemporaneo/artista/:id` - Perfil de artista
- `/museo-de-arte-contemporaneo/checkout/:id` - Proceso de compra
- `/museo-de-arte-contemporaneo/confirmacion` - Confirmación de compra
- `/museo-de-arte-contemporaneo/mis-compras` - Historial de compras

## Datos Mock

El sistema incluye datos de prueba:
- 6 obras de arte con imágenes (Unsplash)
- 4 artistas con biografías completas
- 4 géneros artísticos
- Precios, técnicas, dimensiones y descripciones

## Estado del Proyecto

✅ **Panel Administrativo**: Estructura base completada
- Layout y navegación implementados
- Módulos con componentes base

✅ **Sitio Público**: 100% completado
- Catálogo completo con filtros
- Flujo de compra end-to-end
- Perfiles de artistas
- Historial de compras
- Diseño responsive y minimalista

## Próximos Pasos

1. Implementar CRUDs completos en panel administrativo
2. Integrar backend y base de datos
3. Sistema de pagos real
4. Gestión de imágenes (upload)
5. Sistema de notificaciones por email

## Notas

- Actualmente usa datos estáticos (mock data)
- Las compras se simulan sin backend
- Todas las imágenes son de Unsplash
- El diseño sigue un patrón minimalista consistente
