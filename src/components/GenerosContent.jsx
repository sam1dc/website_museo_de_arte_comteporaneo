import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { generosAdminService } from '../services';

const GenerosContent = () => {
  const [generos, setGeneros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const cargadoRef = useRef(false);
  const [currentGenero, setCurrentGenero] = useState({ nombre: '', descripcion: '' });

  useEffect(() => {
    if (cargadoRef.current) return;
    cargadoRef.current = true;

    const cargarGeneros = async () => {
      try {
        setCargando(true);
        const generosData = await generosAdminService.obtenerTodos();
        setGeneros(generosData);
      } catch (err) {
        setError('Error al cargar los géneros');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };

    cargarGeneros();
  }, []);

  const handleOpen = (genero = null) => {
    if (genero) {
      setCurrentGenero(genero);
      setEditMode(true);
    } else {
      setCurrentGenero({ nombre: '', descripcion: '' });
      setEditMode(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    try {
      setEnviando(true);
      setError(null);

      if (editMode) {
        await generosAdminService.actualizar(currentGenero.genero_id, currentGenero);
        setGeneros(generos.map(g => g.genero_id === currentGenero.genero_id ? currentGenero : g));
      } else {
        const nuevoGenero = await generosAdminService.crear(currentGenero);
        setGeneros([...generos, nuevoGenero]);
      }
      handleClose();
    } catch (err) {
      setError(err.message || 'Error al guardar el género');
      console.error(err);
    } finally {
      setEnviando(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este género?')) {
      try {
        await generosAdminService.eliminar(id);
        setGeneros(generos.filter(g => g.genero_id !== id));
      } catch (err) {
        setError('Error al eliminar el género');
        console.error(err);
      }
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {error && (
        <Alert severity="error" className="mb-6" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

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

      {cargando ? (
        <Box className="flex justify-center py-16">
          <CircularProgress />
        </Box>
      ) : (
      <>
      {/* Vista Desktop */}
      <TableContainer component={Paper} className="hidden md:block" sx={{ boxShadow: 'none', border: '1px solid #e5e5e5', width: '100%' }}>
        <Table sx={{ width: '100%' }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#fafafa' }}>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Género</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Descripción</TableCell>
              <TableCell align="right" sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {generos.map((genero) => (
              <TableRow key={genero.genero_id} hover>
                <TableCell>
                  <Typography className="font-medium">{genero.nombre}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" className="text-gray-600">
                    {genero.descripcion}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleOpen(genero)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(genero.genero_id)}>
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
          <Paper key={genero.genero_id} className="p-4 border border-gray-200" sx={{ boxShadow: 'none' }}>
            <Box className="flex justify-between items-start mb-3">
              <Typography className="font-medium text-lg">{genero.nombre}</Typography>
              <Box>
                <IconButton size="small" onClick={() => handleOpen(genero)}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => handleDelete(genero.genero_id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
            <Typography variant="body2" className="text-gray-600">
              <span className="font-medium">Descripción:</span> {genero.descripcion}
            </Typography>
          </Paper>
        ))}
      </Box>
      </>
      )}

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
              label="Descripción"
              value={currentGenero.descripcion}
              onChange={(e) => setCurrentGenero({ ...currentGenero, descripcion: e.target.value })}
              fullWidth
              multiline
              rows={3}
              variant="standard"
            />
          </Box>
        </DialogContent>
        <DialogActions className="p-6">
          <Button onClick={handleClose} sx={{ color: '#666' }}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={enviando}
            variant="contained"
            sx={{
              backgroundColor: '#000',
              color: '#fff',
              borderRadius: 0,
              '&:hover': { backgroundColor: '#1a1a1a' }
            }}
          >
            {enviando ? <CircularProgress size={20} color="inherit" /> : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GenerosContent;
