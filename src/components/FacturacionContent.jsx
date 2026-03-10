import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert } from '@mui/material';
import { facturasAdminService } from '../services';

const FacturacionContent = () => {
  const [facturas, setFacturas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
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

      {cargando ? (
        <Box className="flex justify-center py-16">
          <CircularProgress />
        </Box>
      ) : (
      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e5e5e5' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#fafafa' }}>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Número</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Comprador</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Fecha</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Monto</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(facturas) && facturas.map((factura) => (
              <TableRow key={factura.id} hover>
                <TableCell>{factura.numero_factura}</TableCell>
                <TableCell>{factura.comprador?.nombre}</TableCell>
                <TableCell>{new Date(factura.fecha).toLocaleDateString()}</TableCell>
                <TableCell>${(factura.monto || 0).toLocaleString()}</TableCell>
                <TableCell>{factura.estado}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      )}
    </Box>
  );
};

export default FacturacionContent;
