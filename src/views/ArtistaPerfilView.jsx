import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Grid, Card, CardMedia, CardContent, Chip, Button } from '@mui/material';
import { MOCK_ARTISTAS, MOCK_OBRAS, MOCK_GENEROS } from '../utils/mockData';

const ArtistaPerfilView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const artista = MOCK_ARTISTAS.find(a => a.id === parseInt(id));
  const obrasArtista = MOCK_OBRAS.filter(o => o.artistaId === parseInt(id));
  
  if (!artista) {
    return (
      <Container maxWidth="xl" className="py-16">
        <Typography>Artista no encontrado</Typography>
      </Container>
    );
  }

  const generosArtista = artista.generos.map(gId => 
    MOCK_GENEROS.find(g => g.id === gId)
  ).filter(Boolean);

  return (
    <Container maxWidth="xl" className="py-16">
      <Button
        onClick={() => navigate(-1)}
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
        ← Volver
      </Button>

      <Box className="mb-12">
        <Typography 
          variant="h3" 
          className="font-extralight tracking-widest text-black mb-4 uppercase"
          sx={{ letterSpacing: '0.2em' }}
        >
          {artista.nombre}
        </Typography>
        <Box className="w-24 h-px bg-black mb-6" />
        
        <Box className="flex gap-2 mb-6">
          {generosArtista.map(genero => (
            <Chip 
              key={genero.id}
              label={genero.nombre} 
              sx={{
                borderRadius: 0,
                fontSize: '0.7rem',
                letterSpacing: '0.05em',
                fontWeight: 300,
                backgroundColor: '#f5f5f5',
                color: '#666'
              }}
            />
          ))}
        </Box>

        <Grid container spacing={4} className="mb-8">
          <Grid item xs={12} md={8}>
            <Typography 
              className="font-light text-gray-800 leading-relaxed mb-6"
              sx={{ fontSize: '1rem', letterSpacing: '0.02em' }}
            >
              {artista.biografia}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box className="bg-gray-50 p-6">
              <Box className="mb-4">
                <Typography 
                  className="text-gray-600 font-light mb-1 uppercase"
                  sx={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}
                >
                  País
                </Typography>
                <Typography className="font-light">{artista.pais}</Typography>
              </Box>
              <Box>
                <Typography 
                  className="text-gray-600 font-light mb-1 uppercase"
                  sx={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}
                >
                  Nacimiento
                </Typography>
                <Typography className="font-light">
                  {new Date(artista.fechaNacimiento).getFullYear()}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box className="mb-8">
        <Typography 
          variant="h5" 
          className="font-light tracking-widest text-black mb-6 uppercase"
          sx={{ letterSpacing: '0.15em' }}
        >
          Obras
        </Typography>
        <Box className="w-16 h-px bg-black mb-8" />
      </Box>

      <Grid container spacing={4}>
        {obrasArtista.map(obra => {
          const genero = MOCK_GENEROS.find(g => g.id === obra.generoId);
          
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={obra.id}>
              <Card 
                className="cursor-pointer transition-all hover:shadow-lg"
                onClick={() => navigate(`/museo-de-arte-contemporaneo/obra/${obra.id}`)}
                sx={{ 
                  borderRadius: 0,
                  boxShadow: 'none',
                  border: '1px solid #e5e5e5',
                  '&:hover': { borderColor: '#000' }
                }}
              >
                <CardMedia
                  component="img"
                  height="300"
                  image={obra.imagen}
                  alt={obra.titulo}
                  sx={{ aspectRatio: '3/4', objectFit: 'cover' }}
                />
                <CardContent className="p-6">
                  <Typography 
                    variant="h6" 
                    className="font-light tracking-wide mb-2 uppercase"
                    sx={{ fontSize: '0.875rem', letterSpacing: '0.1em' }}
                  >
                    {obra.titulo}
                  </Typography>

                  <Box className="flex items-center justify-between mb-3">
                    <Chip 
                      label={genero?.nombre} 
                      size="small"
                      sx={{
                        borderRadius: 0,
                        fontSize: '0.65rem',
                        letterSpacing: '0.05em',
                        fontWeight: 300,
                        backgroundColor: '#f5f5f5',
                        color: '#666'
                      }}
                    />
                    <Chip 
                      label={obra.estatus === 'disponible' ? 'Disponible' : 'Vendida'} 
                      size="small"
                      sx={{
                        borderRadius: 0,
                        fontSize: '0.65rem',
                        letterSpacing: '0.05em',
                        fontWeight: 300,
                        backgroundColor: obra.estatus === 'disponible' ? '#000' : '#999',
                        color: '#fff'
                      }}
                    />
                  </Box>

                  <Typography 
                    variant="h6" 
                    className="font-light"
                    sx={{ fontSize: '1rem', letterSpacing: '0.05em' }}
                  >
                    ${obra.precio.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {obrasArtista.length === 0 && (
        <Box className="text-center py-16">
          <Typography className="text-gray-500 font-light tracking-wide">
            No hay obras disponibles de este artista
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default ArtistaPerfilView;
