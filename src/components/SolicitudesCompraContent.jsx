import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert, Chip, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Receipt as ReceiptIcon } from '@mui/icons-material';
import { compraService } from '../services';

const SolicitudesCompraContent = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
  const [generando, setGenerando] = useState(false);
  const cargadoRef = useRef(false);

  useEffect(() => {
    if (cargadoRef.current) return;
    cargadoRef.current = true;
    cargarSolicitudes();
  }, []);

  const cargarSolicitudes = async () => {
    try {
      setCargando(true);
      const data = await compraService.obtenerSolicitudesPendientes();
      setSolicitudes(data);
    } catch (err) {
      setError('Error al cargar las solicitudes');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const getEstatusChip = (estatus) => {
    const configs = {
      'RESERVADA': { bg: '#fff3cd', color: '#856404', label: 'RESERVADA' },
      'COMPLETADA': { bg: '#d4edda', color: '#155724', label: 'COMPLETADA' },
      'CANCELADA': { bg: '#f8d7da', color: '#721c24', label: 'CANCELADA' },
    };
    
    const config = configs[estatus?.toUpperCase()] || { bg: '#e2e3e5', color: '#383d41', label: estatus };
    
    return (
      <Chip 
        label={config.label}
        size="small"
        sx={{ 
          backgroundColor: config.bg,
          color: config.color,
          borderRadius: 0,
          fontSize: '0.65rem',
          mt: 0.5
        }}
      />
    );
  };

  const handleGenerarFactura = (solicitud) => {
    setSolicitudSeleccionada(solicitud);
    setDialogOpen(true);
  };

  const handleConfirmarFactura = async () => {
    try {
      setGenerando(true);
      await compraService.generarFactura(solicitudSeleccionada);
      setDialogOpen(false);
      setSolicitudSeleccionada(null);
      cargarSolicitudes();
      alert('Factura generada exitosamente. La obra ahora está VENDIDA y la factura ha sido enviada al correo del comprador.');
    } catch (err) {
      setError(err.message || 'Error al generar la factura');
    } finally {
      setGenerando(false);
    }
  };

  const calcularIVA = (precioBase, comision) => {
    const subtotal = parseFloat(precioBase || 0) + parseFloat(comision || 0);
    return subtotal * 0.15; // IVA 15% según backend
  };

  const calcularTotal = (precioBase, comision) => {
    const subtotal = parseFloat(precioBase || 0) + parseFloat(comision || 0);
    const iva = subtotal * 0.15;
    return subtotal + iva;
  };

  const calcularComision = (obra) => {
    const precio = parseFloat(obra?.precio_usd || 0);
    const porcentaje = parseFloat(obra?.artista?.porcentaje_comision || 0.07);
    return precio * porcentaje;
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
          Solicitudes de Compra
        </Typography>
        <Typography variant="body2" className="text-gray-600">
          Obras reservadas pendientes de facturación
        </Typography>
      </Box>

      {cargando ? (
        <Box className="flex justify-center py-16">
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e5e5e5' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#fafafa' }}>
                <TableCell sx={{ fontWeight: 500 }}>Obra</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>Comprador</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>Fecha Solicitud</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>Precio Obra</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>Comisión</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>Total + IVA</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>Dirección Envío</TableCell>
                <TableCell align="right" sx={{ fontWeight: 500 }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {solicitudes.map((solicitud) => {
                const precioObra = parseFloat(solicitud.obra?.precio_usd || 0);
                const comision = calcularComision(solicitud.obra);
                const esReservada = solicitud.estatus?.toUpperCase() === 'RESERVADA';
                
                return (
                <TableRow key={solicitud.solicitud_id} hover>
                  <TableCell>
                    <Typography variant="body2" className="font-medium">
                      {solicitud.obra?.nombre}
                    </Typography>
                    {getEstatusChip(solicitud.estatus)}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{solicitud.comprador?.nombre_completo || `${solicitud.comprador?.nombres} ${solicitud.comprador?.apellidos}`}</Typography>
                    <Typography variant="caption" className="text-gray-500">
                      {solicitud.comprador?.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {new Date(solicitud.solicitada_en || solicitud.fecha_solicitud).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    ${precioObra.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    ${comision.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Typography className="font-medium">
                      ${calcularTotal(precioObra, comision).toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" className="text-gray-600">
                      {solicitud.comprador?.direccion || 'N/A'}, {solicitud.comprador?.ciudad || ''}, {solicitud.comprador?.pais || ''}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    {esReservada ? (
                      <Button
                        size="small"
                        startIcon={<ReceiptIcon />}
                        onClick={() => handleGenerarFactura({
                          ...solicitud,
                          precio_obra: precioObra,
                          comision_museo: comision
                        })}
                        sx={{
                          backgroundColor: '#000',
                          color: '#fff',
                          borderRadius: 0,
                          fontSize: '0.75rem',
                          '&:hover': { backgroundColor: '#333' }
                        }}
                      >
                        Generar Factura
                      </Button>
                    ) : (
                      <Typography variant="caption" className="text-gray-500">
                        {solicitud.estatus === 'COMPLETADA' ? 'Facturada' : 'No disponible'}
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              )})}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {!cargando && solicitudes.length === 0 && (
        <Box className="text-center py-16">
          <Typography className="text-gray-500">
            No hay solicitudes pendientes
          </Typography>
        </Box>
      )}

      {/* Dialog Confirmar Factura */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle className="font-light tracking-wide border-b">
          Generar Factura
        </DialogTitle>
        <DialogContent className="mt-4">
          {solicitudSeleccionada && (
            <Box className="space-y-4">
              <Alert severity="info">
                Se generará la factura y se enviará automáticamente por correo al comprador. La obra cambiará a estatus VENDIDA.
              </Alert>

              <Box>
                <Typography variant="caption" className="text-gray-600 uppercase">Obra</Typography>
                <Typography className="font-medium">{solicitudSeleccionada.obra?.nombre}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" className="text-gray-600 uppercase">Comprador</Typography>
                <Typography>{solicitudSeleccionada.comprador?.nombre_completo || `${solicitudSeleccionada.comprador?.nombres} ${solicitudSeleccionada.comprador?.apellidos}`}</Typography>
                <Typography variant="caption" className="text-gray-500">
                  {solicitudSeleccionada.comprador?.email}
                </Typography>
              </Box>

              <Box className="border-t pt-4">
                <Box className="flex justify-between mb-2">
                  <Typography variant="body2" className="text-gray-600">Precio Obra:</Typography>
                  <Typography variant="body2">${parseFloat(solicitudSeleccionada.precio_obra).toFixed(2)}</Typography>
                </Box>
                <Box className="flex justify-between mb-2">
                  <Typography variant="body2" className="text-gray-600">Comisión Museo:</Typography>
                  <Typography variant="body2">${parseFloat(solicitudSeleccionada.comision_museo).toFixed(2)}</Typography>
                </Box>
                <Box className="flex justify-between mb-2 pb-2 border-b">
                  <Typography variant="body2" className="text-gray-600">Subtotal:</Typography>
                  <Typography variant="body2">
                    ${(parseFloat(solicitudSeleccionada.precio_obra) + parseFloat(solicitudSeleccionada.comision_museo)).toFixed(2)}
                  </Typography>
                </Box>
                <Box className="flex justify-between mb-2">
                  <Typography variant="body2" className="text-gray-600">IVA (15%):</Typography>
                  <Typography variant="body2">
                    ${calcularIVA(solicitudSeleccionada.precio_obra, solicitudSeleccionada.comision_museo).toFixed(2)}
                  </Typography>
                </Box>
                <Box className="flex justify-between pt-2 border-t">
                  <Typography className="font-medium">Total:</Typography>
                  <Typography className="font-bold">
                    ${calcularTotal(solicitudSeleccionada.precio_obra, solicitudSeleccionada.comision_museo).toFixed(2)}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="caption" className="text-gray-600 uppercase">Dirección de Envío</Typography>
                <Typography variant="body2">
                  {solicitudSeleccionada.comprador?.direccion || 'N/A'}<br />
                  {solicitudSeleccionada.comprador?.ciudad || ''}, {solicitudSeleccionada.comprador?.codigo_postal || ''}<br />
                  {solicitudSeleccionada.comprador?.pais || ''}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions className="p-4 border-t">
          <Button onClick={() => setDialogOpen(false)} sx={{ borderRadius: 0 }}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmarFactura}
            disabled={generando}
            variant="contained"
            sx={{
              backgroundColor: '#000',
              color: '#fff',
              borderRadius: 0,
              '&:hover': { backgroundColor: '#333' }
            }}
          >
            {generando ? <CircularProgress size={20} /> : 'Confirmar y Enviar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SolicitudesCompraContent;
