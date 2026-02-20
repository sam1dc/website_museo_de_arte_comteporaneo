import { Container, Typography, Box } from '@mui/material';

const CatalogoView = () => {
  return (
    <Container maxWidth="xl" className="py-16">
      <Box className="mb-12">
        <Typography 
          variant="h3" 
          className="font-extralight tracking-widest text-black mb-4 uppercase"
          sx={{ letterSpacing: '0.2em' }}
        >
          Catálogo
        </Typography>
        <Box className="w-24 h-px bg-black" />
      </Box>

      <Typography className="text-gray-600 font-light">
        Catálogo de obras en construcción...
      </Typography>
    </Container>
  );
};

export default CatalogoView;
