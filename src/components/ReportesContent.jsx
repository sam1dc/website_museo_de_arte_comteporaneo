import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Paper, Grid, CircularProgress, Alert } from '@mui/material';
import { reportesAdminService } from '../services';

const ReportesContent = () => {
  const [reportes, setReportes] = useState({
    obrasVendidas: [],
    facturacion: {},
    membresias: {}
  });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const cargadoRef = useRef(false);

  useEffect(() => {
    if (cargadoRef.current) return;
    cargadoRef.current = true;

    const cargarReportes = async () => {
      try {
        setCargando(true);
        const [obrasVendidas, facturacion, membresias] = await Promise.all([
          reportesAdminService.obrasVendidas(),
          reportesAdminService.facturacion(),
          reportesAdminService.membresias()
        ]);
        setReportes({ obrasVendidas, facturacion, membresias });
      } catch (err) {
        setError('Error al cargar los reportes');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };

    cargarReportes();
  }, []);

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
        <Typography variant="body2" className="text-gray-600">
          Análisis de ventas y actividad del museo
        </Typography>
      </Box>

      {cargando ? (
        <Box className="flex justify-center py-16">
          <CircularProgress />
        </Box>
      ) : (
      <Grid container spacing={4}>
        {/* Resumen de Facturación */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4, border: '1px solid #e5e5e5', boxShadow: 'none' }}>
            <Typography variant="h6" className="font-light mb-4">
              Facturación
            </Typography>
            <Box className="space-y-2">
              <Box className="flex justify-between">
                <Typography className="text-gray-600">Total Ingresos:</Typography>
                <Typography className="font-medium">
                  ${(reportes.facturacion?.total_ingresos || 0).toLocaleString()}
                </Typography>
              </Box>
              <Box className="flex justify-between">
                <Typography className="text-gray-600">Facturas Emitidas:</Typography>
                <Typography className="font-medium">
                  {reportes.facturacion?.total_facturas || 0}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Resumen de Membresías */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4, border: '1px solid #e5e5e5', boxShadow: 'none' }}>
            <Typography variant="h6" className="font-light mb-4">
              Membresías
            </Typography>
            <Box className="space-y-2">
              <Box className="flex justify-between">
                <Typography className="text-gray-600">Total Miembros:</Typography>
                <Typography className="font-medium">
                  {reportes.membresias?.total_miembros || 0}
                </Typography>
              </Box>
              <Box className="flex justify-between">
                <Typography className="text-gray-600">Activas:</Typography>
                <Typography className="font-medium">
                  {reportes.membresias?.activas || 0}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Obras Vendidas */}
        <Grid item xs={12}>
          <Paper sx={{ p: 4, border: '1px solid #e5e5e5', boxShadow: 'none' }}>
            <Typography variant="h6" className="font-light mb-4">
              Obras Vendidas
            </Typography>
            <Box className="space-y-2">
              <Box className="flex justify-between">
                <Typography className="text-gray-600">Total Vendidas:</Typography>
                <Typography className="font-medium">
                  {Array.isArray(reportes.obrasVendidas) ? reportes.obrasVendidas.length : 0}
                </Typography>
              </Box>
              <Box className="flex justify-between">
                <Typography className="text-gray-600">Valor Total:</Typography>
                <Typography className="font-medium">
                  ${Array.isArray(reportes.obrasVendidas) 
                    ? reportes.obrasVendidas.reduce((sum, obra) => sum + (obra.precio || 0), 0).toLocaleString()
                    : 0}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      )}
    </Box>
  );
};

export default ReportesContent;
