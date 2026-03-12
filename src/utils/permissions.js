// Roles del sistema
export const ROLES = {
  ADMIN: 'admin',
  EMPLEADO: 'empleado',
  COMPRADOR: 'comprador'
};

// Permisos del sistema
export const PERMISOS = {
  VER_CATALOGO: 'ver_catalogo',
  VER_ARTISTAS: 'ver_artistas',
  CONSULTAR_VENTAS: 'consultar_ventas',
  CREAR_OBRAS: 'crear_obras',
  EDITAR_OBRAS: 'editar_obras',
  ELIMINAR_OBRAS: 'eliminar_obras',
  EMITIR_FACTURAS: 'emitir_facturas',
  GESTIONAR_COMPRADORES: 'gestionar_compradores',
  CREAR_ADMINS: 'crear_admins'
};

// Mapa de permisos por rol
export const PERMISOS_POR_ROL = {
  [ROLES.ADMIN]: [
    PERMISOS.VER_CATALOGO,
    PERMISOS.VER_ARTISTAS,
    PERMISOS.CONSULTAR_VENTAS,
    PERMISOS.CREAR_OBRAS,
    PERMISOS.EDITAR_OBRAS,
    PERMISOS.ELIMINAR_OBRAS,
    PERMISOS.EMITIR_FACTURAS,
    PERMISOS.GESTIONAR_COMPRADORES,
    PERMISOS.CREAR_ADMINS
  ],
  [ROLES.EMPLEADO]: [
    PERMISOS.VER_CATALOGO,
    PERMISOS.VER_ARTISTAS,
    PERMISOS.CONSULTAR_VENTAS,
    PERMISOS.CREAR_OBRAS,
    PERMISOS.EDITAR_OBRAS,
    PERMISOS.ELIMINAR_OBRAS,
    PERMISOS.EMITIR_FACTURAS,
    PERMISOS.GESTIONAR_COMPRADORES
  ],
  [ROLES.COMPRADOR]: []
};

// Función para verificar si un usuario tiene un permiso
export const tienePermiso = (user, permiso) => {
  if (!user || !user.tipo) return false;
  
  const rol = user.tipo;
  const permisos = PERMISOS_POR_ROL[rol] || [];
  
  return permisos.includes(permiso);
};

// Función para verificar si un usuario es admin
export const esAdmin = (user) => {
  return user?.tipo === ROLES.ADMIN || user?.tipo === ROLES.EMPLEADO;
};

// Función para verificar si un usuario es comprador
export const esComprador = (user) => {
  return user?.tipo === ROLES.COMPRADOR;
};
