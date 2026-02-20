import { useState } from 'react';
import { Box, Typography, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';

const CompradoresContent = () => {
  const [compradores, setCompradores] = useState([
    { 
      id: 1, 
      nombre: 'Juan Pérez',
      email: 'juan.perez@email.com',
      telefono: '+1 555-0101',
      direccion: '123 Main St, New York, NY',
      fechaRegistro: '2024-01-15',
      membresia: 'Activa',
      compras: 2
    },
    { 
      id: 2, 
      nombre: 'María García',
      email: 'maria.garcia@email.com',
      telefono: '+1 555-0102',
      direccion: '456 Oak Ave, Los Angeles, CA',
      fechaRegistro: '2024-02-20',
      membresia: 'Activa',
      compras: 1
    },
    { 
      id: 3, 
      nombre: 'Carlos López',
      email: 'carlos.lopez@email.com',
      telefono: '+1 555-0103',
      direccion: '789 Pine Rd, Miami, FL',
      fechaRegistro: '2023-12-10',
      membresia: 'Vencida',
      compras: 3
    }
  ]);

  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentComprador, setCurrentComprador] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    fechaRegistro: '',
    membresia: 'Activa',
    compras: 0
  });

  const handleOpen = (comprador = null, view = false) => {
    if (comprador) {
      setCurrentComprador(comprador);
      setViewMode(view);
      setEditMode(!view);
    } else {
      setCurrentComprador({
        nombre: '',
        email: '',
        telefono: '',
        direccion: '',
        fechaRegistro: new Date().toISOString().split('T')[0],
        membresia: 'Activa',
        compras: 0
      });
      setViewMode(false);
      setEditMode(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setViewMode(false);
  };

  const handleSave = () => {
    if (editMode) {
      setCompradores(compradores.map(c => c.id === currentComprador.id ? currentComprador : c));
    } else {
      setCompradores([...compradores, { ...currentComprador, id: Date.now() }]);
    }
    handleClose();
  };

  const handleDelete = (id) => {
    setCompradores(compradores.filter(c => c.id !== id));
  };

  const handleChange = (field, value) => {
    setCurrentComprador({ ...currentComprador, [field]: value });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4" sx={{ width: '100%' }}>
        <Box>
          <Typography variant="h4" className="font-light tracking-wide mb-2">
            Compradores
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            Gestiona los compradores registrados
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
          Nuevo Comprador
        </Button>
      </Box>

      {/* Vista Desktop */}
      <TableContainer component={Paper} className="hidden md:block" sx={{ boxShadow: 'none', border: '1px solid #e5e5e5', width: '100%' }}>
        <Table sx={{ width: '100%' }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#fafafa' }}>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Teléfono</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Membresía</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Compras</TableCell>
              <TableCell align="right" sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {compradores.map((comprador) => (
              <TableRow key={comprador.id} hover>
                <TableCell>
                  <Typography className="font-medium">{comprador.nombre}</Typography>
                </TableCell>
                <TableCell>{comprador.email}</TableCell>
                <TableCell>{comprador.telefono}</TableCell>
                <TableCell>
                  <Chip 
                    label={comprador.membresia} 
                    color={comprador.membresia === 'Activa' ? 'success' : 'error'}
                    size="small"
                    sx={{ borderRadius: 0 }}
                  />
                </TableCell>
                <TableCell>{comprador.compras}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleOpen(comprador, true)}>
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleOpen(comprador, false)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(comprador.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Vista Mobile */}
      <Box className="block md:hidden space-y-4">
        {compradores.map((comprador) => (
          <Paper key={comprador.id} className="p-4 border border-gray-200" sx={{ boxShadow: 'none' }}>
            <Box className="flex justify-between items-start mb-3">
              <Box>
                <Typography className="font-medium text-lg">{comprador.nombre}</Typography>
                <Typography variant="body2" className="text-gray-600">{comprador.email}</Typography>
              </Box>
              <Box>
                <IconButton size="small" onClick={() => handleOpen(comprador, true)}>
                  <VisibilityIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => handleOpen(comprador, false)}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => handleDelete(comprador.id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
            <Box className="space-y-2">
              <Typography variant="body2" className="text-gray-600">
                <span className="font-medium">Teléfono:</span> {comprador.telefono}
              </Typography>
              <Box className="flex gap-2 items-center">
                <Chip 
                  label={comprador.membresia} 
                  color={comprador.membresia === 'Activa' ? 'success' : 'error'}
                  size="small"
                  sx={{ borderRadius: 0 }}
                />
                <Typography variant="body2" className="text-gray-600">
                  {comprador.compras} compras
                </Typography>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle className="font-light tracking-wide">
          {viewMode ? 'Detalle del Comprador' : editMode ? 'Editar Comprador' : 'Nuevo Comprador'}
        </DialogTitle>
        <DialogContent>
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <TextField
              label="Nombre Completo"
              value={currentComprador.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              fullWidth
              variant="standard"
              disabled={viewMode}
            />
            <TextField
              label="Email"
              type="email"
              value={currentComprador.email}
              onChange={(e) => handleChange('email', e.target.value)}
              fullWidth
              variant="standard"
              disabled={viewMode}
            />
            <TextField
              label="Teléfono"
              value={currentComprador.telefono}
              onChange={(e) => handleChange('telefono', e.target.value)}
              fullWidth
              variant="standard"
              disabled={viewMode}
            />
            <TextField
              label="Fecha de Registro"
              type="date"
              value={currentComprador.fechaRegistro}
              onChange={(e) => handleChange('fechaRegistro', e.target.value)}
              fullWidth
              variant="standard"
              InputLabelProps={{ shrink: true }}
              disabled={viewMode}
            />
            <TextField
              label="Dirección"
              value={currentComprador.direccion}
              onChange={(e) => handleChange('direccion', e.target.value)}
              fullWidth
              variant="standard"
              className="md:col-span-2"
              disabled={viewMode}
            />
            {viewMode && (
              <>
                <TextField
                  label="Membresía"
                  value={currentComprador.membresia}
                  fullWidth
                  variant="standard"
                  disabled
                />
                <TextField
                  label="Total de Compras"
                  value={currentComprador.compras}
                  fullWidth
                  variant="standard"
                  disabled
                />
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
              Guardar
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CompradoresContent;
