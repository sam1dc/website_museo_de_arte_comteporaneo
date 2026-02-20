import { useState } from 'react';
import { Box, Typography, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, MenuItem } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Image as ImageIcon } from '@mui/icons-material';

const ObrasContent = () => {
  const [obras, setObras] = useState([
    { 
      id: 1, 
      nombre: 'Guernica',
      artista: 'Pablo Picasso',
      genero: 'Pintura',
      precio: 25000,
      fechaCreacion: '1937-06-04',
      estatus: 'Disponible',
      caracteristicas: 'Óleo sobre lienzo, 349 x 776 cm'
    },
    { 
      id: 2, 
      nombre: 'Las Dos Fridas',
      artista: 'Frida Kahlo',
      genero: 'Pintura',
      precio: 18000,
      fechaCreacion: '1939-01-01',
      estatus: 'Disponible',
      caracteristicas: 'Óleo sobre lienzo, 173 x 173 cm'
    },
    { 
      id: 3, 
      nombre: 'El Pensador',
      artista: 'Auguste Rodin',
      genero: 'Escultura',
      precio: 35000,
      fechaCreacion: '1902-01-01',
      estatus: 'Reservada',
      caracteristicas: 'Bronce, 180 cm altura, 98 kg'
    }
  ]);

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentObra, setCurrentObra] = useState({
    nombre: '',
    artista: '',
    genero: '',
    precio: '',
    fechaCreacion: '',
    estatus: 'Disponible',
    caracteristicas: ''
  });

  const generos = ['Pintura', 'Escultura', 'Fotografía', 'Cerámica', 'Orfebrería'];
  const estatusOptions = ['Disponible', 'Reservada', 'Vendida'];

  const handleOpen = (obra = null) => {
    if (obra) {
      setCurrentObra(obra);
      setEditMode(true);
    } else {
      setCurrentObra({
        nombre: '',
        artista: '',
        genero: '',
        precio: '',
        fechaCreacion: '',
        estatus: 'Disponible',
        caracteristicas: ''
      });
      setEditMode(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    if (editMode) {
      setObras(obras.map(o => o.id === currentObra.id ? currentObra : o));
    } else {
      setObras([...obras, { ...currentObra, id: Date.now() }]);
    }
    handleClose();
  };

  const handleDelete = (id) => {
    setObras(obras.filter(o => o.id !== id));
  };

  const handleChange = (field, value) => {
    setCurrentObra({ ...currentObra, [field]: value });
  };

  const getEstatusColor = (estatus) => {
    switch (estatus) {
      case 'Disponible': return 'success';
      case 'Reservada': return 'warning';
      case 'Vendida': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4" sx={{ width: '100%' }}>
        <Box>
          <Typography variant="h4" className="font-light tracking-wide mb-2">
            Obras de Arte
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            Gestiona las obras en exposición
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
          Nueva Obra
        </Button>
      </Box>

      {/* Vista Desktop */}
      <TableContainer component={Paper} className="hidden md:block" sx={{ boxShadow: 'none', border: '1px solid #e5e5e5', width: '100%' }}>
        <Table sx={{ width: '100%' }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#fafafa' }}>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Obra</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Artista</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Género</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Precio</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Estatus</TableCell>
              <TableCell align="right" sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {obras.map((obra) => (
              <TableRow key={obra.id} hover>
                <TableCell>
                  <Box className="flex items-center gap-2">
                    <ImageIcon className="text-gray-400" />
                    <Typography className="font-medium">{obra.nombre}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{obra.artista}</TableCell>
                <TableCell>{obra.genero}</TableCell>
                <TableCell>${obra.precio.toLocaleString()}</TableCell>
                <TableCell>
                  <Chip 
                    label={obra.estatus} 
                    color={getEstatusColor(obra.estatus)}
                    size="small"
                    sx={{ borderRadius: 0 }}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleOpen(obra)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(obra.id)}>
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
        {obras.map((obra) => (
          <Paper key={obra.id} className="p-4 border border-gray-200" sx={{ boxShadow: 'none' }}>
            <Box className="flex justify-between items-start mb-3">
              <Box>
                <Typography className="font-medium text-lg">{obra.nombre}</Typography>
                <Typography variant="body2" className="text-gray-600">{obra.artista}</Typography>
              </Box>
              <Box>
                <IconButton size="small" onClick={() => handleOpen(obra)}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => handleDelete(obra.id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
            <Box className="space-y-2">
              <Typography variant="body2" className="text-gray-600">
                <span className="font-medium">Género:</span> {obra.genero}
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                <span className="font-medium">Precio:</span> ${obra.precio.toLocaleString()}
              </Typography>
              <Chip 
                label={obra.estatus} 
                color={getEstatusColor(obra.estatus)}
                size="small"
                sx={{ borderRadius: 0 }}
              />
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle className="font-light tracking-wide">
          {editMode ? 'Editar Obra' : 'Nueva Obra'}
        </DialogTitle>
        <DialogContent>
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <TextField
              label="Nombre de la Obra"
              value={currentObra.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              fullWidth
              variant="standard"
            />
            <TextField
              label="Artista"
              value={currentObra.artista}
              onChange={(e) => handleChange('artista', e.target.value)}
              fullWidth
              variant="standard"
            />
            <TextField
              select
              label="Género"
              value={currentObra.genero}
              onChange={(e) => handleChange('genero', e.target.value)}
              fullWidth
              variant="standard"
            >
              {generos.map((genero) => (
                <MenuItem key={genero} value={genero}>
                  {genero}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Precio (USD)"
              type="number"
              value={currentObra.precio}
              onChange={(e) => handleChange('precio', parseFloat(e.target.value))}
              fullWidth
              variant="standard"
            />
            <TextField
              label="Fecha de Creación"
              type="date"
              value={currentObra.fechaCreacion}
              onChange={(e) => handleChange('fechaCreacion', e.target.value)}
              fullWidth
              variant="standard"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              select
              label="Estatus"
              value={currentObra.estatus}
              onChange={(e) => handleChange('estatus', e.target.value)}
              fullWidth
              variant="standard"
            >
              {estatusOptions.map((estatus) => (
                <MenuItem key={estatus} value={estatus}>
                  {estatus}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Características"
              value={currentObra.caracteristicas}
              onChange={(e) => handleChange('caracteristicas', e.target.value)}
              fullWidth
              multiline
              rows={3}
              variant="standard"
              className="md:col-span-2"
              helperText="Ej: Material, dimensiones, peso, etc."
            />
          </Box>
        </DialogContent>
        <DialogActions className="p-6">
          <Button onClick={handleClose} sx={{ color: '#666' }}>
            Cancelar
          </Button>
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
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ObrasContent;
