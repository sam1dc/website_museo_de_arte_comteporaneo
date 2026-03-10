import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, MenuItem, CircularProgress, Alert } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Image as ImageIcon } from '@mui/icons-material';
import { obrasAdminService } from '../services';

const ObrasContent = () => {
  const [obras, setObras] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const cargadoRef = useRef(false);
  const [currentObra, setCurrentObra] = useState({
    titulo: '',
    artista_id: '',
    genero_id: '',
    precio: '',
    año: '',
    estatus: 'disponible',
    descripcion: '',
    tecnica: '',
    dimensiones: ''
  });

  const estatusOptions = ['disponible', 'reservada', 'vendida'];

  useEffect(() => {
    if (cargadoRef.current) return;
    cargadoRef.current = true;

    const cargarObras = async () => {
      try {
        setCargando(true);
        const obrasData = await obrasAdminService.obtenerTodos();
        setObras(obrasData);
      } catch (err) {
        setError('Error al cargar las obras');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };

    cargarObras();
  }, []);

  const handleOpen = (obra = null) => {
    if (obra) {
      setCurrentObra(obra);
      setEditMode(true);
    } else {
      setCurrentObra({
        titulo: '',
        artista_id: '',
        genero_id: '',
        precio: '',
        año: '',
        estatus: 'disponible',
        descripcion: '',
        tecnica: '',
        dimensiones: ''
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
        await obrasAdminService.actualizar(currentObra.id, currentObra);
        setObras(obras.map(o => o.id === currentObra.id ? currentObra : o));
      } else {
        const nuevaObra = await obrasAdminService.crear(currentObra);
        setObras([...obras, nuevaObra]);
      }
      handleClose();
    } catch (err) {
      setError(err.message || 'Error al guardar la obra');
      console.error(err);
    } finally {
      setEnviando(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta obra?')) {
      try {
        await obrasAdminService.eliminar(id);
        setObras(obras.filter(o => o.id !== id));
      } catch (err) {
        setError('Error al eliminar la obra');
        console.error(err);
      }
    }
  };

  const handleChange = (field, value) => {
    setCurrentObra({ ...currentObra, [field]: value });
  };

  const getEstatusColor = (estatus) => {
    switch (estatus) {
      case 'disponible': return 'success';
      case 'reservada': return 'warning';
      case 'vendida': return 'error';
      default: return 'default';
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
                    <Typography className="font-medium">{obra.titulo}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{obra.artista?.nombre}</TableCell>
                <TableCell>{obra.genero?.nombre}</TableCell>
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
                <Typography className="font-medium text-lg">{obra.titulo}</Typography>
                <Typography variant="body2" className="text-gray-600">{obra.artista?.nombre}</Typography>
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
                <span className="font-medium">Género:</span> {obra.genero?.nombre}
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
      </>
      )}

      {/* Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle className="font-light tracking-wide">
          {editMode ? 'Editar Obra' : 'Nueva Obra'}
        </DialogTitle>
        <DialogContent>
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <TextField
              label="Título"
              value={currentObra.titulo}
              onChange={(e) => handleChange('titulo', e.target.value)}
              fullWidth
              variant="standard"
            />
            <TextField
              label="Artista ID"
              type="number"
              value={currentObra.artista_id}
              onChange={(e) => handleChange('artista_id', e.target.value)}
              fullWidth
              variant="standard"
            />
            <TextField
              label="Género ID"
              type="number"
              value={currentObra.genero_id}
              onChange={(e) => handleChange('genero_id', e.target.value)}
              fullWidth
              variant="standard"
            />
            <TextField
              label="Precio (USD)"
              type="number"
              value={currentObra.precio}
              onChange={(e) => handleChange('precio', parseFloat(e.target.value))}
              fullWidth
              variant="standard"
            />
            <TextField
              label="Año"
              type="number"
              value={currentObra.año}
              onChange={(e) => handleChange('año', e.target.value)}
              fullWidth
              variant="standard"
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
              label="Técnica"
              value={currentObra.tecnica}
              onChange={(e) => handleChange('tecnica', e.target.value)}
              fullWidth
              variant="standard"
            />
            <TextField
              label="Dimensiones"
              value={currentObra.dimensiones}
              onChange={(e) => handleChange('dimensiones', e.target.value)}
              fullWidth
              variant="standard"
            />
            <TextField
              label="Descripción"
              value={currentObra.descripcion}
              onChange={(e) => handleChange('descripcion', e.target.value)}
              fullWidth
              multiline
              rows={3}
              variant="standard"
              className="md:col-span-2"
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

export default ObrasContent;
