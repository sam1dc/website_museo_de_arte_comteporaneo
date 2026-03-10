import { Container, Typography, Box, Paper, Grid, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { compraService } from '../services';

const MisComprasView = () => {
  const navigate = useNavigate();
  const [compras, setCompras] = useState({ facturas: [], solicitudes: [] });
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

    const cargarCompras = async () => {
      try {
        setCargando(true);
        const compradorId = comprador.data?.comprador_id || comprador.comprador_id;
        const comprasData = await compraService.obtenerMisCompras(compradorId);
        setCompras(comprasData);
      } catch (err) {
        setError('Error al cargar tus compras');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };

    cargarCompras();
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
      ) : (!compras.facturas || compras.facturas.length === 0) && (!compras.solicitudes || compras.solicitudes.length === 0) ? (
        <Box className="text-center py-16">
          <Typography className="text-gray-500 font-light tracking-wide mb-6">
            Aún no has realizado ninguna compra
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
        </Box>
      )}
    </Container>
  );
};

export default MisComprasView;
