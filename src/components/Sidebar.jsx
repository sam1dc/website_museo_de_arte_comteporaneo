import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Dashboard as DashboardIcon, Person as PersonIcon, Category as CategoryIcon, Palette as PaletteIcon, Image as ImageIcon, ShoppingCart as ShoppingCartIcon, Receipt as ReceiptIcon, Assessment as AssessmentIcon, RequestQuote as RequestQuoteIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ mobileOpen, onMobileClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
    { id: 'usuarios', label: 'Usuarios', icon: <PersonIcon />, path: '/admin/usuarios' },
    { id: 'generos', label: 'Géneros', icon: <CategoryIcon />, path: '/admin/generos' },
    { id: 'artistas', label: 'Artistas', icon: <PaletteIcon />, path: '/admin/artistas' },
    { id: 'obras', label: 'Obras', icon: <ImageIcon />, path: '/admin/obras' },
    { id: 'compradores', label: 'Compradores', icon: <ShoppingCartIcon />, path: '/admin/compradores' },
    { id: 'solicitudes', label: 'Solicitudes Compra', icon: <RequestQuoteIcon />, path: '/admin/solicitudes-compra' },
    { id: 'facturacion', label: 'Facturación', icon: <ReceiptIcon />, path: '/admin/facturacion' },
    { id: 'reportes', label: 'Reportes', icon: <AssessmentIcon />, path: '/admin/reportes' }
  ];

  const handleMenuClick = (path) => {
    navigate(path);
    onMobileClose();
  };

  const drawerContent = (
    <Box className="p-8">
      <Box className="text-2xl font-extralight tracking-widest mb-12">MAC</Box>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding className="mb-2">
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleMenuClick(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderLeft: '3px solid #fff'
                },
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.05)'
                },
                paddingLeft: '24px'
              }}
            >
              <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                sx={{ '& .MuiTypography-root': { fontSize: '0.875rem', letterSpacing: '0.05em' } }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
            backgroundColor: '#000',
            color: '#fff',
            borderRight: 'none'
          }
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: 280,
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
            backgroundColor: '#000',
            color: '#fff',
            borderRight: 'none'
          }
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
