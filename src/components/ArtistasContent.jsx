import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { artistasAdminService } from '../services';

const ArtistasContent = () => {
  const [artistas, setArtistas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const cargadoRef = useRef(false);
  const [currentArtista, setCurrentArtista] = useState({
    nombre: '',
    pais: '',
    fecha_nacimiento: '',
    biografia: ''
  });

  useEffect(() => {
    if (cargadoRef.current) return;
    cargadoRef.current = true;

    const cargarArtistas = async () => {
      try {
        setCargando(true);
        const artistasData = await artistasAdminService.obtenerTodos();
        setArtistas(artistasData);
      } catch (err) {
        setError('Error al cargar los artistas');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };

    cargarArtistas();
  }, []);

  const handleOpen = (artista = null) => {
    if (artista) {
      setCurrentArtista(artista);
      setEditMode(true);
    } else {
      setCurrentArtista({
        nombre: '',
        pais: '',
        fecha_nacimiento: '',
        biografia: ''
      });
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
        await artistasAdminService.actualizar(currentArtista.id, currentArtista);
        setArtistas(artistas.map(a => a.id === currentArtista.id ? currentArtista : a));
      } else {
        const nuevoArtista = await artistasAdminService.crear(currentArtista);
        setArtistas([...artistas, nuevoArtista]);
      }
      handleClose();
    } catch (err) {
      setError(err.message || 'Error al guardar el artista');
      console.error(err);
    } finally {
      setEnviando(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este artista?')) {
      try {
        await artistasAdminService.eliminar(id);
        setArtistas(artistas.filter(a => a.id !== id));
      } catch (err) {
        setError('Error al eliminar el artista');
        console.error(err);
      }
    }
  };

  const handleChange = (field, value) => {
    setCurrentArtista({ ...currentArtista, [field]: value });
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
            Artistas
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            Gestiona los artistas y sus datos
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
          Nuevo Artista
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
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>País</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Nacimiento</TableCell>
              <TableCell align="right" sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {artistas.map((artista) => (
              <TableRow key={artista.id} hover>
                <TableCell>
                  <Typography className="font-medium">{artista.nombre}</Typography>
                </TableCell>
                <TableCell>{artista.pais}</TableCell>
                <TableCell>{new Date(artista.fecha_nacimiento).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleOpen(artista)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(artista.id)}>
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
        {artistas.map((artista) => (
          <Paper key={artista.id} className="p-4 border border-gray-200" sx={{ boxShadow: 'none' }}>
            <Box className="flex justify-between items-start mb-3">
              <Box>
                <Typography className="font-medium text-lg">{artista.nombre}</Typography>
                <Typography variant="body2" className="text-gray-600">{artista.pais}</Typography>
              </Box>
              <Box>
                <IconButton size="small" onClick={() => handleOpen(artista)}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => handleDelete(artista.id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
            <Typography variant="body2" className="text-gray-600">
              <span className="font-medium">Nacimiento:</span> {new Date(artista.fecha_nacimiento).toLocaleDateString()}
            </Typography>
          </Paper>
        ))}
      </Box>
      </>
      )}

      {/* Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle className="font-light tracking-wide">
          {editMode ? 'Editar Artista' : 'Nuevo Artista'}
        </DialogTitle>
        <DialogContent>
          <Box className="flex flex-col gap-6 mt-4">
            <TextField
              label="Nombre Completo"
              value={currentArtista.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              fullWidth
              variant="standard"
            />
            <TextField
              label="País"
              value={currentArtista.pais}
              onChange={(e) => handleChange('pais', e.target.value)}
              fullWidth
              variant="standard"
            />
            <TextField
              label="Fecha de Nacimiento"
              type="date"
              value={currentArtista.fecha_nacimiento}
              onChange={(e) => handleChange('fecha_nacimiento', e.target.value)}
              fullWidth
              variant="standard"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Biografía"
              value={currentArtista.biografia}
              onChange={(e) => handleChange('biografia', e.target.value)}
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

export default ArtistasContent;
