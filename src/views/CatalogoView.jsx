import { useState, useEffect, useRef } from 'react';
import { Container, Typography, Box, Grid, Card, CardMedia, CardContent, Chip, TextField, MenuItem, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { catalogoService } from '../services';

const CatalogoView = () => {
  const navigate = useNavigate();
  const [obras, setObras] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [artistas, setArtistas] = useState([]);
  const [filtroGenero, setFiltroGenero] = useState('todos');
  const [filtroArtista, setFiltroArtista] = useState('todos');
  const [filtroEstatus, setFiltroEstatus] = useState('todos');
  const [filtroPrecio, setFiltroPrecio] = useState('todos');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const cargadoRef = useRef(false);

  useEffect(() => {
    if (cargadoRef.current) return;
    cargadoRef.current = true;

    const cargarDatos = async () => {
      try {
        setCargando(true);
        const [obrasData, generosData] = await Promise.all([
          catalogoService.obtenerObras(),
          catalogoService.obtenerGeneros(),
        ]);
        setObras(obrasData);
        setGeneros(generosData);
        
        // Extraer artistas únicos de las obras
        const artistasUnicos = obrasData
          .filter(obra => obra.artista)
          .reduce((acc, obra) => {
            if (!acc.find(a => a.artista_id === obra.artista.artista_id)) {
              acc.push(obra.artista);
            }
            return acc;
          }, []);
        setArtistas(artistasUnicos);
      } catch (err) {
        setError('Error al cargar las obras');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  const obrasFiltradas = obras.filter(obra => {
    const cumpleGenero = filtroGenero === 'todos' || obra.genero_id === parseInt(filtroGenero);
    const cumpleArtista = filtroArtista === 'todos' || obra.artista_id === parseInt(filtroArtista);
    const cumpleEstatus = filtroEstatus === 'todos' || obra.estatus?.toUpperCase() === filtroEstatus.toUpperCase();
    
    let cumplePrecio = true;
    if (filtroPrecio !== 'todos') {
      const precio = parseFloat(obra.precio_usd);
      switch(filtroPrecio) {
        case 'bajo': cumplePrecio = precio < 5000; break;
        case 'medio': cumplePrecio = precio >= 5000 && precio <= 15000; break;
        case 'alto': cumplePrecio = precio > 15000; break;
      }
    }
    
    return cumpleGenero && cumpleArtista && cumpleEstatus && cumplePrecio;
  });

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
          {generos.map(genero => (
            <MenuItem key={genero.genero_id} value={genero.genero_id}>{genero.nombre}</MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Artista"
          value={filtroArtista}
          onChange={(e) => setFiltroArtista(e.target.value)}
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
          {artistas.map(artista => (
            <MenuItem key={artista.artista_id} value={artista.artista_id}>{artista.nombre_completo}</MenuItem>
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
          <MenuItem value="DISPONIBLE">Disponibles</MenuItem>
          <MenuItem value="VENDIDA">Vendidas</MenuItem>
        </TextField>

        <TextField
          select
          label="Rango de Precio"
          value={filtroPrecio}
          onChange={(e) => setFiltroPrecio(e.target.value)}
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
          <MenuItem value="bajo">Menos de $5,000</MenuItem>
          <MenuItem value="medio">$5,000 - $15,000</MenuItem>
          <MenuItem value="alto">Más de $15,000</MenuItem>
        </TextField>
      </Box>

      {/* Grid de Obras */}
      {cargando ? (
        <Box className="flex justify-center py-16">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box className="text-center py-16">
          <Typography className="text-red-500 font-light tracking-wide">
            {error}
          </Typography>
        </Box>
      ) : (
      <Grid container spacing={4}>
        {obrasFiltradas.map(obra => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={obra.obra_id}>
            <Card 
              className="cursor-pointer transition-all hover:shadow-lg flex flex-col"
              onClick={() => navigate(`/museo-de-arte-contemporaneo/obra/${obra.obra_id}`)}
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
                image={obra.foto_url}
                alt={obra.nombre}
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
                  {obra.nombre}
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
                  {obra.artista?.nombre_completo}
                </Typography>

                <Typography 
                  variant="body2" 
                  className="text-gray-500 mb-3 font-light"
                  sx={{ 
                    fontSize: '0.7rem', 
                    letterSpacing: '0.05em',
                    minHeight: '1.2rem'
                  }}
                >
                  {obra.tipo || 'N/A'}
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
                      color: '#666',
                      height: '24px'
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
                  ${obra.precio_usd ? parseFloat(obra.precio_usd).toLocaleString() : '0'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      )}

      {!cargando && !error && obrasFiltradas.length === 0 && (
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
