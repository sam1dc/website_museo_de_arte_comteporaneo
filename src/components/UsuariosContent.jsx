import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, CircularProgress, Alert } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Lock as LockIcon } from '@mui/icons-material';
import { usuariosAdminService } from '../services';

const UsuariosContent = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const cargadoRef = useRef(false);
  const [currentUsuario, setCurrentUsuario] = useState({
    nombre: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    if (cargadoRef.current) return;
    cargadoRef.current = true;

    const cargarUsuarios = async () => {
      try {
        setCargando(true);
        const usuariosData = await usuariosAdminService.obtenerTodos();
        setUsuarios(usuariosData);
      } catch (err) {
        setError('Error al cargar los usuarios');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };

    cargarUsuarios();
  }, []);

  const handleOpen = (usuario = null) => {
    if (usuario) {
      setCurrentUsuario({ ...usuario, password: '' });
      setEditMode(true);
    } else {
      setCurrentUsuario({
        nombre: '',
        email: '',
        password: ''
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
        await usuariosAdminService.actualizar(currentUsuario.id, currentUsuario);
        setUsuarios(usuarios.map(u => u.id === currentUsuario.id ? currentUsuario : u));
      } else {
        const nuevoUsuario = await usuariosAdminService.crear(currentUsuario);
        setUsuarios([...usuarios, nuevoUsuario]);
      }
      handleClose();
    } catch (err) {
      setError(err.message || 'Error al guardar el usuario');
      console.error(err);
    } finally {
      setEnviando(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        await usuariosAdminService.eliminar(id);
        setUsuarios(usuarios.filter(u => u.id !== id));
      } catch (err) {
        setError('Error al eliminar el usuario');
        console.error(err);
      }
    }
  };

  const handleChange = (field, value) => {
    setCurrentUsuario({ ...currentUsuario, [field]: value });
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
            Usuarios Administradores
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            Gestiona los usuarios con acceso al sistema
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
          Nuevo Usuario
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
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Email</TableCell>
              <TableCell align="right" sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow key={usuario.id} hover>
                <TableCell>
                  <Typography className="font-medium">{usuario.nombre}</Typography>
                </TableCell>
                <TableCell>{usuario.email}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleOpen(usuario)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(usuario.id)}>
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
        {usuarios.map((usuario) => (
          <Paper key={usuario.id} className="p-4 border border-gray-200" sx={{ boxShadow: 'none' }}>
            <Box className="flex justify-between items-start mb-3">
              <Box>
                <Typography className="font-medium text-lg">{usuario.nombre}</Typography>
                <Typography variant="body2" className="text-gray-600">{usuario.email}</Typography>
              </Box>
              <Box>
                <IconButton size="small" onClick={() => handleOpen(usuario)}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => handleDelete(usuario.id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>
      </>
      )}

      {/* Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle className="font-light tracking-wide">
          {editMode ? 'Editar Usuario' : 'Nuevo Usuario'}
        </DialogTitle>
        <DialogContent>
          <Box className="flex flex-col gap-6 mt-4">
            <TextField
              label="Nombre Completo"
              value={currentUsuario.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              fullWidth
              variant="standard"
            />
            <TextField
              label="Email"
              type="email"
              value={currentUsuario.email}
              onChange={(e) => handleChange('email', e.target.value)}
              fullWidth
              variant="standard"
            />
            <TextField
              label={editMode ? 'Nueva Contraseña (dejar vacío para mantener)' : 'Contraseña'}
              type="password"
              value={currentUsuario.password}
              onChange={(e) => handleChange('password', e.target.value)}
              fullWidth
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

export default UsuariosContent;
