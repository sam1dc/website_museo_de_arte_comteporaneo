import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert, Chip, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Tooltip } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Security as SecurityIcon } from '@mui/icons-material';
import { compradoresAdminService } from '../services';
import { useAuth } from '../hooks/useAuth';
import { PERMISOS } from '../utils/permissions';
import ProtectedAction from './ProtectedAction';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import { useConfirmDelete } from '../hooks/useConfirmDelete';

const CompradoresContent = () => {
  const { deleteDialog, confirmDelete, handleConfirm, handleClose: handleDeleteClose } = useConfirmDelete();
  const [compradores, setCompradores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [cargandoPreguntas, setCargandoPreguntas] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [preguntasOpen, setPreguntasOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const cargadoRef = useRef(false);
  const [currentComprador, setCurrentComprador] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    pais: '',
    username: '',
    password: '',
    es_miembro: false
  });
  const [preguntas, setPreguntas] = useState([
    { pregunta: '', respuesta: '' },
    { pregunta: '', respuesta: '' },
    { pregunta: '', respuesta: '' }
  ]);

  const preguntasDisponibles = [
    '¿Cuál es el nombre de tu primera mascota?',
    '¿En qué ciudad naciste?',
    '¿Cuál es tu comida favorita?',
    '¿Cuál es el nombre de tu mejor amigo de la infancia?',
    '¿Cuál es tu película favorita?',
    '¿Cuál es el nombre de tu escuela primaria?',
    '¿Cuál es tu color favorito?',
    '¿En qué calle vivías cuando eras niño?',
    '¿Cuál es el segundo nombre de tu madre?',
    '¿Cuál es tu libro favorito?'
  ];

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

  const handleOpen = (comprador = null) => {
    if (comprador) {
      setCurrentComprador({
        ...comprador,
        password: ''
      });
      setEditMode(true);
    } else {
      setCurrentComprador({
        nombres: '',
        apellidos: '',
        email: '',
        telefono: '',
        direccion: '',
        ciudad: '',
        pais: '',
        username: '',
        password: '',
        es_miembro: false
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
        await compradoresAdminService.actualizar(currentComprador.comprador_id, currentComprador);
        const compradoresData = await compradoresAdminService.obtenerTodos();
        setCompradores(compradoresData);
      } else {
        const nuevoComprador = await compradoresAdminService.crear(currentComprador);
        setCompradores([...compradores, nuevoComprador]);
      }
      handleClose();
    } catch (err) {
      setError(err.message || 'Error al guardar el comprador');
      console.error(err);
    } finally {
      setEnviando(false);
    }
  };

  const handleDelete = async (id) => {
    const comprador = compradores.find(c => c.comprador_id === id);
    confirmDelete({
      title: 'Eliminar Comprador',
      message: '¿Estás seguro de que deseas eliminar este comprador?',
      itemName: comprador?.nombre_completo,
      onConfirm: async () => {
        try {
          await compradoresAdminService.eliminar(id);
          setCompradores(compradores.filter(c => c.comprador_id !== id));
        } catch (err) {
          setError('Error al eliminar el comprador');
          console.error(err);
        }
      }
    });
  };

  const handleOpenPreguntas = async (comprador) => {
    setCurrentComprador(comprador);
    setPreguntasOpen(true);
    setCargandoPreguntas(true);
    
    try {
      const preguntasData = await compradoresAdminService.obtenerPreguntas(comprador.comprador_id);
      if (preguntasData && preguntasData.length === 3) {
        setPreguntas(preguntasData.map(p => ({ pregunta: p.pregunta, respuesta: '' })));
      } else {
        setPreguntas([
          { pregunta: '', respuesta: '' },
          { pregunta: '', respuesta: '' },
          { pregunta: '', respuesta: '' }
        ]);
      }
    } catch (err) {
      setPreguntas([
        { pregunta: '', respuesta: '' },
        { pregunta: '', respuesta: '' },
        { pregunta: '', respuesta: '' }
      ]);
    } finally {
      setCargandoPreguntas(false);
    }
  };

  const handleSavePreguntas = async () => {
    if (preguntas.some(p => !p.pregunta || !p.respuesta)) {
      setError('Por favor completa todas las preguntas y respuestas');
      return;
    }

    try {
      setEnviando(true);
      setError(null);
      await compradoresAdminService.actualizarPreguntas(currentComprador.comprador_id, preguntas);
      setPreguntasOpen(false);
    } catch (err) {
      setError(err.message || 'Error al actualizar las preguntas');
    } finally {
      setEnviando(false);
    }
  };

  const handleChange = (field, value) => {
    setCurrentComprador({ ...currentComprador, [field]: value });
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
            Compradores
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            Listado de compradores registrados
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
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Nombre Completo</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Teléfono</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Ubicación</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Membresía</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Compras</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Fecha Registro</TableCell>
              <TableCell align="right" sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(compradores) && compradores.map((comprador) => (
              <TableRow key={comprador.comprador_id} hover>
                <TableCell>
                  <Typography className="font-medium">{comprador.nombre_completo}</Typography>
                </TableCell>
                <TableCell>{comprador.email}</TableCell>
                <TableCell>{comprador.telefono || 'N/A'}</TableCell>
                <TableCell>
                  <Typography variant="body2">{comprador.ciudad}, {comprador.pais}</Typography>
                  {comprador.direccion && (
                    <Typography variant="caption" className="text-gray-500">{comprador.direccion}</Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={comprador.membresia || (comprador.es_miembro ? 'Activa' : 'Inactiva')}
                    size="small"
                    sx={{ 
                      backgroundColor: comprador.es_miembro ? '#e8f5e9' : '#f5f5f5',
                      color: comprador.es_miembro ? '#2e7d32' : '#666',
                      borderRadius: 0,
                      fontSize: '0.7rem',
                      letterSpacing: '0.05em'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={comprador.facturas_count || 0}
                    size="small"
                    sx={{ 
                      backgroundColor: '#f5f5f5',
                      color: '#666',
                      borderRadius: 0,
                      fontSize: '0.7rem'
                    }}
                  />
                </TableCell>
                <TableCell>{new Date(comprador.created_at).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Editar">
                    <IconButton size="small" onClick={() => handleOpen(comprador)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Preguntas de Seguridad">
                    <IconButton size="small" onClick={() => handleOpenPreguntas(comprador)}>
                      <SecurityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <ProtectedAction permiso={PERMISOS.GESTIONAR_COMPRADORES}>
                    <Tooltip title="Eliminar">
                      <IconButton size="small" onClick={() => handleDelete(comprador.comprador_id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </ProtectedAction>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Vista Mobile */}
      <Box className="block md:hidden space-y-4">
        {Array.isArray(compradores) && compradores.map((comprador) => (
          <Paper key={comprador.comprador_id} className="p-4 border border-gray-200" sx={{ boxShadow: 'none' }}>
            <Box className="flex justify-between items-start mb-2">
              <Typography className="font-medium text-lg">{comprador.nombre_completo}</Typography>
              <Box>
                <IconButton size="small" onClick={() => handleOpen(comprador)}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <ProtectedAction permiso={PERMISOS.GESTIONAR_COMPRADORES}>
                  <IconButton size="small" onClick={() => handleDelete(comprador.comprador_id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ProtectedAction>
              </Box>
            </Box>
            <Box className="space-y-1">
              <Typography variant="body2" className="text-gray-600">
                <span className="font-medium">Email:</span> {comprador.email}
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                <span className="font-medium">Teléfono:</span> {comprador.telefono || 'N/A'}
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                <span className="font-medium">Ubicación:</span> {comprador.ciudad}, {comprador.pais}
              </Typography>
              <Box className="flex gap-2 mt-2">
                <Chip 
                  label={comprador.membresia || (comprador.es_miembro ? 'Activa' : 'Inactiva')}
                  size="small"
                  sx={{ 
                    backgroundColor: comprador.es_miembro ? '#e8f5e9' : '#f5f5f5',
                    color: comprador.es_miembro ? '#2e7d32' : '#666',
                    borderRadius: 0,
                    fontSize: '0.7rem'
                  }}
                />
                <Chip 
                  label={`${comprador.facturas_count || 0} compras`}
                  size="small"
                  sx={{ 
                    backgroundColor: '#f5f5f5',
                    color: '#666',
                    borderRadius: 0,
                    fontSize: '0.7rem'
                  }}
                />
              </Box>
              <Typography variant="caption" className="text-gray-500 block mt-2">
                Registrado: {new Date(comprador.created_at).toLocaleDateString()}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Box>
      </>
      )}

      {/* Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle className="font-light tracking-wide">
          {editMode ? 'Editar Comprador' : 'Nuevo Comprador'}
        </DialogTitle>
        <DialogContent>
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <TextField
              label="Nombres"
              value={currentComprador.nombres}
              onChange={(e) => handleChange('nombres', e.target.value)}
              fullWidth
              variant="standard"
            />
            <TextField
              label="Apellidos"
              value={currentComprador.apellidos}
              onChange={(e) => handleChange('apellidos', e.target.value)}
              fullWidth
              variant="standard"
            />
            <TextField
              label="Email"
              type="email"
              value={currentComprador.email}
              onChange={(e) => handleChange('email', e.target.value)}
              fullWidth
              variant="standard"
            />
            <TextField
              label="Username"
              value={currentComprador.username}
              onChange={(e) => handleChange('username', e.target.value)}
              fullWidth
              variant="standard"
            />
            <TextField
              label="Teléfono"
              value={currentComprador.telefono}
              onChange={(e) => handleChange('telefono', e.target.value)}
              fullWidth
              variant="standard"
            />
            <TextField
              label={editMode ? 'Nueva Contraseña (dejar vacío para mantener)' : 'Contraseña'}
              type="password"
              value={currentComprador.password}
              onChange={(e) => handleChange('password', e.target.value)}
              fullWidth
              variant="standard"
            />
            <TextField
              label="Dirección"
              value={currentComprador.direccion}
              onChange={(e) => handleChange('direccion', e.target.value)}
              fullWidth
              variant="standard"
              className="md:col-span-2"
            />
            <TextField
              label="Ciudad"
              value={currentComprador.ciudad}
              onChange={(e) => handleChange('ciudad', e.target.value)}
              fullWidth
              variant="standard"
            />
            <TextField
              label="País"
              value={currentComprador.pais}
              onChange={(e) => handleChange('pais', e.target.value)}
              fullWidth
              variant="standard"
            />
            <FormControl fullWidth variant="standard" className="md:col-span-2">
              <InputLabel>Membresía</InputLabel>
              <Select
                value={currentComprador.es_miembro}
                onChange={(e) => handleChange('es_miembro', e.target.value)}
                label="Membresía"
              >
                <MenuItem value={false}>Inactiva</MenuItem>
                <MenuItem value={true}>Activa</MenuItem>
              </Select>
            </FormControl>
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

      {/* Modal Preguntas de Seguridad */}
      <Dialog open={preguntasOpen} onClose={() => setPreguntasOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle className="font-light tracking-wide border-b">
          Preguntas de Seguridad - {currentComprador.nombres} {currentComprador.apellidos}
        </DialogTitle>
        <DialogContent className="p-6">
          {cargandoPreguntas ? (
            <Box className="flex justify-center py-16">
              <CircularProgress />
            </Box>
          ) : (
            <Box className="flex flex-col gap-6 mt-4">
              {preguntas.map((item, index) => (
                <Box key={index} className="border p-4">
                  <Typography variant="caption" className="text-gray-600 uppercase tracking-wider text-xs mb-3 block">
                    Pregunta {index + 1}
                  </Typography>
                  <FormControl fullWidth variant="standard" sx={{ mb: 3 }}>
                    <InputLabel>Selecciona una pregunta</InputLabel>
                    <Select
                      value={item.pregunta}
                      onChange={(e) => {
                        const nuevas = [...preguntas];
                        nuevas[index].pregunta = e.target.value;
                        setPreguntas(nuevas);
                      }}
                    >
                      {preguntasDisponibles.map((pregunta, i) => (
                        <MenuItem key={i} value={pregunta}>{pregunta}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    label="Respuesta"
                    value={item.respuesta}
                    onChange={(e) => {
                      const nuevas = [...preguntas];
                      nuevas[index].respuesta = e.target.value;
                      setPreguntas(nuevas);
                    }}
                    required
                    fullWidth
                    variant="standard"
                  />
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions className="p-6">
          <Button onClick={() => setPreguntasOpen(false)} sx={{ color: '#666' }}>
            Cancelar
          </Button>
          <Button
            onClick={handleSavePreguntas}
            disabled={enviando || cargandoPreguntas}
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

export default CompradoresContent;
