import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert, Tooltip, Avatar, Chip } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Image as ImageIcon, Close as CloseIcon } from '@mui/icons-material';
import { artistasAdminService, generosAdminService } from '../services';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import { useConfirmDelete } from '../hooks/useConfirmDelete';

const ArtistasContent = () => {
  const { deleteDialog, confirmDelete, handleConfirm, handleClose: handleDeleteClose } = useConfirmDelete();
  const [artistas, setArtistas] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [fotoModal, setFotoModal] = useState({ open: false, url: '', nombre: '' });
  const cargadoRef = useRef(false);
  const [currentArtista, setCurrentArtista] = useState({
    nombres: '',
    apellidos: '',
    nacionalidad: '',
    fecha_nacimiento: '',
    biografia: '',
    foto_url: '',
    genero_ids: []
  });

  useEffect(() => {
    if (cargadoRef.current) return;
    cargadoRef.current = true;

    const cargarDatos = async () => {
      try {
        setCargando(true);
        const [artistasData, generosData] = await Promise.all([
          artistasAdminService.obtenerTodos(),
          generosAdminService.obtenerTodos()
        ]);
        setArtistas(artistasData);
        setGeneros(generosData);
      } catch (err) {
        setError('Error al cargar los datos');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  const handleOpen = (artista = null) => {
    if (artista) {
      setCurrentArtista({
        ...artista,
        fecha_nacimiento: artista.fecha_nacimiento ? artista.fecha_nacimiento.split('T')[0] : '',
        genero_ids: artista.generos?.map(g => g.genero_id) || []
      });
      setEditMode(true);
    } else {
      setCurrentArtista({
        nombres: '',
        apellidos: '',
        nacionalidad: '',
        fecha_nacimiento: '',
        biografia: '',
        foto_url: '',
        genero_ids: []
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
        const response = await artistasAdminService.actualizar(currentArtista.artista_id, currentArtista);
        // Recargar todos los artistas para obtener los datos actualizados con géneros
        const artistasData = await artistasAdminService.obtenerTodos();
        setArtistas(artistasData);
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
    const artista = artistas.find(a => a.artista_id === id);
    confirmDelete({
      title: 'Eliminar Artista',
      message: '¿Estás seguro de que deseas eliminar este artista?',
      itemName: `${artista?.nombres} ${artista?.apellidos}`,
      onConfirm: async () => {
        try {
          await artistasAdminService.eliminar(id);
          setArtistas(artistas.filter(a => a.artista_id !== id));
        } catch (err) {
          setError('Error al eliminar el artista');
          console.error(err);
        }
      }
    });
  };

  const renderGeneros = (generos) => {
    if (!generos || generos.length === 0) return 'N/A';
    
    const visible = generos.slice(0, 3);
    const hidden = generos.slice(3);
    
    return (
      <Box className="flex gap-1 flex-wrap">
        {visible.map((g) => (
          <Chip key={g.genero_id} label={g.nombre} size="small" sx={{ fontSize: '0.7rem' }} />
        ))}
        {hidden.length > 0 && (
          <Tooltip title={hidden.map(g => g.nombre).join(', ')}>
            <Chip label="..." size="small" sx={{ fontSize: '0.7rem' }} />
          </Tooltip>
        )}
      </Box>
    );
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
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Foto</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Nombre Completo</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Nacionalidad</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Géneros</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Biografía</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Fecha Nacimiento</TableCell>
              <TableCell align="right" sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {artistas.map((artista) => (
              <TableRow key={artista.artista_id} hover>
                <TableCell>
                  {artista.foto_url ? (
                    <Tooltip title="Ver foto">
                      <Avatar 
                        src={artista.foto_url} 
                        alt={artista.nombre_completo}
                        sx={{ width: 40, height: 40, cursor: 'pointer' }}
                        onClick={() => setFotoModal({ open: true, url: artista.foto_url, nombre: artista.nombre_completo })}
                      />
                    </Tooltip>
                  ) : (
                    <Avatar sx={{ width: 40, height: 40, bgcolor: '#e0e0e0' }}>
                      <ImageIcon sx={{ color: '#999' }} />
                    </Avatar>
                  )}
                </TableCell>
                <TableCell>
                  <Typography className="font-medium">{artista.nombre_completo}</Typography>
                </TableCell>
                <TableCell>{artista.nacionalidad}</TableCell>
                <TableCell>{renderGeneros(artista.generos)}</TableCell>
                <TableCell>
                  <Tooltip title={artista.biografia || 'Sin biografía'}>
                    <Typography variant="body2" className="text-gray-600" sx={{ 
                      maxWidth: '200px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {artista.biografia || 'N/A'}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>{artista.fecha_nacimiento ? new Date(artista.fecha_nacimiento).toLocaleDateString() : 'N/A'}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleOpen(artista)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(artista.artista_id)}>
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
          <Paper key={artista.artista_id} className="p-4 border border-gray-200" sx={{ boxShadow: 'none' }}>
            <Box className="flex gap-3 mb-3">
              {artista.foto_url ? (
                <Avatar 
                  src={artista.foto_url} 
                  alt={artista.nombre_completo}
                  sx={{ width: 60, height: 60, cursor: 'pointer' }}
                  onClick={() => setFotoModal({ open: true, url: artista.foto_url, nombre: artista.nombre_completo })}
                />
              ) : (
                <Avatar sx={{ width: 60, height: 60, bgcolor: '#e0e0e0' }}>
                  <ImageIcon sx={{ color: '#999' }} />
                </Avatar>
              )}
              <Box className="flex-1">
                <Typography className="font-medium text-lg">{artista.nombre_completo}</Typography>
                <Typography variant="body2" className="text-gray-600">{artista.nacionalidad}</Typography>
                <Typography variant="body2" className="text-gray-600">
                  {artista.fecha_nacimiento ? new Date(artista.fecha_nacimiento).toLocaleDateString() : 'N/A'}
                </Typography>
              </Box>
              <Box>
                <IconButton size="small" onClick={() => handleOpen(artista)}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => handleDelete(artista.artista_id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
            <Box className="mb-2">
              <Typography variant="caption" className="text-gray-600 font-medium">Géneros:</Typography>
              <Box className="mt-1">{renderGeneros(artista.generos)}</Box>
            </Box>
            <Typography variant="body2" className="text-gray-600">
              <span className="font-medium">Biografía:</span> {artista.biografia || 'N/A'}
            </Typography>
          </Paper>
        ))}
      </Box>
      </>
      )}

      {/* Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle className="font-light tracking-wide">
          {editMode ? 'Editar Artista' : 'Nuevo Artista'}
        </DialogTitle>
        <DialogContent>
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <TextField
              label="Nombres"
              value={currentArtista.nombres}
              onChange={(e) => handleChange('nombres', e.target.value)}
              fullWidth
              variant="standard"
            />
            <TextField
              label="Apellidos"
              value={currentArtista.apellidos}
              onChange={(e) => handleChange('apellidos', e.target.value)}
              fullWidth
              variant="standard"
            />
            <TextField
              label="Nacionalidad"
              value={currentArtista.nacionalidad}
              onChange={(e) => handleChange('nacionalidad', e.target.value)}
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
              label="URL de Foto"
              value={currentArtista.foto_url}
              onChange={(e) => handleChange('foto_url', e.target.value)}
              fullWidth
              variant="standard"
              className="md:col-span-2"
            />
            <Box className="md:col-span-2">
              <Typography variant="caption" className="text-gray-600 mb-2 block">
                Géneros Artísticos
              </Typography>
              <Box className="flex flex-wrap gap-2">
                {generos.map((genero) => (
                  <Chip
                    key={genero.genero_id}
                    label={genero.nombre}
                    onClick={() => {
                      const isSelected = currentArtista.genero_ids.includes(genero.genero_id);
                      handleChange(
                        'genero_ids',
                        isSelected
                          ? currentArtista.genero_ids.filter(id => id !== genero.genero_id)
                          : [...currentArtista.genero_ids, genero.genero_id]
                      );
                    }}
                    color={currentArtista.genero_ids.includes(genero.genero_id) ? "primary" : "default"}
                    sx={{ 
                      borderRadius: 0,
                      cursor: 'pointer',
                      backgroundColor: currentArtista.genero_ids.includes(genero.genero_id) ? '#000' : '#f5f5f5',
                      color: currentArtista.genero_ids.includes(genero.genero_id) ? '#fff' : '#666',
                      '&:hover': {
                        backgroundColor: currentArtista.genero_ids.includes(genero.genero_id) ? '#1a1a1a' : '#e0e0e0',
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
            <TextField
              label="Biografía"
              value={currentArtista.biografia}
              onChange={(e) => handleChange('biografia', e.target.value)}
              fullWidth
              multiline
              rows={4}
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

      {/* Modal de Foto */}
      <Dialog 
        open={fotoModal.open} 
        onClose={() => setFotoModal({ open: false, url: '', nombre: '' })}
        maxWidth="lg"
        PaperProps={{
          sx: { borderRadius: 0, m: 2 }
        }}
      >
        <DialogTitle className="font-light tracking-wide flex justify-between items-center border-b">
          {fotoModal.nombre}
          <IconButton onClick={() => setFotoModal({ open: false, url: '', nombre: '' })} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5' }}>
          <img 
            src={fotoModal.url} 
            alt={fotoModal.nombre}
            style={{ maxWidth: '100%', maxHeight: '65vh', width: 'auto', height: 'auto', objectFit: 'contain' }}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmación de Eliminación */}
      <ConfirmDeleteDialog
        open={deleteDialog.open}
        onClose={handleDeleteClose}
        onConfirm={handleConfirm}
        title={deleteDialog.title}
        message={deleteDialog.message}
        itemName={deleteDialog.itemName}
      />
    </Box>
  );
};

export default ArtistasContent;
