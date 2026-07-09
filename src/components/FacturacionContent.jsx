import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert, Chip, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button, Tabs, Tab, TextField } from '@mui/material';
import { Visibility as VisibilityIcon, Close as CloseIcon } from '@mui/icons-material';
import { facturasAdminService } from '../services';
import { useAuth } from '../hooks/useAuth';
import { PERMISOS } from '../utils/permissions';

const FacturacionContent = () => {
  const [facturas, setFacturas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [detalleOpen, setDetalleOpen] = useState(false);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [anioMes, setAnioMes] = useState('');
  const [facturasCassandra, setFacturasCassandra] = useState([]);
  const [cargandoCassandra, setCargandoCassandra] = useState(false);
  const [errorCassandra, setErrorCassandra] = useState(null);
  const cargadoRef = useRef(false);

  useEffect(() => {
    if (cargadoRef.current) return;
    cargadoRef.current = true;

    const cargarFacturas = async () => {
      try {
        setCargando(true);
        const facturasData = await facturasAdminService.obtenerTodos();
        setFacturas(facturasData);
      } catch (err) {
        setError('Error al cargar las facturas');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };

    cargarFacturas();
  }, []);

  const handleVerDetalle = (factura) => {
    setFacturaSeleccionada(factura);
    setDetalleOpen(true);
  };

  const handleCloseDetalle = () => {
    setDetalleOpen(false);
    setFacturaSeleccionada(null);
  };

  const handleConsultarCassandra = async () => {
    if (!anioMes) {
      setErrorCassandra('Por favor selecciona un año y mes.');
      return;
    }
    setCargandoCassandra(true);
    setErrorCassandra(null);
    try {
      const { reportesAdminService } = await import('../services');
      const response = await reportesAdminService.obtenerFacturacionMensual(anioMes);
      setFacturasCassandra(response || []);
    } catch (err) {
      console.error('Error al consultar facturación mensual:', err);
      setErrorCassandra('Error al cargar la facturación mensual desde Cassandra.');
      setFacturasCassandra([]);
    } finally {
      setCargandoCassandra(false);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {error && (
        <Alert severity="error" className="mb-6" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box className="mb-6">
        <Typography variant="h4" className="font-light tracking-wide mb-2">
          Facturación
        </Typography>
        <Typography variant="body2" className="text-gray-600">
          Listado de facturas emitidas
        </Typography>
      </Box>

      <Tabs 
        value={tabIndex} 
        onChange={(e, newIdx) => setTabIndex(newIdx)} 
        sx={{ 
          mb: 4, 
          '& .MuiTabs-indicator': { backgroundColor: '#000' },
          '& .MuiTab-root': { 
            color: '#666', 
            textTransform: 'uppercase', 
            letterSpacing: '0.1em', 
            fontSize: '0.8rem',
            '&.Mui-selected': { color: '#000', fontWeight: 500 }
          } 
        }}
      >
        <Tab label="Facturas Recientes (Core - Laravel)" />
        <Tab label="Consulta Gerencial Mensual (Cassandra)" />
      </Tabs>

      {tabIndex === 0 && (
        cargando ? (
          <Box className="flex justify-center py-16">
            <CircularProgress />
          </Box>
        ) : (
        <>
        {/* Vista Desktop */}
        <TableContainer component={Paper} className="hidden md:block" sx={{ boxShadow: 'none', border: '1px solid #e5e5e5', width: '100%' }}>
          <Table sx={{ width: '100%' }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#fafafa' }}>
                <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Código</TableCell>
                <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Obra</TableCell>
                <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Comprador</TableCell>
                <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Membresía</TableCell>
                <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Fecha Venta</TableCell>
                <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Precio Base</TableCell>
                <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>IVA</TableCell>
                <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Total</TableCell>
                <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Ganancia Museo</TableCell>
                <TableCell align="right" sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(facturas) && facturas.map((factura) => (
                <TableRow key={factura.factura_id} hover>
                  <TableCell>
                    <Typography className="font-medium">#{factura.codigo_factura}</Typography>
                  </TableCell>
                  <TableCell>{factura.obra?.nombre || 'N/A'}</TableCell>
                  <TableCell>
                    <Typography variant="body2">{factura.comprador?.nombre_completo || 'N/A'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={factura.comprador?.membresia || 'Inactiva'}
                      size="small"
                      sx={{ 
                        backgroundColor: factura.comprador?.membresia === 'Activa' ? '#e8f5e9' : '#f5f5f5',
                        color: factura.comprador?.membresia === 'Activa' ? '#2e7d32' : '#666',
                        borderRadius: 0,
                        fontSize: '0.7rem'
                      }}
                    />
                  </TableCell>
                  <TableCell>{new Date(factura.fecha_venta).toLocaleDateString()}</TableCell>
                  <TableCell>${parseFloat(factura.precio_base_usd).toFixed(2)}</TableCell>
                  <TableCell>
                    <Tooltip title={`Tasa: ${(parseFloat(factura.iva_tasa) * 100).toFixed(1)}%`}>
                      <span>${parseFloat(factura.iva_monto_usd).toFixed(2)}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Typography className="font-medium">${parseFloat(factura.total_usd).toFixed(2)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={`${(parseFloat(factura.museo_pct) * 100).toFixed(1)}% del total`}>
                      <span className="text-green-600 font-medium">${parseFloat(factura.museo_ganancia_usd).toFixed(2)}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleVerDetalle(factura)}>
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
  
        {/* Vista Mobile */}
        <Box className="block md:hidden space-y-4">
          {Array.isArray(facturas) && facturas.map((factura) => (
            <Paper key={factura.factura_id} className="p-4 border border-gray-200" sx={{ boxShadow: 'none' }}>
              <Box className="flex justify-between items-start mb-3">
                <Box>
                  <Typography className="font-medium text-lg">#{factura.codigo_factura}</Typography>
                  <Typography variant="body2" className="text-gray-600">{factura.obra?.nombre}</Typography>
                </Box>
                <IconButton size="small" onClick={() => handleVerDetalle(factura)}>
                  <VisibilityIcon fontSize="small" />
                </IconButton>
              </Box>
              <Box className="space-y-2">
                <Typography variant="body2" className="text-gray-600">
                  <span className="font-medium">Comprador:</span> {factura.comprador?.nombre_completo}
                </Typography>
                <Box className="flex gap-2">
                  <Chip 
                    label={factura.comprador?.membresia || 'Inactiva'}
                    size="small"
                    sx={{ 
                      backgroundColor: factura.comprador?.membresia === 'Activa' ? '#e8f5e9' : '#f5f5f5',
                      color: factura.comprador?.membresia === 'Activa' ? '#2e7d32' : '#666',
                      borderRadius: 0,
                      fontSize: '0.7rem'
                    }}
                  />
                </Box>
                <Typography variant="body2" className="text-gray-600">
                  <span className="font-medium">Fecha:</span> {new Date(factura.fecha_venta).toLocaleDateString()}
                </Typography>
                <Box className="border-t pt-2 mt-2">
                  <Typography variant="body2" className="text-gray-600">
                    <span className="font-medium">Precio Base:</span> ${parseFloat(factura.precio_base_usd).toFixed(2)}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    <span className="font-medium">IVA:</span> ${parseFloat(factura.iva_monto_usd).toFixed(2)}
                  </Typography>
                  <Typography variant="body2" className="font-medium">
                    <span>Total:</span> ${parseFloat(factura.total_usd).toFixed(2)}
                  </Typography>
                  <Typography variant="body2" className="text-green-600 font-medium">
                    <span>Ganancia Museo:</span> ${parseFloat(factura.museo_ganancia_usd).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
        </>
        )
      )}

      {tabIndex === 1 && (
        <Box className="space-y-6">
          <Paper sx={{ p: 4, border: '1px solid #e5e5e5', boxShadow: 'none', borderRadius: 0 }}>
            <Typography variant="h6" className="font-light mb-4 uppercase tracking-wider text-sm">
              Buscar Facturación por Periodo (Año-Mes)
            </Typography>
            <Box className="flex flex-col sm:flex-row gap-4 items-end">
              <TextField
                label="Año y Mes"
                type="month"
                value={anioMes}
                onChange={(e) => setAnioMes(e.target.value)}
                variant="standard"
                InputLabelProps={{ shrink: true }}
                sx={{ 
                  flex: 1,
                  '& .MuiInput-underline:before': { borderBottomColor: '#e5e5e5' },
                  '& .MuiInput-underline:hover:before': { borderBottomColor: '#000' },
                  '& .MuiInput-underline:after': { borderBottomColor: '#000' },
                  '& .MuiInputLabel-root': { color: '#666', fontSize: '0.875rem' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#000' }
                }}
              />
              <Button
                variant="contained"
                onClick={handleConsultarCassandra}
                disabled={cargandoCassandra}
                sx={{
                  backgroundColor: '#000',
                  color: '#fff',
                  borderRadius: 0,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: 300,
                  px: 4,
                  '&:hover': { backgroundColor: '#1a1a1a' }
                }}
              >
                {cargandoCassandra ? <CircularProgress size={20} color="inherit" /> : 'Consultar'}
              </Button>
            </Box>
          </Paper>

          {errorCassandra && (
            <Alert severity="error" onClose={() => setErrorCassandra(null)}>
              {errorCassandra}
            </Alert>
          )}

          {cargandoCassandra ? (
            <Box className="flex justify-center py-16">
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e5e5e5', borderRadius: 0 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#fafafa' }}>
                    <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>ID Factura</TableCell>
                    <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Cliente</TableCell>
                    <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Fecha de Emisión</TableCell>
                    <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Conceptos</TableCell>
                    <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Monto Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {facturasCassandra.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 6, color: '#666' }}>
                        No se encontraron registros de facturación para el periodo seleccionado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    facturasCassandra.map((factura) => (
                      <TableRow key={factura.factura_id} hover>
                        <TableCell className="font-medium">#{factura.factura_id}</TableCell>
                        <TableCell>{factura.cliente_nombre}</TableCell>
                        <TableCell>
                          {factura.fecha_emision 
                            ? new Date(factura.fecha_emision).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Box className="flex flex-wrap gap-1">
                            {Array.isArray(factura.detalles_conceptos) 
                              ? factura.detalles_conceptos.map((concepto, i) => (
                                  <Chip 
                                    key={i} 
                                    label={concepto} 
                                    size="small" 
                                    sx={{ borderRadius: 0, fontSize: '0.7rem', backgroundColor: '#f5f5f5' }}
                                  />
                                ))
                              : <Chip label={String(factura.detalles_conceptos)} size="small" sx={{ borderRadius: 0, fontSize: '0.7rem' }} />
                            }
                          </Box>
                        </TableCell>
                        <TableCell className="font-bold">
                          ${parseFloat(factura.monto_total || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}

      {/* Modal Detalle Factura */}
      <Dialog open={detalleOpen} onClose={handleCloseDetalle} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 0 } }}>
        <DialogTitle className="font-light tracking-wide flex justify-between items-center border-b">
          Detalle de Factura #{facturaSeleccionada?.codigo_factura}
          <IconButton onClick={handleCloseDetalle} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className="mt-4">
          {facturaSeleccionada && (
            <Box className="space-y-4">
              <Box>
                <Typography variant="caption" className="text-gray-600 uppercase tracking-wider text-xs">
                  Obra
                </Typography>
                <Typography variant="body1" className="mt-1 font-medium">
                  {facturaSeleccionada.obra?.nombre || 'N/A'}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="caption" className="text-gray-600 uppercase tracking-wider text-xs">
                  Comprador
                </Typography>
                <Typography variant="body1" className="mt-1">
                  {facturaSeleccionada.comprador?.nombre_completo || 'N/A'}
                </Typography>
                <Chip 
                  label={facturaSeleccionada.comprador?.membresia || 'Inactiva'}
                  size="small"
                  sx={{ 
                    backgroundColor: facturaSeleccionada.comprador?.membresia === 'Activa' ? '#e8f5e9' : '#f5f5f5',
                    color: facturaSeleccionada.comprador?.membresia === 'Activa' ? '#2e7d32' : '#666',
                    borderRadius: 0,
                    fontSize: '0.7rem',
                    mt: 1
                  }}
                />
              </Box>

              <Box>
                <Typography variant="caption" className="text-gray-600 uppercase tracking-wider text-xs">
                  Fecha de Venta
                </Typography>
                <Typography variant="body1" className="mt-1">
                  {new Date(facturaSeleccionada.fecha_venta).toLocaleDateString('es-ES', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Typography>
              </Box>

              <Box className="border-t pt-4">
                <Box className="flex justify-between mb-2">
                  <Typography variant="body2" className="text-gray-600">Precio Base:</Typography>
                  <Typography variant="body2" className="font-medium">${parseFloat(facturaSeleccionada.precio_base_usd).toFixed(2)}</Typography>
                </Box>
                <Box className="flex justify-between mb-2">
                  <Typography variant="body2" className="text-gray-600">
                    IVA ({(parseFloat(facturaSeleccionada.iva_tasa) * 100).toFixed(1)}%):
                  </Typography>
                  <Typography variant="body2" className="font-medium">${parseFloat(facturaSeleccionada.iva_monto_usd).toFixed(2)}</Typography>
                </Box>
                <Box className="flex justify-between mb-3 pt-2 border-t">
                  <Typography variant="body1" className="font-medium">Total:</Typography>
                  <Typography variant="body1" className="font-bold">${parseFloat(facturaSeleccionada.total_usd).toFixed(2)}</Typography>
                </Box>
                <Box className="flex justify-between bg-green-50 p-2">
                  <Typography variant="body2" className="text-green-700">
                    Ganancia Museo ({(parseFloat(facturaSeleccionada.museo_pct) * 100).toFixed(1)}%):
                  </Typography>
                  <Typography variant="body2" className="font-bold text-green-700">
                    ${parseFloat(facturaSeleccionada.museo_ganancia_usd).toFixed(2)}
                  </Typography>
                </Box>
              </Box>

              {facturaSeleccionada.pago_referencia && (
                <Box>
                  <Typography variant="caption" className="text-gray-600 uppercase tracking-wider text-xs">
                    Referencia de Pago
                  </Typography>
                  <Typography variant="body1" className="mt-1">
                    {facturaSeleccionada.pago_referencia}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions className="p-4 border-t">
          <Button onClick={handleCloseDetalle} sx={{ color: '#666', borderRadius: 0 }}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FacturacionContent;
