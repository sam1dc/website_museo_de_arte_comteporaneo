import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Grid, Button, Chip } from '@mui/material';
import { MOCK_OBRAS, MOCK_ARTISTAS, MOCK_GENEROS } from '../utils/mockData';

const DetalleObraView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const obra = MOCK_OBRAS.find(o => o.id === parseInt(id));
  const artista = obra ? MOCK_ARTISTAS.find(a => a.id === obra.artistaId) : null;
  const genero = obra ? MOCK_GENEROS.find(g => g.id === obra.generoId) : null;
  const comprador = JSON.parse(localStorage.getItem('compradorAuth') || 'null');

  if (!obra) {
    return (
      <Container maxWidth="xl" className="py-16">
        <Typography>Obra no encontrada</Typography>
      </Container>
    );
  }

  const handleComprar = () => {
    if (!comprador) {
      navigate('/login');
    } else {
      navigate(`/museo-de-arte-contemporaneo/checkout/${obra.id}`);
    }
  };

  return (
    <Container maxWidth="xl" className="py-16">
      <Button
        onClick={() => navigate('/museo-de-arte-contemporaneo')}
        sx={{
          color: '#666',
          fontSize: '0.75rem',
          letterSpacing: '0.1em',
          fontWeight: 300,
          textTransform: 'uppercase',
          mb: 4,
          '&:hover': { backgroundColor: 'transparent', color: '#000' }
        }}
      >
        ← Volver al catálogo
      </Button>

      <Grid container spacing={8}>
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={obra.imagen}
            alt={obra.titulo}
            sx={{
              width: '100%',
              aspectRatio: '3/4',
              objectFit: 'cover',
              border: '1px solid #e5e5e5'
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Box className="flex gap-2 mb-4">
            <Chip 
              label={genero?.nombre} 
              sx={{
                borderRadius: 0,
                fontSize: '0.7rem',
                letterSpacing: '0.05em',
                fontWeight: 300,
                backgroundColor: '#f5f5f5',
                color: '#666'
              }}
            />
            <Chip 
              label={obra.estatus === 'disponible' ? 'Disponible' : 'Vendida'} 
              sx={{
                borderRadius: 0,
                fontSize: '0.7rem',
                letterSpacing: '0.05em',
                fontWeight: 300,
                backgroundColor: obra.estatus === 'disponible' ? '#000' : '#999',
                color: '#fff'
              }}
            />
          </Box>

          <Typography 
            variant="h3" 
            className="font-extralight tracking-widest text-black mb-4 uppercase"
            sx={{ letterSpacing: '0.15em', fontSize: '2rem' }}
          >
            {obra.titulo}
          </Typography>

          <Box className="w-24 h-px bg-black mb-6" />

          <Box 
            className="mb-6 cursor-pointer"
            onClick={() => navigate(`/museo-de-arte-contemporaneo/artista/${artista.id}`)}
          >
            <Typography 
              className="text-gray-600 font-light mb-1 uppercase hover:text-black transition-colors"
              sx={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}
            >
              Artista
            </Typography>
            <Typography 
              className="font-light tracking-wide hover:underline"
              sx={{ fontSize: '1.1rem', letterSpacing: '0.05em' }}
            >
              {artista?.nombre}
            </Typography>
          </Box>

          <Box className="mb-6">
            <Typography 
              className="text-gray-600 font-light mb-2 uppercase"
              sx={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}
            >
              Descripción
            </Typography>
            <Typography 
              className="font-light text-gray-800 leading-relaxed"
              sx={{ fontSize: '0.95rem', letterSpacing: '0.02em' }}
            >
              {obra.descripcion}
            </Typography>
          </Box>

          <Box className="mb-6 grid grid-cols-2 gap-4">
            <Box>
              <Typography 
                className="text-gray-600 font-light mb-1 uppercase"
                sx={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}
              >
                Año
              </Typography>
              <Typography className="font-light">{obra.año}</Typography>
            </Box>
            <Box>
              <Typography 
                className="text-gray-600 font-light mb-1 uppercase"
                sx={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}
              >
                Técnica
              </Typography>
              <Typography className="font-light">{obra.tecnica}</Typography>
            </Box>
            <Box>
              <Typography 
                className="text-gray-600 font-light mb-1 uppercase"
                sx={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}
              >
                Dimensiones
              </Typography>
              <Typography className="font-light">{obra.dimensiones}</Typography>
            </Box>
          </Box>

          <Box className="mt-8 pt-8 border-t border-gray-200">
            <Typography 
              variant="h4" 
              className="font-light mb-6"
              sx={{ fontSize: '2rem', letterSpacing: '0.05em' }}
            >
              ${obra.precio.toLocaleString()}
            </Typography>

            {obra.estatus === 'disponible' ? (
              <Button
                onClick={handleComprar}
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: '#000',
                  color: '#fff',
                  padding: '16px',
                  fontSize: '0.875rem',
                  letterSpacing: '0.15em',
                  fontWeight: 300,
                  borderRadius: 0,
                  '&:hover': { backgroundColor: '#1a1a1a' },
                  textTransform: 'uppercase'
                }}
              >
                Comprar Obra
              </Button>
            ) : (
              <Button
                disabled
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: '#e5e5e5',
                  color: '#999',
                  padding: '16px',
                  fontSize: '0.875rem',
                  letterSpacing: '0.15em',
                  fontWeight: 300,
                  borderRadius: 0,
                  textTransform: 'uppercase',
                  '&:hover': { backgroundColor: '#e5e5e5' }
                }}
              >
                Obra Vendida
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DetalleObraView;
