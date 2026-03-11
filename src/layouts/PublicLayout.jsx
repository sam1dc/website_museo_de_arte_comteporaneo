import { Outlet, Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Button, Container, Menu, MenuItem } from '@mui/material';
import { ShoppingBag, Logout, KeyboardArrowDown } from '@mui/icons-material';
import { useState } from 'react';
import Footer from '../components/Footer';

const PublicLayout = () => {
  const navigate = useNavigate();
  const comprador = JSON.parse(localStorage.getItem('compradorAuth') || 'null');
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('compradorAuth');
    handleClose();
    navigate('/museo-de-arte-contemporaneo');
  };

  const handleMisCompras = () => {
    handleClose();
    navigate('/museo-de-arte-contemporaneo/mis-compras');
  };

  return (
    <Box className="min-h-screen bg-white flex flex-col">
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          backgroundColor: '#fff',
          borderBottom: '1px solid #e5e5e5'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar className="justify-between py-4">
            <Link to="/museo-de-arte-contemporaneo" className="no-underline">
              <Typography 
                variant="h5" 
                className="font-extralight tracking-widest text-black uppercase"
                sx={{ letterSpacing: '0.2em' }}
              >
                MAC
              </Typography>
            </Link>

            <Box className="flex items-center gap-6">
              <Link to="/museo-de-arte-contemporaneo" className="no-underline">
                <Typography 
                  className="text-black text-sm tracking-wider hover:text-gray-600 transition-colors uppercase"
                  sx={{ letterSpacing: '0.1em', fontWeight: 300 }}
                >
                  Inicio
                </Typography>
              </Link>
              <Link to="/museo-de-arte-contemporaneo/catalogo" className="no-underline">
                <Typography 
                  className="text-black text-sm tracking-wider hover:text-gray-600 transition-colors uppercase"
                  sx={{ letterSpacing: '0.1em', fontWeight: 300 }}
                >
                  Catálogo
                </Typography>
              </Link>

              {comprador ? (
                <>
                  <Button
                    onClick={handleClick}
                    endIcon={<KeyboardArrowDown />}
                    sx={{
                      color: '#000',
                      fontSize: '0.875rem',
                      letterSpacing: '0.05em',
                      fontWeight: 300,
                      textTransform: 'none',
                      '&:hover': { backgroundColor: 'transparent', color: '#666' }
                    }}
                  >
                    {comprador.data?.nombre_completo || comprador.data?.nombres || 'Usuario'}
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                      sx: {
                        borderRadius: 0,
                        border: '1px solid #e5e5e5',
                        mt: 1
                      }
                    }}
                  >
                    <MenuItem 
                      onClick={handleMisCompras}
                      sx={{
                        fontSize: '0.875rem',
                        letterSpacing: '0.05em',
                        fontWeight: 300,
                        py: 1.5,
                        px: 3,
                        gap: 1.5
                      }}
                    >
                      <ShoppingBag sx={{ fontSize: '1.1rem' }} />
                      Mis Compras
                    </MenuItem>
                    <MenuItem 
                      onClick={handleLogout}
                      sx={{
                        fontSize: '0.875rem',
                        letterSpacing: '0.05em',
                        fontWeight: 300,
                        py: 1.5,
                        px: 3,
                        gap: 1.5
                      }}
                    >
                      <Logout sx={{ fontSize: '1.1rem' }} />
                      Salir
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  onClick={() => navigate('/login')}
                  sx={{
                    color: '#000',
                    fontSize: '0.875rem',
                    letterSpacing: '0.1em',
                    fontWeight: 300,
                    textTransform: 'uppercase',
                    '&:hover': { backgroundColor: 'transparent', color: '#666' }
                  }}
                >
                  Acceder
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="main" className="flex-grow">
        <Outlet />
      </Box>

      <Footer />
    </Box>
  );
};

export default PublicLayout;
