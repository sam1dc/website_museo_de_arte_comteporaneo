import { useState, useEffect, useRef } from 'react';
import { Container, Typography, Box, Grid, Card, CardMedia, CardContent, Chip, TextField, MenuItem, CircularProgress, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { catalogoService, recomendacionService } from '../services';

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
  const [recomendaciones, setRecomendaciones] = useState([]);
  const carouselRef = useRef(null);
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

        // Cargar recomendaciones (Neo4j)
        try {
          const comprador = JSON.parse(localStorage.getItem('compradorAuth') || 'null');
          const compradorId = comprador?.data?.comprador_id || comprador?.comprador_id || 'anonimo';
          const recomRes = await recomendacionService.obtenerSugerencias(compradorId);
          if (recomRes && recomRes.obras_enriquecidas) {
            setRecomendaciones(recomRes.obras_enriquecidas.map(o => ({
              obra_id: o.id || o.obra_id,
              nombre: o.titulo || o.nombre,
              foto_url: o.foto_url,
              precio_usd: o.precio || o.precio_usd,
              artista: o.artista || { nombre_completo: 'Artista' },
              genero: o.genero || { nombre: 'Arte' },
              tipo: o.tipo || '',
              estatus: o.disponible ? 'DISPONIBLE' : 'VENDIDA'
            })));
          }
        } catch (recErr) {
          console.error('Recomendaciones no disponibles:', recErr);
        }
      } catch (err) {
        setError('Error al cargar las obras');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 320;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const obrasFiltradas = obras.filter(obra => {
    const cumpleGenero = filtroGenero === 'todos' || String(obra.genero_id) === String(filtroGenero);
    const cumpleArtista = filtroArtista === 'todos' || String(obra.artista_id) === String(filtroArtista);
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

      {/* Carrusel de Recomendaciones */}
      {recomendaciones.length > 0 && (
        <Box className="mb-16">
          <Box className="flex items-center justify-between mb-6">
            <Box>
              <Typography
                variant="h5"
                className="font-extralight tracking-widest text-black uppercase"
                sx={{ letterSpacing: '0.15em', fontSize: '1.1rem' }}
              >
                Recomendado para ti
              </Typography>
              <Box className="w-16 h-px bg-black mt-2" />
            </Box>
            <Box className="flex gap-2">
              <IconButton
                onClick={() => scrollCarousel('left')}
                sx={{
                  border: '1px solid #e5e5e5',
                  borderRadius: 0,
                  width: 36,
                  height: 36,
                  '&:hover': { borderColor: '#000', backgroundColor: '#000', color: '#fff' },
                  transition: 'all 0.3s ease',
                }}
              >
                <span style={{ fontSize: '14px' }}>&#8592;</span>
              </IconButton>
              <IconButton
                onClick={() => scrollCarousel('right')}
                sx={{
                  border: '1px solid #e5e5e5',
                  borderRadius: 0,
                  width: 36,
                  height: 36,
                  '&:hover': { borderColor: '#000', backgroundColor: '#000', color: '#fff' },
                  transition: 'all 0.3s ease',
                }}
              >
                <span style={{ fontSize: '14px' }}>&#8594;</span>
              </IconButton>
            </Box>
          </Box>

          <Box
            ref={carouselRef}
            sx={{
              display: 'flex',
              gap: '20px',
              overflowX: 'auto',
              scrollBehavior: 'smooth',
              pb: 2,
              '&::-webkit-scrollbar': { height: '4px' },
              '&::-webkit-scrollbar-thumb': { backgroundColor: '#ccc', borderRadius: '2px' },
              '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
            }}
          >
            {recomendaciones.map((obra, index) => (
              <Box
                key={obra.obra_id || index}
                onClick={() => navigate(`/museo-de-arte-contemporaneo/obra/${obra.obra_id}`)}
                sx={{
                  minWidth: '280px',
                  maxWidth: '280px',
                  cursor: 'pointer',
                  border: '1px solid #e5e5e5',
                  transition: 'all 0.4s ease',
                  backgroundColor: '#fff',
                  '&:hover': {
                    borderColor: '#000',
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                  },
                }}
              >
                <Box sx={{ height: '220px', overflow: 'hidden', backgroundColor: '#f5f5f5' }}>
                  <img
                    src={obra.foto_url}
                    alt={obra.nombre}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </Box>
                <Box sx={{ p: 2 }}>
                  <Typography
                    sx={{
                      fontSize: '0.75rem',
                      fontWeight: 300,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      mb: 0.5,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {obra.nombre}
                  </Typography>
                  <Typography
                    sx={{ fontSize: '0.7rem', color: '#888', fontWeight: 300, letterSpacing: '0.03em', mb: 1 }}
                  >
                    {obra.artista?.nombre_completo || obra.artista?.nombre || 'Artista'}
                  </Typography>
                  <Typography
                    sx={{ fontSize: '0.9rem', fontWeight: 300, letterSpacing: '0.05em' }}
                  >
                    ${obra.precio_usd ? parseFloat(obra.precio_usd).toLocaleString() : '0'}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

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
      <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {obrasFiltradas.map(obra => (
          <Box
            key={obra.obra_id}
            onClick={() => navigate(`/museo-de-arte-contemporaneo/obra/${obra.obra_id}`)}
            className="cursor-pointer transition-all hover:shadow-lg border border-gray-200 hover:border-black bg-white flex flex-col"
            sx={{ height: '550px' }}
          >
            <Box className="w-full overflow-hidden bg-gray-100" sx={{ height: '320px', flexShrink: 0 }}>
              <img
                src={obra.foto_url}
                alt={obra.nombre}
                className="w-full h-full"
                style={{ objectFit: 'cover', display: 'block' }}
              />
            </Box>
            <Box className="p-4 flex flex-col flex-grow">
              <Typography 
                className="font-light tracking-wide mb-2 uppercase line-clamp-2"
                sx={{ fontSize: '0.75rem', letterSpacing: '0.05em', minHeight: '2.5rem' }}
              >
                {obra.nombre}
              </Typography>
              
              <Typography 
                className="text-gray-600 font-light mb-2 truncate"
                sx={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}
              >
                {obra.artista?.nombre_completo}
              </Typography>

              <Typography 
                className="text-gray-500 font-light mb-3 capitalize truncate"
                sx={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}
              >
                {obra.tipo || 'N/A'}
              </Typography>

              <Box className="flex items-center justify-between mb-3 gap-2">
                <Box 
                  className="px-2 py-1 bg-gray-100 text-gray-600 truncate"
                  sx={{ fontSize: '0.75rem', letterSpacing: '0.05em', fontWeight: 300 }}
                >
                  {obra.genero?.nombre}
                </Box>
                <Box 
                  className="px-2 py-1 text-white whitespace-nowrap"
                  sx={{ 
                    fontSize: '0.75rem', 
                    letterSpacing: '0.05em', 
                    fontWeight: 300,
                    backgroundColor: obra.estatus === 'DISPONIBLE' ? '#000' : '#999'
                  }}
                >
                  {obra.estatus === 'DISPONIBLE' ? 'Disponible' : 'Vendida'}
                </Box>
              </Box>

              <Typography 
                className="font-light mt-auto"
                sx={{ fontSize: '1rem', letterSpacing: '0.05em' }}
              >
                ${obra.precio_usd ? parseFloat(obra.precio_usd).toLocaleString() : '0'}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
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
