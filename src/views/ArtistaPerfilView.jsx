import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Grid, Card, CardMedia, CardContent, Chip, Button, CircularProgress } from '@mui/material';
import { Public, CalendarToday, Palette } from '@mui/icons-material';
import { useState, useEffect, useRef } from 'react';
import { artistaService } from '../services';

const ArtistaPerfilView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artista, setArtista] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const cargadoRef = useRef(false);

  useEffect(() => {
    if (cargadoRef.current) return;
    cargadoRef.current = true;

    const cargarDatos = async () => {
      try {
        setCargando(true);
        const artistaData = await artistaService.obtenerDetalle(id);
        setArtista(artistaData);
      } catch (err) {
        setError('Artista no encontrado');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [id]);

  return (
    <Container maxWidth="lg" className="py-8 md:py-16 px-4 md:px-6">
      {cargando ? (
        <Box className="flex justify-center py-16">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box className="text-center py-16">
          <Typography className="text-red-500 font-light tracking-wide mb-4">
            {error}
          </Typography>
          <Button onClick={() => navigate(-1)}>
            Volver
          </Button>
        </Box>
      ) : artista ? (
      <>
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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
          {artista.foto_url && (
            <div className="md:col-span-3">
              <Box className="w-full aspect-square overflow-hidden border border-gray-200">
                <img
                  src={artista.foto_url}
                  alt={artista.nombre_completo}
                  className="w-full h-full object-cover"
                />
              </Box>
            </div>
          )}
          <div className="md:col-span-9">
            <Typography 
              variant="h3" 
              className="font-extralight tracking-widest text-black uppercase mb-4"
              sx={{ letterSpacing: '0.2em', fontSize: { xs: '1.75rem', md: '2.5rem' } }}
            >
              {artista.nombre_completo}
            </Typography>
            
            <div className="flex gap-3 flex-wrap items-center">
              {artista.generos?.map(genero => (
                <Chip 
                  key={genero.genero_id}
                  icon={<Palette sx={{ fontSize: '0.9rem', color: '#666 !important' }} />}
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
              <div className="flex items-center gap-2 ml-2">
                <Public sx={{ fontSize: '1rem', color: '#666' }} />
                <Typography className="font-light text-gray-700" sx={{ fontSize: '0.9rem' }}>
                  {artista.nacionalidad}
                </Typography>
              </div>
              <div className="flex items-center gap-2">
                <CalendarToday sx={{ fontSize: '1rem', color: '#666' }} />
                <Typography className="font-light text-gray-700" sx={{ fontSize: '0.9rem' }}>
                  {artista.fecha_nacimiento ? artista.fecha_nacimiento.split('T')[0].split('-').reverse().join('/') : 'N/A'}
                </Typography>
              </div>
            </div>

          <div className='mt-1.5'>
              <Typography 
                className="text-gray-600 font-light uppercase"
                sx={{ fontSize: '0.75rem', letterSpacing: '0.1em', my: 2 }}
              >
                Biografía
              </Typography>
              <Typography 
                className="font-light text-gray-800 leading-relaxed"
                sx={{ fontSize: '1rem', letterSpacing: '0.02em' }}
              >
                {artista.biografia}
              </Typography>
          </div>
          </div>
        </div>


      </Box>

      <Box className="mb-10">
        <Typography 
          variant="h4" 
          className="font-light tracking-widest text-black mb-2 uppercase"
          sx={{ letterSpacing: '0.2em', fontSize: { xs: '1.5rem', md: '2rem' } }}
        >
          Obras
        </Typography>
        <Box className="w-20 h-0.5 bg-black mb-10" />
      </Box>

      <Grid container spacing={{ xs: 3, md: 4 }}>
        {artista.obras?.map(obra => (
          <Grid item xs={12} sm={6} md={4} key={obra.obra_id}>
            <Card 
              className="cursor-pointer transition-all hover:shadow-lg"
              onClick={() => navigate(`/museo-de-arte-contemporaneo/obra/${obra.obra_id}`)}
              sx={{ 
                borderRadius: 0,
                boxShadow: 'none',
                border: '1px solid #e5e5e5',
                '&:hover': { borderColor: '#000' }
              }}
            >
              <Box sx={{ height: 300, overflow: 'hidden' }}>
                <CardMedia
                  component="img"
                  image={obra.foto_url}
                  alt={obra.nombre}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
              <CardContent className="p-4 md:p-6">
                <Typography 
                  variant="h6" 
                  className="font-light tracking-wide mb-2 uppercase"
                  sx={{ fontSize: '0.875rem', letterSpacing: '0.1em' }}
                >
                  {obra.nombre}
                </Typography>

                <Box className="flex items-center justify-between mb-3">
                  <Chip 
                    label={obra.genero?.nombre} 
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
                    label={obra.estatus === 'DISPONIBLE' ? 'Disponible' : 'Vendida'} 
                    size="small"
                    sx={{
                      borderRadius: 0,
                      fontSize: '0.65rem',
                      letterSpacing: '0.05em',
                      fontWeight: 300,
                      backgroundColor: obra.estatus === 'DISPONIBLE' ? '#000' : '#999',
                      color: '#fff'
                    }}
                  />
                </Box>

                <Typography 
                  variant="h6" 
                  className="font-light"
                  sx={{ fontSize: '1rem', letterSpacing: '0.05em' }}
                >
                  ${obra.precio_usd ? parseFloat(obra.precio_usd).toLocaleString() : '0'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {!artista.obras || artista.obras.length === 0 && (
        <Box className="text-center py-16">
          <Typography className="text-gray-500 font-light tracking-wide">
            No hay obras disponibles de este artista
          </Typography>
        </Box>
      )}
      </>
      ) : null}
    </Container>
  );
};

export default ArtistaPerfilView;
