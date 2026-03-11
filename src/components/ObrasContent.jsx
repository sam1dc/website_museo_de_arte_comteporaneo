import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, FormControl, InputLabel, Select, MenuItem, CircularProgress, Alert, Avatar, Tooltip } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Image as ImageIcon, Close as CloseIcon } from '@mui/icons-material';
import { obrasAdminService, artistasAdminService, generosAdminService } from '../services';

const ObrasContent = () => {
  const [obras, setObras] = useState([]);
  const [artistas, setArtistas] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [fotoModal, setFotoModal] = useState({ open: false, url: '', nombre: '' });
  const cargadoRef = useRef(false);
  const [currentObra, setCurrentObra] = useState({
    nombre: '',
    artista_id: '',
    genero_id: '',
    precio_usd: '',
    fecha_creacion: '',
    estatus: 'DISPONIBLE',
    descripcion: '',
    foto_url: '',
    tipo: ''
  });

  const estatusOptions = ['DISPONIBLE', 'RESERVADA', 'VENDIDA'];
  const tipoOptions = [
    { value: '', label: 'Sin especificar' },
    { value: 'pintura', label: 'Pintura' },
    { value: 'escultura', label: 'Escultura' },
    { value: 'fotografia', label: 'Fotografía' },
    { value: 'orfebreria', label: 'Orfebrería' },
    { value: 'ceramica', label: 'Cerámica' }
  ];

  useEffect(() => {
    if (cargadoRef.current) return;
    cargadoRef.current = true;

    const cargarDatos = async () => {
      try {
        setCargando(true);
        const [obrasData, artistasData, generosData] = await Promise.all([
          obrasAdminService.obtenerTodos(),
          artistasAdminService.obtenerTodos(),
          generosAdminService.obtenerTodos()
        ]);
        setObras(obrasData);
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

  const handleOpen = (obra = null) => {
    if (obra) {
      setCurrentObra({
        ...obra,
        fecha_creacion: obra.fecha_creacion ? obra.fecha_creacion.split('T')[0] : ''
      });
      setEditMode(true);
    } else {
      setCurrentObra({
        nombre: '',
        artista_id: '',
        genero_id: '',
        precio_usd: '',
        fecha_creacion: '',
        estatus: 'DISPONIBLE',
        descripcion: '',
        foto_url: '',
        tipo: ''
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
        await obrasAdminService.actualizar(currentObra.obra_id, currentObra);
        const obrasData = await obrasAdminService.obtenerTodos();
        setObras(obrasData);
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
        setObras(obras.filter(o => o.obra_id !== id));
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
    switch (estatus?.toUpperCase()) {
      case 'DISPONIBLE': return { bg: '#e8f5e9', color: '#2e7d32' };
      case 'RESERVADA': return { bg: '#fff3e0', color: '#e65100' };
      case 'VENDIDA': return { bg: '#ffebee', color: '#c62828' };
      default: return { bg: '#f5f5f5', color: '#666' };
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
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Foto</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Obra</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Artista</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Género</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Tipo</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Precio</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Fecha Creación</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Estatus</TableCell>
              <TableCell align="right" sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {obras.map((obra) => {
              const estatusStyle = getEstatusColor(obra.estatus);
              return (
                <TableRow key={obra.obra_id} hover>
                  <TableCell>
                    {obra.foto_url ? (
                      <Tooltip title="Ver foto">
                        <Avatar 
                          src={obra.foto_url} 
                          alt={obra.nombre}
                          sx={{ width: 40, height: 40, cursor: 'pointer' }}
                          onClick={() => setFotoModal({ open: true, url: obra.foto_url, nombre: obra.nombre })}
                        />
                      </Tooltip>
                    ) : (
                      <Avatar sx={{ width: 40, height: 40, bgcolor: '#e0e0e0' }}>
                        <ImageIcon sx={{ color: '#999' }} />
                      </Avatar>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography className="font-medium">{obra.nombre}</Typography>
                    {obra.descripcion && (
                      <Tooltip title={obra.descripcion}>
                        <Typography variant="caption" className="text-gray-500" sx={{ 
                          maxWidth: '150px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          display: 'block'
                        }}>
                          {obra.descripcion}
                        </Typography>
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell>{obra.artista?.nombre_completo || 'N/A'}</TableCell>
                  <TableCell>{obra.genero?.nombre || 'N/A'}</TableCell>
                  <TableCell>
                    {obra.tipo ? (
                      <Chip 
                        label={obra.tipo.charAt(0).toUpperCase() + obra.tipo.slice(1)} 
                        size="small"
                        sx={{ 
                          backgroundColor: '#f5f5f5',
                          color: '#666',
                          borderRadius: 0,
                          fontSize: '0.7rem',
                          letterSpacing: '0.05em'
                        }}
                      />
                    ) : 'N/A'}
                  </TableCell>
                  <TableCell>${parseFloat(obra.precio_usd || 0).toLocaleString()}</TableCell>
                  <TableCell>{obra.fecha_creacion ? new Date(obra.fecha_creacion).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={obra.estatus} 
                      size="small"
                      sx={{ 
                        backgroundColor: estatusStyle.bg,
                        color: estatusStyle.color,
                        borderRadius: 0,
                        textTransform: 'uppercase',
                        fontSize: '0.7rem',
                        letterSpacing: '0.05em'
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleOpen(obra)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(obra.obra_id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Vista Mobile */}
      <Box className="block md:hidden space-y-4">
        {obras.map((obra) => {
          const estatusStyle = getEstatusColor(obra.estatus);
          return (
            <Paper key={obra.obra_id} className="p-4 border border-gray-200" sx={{ boxShadow: 'none' }}>
              <Box className="flex gap-3 mb-3">
                {obra.foto_url ? (
                  <Avatar 
                    src={obra.foto_url} 
                    alt={obra.nombre}
                    sx={{ width: 60, height: 60, cursor: 'pointer' }}
                    onClick={() => setFotoModal({ open: true, url: obra.foto_url, nombre: obra.nombre })}
                  />
                ) : (
                  <Avatar sx={{ width: 60, height: 60, bgcolor: '#e0e0e0' }}>
                    <ImageIcon sx={{ color: '#999' }} />
                  </Avatar>
                )}
                <Box className="flex-1">
                  <Typography className="font-medium text-lg">{obra.nombre}</Typography>
                  <Typography variant="body2" className="text-gray-600">{obra.artista?.nombre_completo}</Typography>
                </Box>
                <Box>
                  <IconButton size="small" onClick={() => handleOpen(obra)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(obra.obra_id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
              <Box className="space-y-2">
                <Typography variant="body2" className="text-gray-600">
                  <span className="font-medium">Género:</span> {obra.genero?.nombre}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  <span className="font-medium">Precio:</span> ${parseFloat(obra.precio_usd || 0).toLocaleString()}
                </Typography>
                <Chip 
                  label={obra.estatus} 
                  size="small"
                  sx={{ 
                    backgroundColor: estatusStyle.bg,
                    color: estatusStyle.color,
                    borderRadius: 0,
                    textTransform: 'uppercase',
                    fontSize: '0.7rem',
                    letterSpacing: '0.05em'
                  }}
                />
              </Box>
            </Paper>
          );
        })}
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
              label="Nombre de la Obra"
              value={currentObra.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              fullWidth
              variant="standard"
              className="md:col-span-2"
            />
            <FormControl fullWidth variant="standard">
              <InputLabel>Artista</InputLabel>
              <Select
                value={currentObra.artista_id}
                onChange={(e) => handleChange('artista_id', e.target.value)}
                label="Artista"
              >
                {artistas.map((artista) => (
                  <MenuItem key={artista.artista_id} value={artista.artista_id}>
                    {artista.nombre_completo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth variant="standard">
              <InputLabel>Género</InputLabel>
              <Select
                value={currentObra.genero_id}
                onChange={(e) => handleChange('genero_id', e.target.value)}
                label="Género"
              >
                {generos.map((genero) => (
                  <MenuItem key={genero.genero_id} value={genero.genero_id}>
                    {genero.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Precio (USD)"
              type="number"
              value={currentObra.precio_usd}
              onChange={(e) => handleChange('precio_usd', e.target.value)}
              fullWidth
              variant="standard"
            />
            <TextField
              label="Fecha de Creación"
              type="date"
              value={currentObra.fecha_creacion}
              onChange={(e) => handleChange('fecha_creacion', e.target.value)}
              fullWidth
              variant="standard"
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth variant="standard">
              <InputLabel>Estatus</InputLabel>
              <Select
                value={currentObra.estatus}
                onChange={(e) => handleChange('estatus', e.target.value)}
                label="Estatus"
              >
                {estatusOptions.map((estatus) => (
                  <MenuItem key={estatus} value={estatus}>
                    {estatus}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth variant="standard">
              <InputLabel>Tipo de Obra</InputLabel>
              <Select
                value={currentObra.tipo || ''}
                onChange={(e) => handleChange('tipo', e.target.value)}
                label="Tipo de Obra"
              >
                {tipoOptions.map((tipo) => (
                  <MenuItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="URL de Foto"
              value={currentObra.foto_url}
              onChange={(e) => handleChange('foto_url', e.target.value)}
              fullWidth
              variant="standard"
              className="md:col-span-2"
            />
            <TextField
              label="Descripción"
              value={currentObra.descripcion}
              onChange={(e) => handleChange('descripcion', e.target.value)}
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
    </Box>
  );
};

export default ObrasContent;
