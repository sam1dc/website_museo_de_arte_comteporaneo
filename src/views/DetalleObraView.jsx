import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Grid, Button, Chip, CircularProgress } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import { catalogoService, artistaService } from '../services';

const DetalleObraView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [obra, setObra] = useState(null);
  const [artista, setArtista] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const cargadoRef = useRef(false);
  const comprador = JSON.parse(localStorage.getItem('compradorAuth') || 'null');

  useEffect(() => {
    if (cargadoRef.current) return;
    cargadoRef.current = true;

    const cargarDatos = async () => {
      try {
        setCargando(true);
        const obraData = await catalogoService.obtenerObraDetalle(id);
        console.log('Obra data:', obraData);
        setObra(obraData);
        
        // El artista ya viene en la obra
        if (obraData.artista) {
          setArtista(obraData.artista);
        }
      } catch (err) {
        setError('Obra no encontrada');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [id]);

  const handleComprar = () => {
    if (!comprador) {
      navigate('/login');
    } else {
      navigate(`/museo-de-arte-contemporaneo/checkout/${obra.obra_id}`);
    }
  };

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
          <Button onClick={() => navigate('/museo-de-arte-contemporaneo')}>
            Volver al catálogo
          </Button>
        </Box>
      ) : obra ? (
      <>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div>
          <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden border border-gray-200">
            <img
              src={obra.foto_url}
              alt={obra.nombre}
              className="w-full h-full object-contain bg-gray-50"
            />
          </div>
        </div>

        <div className="flex flex-col h-[400px] md:h-[500px] lg:h-[600px]">
          <Box className="flex gap-2 mb-4">
            <Chip 
              label={obra.genero?.nombre} 
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
              label={obra.estatus === 'DISPONIBLE' ? 'Disponible' : 'Vendida'} 
              sx={{
                borderRadius: 0,
                fontSize: '0.7rem',
                letterSpacing: '0.05em',
                fontWeight: 300,
                backgroundColor: obra.estatus === 'DISPONIBLE' ? '#000' : '#999',
                color: '#fff'
              }}
            />
          </Box>

          <Typography 
            variant="h3" 
            className="font-extralight tracking-widest text-black mb-4 uppercase"
            sx={{ letterSpacing: '0.15em', fontSize: '2rem' }}
          >
            {obra.nombre}
          </Typography>

          <Box className="w-24 h-px bg-black mb-6" />

          <Box 
            className="mb-6 cursor-pointer"
            onClick={() => navigate(`/museo-de-arte-contemporaneo/artista/${artista?.artista_id}`)}
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
              {artista?.nombre_completo}
            </Typography>
          </Box>

          {/* Área con scroll */}
          <div className="flex-1 overflow-y-auto pr-2 mb-6" style={{ scrollbarWidth: 'thin' }}>
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
                Fecha Creación
              </Typography>
              <Typography className="font-light">
                {obra.fecha_creacion ? obra.fecha_creacion.split('T')[0].split('-').reverse().join('/') : 'N/A'}
              </Typography>
            </Box>
            <Box>
              <Typography 
                className="text-gray-600 font-light mb-1 uppercase"
                sx={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}
              >
                Género
              </Typography>
              <Typography className="font-light">{obra.genero?.nombre || 'N/A'}</Typography>
            </Box>
            <Box>
              <Typography 
                className="text-gray-600 font-light mb-1 uppercase"
                sx={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}
              >
                Tipo
              </Typography>
              <Typography className="font-light capitalize">{obra.tipo || 'N/A'}</Typography>
            </Box>
          </Box>

          {/* Detalles técnicos según tipo de obra */}
          {obra.tipo === 'pintura' && (obra.pintura?.tecnica || obra.pintura?.soporte || obra.pintura?.alto_cm || obra.pintura?.ancho_cm) ? (
            <Box className="mb-6 p-4 bg-gray-50 border border-gray-200">
              <Typography 
                className="text-gray-600 font-light mb-3 uppercase"
                sx={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}
              >
                Detalles Técnicos - Pintura
              </Typography>
              <Box className="grid grid-cols-2 gap-3">
                {obra.pintura?.tecnica && (
                  <Box>
                    <Typography className="text-gray-500 text-xs uppercase mb-1">Técnica</Typography>
                    <Typography className="font-light">{obra.pintura.tecnica}</Typography>
                  </Box>
                )}
                {obra.pintura?.soporte && (
                  <Box>
                    <Typography className="text-gray-500 text-xs uppercase mb-1">Soporte</Typography>
                    <Typography className="font-light">{obra.pintura.soporte}</Typography>
                  </Box>
                )}
                {obra.pintura?.alto_cm && (
                  <Box>
                    <Typography className="text-gray-500 text-xs uppercase mb-1">Alto</Typography>
                    <Typography className="font-light">{obra.pintura.alto_cm} cm</Typography>
                  </Box>
                )}
                {obra.pintura?.ancho_cm && (
                  <Box>
                    <Typography className="text-gray-500 text-xs uppercase mb-1">Ancho</Typography>
                    <Typography className="font-light">{obra.pintura.ancho_cm} cm</Typography>
                  </Box>
                )}
              </Box>
            </Box>
          ) : null}

          {obra.tipo === 'escultura' && (obra.escultura?.material || obra.escultura?.tecnica || obra.escultura?.alto_cm || obra.escultura?.ancho_cm || obra.escultura?.profundidad_cm || obra.escultura?.peso_kg) ? (
            <Box className="mb-6 p-4 bg-gray-50 border border-gray-200">
              <Typography 
                className="text-gray-600 font-light mb-3 uppercase"
                sx={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}
              >
                Detalles Técnicos - Escultura
              </Typography>
              <Box className="grid grid-cols-2 gap-3">
                {obra.escultura?.material && (
                  <Box>
                    <Typography className="text-gray-500 text-xs uppercase mb-1">Material</Typography>
                    <Typography className="font-light">{obra.escultura.material}</Typography>
                  </Box>
                )}
                {obra.escultura?.tecnica && (
                  <Box>
                    <Typography className="text-gray-500 text-xs uppercase mb-1">Técnica</Typography>
                    <Typography className="font-light">{obra.escultura.tecnica}</Typography>
                  </Box>
                )}
                {obra.escultura?.alto_cm && (
                  <Box>
                    <Typography className="text-gray-500 text-xs uppercase mb-1">Alto</Typography>
                    <Typography className="font-light">{obra.escultura.alto_cm} cm</Typography>
                  </Box>
                )}
                {obra.escultura?.ancho_cm && (
                  <Box>
                    <Typography className="text-gray-500 text-xs uppercase mb-1">Ancho</Typography>
                    <Typography className="font-light">{obra.escultura.ancho_cm} cm</Typography>
                  </Box>
                )}
                {obra.escultura?.profundidad_cm && (
                  <Box>
                    <Typography className="text-gray-500 text-xs uppercase mb-1">Profundidad</Typography>
                    <Typography className="font-light">{obra.escultura.profundidad_cm} cm</Typography>
                  </Box>
                )}
                {obra.escultura?.peso_kg && (
                  <Box>
                    <Typography className="text-gray-500 text-xs uppercase mb-1">Peso</Typography>
                    <Typography className="font-light">{obra.escultura.peso_kg} kg</Typography>
                  </Box>
                )}
              </Box>
            </Box>
          ) : null}

          {obra.tipo === 'fotografia' && (obra.fotografia?.tecnica || obra.fotografia?.soporte || obra.fotografia?.camara || obra.fotografia?.lente || obra.fotografia?.tipo_impresion || obra.fotografia?.alto_cm || obra.fotografia?.ancho_cm || obra.fotografia?.edicion || obra.fotografia?.numero) ? (
            <Box className="mb-6 p-4 bg-gray-50 border border-gray-200">
              <Typography 
                className="text-gray-600 font-light mb-3 uppercase"
                sx={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}
              >
                Detalles Técnicos - Fotografía
              </Typography>
              <Box className="grid grid-cols-2 gap-3">
                {obra.fotografia?.camara && (
                  <Box>
                    <Typography className="text-gray-500 text-xs uppercase mb-1">Cámara</Typography>
                    <Typography className="font-light">{obra.fotografia.camara}</Typography>
                  </Box>
                )}
                {obra.fotografia?.lente && (
                  <Box>
                    <Typography className="text-gray-500 text-xs uppercase mb-1">Lente</Typography>
                    <Typography className="font-light">{obra.fotografia.lente}</Typography>
                  </Box>
                )}
                {obra.fotografia?.tipo_impresion && (
                  <Box>
                    <Typography className="text-gray-500 text-xs uppercase mb-1">Tipo Impresión</Typography>
                    <Typography className="font-light">{obra.fotografia.tipo_impresion}</Typography>
                  </Box>
                )}
                {obra.fotografia?.tecnica && (
                  <Box>
                    <Typography className="text-gray-500 text-xs uppercase mb-1">Técnica</Typography>
                    <Typography className="font-light">{obra.fotografia.tecnica}</Typography>
                  </Box>
                )}
                {obra.fotografia?.soporte && (
                  <Box>
                    <Typography className="text-gray-500 text-xs uppercase mb-1">Soporte</Typography>
                    <Typography className="font-light">{obra.fotografia.soporte}</Typography>
                  </Box>
                )}
                {obra.fotografia?.alto_cm && (
                  <Box>
                    <Typography className="text-gray-500 text-xs uppercase mb-1">Alto</Typography>
                    <Typography className="font-light">{obra.fotografia.alto_cm} cm</Typography>
                  </Box>
                )}
                {obra.fotografia?.ancho_cm && (
                  <Box>
                    <Typography className="text-gray-500 text-xs uppercase mb-1">Ancho</Typography>
                    <Typography className="font-light">{obra.fotografia.ancho_cm} cm</Typography>
                  </Box>
                )}
                {obra.fotografia?.edicion && (
                  <Box>
                    <Typography className="text-gray-500 text-xs uppercase mb-1">Edición</Typography>
                    <Typography className="font-light">{obra.fotografia.edicion}</Typography>
                  </Box>
                )}
                {obra.fotografia?.numero && (
                  <Box>
                    <Typography className="text-gray-500 text-xs uppercase mb-1">Número</Typography>
                    <Typography className="font-light">{obra.fotografia.numero}</Typography>
                  </Box>
                )}
              </Box>
            </Box>
          ) : null}

          {obra.tipo === 'orfebreria' && (obra.orfebreria?.metal_principal || obra.orfebreria?.pureza || obra.orfebreria?.piedras || obra.orfebreria?.material || obra.orfebreria?.tecnica || obra.orfebreria?.peso_gramos || obra.orfebreria?.quilates) ? (
            <Box className="mb-6 p-4 bg-gray-50 border border-gray-200">
              <Typography 
                className="text-gray-600 font-light mb-3 uppercase"
                sx={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}
              >
                Detalles Técnicos - Orfebrería
              </Typography>
              <Box className="grid grid-cols-2 gap-3">
                {obra.orfebreria?.metal_principal && (
                  <Box>
                    <Typography className="text-gray-500 text-xs uppercase mb-1">Metal Principal</Typography>
                    <Typography className="font-light">{obra.orfebreria.metal_principal}</Typography>
                  </Box>
                )}
                {obra.orfebreria?.pureza && (
                  <Box>
                    <Typography className="text-gray-500 text-xs uppercase mb-1">Pureza</Typography>
                    <Typography className="font-light">{obra.orfebreria.pureza}</Typography>
                  </Box>
                )}
                {obra.orfebreria?.piedras && (
                  <Box>
                    <Typography className="text-gray-500 text-xs uppercase mb-1">Piedras</Typography>
                    <Typography className="font-light">{obra.orfebreria.piedras}</Typography>
                  </Box>
                )}
                {obra.orfebreria?.material && (
                  <Box>
                    <Typography className="text-gray-500 text-xs uppercase mb-1">Material</Typography>
                    <Typography className="font-light">{obra.orfebreria.material}</Typography>
                  </Box>
                )}
                {obra.orfebreria?.tecnica && (
                  <Box>
                    <Typography className="text-gray-500 text-xs uppercase mb-1">Técnica</Typography>
                    <Typography className="font-light">{obra.orfebreria.tecnica}</Typography>
                  </Box>
                )}
                {obra.orfebreria?.peso_gramos && (
                  <Box>
                    <Typography className="text-gray-500 text-xs uppercase mb-1">Peso</Typography>
                    <Typography className="font-light">{obra.orfebreria.peso_gramos} g</Typography>
                  </Box>
                )}
                {obra.orfebreria?.quilates && (
                  <Box>
                    <Typography className="text-gray-500 text-xs uppercase mb-1">Quilates</Typography>
                    <Typography className="font-light">{obra.orfebreria.quilates}</Typography>
                  </Box>
                )}
              </Box>
            </Box>
          ) : null}

          {obra.tipo === 'ceramica' && (obra.ceramica?.tipo_pasta || obra.ceramica?.esmalte || obra.ceramica?.temperatura_coccion_c || obra.ceramica?.tecnica || obra.ceramica?.tipo_arcilla || obra.ceramica?.alto_cm || obra.ceramica?.diametro_cm || obra.ceramica?.esmaltado !== undefined) ? (
            <Box className="mb-6 p-4 bg-gray-50 border border-gray-200">
              <Typography 
                className="text-gray-600 font-light mb-3 uppercase"
                sx={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}
              >
                Detalles Técnicos - Cerámica
              </Typography>
              <Box className="grid grid-cols-2 gap-3">
                {obra.ceramica?.tipo_pasta && (
                  <Box>
                    <Typography className="text-gray-500 text-xs uppercase mb-1">Tipo Pasta</Typography>
                    <Typography className="font-light">{obra.ceramica.tipo_pasta}</Typography>
                  </Box>
                )}
                {obra.ceramica?.esmalte && (
                  <Box>
                    <Typography className="text-gray-500 text-xs uppercase mb-1">Esmalte</Typography>
                    <Typography className="font-light">{obra.ceramica.esmalte}</Typography>
                  </Box>
                )}
                {obra.ceramica?.temperatura_coccion_c && (
                  <Box>
                    <Typography className="text-gray-500 text-xs uppercase mb-1">Temperatura Cocción</Typography>
                    <Typography className="font-light">{obra.ceramica.temperatura_coccion_c} °C</Typography>
                  </Box>
                )}
                {obra.ceramica?.tecnica && (
                  <Box>
                    <Typography className="text-gray-500 text-xs uppercase mb-1">Técnica</Typography>
                    <Typography className="font-light">{obra.ceramica.tecnica}</Typography>
                  </Box>
                )}
                {obra.ceramica?.tipo_arcilla && (
                  <Box>
                    <Typography className="text-gray-500 text-xs uppercase mb-1">Tipo Arcilla</Typography>
                    <Typography className="font-light">{obra.ceramica.tipo_arcilla}</Typography>
                  </Box>
                )}
                {obra.ceramica?.alto_cm && (
                  <Box>
                    <Typography className="text-gray-500 text-xs uppercase mb-1">Alto</Typography>
                    <Typography className="font-light">{obra.ceramica.alto_cm} cm</Typography>
                  </Box>
                )}
                {obra.ceramica?.diametro_cm && (
                  <Box>
                    <Typography className="text-gray-500 text-xs uppercase mb-1">Diámetro</Typography>
                    <Typography className="font-light">{obra.ceramica.diametro_cm} cm</Typography>
                  </Box>
                )}
                {obra.ceramica?.esmaltado !== undefined && (
                  <Box>
                    <Typography className="text-gray-500 text-xs uppercase mb-1">Esmaltado</Typography>
                    <Typography className="font-light">{obra.ceramica.esmaltado ? 'Sí' : 'No'}</Typography>
                  </Box>
                )}
              </Box>
            </Box>
          ) : null}
          </div>
          {/* Fin área con scroll */}

          <Box className="pt-6 border-t border-gray-200">
            <Typography 
              variant="h4" 
              className="font-light mb-6"
              sx={{ fontSize: '2rem', letterSpacing: '0.05em' }}
            >
              ${obra.precio_usd ? parseFloat(obra.precio_usd).toLocaleString() : '0'}
            </Typography>

            {obra.estatus === 'DISPONIBLE' ? (
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
        </div>
      </div>
      </>
      ) : null}
    </Container>
  );
};

export default DetalleObraView;
