import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const ConfirmacionCompraView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { obra, total } = location.state || {};

  if (!obra) {
    navigate('/museo-de-arte-contemporaneo');
    return null;
  }

  const numeroOrden = `MAC-${Date.now().toString().slice(-8)}`;

  return (
    <Container maxWidth="md" className="py-16">
      <Paper 
        elevation={0}
        sx={{ 
          border: '1px solid #e5e5e5',
          borderRadius: 0,
          p: { xs: 4, sm: 8 },
          textAlign: 'center'
        }}
      >
        <CheckCircleOutlineIcon 
          sx={{ 
            fontSize: 80, 
            color: '#000',
            mb: 3
          }} 
        />

        <Typography 
          variant="h3" 
          className="font-extralight tracking-widest text-black mb-4 uppercase"
          sx={{ letterSpacing: '0.2em', fontSize: { xs: '1.5rem', sm: '2rem' } }}
        >
          Compra Exitosa
        </Typography>

        <Box className="w-24 h-px bg-black mb-8 mx-auto" />

        <Typography 
          className="text-gray-700 font-light mb-8 leading-relaxed"
          sx={{ fontSize: '1rem', letterSpacing: '0.02em' }}
        >
          Tu compra ha sido procesada exitosamente. Recibirás un correo de confirmación 
          con los detalles de tu pedido y la información de envío.
        </Typography>

        <Box className="bg-gray-50 p-6 mb-8 text-left">
          <Box className="mb-4">
            <Typography 
              className="text-gray-600 font-light mb-1 uppercase"
              sx={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}
            >
              Número de Orden
            </Typography>
            <Typography 
              className="font-light tracking-wider"
              sx={{ fontSize: '1.1rem', letterSpacing: '0.1em' }}
            >
              {numeroOrden}
            </Typography>
          </Box>

          <Box className="mb-4">
            <Typography 
              className="text-gray-600 font-light mb-1 uppercase"
              sx={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}
            >
              Obra Adquirida
            </Typography>
            <Typography className="font-light">
              {obra.titulo}
            </Typography>
          </Box>

          <Box>
            <Typography 
              className="text-gray-600 font-light mb-1 uppercase"
              sx={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}
            >
              Total Pagado
            </Typography>
            <Typography 
              className="font-light"
              sx={{ fontSize: '1.3rem' }}
            >
              ${total?.toLocaleString()}
            </Typography>
          </Box>
        </Box>

        <Box className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate('/museo-de-arte-contemporaneo/mis-compras')}
            variant="contained"
            sx={{
              backgroundColor: '#000',
              color: '#fff',
              padding: '12px 32px',
              fontSize: '0.875rem',
              letterSpacing: '0.15em',
              fontWeight: 300,
              borderRadius: 0,
              '&:hover': { backgroundColor: '#1a1a1a' },
              textTransform: 'uppercase'
            }}
          >
            Ver Mis Compras
          </Button>

          <Button
            onClick={() => navigate('/museo-de-arte-contemporaneo')}
            variant="outlined"
            sx={{
              borderColor: '#000',
              color: '#000',
              padding: '12px 32px',
              fontSize: '0.875rem',
              letterSpacing: '0.15em',
              fontWeight: 300,
              borderRadius: 0,
              '&:hover': { 
                borderColor: '#000',
                backgroundColor: 'rgba(0,0,0,0.05)' 
              },
              textTransform: 'uppercase'
            }}
          >
            Volver al Catálogo
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ConfirmacionCompraView;
