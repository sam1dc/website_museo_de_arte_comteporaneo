import { Container, Typography, Box, Paper, Grid, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { compraService, recomendacionService, catalogoService } from '../services';

const MisComprasView = () => {
  const navigate = useNavigate();
  const [compras, setCompras] = useState({ facturas: [], solicitudes: [] });
  const [obrasRecomendadas, setObrasRecomendadas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const cargadoRef = useRef(false);
  const comprador = JSON.parse(localStorage.getItem('compradorAuth') || 'null');

  useEffect(() => {
    if (!comprador) {
      navigate('/login');
      return;
    }

    if (cargadoRef.current) return;
    cargadoRef.current = true;

    const cargarDatos = async () => {
      try {
        setCargando(true);
        const compradorId = comprador.data?.comprador_id || comprador.comprador_id;
        
        // Cargar compras y recomendaciones en paralelo
        const [comprasData, recomendacionesRes] = await Promise.all([
          compraService.obtenerMisCompras(compradorId),
          recomendacionService.obtenerSugerencias(compradorId).catch(err => {
            console.error('Error al cargar recomendaciones:', err);
            return null;
          })
        ]);

        setCompras(comprasData);

        if (recomendacionesRes && recomendacionesRes.obras_enriquecidas) {
          // Utilizar directamente las obras enriquecidas devueltas por FastAPI/MongoDB/Neo4j
          const recomendadas = recomendacionesRes.obras_enriquecidas.map(o => ({
            obra_id: o.id,
            nombre: o.titulo || o.nombre,
            foto_url: o.foto_url,
            precio_usd: o.precio || o.precio_usd,
            artista: o.artista || { nombre_completo: 'Artista del Museo' },
            genero: o.genero || { nombre: 'Arte Contemporáneo' },
            tipo: o.tipo || (o.detalles_especificos?.tecnica || 'Obra de Arte'),
            estatus: o.disponible === true || o.disponible === 'true' ? 'DISPONIBLE' : 'VENDIDA'
          }));

          setObrasRecomendadas(recomendadas);
        }
      } catch (err) {
        setError('Error al cargar tus datos');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [comprador, navigate]);

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
        <Box className="w-24 h-px bg-black mb-8" />
        <Typography className="text-gray-600 font-light tracking-wide">
          Historial de tus adquisiciones
        </Typography>
      </Box>

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
        <Box className="space-y-8">
          {/* Facturas */}
          {compras.facturas && compras.facturas.length > 0 && (
            <Box>
              <Typography variant="h5" className="font-light tracking-wide mb-4">
                Compras Completadas
              </Typography>
              <Grid container spacing={4}>
                {compras.facturas.map((factura) => (
                  <Grid item xs={12} key={factura.factura_id}>
                    <Paper elevation={0} sx={{ border: '1px solid #e5e5e5', borderRadius: 0, p: 4 }}>
                      <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} sm={2}>
                          <Box component="img" src={factura.obra_foto_url} alt={factura.obra_nombre}
                            sx={{ width: '100%', height: '120px', objectFit: 'cover', border: '1px solid #e5e5e5' }} />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Typography className="text-gray-600 font-light mb-1 uppercase" sx={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}>
                            Factura
                          </Typography>
                          <Typography className="font-light">#{factura.codigo_factura}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Typography className="text-gray-600 font-light mb-1 uppercase" sx={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}>
                            Fecha
                          </Typography>
                          <Typography className="font-light">{new Date(factura.fecha_venta).toLocaleDateString('es-ES')}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography className="text-gray-600 font-light mb-1 uppercase" sx={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}>
                            Obra
                          </Typography>
                          <Typography className="font-light">{factura.obra_nombre}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography className="text-gray-600 font-light mb-1 uppercase" sx={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}>
                            Total
                          </Typography>
                          <Typography className="font-light" sx={{ fontSize: '1.1rem' }}>${parseFloat(factura.total_usd).toLocaleString()}</Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
          
          {/* Solicitudes */}
          {compras.solicitudes && compras.solicitudes.length > 0 && (
            <Box>
              <Typography variant="h5" className="font-light tracking-wide mb-4">
                Solicitudes en Curso
              </Typography>
              <Grid container spacing={4}>
                {compras.solicitudes.map((solicitud) => (
                  <Grid item xs={12} key={solicitud.solicitud_id}>
                    <Paper elevation={0} sx={{ border: '1px solid #e5e5e5', borderRadius: 0, p: 4, backgroundColor: '#fffbf0' }}>
                      <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} sm={2}>
                          <Box component="img" src={solicitud.obra_foto_url} alt={solicitud.obra_nombre}
                            sx={{ width: '100%', height: '120px', objectFit: 'cover', border: '1px solid #e5e5e5' }} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Typography className="text-gray-600 font-light mb-1 uppercase" sx={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}>
                            Obra
                          </Typography>
                          <Typography className="font-light">{solicitud.obra_nombre}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Typography className="text-gray-600 font-light mb-1 uppercase" sx={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}>
                            Solicitada
                          </Typography>
                          <Typography className="font-light">{new Date(solicitud.solicitada_en).toLocaleDateString('es-ES')}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Typography className="text-gray-600 font-light mb-1 uppercase" sx={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}>
                            Estado
                          </Typography>
                          <Typography className="text-orange-700 font-light" sx={{ fontSize: '0.9rem', letterSpacing: '0.05em' }}>
                            {solicitud.estatus}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {(!compras.facturas || compras.facturas.length === 0) && (!compras.solicitudes || compras.solicitudes.length === 0) && (
            <Box className="text-center py-16">
              <Typography className="text-gray-500 font-light tracking-wide mb-6">
                Aún no has realizado ninguna compra
              </Typography>
            </Box>
          )}

          {/* Recomendaciones (Neo4j) */}
          {obrasRecomendadas && obrasRecomendadas.length > 0 && (
            <Box sx={{ mt: 10, pt: 8, borderTop: '1px solid #e5e5e5' }}>
              <Typography 
                variant="h4" 
                className="font-extralight tracking-widest text-black mb-2 uppercase text-xl sm:text-2xl" 
                sx={{ letterSpacing: '0.15em' }}
              >
                Recomendado para ti
              </Typography>
              <Typography variant="body2" className="text-gray-600 font-light mb-8">
                Obras de arte seleccionadas en función de tus compras e intereses.
              </Typography>
              
              <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {obrasRecomendadas.map((obra) => (
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
                        {obra.tipo}
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
            </Box>
          )}
        </Box>
      )}
    </Container>
  );
};

export default MisComprasView;
