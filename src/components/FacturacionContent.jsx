import { useState } from 'react';
import { Box, Typography, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, MenuItem, Divider } from '@mui/material';
import { Add as AddIcon, Visibility as VisibilityIcon, Receipt as ReceiptIcon } from '@mui/icons-material';

const FacturacionContent = () => {
  const [facturas, setFacturas] = useState([
    { 
      id: 1,
      codigo: 'FAC-2024-001',
      comprador: 'Juan Pérez',
      obra: 'Guernica',
      precioObra: 25000,
      iva: 3750,
      gananciaMuseo: 2500,
      porcentajeGanancia: 10,
      total: 28750,
      fecha: '2024-01-20'
    },
    { 
      id: 2,
      codigo: 'FAC-2024-002',
      comprador: 'María García',
      obra: 'Las Dos Fridas',
      precioObra: 18000,
      iva: 2700,
      gananciaMuseo: 900,
      porcentajeGanancia: 5,
      total: 20700,
      fecha: '2024-02-15'
    }
  ]);

  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [currentFactura, setCurrentFactura] = useState({
    codigo: '',
    comprador: '',
    obra: '',
    precioObra: 0,
    porcentajeGanancia: 5,
    fecha: new Date().toISOString().split('T')[0]
  });

  const calcularFactura = (precio, porcentaje) => {
    const iva = precio * 0.15; // 15% IVA
    const ganancia = precio * (porcentaje / 100);
    const total = precio + iva;
    return { iva, ganancia, total };
  };

  const handleOpen = (factura = null, view = false) => {
    if (factura) {
      setCurrentFactura(factura);
      setViewMode(true);
    } else {
      const nextCodigo = `FAC-${new Date().getFullYear()}-${String(facturas.length + 1).padStart(3, '0')}`;
      setCurrentFactura({
        codigo: nextCodigo,
        comprador: '',
        obra: '',
        precioObra: 0,
        porcentajeGanancia: 5,
        fecha: new Date().toISOString().split('T')[0]
      });
      setViewMode(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setViewMode(false);
  };

  const handleSave = () => {
    const { iva, ganancia, total } = calcularFactura(
      currentFactura.precioObra, 
      currentFactura.porcentajeGanancia
    );
    
    const nuevaFactura = {
      ...currentFactura,
      id: Date.now(),
      iva,
      gananciaMuseo: ganancia,
      total
    };
    
    setFacturas([...facturas, nuevaFactura]);
    handleClose();
  };

  const handleChange = (field, value) => {
    setCurrentFactura({ ...currentFactura, [field]: value });
  };

  const calculos = viewMode ? null : calcularFactura(
    currentFactura.precioObra || 0, 
    currentFactura.porcentajeGanancia || 5
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4" sx={{ width: '100%' }}>
        <Box>
          <Typography variant="h4" className="font-light tracking-wide mb-2">
            Facturación
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            Gestiona las facturas de ventas
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={{
            backgroundColor: '#000',
            color: '#fff',
            borderRadius: 0,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontWeight: 300,
            '&:hover': { backgroundColor: '#1a1a1a' }
          }}
        >
          Nueva Factura
        </Button>
      </Box>

      {/* Vista Desktop */}
      <TableContainer component={Paper} className="hidden md:block" sx={{ boxShadow: 'none', border: '1px solid #e5e5e5', width: '100%' }}>
        <Table sx={{ width: '100%' }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#fafafa' }}>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Código</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Comprador</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Obra</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Precio</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Total</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Fecha</TableCell>
              <TableCell align="right" sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {facturas.map((factura) => (
              <TableRow key={factura.id} hover>
                <TableCell>
                  <Box className="flex items-center gap-2">
                    <ReceiptIcon className="text-gray-400" fontSize="small" />
                    <Typography className="font-medium">{factura.codigo}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{factura.comprador}</TableCell>
                <TableCell>{factura.obra}</TableCell>
                <TableCell>${factura.precioObra.toLocaleString()}</TableCell>
                <TableCell className="font-medium">${factura.total.toLocaleString()}</TableCell>
                <TableCell>{new Date(factura.fecha).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleOpen(factura, true)}>
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
        {facturas.map((factura) => (
          <Paper key={factura.id} className="p-4 border border-gray-200" sx={{ boxShadow: 'none' }}>
            <Box className="flex justify-between items-start mb-3">
              <Box>
                <Typography className="font-medium text-lg">{factura.codigo}</Typography>
                <Typography variant="body2" className="text-gray-600">{factura.comprador}</Typography>
              </Box>
              <IconButton size="small" onClick={() => handleOpen(factura, true)}>
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Box>
            <Box className="space-y-2">
              <Typography variant="body2" className="text-gray-600">
                <span className="font-medium">Obra:</span> {factura.obra}
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                <span className="font-medium">Total:</span> ${factura.total.toLocaleString()}
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                <span className="font-medium">Fecha:</span> {new Date(factura.fecha).toLocaleDateString()}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle className="font-light tracking-wide">
          {viewMode ? 'Detalle de Factura' : 'Nueva Factura'}
        </DialogTitle>
        <DialogContent>
          <Box className="flex flex-col gap-6 mt-4">
            <TextField
              label="Código de Factura"
              value={currentFactura.codigo}
              fullWidth
              variant="standard"
              disabled
            />
            <TextField
              label="Comprador"
              value={currentFactura.comprador}
              onChange={(e) => handleChange('comprador', e.target.value)}
              fullWidth
              variant="standard"
              disabled={viewMode}
            />
            <TextField
              label="Obra"
              value={currentFactura.obra}
              onChange={(e) => handleChange('obra', e.target.value)}
              fullWidth
              variant="standard"
              disabled={viewMode}
            />
            <TextField
              label="Precio de la Obra (USD)"
              type="number"
              value={currentFactura.precioObra}
              onChange={(e) => handleChange('precioObra', parseFloat(e.target.value) || 0)}
              fullWidth
              variant="standard"
              disabled={viewMode}
            />
            <TextField
              select
              label="Porcentaje Ganancia Museo (%)"
              value={currentFactura.porcentajeGanancia}
              onChange={(e) => handleChange('porcentajeGanancia', parseFloat(e.target.value))}
              fullWidth
              variant="standard"
              disabled={viewMode}
            >
              <MenuItem value={5}>5%</MenuItem>
              <MenuItem value={6}>6%</MenuItem>
              <MenuItem value={7}>7%</MenuItem>
              <MenuItem value={8}>8%</MenuItem>
              <MenuItem value={9}>9%</MenuItem>
              <MenuItem value={10}>10%</MenuItem>
            </TextField>
            <TextField
              label="Fecha"
              type="date"
              value={currentFactura.fecha}
              onChange={(e) => handleChange('fecha', e.target.value)}
              fullWidth
              variant="standard"
              InputLabelProps={{ shrink: true }}
              disabled={viewMode}
            />

            {!viewMode && calculos && currentFactura.precioObra > 0 && (
              <>
                <Divider />
                <Box className="bg-gray-50 p-4 space-y-2">
                  <Typography variant="body2" className="flex justify-between">
                    <span>Precio Obra:</span>
                    <span className="font-medium">${currentFactura.precioObra.toLocaleString()}</span>
                  </Typography>
                  <Typography variant="body2" className="flex justify-between">
                    <span>IVA (15%):</span>
                    <span className="font-medium">${calculos.iva.toLocaleString()}</span>
                  </Typography>
                  <Typography variant="body2" className="flex justify-between text-gray-600">
                    <span>Ganancia Museo ({currentFactura.porcentajeGanancia}%):</span>
                    <span className="font-medium">${calculos.ganancia.toLocaleString()}</span>
                  </Typography>
                  <Divider />
                  <Typography variant="body1" className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>${calculos.total.toLocaleString()}</span>
                  </Typography>
                </Box>
              </>
            )}

            {viewMode && (
              <>
                <Divider />
                <Box className="bg-gray-50 p-4 space-y-2">
                  <Typography variant="body2" className="flex justify-between">
                    <span>Precio Obra:</span>
                    <span className="font-medium">${currentFactura.precioObra.toLocaleString()}</span>
                  </Typography>
                  <Typography variant="body2" className="flex justify-between">
                    <span>IVA (15%):</span>
                    <span className="font-medium">${currentFactura.iva.toLocaleString()}</span>
                  </Typography>
                  <Typography variant="body2" className="flex justify-between text-gray-600">
                    <span>Ganancia Museo ({currentFactura.porcentajeGanancia}%):</span>
                    <span className="font-medium">${currentFactura.gananciaMuseo.toLocaleString()}</span>
                  </Typography>
                  <Divider />
                  <Typography variant="body1" className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>${currentFactura.total.toLocaleString()}</span>
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions className="p-6">
          <Button onClick={handleClose} sx={{ color: '#666' }}>
            {viewMode ? 'Cerrar' : 'Cancelar'}
          </Button>
          {!viewMode && (
            <Button
              onClick={handleSave}
              variant="contained"
              sx={{
                backgroundColor: '#000',
                color: '#fff',
                borderRadius: 0,
                '&:hover': { backgroundColor: '#1a1a1a' }
              }}
            >
              Generar Factura
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FacturacionContent;
