import { useState } from 'react';
import { Box, Typography, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tabs, Tab } from '@mui/material';
import { Search as SearchIcon, Assessment as AssessmentIcon } from '@mui/icons-material';

const ReportesContent = () => {
  const [tabValue, setTabValue] = useState(0);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  // Data mock para reportes
  const obrasVendidas = [
    { obra: 'Guernica', artista: 'Pablo Picasso', comprador: 'Juan Pérez', precio: 25000, fecha: '2024-01-20' },
    { obra: 'Las Dos Fridas', artista: 'Frida Kahlo', comprador: 'María García', precio: 18000, fecha: '2024-02-15' }
  ];

  const resumenFacturacion = [
    { codigo: 'FAC-2024-001', fecha: '2024-01-20', precioObra: 25000, gananciaMuseo: 2500, porcentaje: 10, total: 28750 },
    { codigo: 'FAC-2024-002', fecha: '2024-02-15', precioObra: 18000, gananciaMuseo: 900, porcentaje: 5, total: 20700 }
  ];

  const resumenMembresias = [
    { comprador: 'Juan Pérez', email: 'juan.perez@email.com', fechaRegistro: '2024-01-15', monto: 10 },
    { comprador: 'María García', email: 'maria.garcia@email.com', fechaRegistro: '2024-02-20', monto: 10 },
    { comprador: 'Carlos López', email: 'carlos.lopez@email.com', fechaRegistro: '2023-12-10', monto: 10 }
  ];

  const handleBuscar = () => {
    // Aquí se implementaría el filtrado por fechas
    console.log('Buscar desde:', fechaInicio, 'hasta:', fechaFin);
  };

  const totalRecaudado = resumenFacturacion.reduce((sum, f) => sum + f.total, 0);
  const totalGanancias = resumenFacturacion.reduce((sum, f) => sum + f.gananciaMuseo, 0);
  const totalMembresias = resumenMembresias.length * 10;

  return (
    <Box sx={{ width: '100%' }}>
      <Box className="mb-6">
        <Typography variant="h4" className="font-light tracking-wide mb-2">
          Reportes y Consultas
        </Typography>
        <Typography variant="body2" className="text-gray-600">
          Consulta información del sistema por período
        </Typography>
      </Box>

      {/* Filtros de Fecha */}
      <Paper className="p-4 sm:p-6 mb-6" sx={{ boxShadow: 'none', border: '1px solid #e5e5e5' }}>
        <Box className="flex flex-col sm:flex-row gap-4 items-end">
          <TextField
            label="Fecha Inicio"
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            variant="standard"
            InputLabelProps={{ shrink: true }}
            className="flex-1"
          />
          <TextField
            label="Fecha Fin"
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            variant="standard"
            InputLabelProps={{ shrink: true }}
            className="flex-1"
          />
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleBuscar}
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
            Buscar
          </Button>
        </Box>
      </Paper>

      {/* Tabs de Reportes */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 300
            }
          }}
        >
          <Tab label="Obras Vendidas" />
          <Tab label="Facturación" />
          <Tab label="Membresías" />
        </Tabs>
      </Box>

      {/* Reporte 1: Obras Vendidas */}
      {tabValue === 0 && (
        <Box>
          <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e5e5e5', width: '100%' }}>
            <Table sx={{ width: '100%' }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#fafafa' }}>
                  <TableCell sx={{ fontWeight: 500 }}>Obra</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>Artista</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>Comprador</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>Precio</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>Fecha</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {obrasVendidas.map((obra, index) => (
                  <TableRow key={index} hover>
                    <TableCell className="font-medium">{obra.obra}</TableCell>
                    <TableCell>{obra.artista}</TableCell>
                    <TableCell>{obra.comprador}</TableCell>
                    <TableCell>${obra.precio.toLocaleString()}</TableCell>
                    <TableCell>{new Date(obra.fecha).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Reporte 2: Resumen de Facturación */}
      {tabValue === 1 && (
        <Box>
          <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e5e5e5', width: '100%', mb: 3 }}>
            <Table sx={{ width: '100%' }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#fafafa' }}>
                  <TableCell sx={{ fontWeight: 500 }}>Código</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>Fecha</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>Precio Obra</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>Ganancia (%)</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>Ganancia ($)</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resumenFacturacion.map((factura, index) => (
                  <TableRow key={index} hover>
                    <TableCell className="font-medium">{factura.codigo}</TableCell>
                    <TableCell>{new Date(factura.fecha).toLocaleDateString()}</TableCell>
                    <TableCell>${factura.precioObra.toLocaleString()}</TableCell>
                    <TableCell>{factura.porcentaje}%</TableCell>
                    <TableCell>${factura.gananciaMuseo.toLocaleString()}</TableCell>
                    <TableCell className="font-medium">${factura.total.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Resumen Total */}
          <Paper className="p-6 bg-gray-50" sx={{ boxShadow: 'none', border: '1px solid #e5e5e5' }}>
            <Box className="flex items-center gap-2 mb-4">
              <AssessmentIcon />
              <Typography variant="h6" className="font-light">Resumen del Período</Typography>
            </Box>
            <Box className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Box>
                <Typography variant="body2" className="text-gray-600 mb-1">Total Recaudado</Typography>
                <Typography variant="h5" className="font-light">${totalRecaudado.toLocaleString()}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" className="text-gray-600 mb-1">Ganancia Museo</Typography>
                <Typography variant="h5" className="font-light">${totalGanancias.toLocaleString()}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" className="text-gray-600 mb-1">Facturas</Typography>
                <Typography variant="h5" className="font-light">{resumenFacturacion.length}</Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      )}

      {/* Reporte 3: Resumen de Membresías */}
      {tabValue === 2 && (
        <Box>
          <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e5e5e5', width: '100%', mb: 3 }}>
            <Table sx={{ width: '100%' }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#fafafa' }}>
                  <TableCell sx={{ fontWeight: 500 }}>Comprador</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>Fecha Registro</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>Monto</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resumenMembresias.map((membresia, index) => (
                  <TableRow key={index} hover>
                    <TableCell className="font-medium">{membresia.comprador}</TableCell>
                    <TableCell>{membresia.email}</TableCell>
                    <TableCell>{new Date(membresia.fechaRegistro).toLocaleDateString()}</TableCell>
                    <TableCell>${membresia.monto}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Resumen Total */}
          <Paper className="p-6 bg-gray-50" sx={{ boxShadow: 'none', border: '1px solid #e5e5e5' }}>
            <Box className="flex items-center gap-2 mb-4">
              <AssessmentIcon />
              <Typography variant="h6" className="font-light">Resumen del Período</Typography>
            </Box>
            <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Box>
                <Typography variant="body2" className="text-gray-600 mb-1">Total Membresías</Typography>
                <Typography variant="h5" className="font-light">{resumenMembresias.length}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" className="text-gray-600 mb-1">Total Recaudado</Typography>
                <Typography variant="h5" className="font-light">${totalMembresias}</Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default ReportesContent;
