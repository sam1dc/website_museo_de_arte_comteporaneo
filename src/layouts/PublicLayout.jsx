import { Outlet, Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Button, Container } from '@mui/material';

const PublicLayout = () => {
  const navigate = useNavigate();
  const comprador = JSON.parse(localStorage.getItem('compradorAuth') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('compradorAuth');
    navigate('/museo-de-arte-contemporaneo');
  };

  return (
    <Box className="min-h-screen bg-white">
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
                  Catálogo
                </Typography>
              </Link>

              {comprador ? (
                <>
                  <Link to="/museo-de-arte-contemporaneo/mis-compras" className="no-underline">
                    <Typography 
                      className="text-black text-sm tracking-wider hover:text-gray-600 transition-colors uppercase"
                      sx={{ letterSpacing: '0.1em', fontWeight: 300 }}
                    >
                      Mis Compras
                    </Typography>
                  </Link>
                  <Button
                    onClick={handleLogout}
                    sx={{
                      color: '#000',
                      fontSize: '0.875rem',
                      letterSpacing: '0.1em',
                      fontWeight: 300,
                      textTransform: 'uppercase',
                      '&:hover': { backgroundColor: 'transparent', color: '#666' }
                    }}
                  >
                    Salir
                  </Button>
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

      <Box component="main">
        <Outlet />
      </Box>
    </Box>
  );
};

export default PublicLayout;
