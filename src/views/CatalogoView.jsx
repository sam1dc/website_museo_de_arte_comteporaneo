import { useState } from 'react';
import { Container, Typography, Box, Grid, Card, CardMedia, CardContent, Chip, TextField, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { MOCK_OBRAS, MOCK_ARTISTAS, MOCK_GENEROS } from '../utils/mockData';

const CatalogoView = () => {
  const navigate = useNavigate();
  const [filtroGenero, setFiltroGenero] = useState('todos');
  const [filtroEstatus, setFiltroEstatus] = useState('todos');

  const obrasFiltradas = MOCK_OBRAS.filter(obra => {
    const cumpleGenero = filtroGenero === 'todos' || obra.generoId === parseInt(filtroGenero);
    const cumpleEstatus = filtroEstatus === 'todos' || obra.estatus === filtroEstatus;
    return cumpleGenero && cumpleEstatus;
  });

  const getArtista = (artistaId) => MOCK_ARTISTAS.find(a => a.id === artistaId);
  const getGenero = (generoId) => MOCK_GENEROS.find(g => g.id === generoId);

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
        <Box className="w-24 h-px bg-black mb-8" />
        <Typography className="text-gray-600 font-light tracking-wide">
          Explora nuestra colección de arte contemporáneo
        </Typography>
      </Box>

      {/* Filtros */}
      <Box className="mb-12 flex flex-col sm:flex-row gap-4">
        <TextField
          select
          label="Género"
          value={filtroGenero}
          onChange={(e) => setFiltroGenero(e.target.value)}
          variant="standard"
          className="w-full sm:w-48"
          sx={{
            '& .MuiInput-underline:before': { borderBottomColor: '#e5e5e5' },
            '& .MuiInput-underline:hover:before': { borderBottomColor: '#000' },
            '& .MuiInput-underline:after': { borderBottomColor: '#000' },
            '& .MuiInputLabel-root': { color: '#666', fontSize: '0.875rem', letterSpacing: '0.05em' },
            '& .MuiInputLabel-root.Mui-focused': { color: '#000' },
          }}
        >
          <MenuItem value="todos">Todos</MenuItem>
          {MOCK_GENEROS.map(genero => (
            <MenuItem key={genero.id} value={genero.id}>{genero.nombre}</MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Disponibilidad"
          value={filtroEstatus}
          onChange={(e) => setFiltroEstatus(e.target.value)}
          variant="standard"
          className="w-full sm:w-48"
          sx={{
            '& .MuiInput-underline:before': { borderBottomColor: '#e5e5e5' },
            '& .MuiInput-underline:hover:before': { borderBottomColor: '#000' },
            '& .MuiInput-underline:after': { borderBottomColor: '#000' },
            '& .MuiInputLabel-root': { color: '#666', fontSize: '0.875rem', letterSpacing: '0.05em' },
            '& .MuiInputLabel-root.Mui-focused': { color: '#000' },
          }}
        >
          <MenuItem value="todos">Todas</MenuItem>
          <MenuItem value="disponible">Disponibles</MenuItem>
          <MenuItem value="vendida">Vendidas</MenuItem>
        </TextField>
      </Box>

      {/* Grid de Obras */}
      <Grid container spacing={4}>
        {obrasFiltradas.map(obra => {
          const artista = getArtista(obra.artistaId);
          const genero = getGenero(obra.generoId);
          
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={obra.id}>
              <Card 
                className="cursor-pointer transition-all hover:shadow-lg flex flex-col"
                onClick={() => navigate(`/museo-de-arte-contemporaneo/obra/${obra.id}`)}
                sx={{ 
                  borderRadius: 0,
                  boxShadow: 'none',
                  border: '1px solid #e5e5e5',
                  '&:hover': { borderColor: '#000' },
                  height: '100%',
                  minHeight: '600px'
                }}
              >
                <CardMedia
                  component="img"
                  image={obra.imagen}
                  alt={obra.titulo}
                  sx={{ 
                    width: '100%',
                    minWidth: '100%',
                    height: '350px',
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                />
                <CardContent className="p-6 flex-grow flex flex-col">
                  <Typography 
                    variant="h6" 
                    className="font-light tracking-wide mb-2 uppercase"
                    sx={{ 
                      fontSize: '0.875rem', 
                      letterSpacing: '0.1em',
                      minHeight: '2.5rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {obra.titulo}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    className="text-gray-600 mb-3 font-light"
                    sx={{ 
                      fontSize: '0.75rem', 
                      letterSpacing: '0.05em',
                      minHeight: '1.5rem'
                    }}
                  >
                    {artista?.nombre}
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
                        color: '#666',
                        height: '24px'
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
                        color: '#fff',
                        height: '24px'
                      }}
                    />
                  </Box>

                  <Typography 
                    variant="h6" 
                    className="font-light mt-auto"
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

      {obrasFiltradas.length === 0 && (
        <Box className="text-center py-16">
          <Typography className="text-gray-500 font-light tracking-wide">
            No se encontraron obras con los filtros seleccionados
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default CatalogoView;
