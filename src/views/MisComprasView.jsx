import { Container, Typography, Box, Paper, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MisComprasView = () => {
  const navigate = useNavigate();
  const comprador = JSON.parse(localStorage.getItem('compradorAuth') || 'null');

  if (!comprador) {
    navigate('/login');
    return null;
  }

  // Simulación de compras - en producción vendría de la BD
  const compras = [
    {
      id: 1,
      numeroOrden: 'MAC-12345678',
      fecha: '2024-02-15',
      obra: 'Sinfonía en Rojo',
      artista: 'Ana Martínez',
      total: 17400,
      estatus: 'Entregado'
    }
  ];

  return (
    <Container maxWidth="xl" className="py-16">
      <Box className="mb-12">
        <Typography 
          variant="h3" 
          className="font-extralight tracking-widest text-black mb-4 uppercase"
          sx={{ letterSpacing: '0.2em' }}
        >
          Mis Compras
        </Typography>
        <Box className="w-24 h-px bg-black mb-8" />
        <Typography className="text-gray-600 font-light tracking-wide">
          Historial de tus adquisiciones
        </Typography>
      </Box>

      {compras.length === 0 ? (
        <Box className="text-center py-16">
          <Typography className="text-gray-500 font-light tracking-wide mb-6">
            Aún no has realizado ninguna compra
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {compras.map(compra => (
            <Grid item xs={12} key={compra.id}>
              <Paper 
                elevation={0}
                sx={{ 
                  border: '1px solid #e5e5e5',
                  borderRadius: 0,
                  p: 4,
                  '&:hover': { borderColor: '#000' },
                  transition: 'border-color 0.3s'
                }}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={3}>
                    <Typography 
                      className="text-gray-600 font-light mb-1 uppercase"
                      sx={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}
                    >
                      Orden
                    </Typography>
                    <Typography 
                      className="font-light tracking-wider"
                      sx={{ fontSize: '0.9rem', letterSpacing: '0.05em' }}
                    >
                      {compra.numeroOrden}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <Typography 
                      className="text-gray-600 font-light mb-1 uppercase"
                      sx={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}
                    >
                      Fecha
                    </Typography>
                    <Typography className="font-light">
                      {new Date(compra.fecha).toLocaleDateString('es-ES')}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <Typography 
                      className="text-gray-600 font-light mb-1 uppercase"
                      sx={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}
                    >
                      Obra
                    </Typography>
                    <Typography className="font-light">
                      {compra.obra}
                    </Typography>
                    <Typography 
                      className="text-gray-600 font-light"
                      sx={{ fontSize: '0.75rem' }}
                    >
                      {compra.artista}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <Typography 
                      className="text-gray-600 font-light mb-1 uppercase"
                      sx={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}
                    >
                      Total
                    </Typography>
                    <Typography className="font-light" sx={{ fontSize: '1.1rem' }}>
                      ${compra.total.toLocaleString()}
                    </Typography>
                    <Typography 
                      className="text-green-700 font-light mt-1"
                      sx={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}
                    >
                      {compra.estatus}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MisComprasView;
