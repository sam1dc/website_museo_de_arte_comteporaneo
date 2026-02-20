import { useState } from 'react';
import { Box, Typography, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const GenerosContent = () => {
  const [generos, setGeneros] = useState([
    { id: 1, nombre: 'Pintura', caracteristicas: 'Técnica, Dimensiones, Soporte' },
    { id: 2, nombre: 'Escultura', caracteristicas: 'Material, Peso, Dimensiones (largo, ancho, profundidad)' },
    { id: 3, nombre: 'Fotografía', caracteristicas: 'Técnica, Dimensiones, Edición' },
    { id: 4, nombre: 'Cerámica', caracteristicas: 'Material, Técnica, Dimensiones' },
    { id: 5, nombre: 'Orfebrería', caracteristicas: 'Material, Peso, Técnica' }
  ]);

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentGenero, setCurrentGenero] = useState({ nombre: '', caracteristicas: '' });

  const handleOpen = (genero = null) => {
    if (genero) {
      setCurrentGenero(genero);
      setEditMode(true);
    } else {
      setCurrentGenero({ nombre: '', caracteristicas: '' });
      setEditMode(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentGenero({ nombre: '', caracteristicas: '' });
  };

  const handleSave = () => {
    if (editMode) {
      setGeneros(generos.map(g => g.id === currentGenero.id ? currentGenero : g));
    } else {
      setGeneros([...generos, { ...currentGenero, id: Date.now() }]);
    }
    handleClose();
  };

  const handleDelete = (id) => {
    setGeneros(generos.filter(g => g.id !== id));
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4" sx={{ width: '100%' }}>
        <Box>
          <Typography variant="h4" className="font-light tracking-wide mb-2">
            Géneros Artísticos
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            Gestiona los géneros y sus características
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
          Nuevo Género
        </Button>
      </Box>

      {/* Vista Desktop */}
      <TableContainer component={Paper} className="hidden md:block" sx={{ boxShadow: 'none', border: '1px solid #e5e5e5', width: '100%' }}>
        <Table sx={{ width: '100%' }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#fafafa' }}>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Género</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Características</TableCell>
              <TableCell align="right" sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {generos.map((genero) => (
              <TableRow key={genero.id} hover>
                <TableCell>
                  <Typography className="font-medium">{genero.nombre}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" className="text-gray-600">
                    {genero.caracteristicas}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleOpen(genero)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(genero.id)}>
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
        {generos.map((genero) => (
          <Paper key={genero.id} className="p-4 border border-gray-200" sx={{ boxShadow: 'none' }}>
            <Box className="flex justify-between items-start mb-3">
              <Typography className="font-medium text-lg">{genero.nombre}</Typography>
              <Box>
                <IconButton size="small" onClick={() => handleOpen(genero)}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => handleDelete(genero.id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
            <Typography variant="body2" className="text-gray-600">
              <span className="font-medium">Características:</span> {genero.caracteristicas}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle className="font-light tracking-wide">
          {editMode ? 'Editar Género' : 'Nuevo Género'}
        </DialogTitle>
        <DialogContent>
          <Box className="flex flex-col gap-6 mt-4">
            <TextField
              label="Nombre del Género"
              value={currentGenero.nombre}
              onChange={(e) => setCurrentGenero({ ...currentGenero, nombre: e.target.value })}
              fullWidth
              variant="standard"
            />
            <TextField
              label="Características"
              value={currentGenero.caracteristicas}
              onChange={(e) => setCurrentGenero({ ...currentGenero, caracteristicas: e.target.value })}
              fullWidth
              multiline
              rows={3}
              variant="standard"
              helperText="Ej: Material, Peso, Dimensiones"
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

export default GenerosContent;
