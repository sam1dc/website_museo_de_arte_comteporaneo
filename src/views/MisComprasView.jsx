import { Container, Typography, Box } from '@mui/material';

const MisComprasView = () => {
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
        <Box className="w-24 h-px bg-black" />
      </Box>

      <Typography className="text-gray-600 font-light">
        Historial de compras en construcción...
      </Typography>
    </Container>
  );
};

export default MisComprasView;
