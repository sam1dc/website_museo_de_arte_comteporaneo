import { useState } from 'react';
import { Box, Typography, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Lock as LockIcon } from '@mui/icons-material';

const UsuariosContent = () => {
  const [usuarios, setUsuarios] = useState([
    { 
      id: 1, 
      nombre: 'María González',
      email: 'maria.gonzalez@museo.com',
      rol: 'Administrador',
      fechaCreacion: '2024-01-10',
      activo: true
    },
    { 
      id: 2, 
      nombre: 'Carlos Ramírez',
      email: 'carlos.ramirez@museo.com',
      rol: 'Administrador',
      fechaCreacion: '2024-01-15',
      activo: true
    },
    { 
      id: 3, 
      nombre: 'Ana Torres',
      email: 'ana.torres@museo.com',
      rol: 'Administrador',
      fechaCreacion: '2024-02-01',
      activo: false
    }
  ]);

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUsuario, setCurrentUsuario] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'Administrador',
    activo: true
  });

  const handleOpen = (usuario = null) => {
    if (usuario) {
      setCurrentUsuario({ ...usuario, password: '' });
      setEditMode(true);
    } else {
      setCurrentUsuario({
        nombre: '',
        email: '',
        password: '',
        rol: 'Administrador',
        activo: true
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
      setUsuarios(usuarios.map(u => {
        if (u.id === currentUsuario.id) {
          // Si hay nueva contraseña, actualizar, si no, mantener la anterior
          return currentUsuario.password 
            ? currentUsuario 
            : { ...currentUsuario, password: u.password };
        }
        return u;
      }));
    } else {
      setUsuarios([...usuarios, { 
        ...currentUsuario, 
        id: Date.now(),
        fechaCreacion: new Date().toISOString().split('T')[0]
      }]);
    }
    handleClose();
  };

  const handleDelete = (id) => {
    setUsuarios(usuarios.filter(u => u.id !== id));
  };

  const handleChange = (field, value) => {
    setCurrentUsuario({ ...currentUsuario, [field]: value });
  };

  const toggleActivo = (id) => {
    setUsuarios(usuarios.map(u => 
      u.id === id ? { ...u, activo: !u.activo } : u
    ));
  };

  return (
    <Box sx={{ width: '100%' }}>
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

      {/* Vista Desktop */}
      <TableContainer component={Paper} className="hidden md:block" sx={{ boxShadow: 'none', border: '1px solid #e5e5e5', width: '100%' }}>
        <Table sx={{ width: '100%' }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#fafafa' }}>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Rol</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Fecha Creación</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Estado</TableCell>
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
                <TableCell>{usuario.rol}</TableCell>
                <TableCell>{new Date(usuario.fechaCreacion).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip 
                    label={usuario.activo ? 'Activo' : 'Inactivo'} 
                    color={usuario.activo ? 'success' : 'default'}
                    size="small"
                    sx={{ borderRadius: 0, cursor: 'pointer' }}
                    onClick={() => toggleActivo(usuario.id)}
                  />
                </TableCell>
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
            <Box className="space-y-2">
              <Typography variant="body2" className="text-gray-600">
                <span className="font-medium">Rol:</span> {usuario.rol}
              </Typography>
              <Chip 
                label={usuario.activo ? 'Activo' : 'Inactivo'} 
                color={usuario.activo ? 'success' : 'default'}
                size="small"
                sx={{ borderRadius: 0, cursor: 'pointer' }}
                onClick={() => toggleActivo(usuario.id)}
              />
            </Box>
          </Paper>
        ))}
      </Box>

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
              helperText={editMode ? 'Solo completa si deseas cambiar la contraseña' : 'Mínimo 6 caracteres'}
              InputProps={{
                startAdornment: <LockIcon className="mr-2 text-gray-400" fontSize="small" />
              }}
            />
            <TextField
              label="Rol"
              value={currentUsuario.rol}
              fullWidth
              variant="standard"
              disabled
              helperText="Todos los usuarios son administradores"
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

export default UsuariosContent;
