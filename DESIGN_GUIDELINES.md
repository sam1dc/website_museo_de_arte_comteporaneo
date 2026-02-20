# Guías de Diseño - Museo de Arte Contemporáneo (MAC)

## Principios de Diseño

### Estética Minimalista
- Diseño limpio y elegante
- Paleta de colores: Negro (#000), Blanco (#fff), Grises
- Tipografía: Font-weight ligero (300-400), tracking amplio (letter-spacing)
- Bordes: Sin border-radius (bordes rectos)

### Responsive Design (OBLIGATORIO)

Todos los componentes deben ser completamente responsive siguiendo estos breakpoints:

#### Breakpoints de Tailwind/MUI
- `xs`: < 600px (móvil)
- `sm`: ≥ 600px (tablet pequeña)
- `md`: ≥ 900px (tablet/desktop)
- `lg`: ≥ 1200px (desktop grande)

#### Patrones Responsive Requeridos

**Padding/Spacing:**
```jsx
className="p-4 sm:p-6 md:p-8"        // Padding adaptativo
className="px-4"                      // Padding horizontal en móvil
className="gap-4 sm:gap-6 md:gap-8"  // Espaciado entre elementos
```

**Tipografía:**
```jsx
className="text-sm sm:text-base md:text-lg"  // Tamaño de texto
className="text-2xl sm:text-3xl md:text-4xl" // Títulos
```

**Layout:**
```jsx
// Sidebar/Drawer
sx={{ display: { xs: 'block', md: 'none' } }}  // Solo móvil
sx={{ display: { xs: 'none', md: 'block' } }}  // Solo desktop

// Ancho
sx={{ width: { xs: '100%', md: 'calc(100% - 280px)' } }}

// Grid/Flex
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
className="flex-col md:flex-row"
```

**Elementos Ocultos:**
```jsx
className="hidden sm:block"  // Ocultar en móvil
className="block md:hidden"  // Ocultar en desktop
```

### Componentes del Dashboard

#### Sidebar
- Ancho fijo: 280px
- Drawer temporal en móvil (< md)
- Drawer permanente en desktop (≥ md)
- Fondo negro con texto blanco
- Botón hamburguesa en navbar para móvil

#### Navbar
- AppBar con ancho adaptativo
- Botón menú hamburguesa visible solo en móvil
- Información de usuario puede ocultarse en móvil si es necesario
- Border bottom sutil (#e5e5e5)

#### Contenido Principal
- Padding responsive: `p-4 sm:p-6 md:p-8`
- Margin-top: 64px (altura del navbar)
- Margin-left adaptativo según sidebar

### Formularios

**Campos de Texto:**
- Variant: "standard" (línea inferior)
- fullWidth: true
- Colores: Gris claro (#e5e5e5) normal, Negro (#000) en focus

**Botones:**
- backgroundColor: '#000'
- borderRadius: 0 (bordes rectos)
- textTransform: 'uppercase'
- letterSpacing: '0.15em'
- fontWeight: 300

### Tarjetas y Contenedores

```jsx
className="bg-white border border-gray-100 p-4 sm:p-6"
```

### Tablas

- Responsive: scroll horizontal en móvil si es necesario
- Considerar vista de cards en móvil para tablas complejas

## Checklist para Nuevos Módulos

- [ ] Padding responsive (p-4 sm:p-6 md:p-8)
- [ ] Tipografía adaptativa
- [ ] Layout responsive (grid/flex)
- [ ] Elementos ocultos según breakpoint si es necesario
- [ ] Sidebar colapsable en móvil
- [ ] Tablas/listas adaptadas para móvil
- [ ] Formularios con fullWidth
- [ ] Márgenes y espaciado adaptativo
- [ ] Probar en móvil, tablet y desktop

## Notas Importantes

- NO incluir usuarios de prueba en producción
- Mantener código minimalista y limpio
- Priorizar accesibilidad
- Usar Material-UI con Tailwind CSS para estilos
