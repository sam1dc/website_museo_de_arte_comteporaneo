import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert } from '@mui/material';
import { compradoresAdminService } from '../services';

const CompradoresContent = () => {
  const [compradores, setCompradores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const cargadoRef = useRef(false);

  useEffect(() => {
    if (cargadoRef.current) return;
    cargadoRef.current = true;

    const cargarCompradores = async () => {
      try {
        setCargando(true);
        const compradoresData = await compradoresAdminService.obtenerTodos();
        setCompradores(compradoresData);
      } catch (err) {
        setError('Error al cargar los compradores');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };

    cargarCompradores();
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
          Compradores
        </Typography>
        <Typography variant="body2" className="text-gray-600">
          Listado de compradores registrados
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
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Teléfono</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Fecha Registro</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(compradores) && compradores.map((comprador) => (
              <TableRow key={comprador.id} hover>
                <TableCell>{comprador.nombre}</TableCell>
                <TableCell>{comprador.email}</TableCell>
                <TableCell>{comprador.telefono}</TableCell>
                <TableCell>{new Date(comprador.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      )}
    </Box>
  );
};

export default CompradoresContent;
