import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Paper, Grid, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Button } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { reportesAdminService } from '../services';

const ReportesContent = () => {
  const [reportes, setReportes] = useState({
    obrasVendidas: [],
    facturacion: { data: [], resumen: {} },
    membresias: { data: [], resumen: {} }
  });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const cargadoRef = useRef(false);

  const cargarReportes = async (inicio = '', fin = '') => {
    try {
      setCargando(true);
      const params = {};
      if (inicio) params.fecha_inicio = inicio;
      if (fin) params.fecha_fin = fin;

      const [obrasVendidas, facturacion, membresias] = await Promise.all([
        reportesAdminService.obrasVendidas(params),
        reportesAdminService.facturacion(params),
        reportesAdminService.membresias(params)
      ]);
      setReportes({ obrasVendidas, facturacion, membresias });
    } catch (err) {
      setError('Error al cargar los reportes');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (cargadoRef.current) return;
    cargadoRef.current = true;
    cargarReportes();
  }, []);

  const handleFiltrar = () => {
    cargarReportes(fechaInicio, fechaFin);
  };

  const handleLimpiar = () => {
    setFechaInicio('');
    setFechaFin('');
    cargarReportes();
  };

  return (
    <Box sx={{ width: '100%' }}>
      {error && (
        <Alert severity="error" className="mb-6" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box className="mb-12">
        <Typography variant="h4" className="font-light tracking-wide mb-2">
          Reportes y Estadísticas
        </Typography>
        <Typography variant="body2" className="text-gray-600 mb-6">
          Análisis de ventas y actividad del museo
        </Typography>

        {/* Filtros de Fecha */}
        <Paper sx={{ p: 3, border: '1px solid #e5e5e5', boxShadow: 'none', mb: 4 }}>
          <Typography variant="h6" className="font-light mb-4 uppercase tracking-wider text-sm">
            Filtrar por Período
          </Typography>
          <Box className="flex flex-col sm:flex-row gap-4 items-end">
            <TextField
              label="Fecha Inicio"
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              variant="standard"
              InputLabelProps={{ shrink: true }}
              sx={{ flex: 1 }}
            />
            <TextField
              label="Fecha Fin"
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              variant="standard"
              InputLabelProps={{ shrink: true }}
              sx={{ flex: 1 }}
            />
            <Box className="flex gap-2">
              <Button
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={handleFiltrar}
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
                Filtrar
              </Button>
              <Button
                variant="outlined"
                onClick={handleLimpiar}
                sx={{
                  borderColor: '#000',
                  color: '#000',
                  borderRadius: 0,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: 300,
                  '&:hover': { borderColor: '#1a1a1a', backgroundColor: '#f5f5f5' }
                }}
              >
                Limpiar
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>

      {cargando ? (
        <Box className="flex justify-center py-16">
          <CircularProgress />
        </Box>
      ) : (
      <Box className="space-y-8">
        {/* Resúmenes */}
        <Grid container spacing={4}>
          {/* Resumen de Facturación */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 4, border: '1px solid #e5e5e5', boxShadow: 'none' }}>
              <Typography variant="h6" className="font-light mb-4 uppercase tracking-wider text-sm">
                Facturación
              </Typography>
              <Box className="space-y-3">
                <Box>
                  <Typography className="text-gray-500 text-xs uppercase tracking-wider mb-1">Total Recaudado</Typography>
                  <Typography variant="h5" className="font-light">
                    ${(reportes.facturacion?.resumen?.total_recaudado || 0).toFixed(2)}
                  </Typography>
                </Box>
                <Box>
                  <Typography className="text-gray-500 text-xs uppercase tracking-wider mb-1">Ganancia Museo</Typography>
                  <Typography variant="h6" className="font-light text-green-600">
                    ${(reportes.facturacion?.resumen?.ganancia_museo || 0).toFixed(2)}
                  </Typography>
                </Box>
                <Box>
                  <Typography className="text-gray-500 text-xs uppercase tracking-wider mb-1">Facturas</Typography>
                  <Typography variant="h6" className="font-light">
                    {reportes.facturacion?.resumen?.facturas || 0}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Resumen de Membresías */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 4, border: '1px solid #e5e5e5', boxShadow: 'none' }}>
              <Typography variant="h6" className="font-light mb-4 uppercase tracking-wider text-sm">
                Membresías
              </Typography>
              <Box className="space-y-3">
                <Box>
                  <Typography className="text-gray-500 text-xs uppercase tracking-wider mb-1">Total Membresías</Typography>
                  <Typography variant="h5" className="font-light">
                    {reportes.membresias?.resumen?.total_membresias || 0}
                  </Typography>
                </Box>
                <Box>
                  <Typography className="text-gray-500 text-xs uppercase tracking-wider mb-1">Total Recaudado</Typography>
                  <Typography variant="h6" className="font-light">
                    ${(reportes.membresias?.resumen?.total_recaudado || 0).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Resumen de Obras Vendidas */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 4, border: '1px solid #e5e5e5', boxShadow: 'none' }}>
              <Typography variant="h6" className="font-light mb-4 uppercase tracking-wider text-sm">
                Obras Vendidas
              </Typography>
              <Box className="space-y-3">
                <Box>
                  <Typography className="text-gray-500 text-xs uppercase tracking-wider mb-1">Total Vendidas</Typography>
                  <Typography variant="h5" className="font-light">
                    {Array.isArray(reportes.obrasVendidas) ? reportes.obrasVendidas.length : 0}
                  </Typography>
                </Box>
                <Box>
                  <Typography className="text-gray-500 text-xs uppercase tracking-wider mb-1">Valor Total</Typography>
                  <Typography variant="h6" className="font-light">
                    ${Array.isArray(reportes.obrasVendidas) 
                      ? reportes.obrasVendidas.reduce((sum, obra) => sum + (obra.precio || 0), 0).toFixed(2)
                      : '0.00'}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Tabla Obras Vendidas */}
        <Box>
          <Typography variant="h5" className="font-light tracking-wide mb-4">
            Detalle de Obras Vendidas
          </Typography>
          <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e5e5e5' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#fafafa' }}>
                  <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Obra</TableCell>
                  <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Artista</TableCell>
                  <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Comprador</TableCell>
                  <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Precio</TableCell>
                  <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Fecha</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(reportes.obrasVendidas) && reportes.obrasVendidas.map((obra, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{obra.obra}</TableCell>
                    <TableCell>{obra.artista}</TableCell>
                    <TableCell>{obra.comprador}</TableCell>
                    <TableCell>${obra.precio?.toFixed(2)}</TableCell>
                    <TableCell>{obra.fecha}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Tabla Facturación */}
        <Box>
          <Typography variant="h5" className="font-light tracking-wide mb-4">
            Detalle de Facturación
          </Typography>
          <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e5e5e5' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#fafafa' }}>
                  <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Código</TableCell>
                  <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Fecha</TableCell>
                  <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Precio Obra</TableCell>
                  <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Ganancia %</TableCell>
                  <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Ganancia USD</TableCell>
                  <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(reportes.facturacion?.data) && reportes.facturacion.data.map((factura, index) => (
                  <TableRow key={index} hover>
                    <TableCell>#{factura.codigo}</TableCell>
                    <TableCell>{factura.fecha}</TableCell>
                    <TableCell>${factura.precio_obra?.toFixed(2)}</TableCell>
                    <TableCell>{factura.ganancia_pct?.toFixed(1)}%</TableCell>
                    <TableCell className="text-green-600 font-medium">${factura.ganancia_usd?.toFixed(2)}</TableCell>
                    <TableCell className="font-medium">${factura.total?.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Tabla Membresías */}
        <Box>
          <Typography variant="h5" className="font-light tracking-wide mb-4">
            Detalle de Membresías
          </Typography>
          <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e5e5e5' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#fafafa' }}>
                  <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Comprador</TableCell>
                  <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Fecha Registro</TableCell>
                  <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Monto</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(reportes.membresias?.data) && reportes.membresias.data.map((membresia, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{membresia.comprador}</TableCell>
                    <TableCell>{membresia.email}</TableCell>
                    <TableCell>{membresia.fecha_registro}</TableCell>
                    <TableCell>${membresia.monto?.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
      )}
    </Box>
  );
};

export default ReportesContent;
