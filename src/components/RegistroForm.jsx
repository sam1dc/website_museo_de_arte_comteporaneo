import { useState } from 'react';
import { Box, TextField, Button, MenuItem, Alert } from '@mui/material';
import useForm from '../hooks/useForm';

const RegistroForm = ({ onSubmit }) => {
  const [error, setError] = useState('');
  const { values, handleChange } = useForm({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    pais: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (values.password !== values.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // Enviar solo los campos que el servidor espera
    const datosRegistro = {
      nombre: values.nombre,
      apellido: values.apellido,
      email: values.email,
      telefono: values.telefono,
      direccion: values.direccion,
      ciudad: values.ciudad,
      pais: values.pais,
      password: values.password
    };

    onSubmit(datosRegistro);
  };

  const inputStyles = {
    '& .MuiInput-underline:before': { borderBottomColor: '#e5e5e5' },
    '& .MuiInput-underline:hover:before': { borderBottomColor: '#000' },
    '& .MuiInput-underline:after': { borderBottomColor: '#000' },
    '& .MuiInputLabel-root': { color: '#666', fontSize: '0.875rem', letterSpacing: '0.05em' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#000' },
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextField
          label="Nombre"
          name="nombre"
          value={values.nombre}
          onChange={handleChange}
          required
          fullWidth
          variant="standard"
          sx={inputStyles}
        />
        <TextField
          label="Apellido"
          name="apellido"
          value={values.apellido}
          onChange={handleChange}
          required
          fullWidth
          variant="standard"
          sx={inputStyles}
        />
      </Box>

      <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextField
          label="Email"
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          required
          fullWidth
          variant="standard"
          sx={inputStyles}
        />
        <TextField
          label="Teléfono"
          name="telefono"
          value={values.telefono}
          onChange={handleChange}
          required
          fullWidth
          variant="standard"
          sx={inputStyles}
        />
      </Box>

      <TextField
        label="Dirección"
        name="direccion"
        value={values.direccion}
        onChange={handleChange}
        required
        fullWidth
        variant="standard"
        sx={inputStyles}
      />

      <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextField
          label="Ciudad"
          name="ciudad"
          value={values.ciudad}
          onChange={handleChange}
          required
          fullWidth
          variant="standard"
          sx={inputStyles}
        />
        <TextField
          label="País"
          name="pais"
          value={values.pais}
          onChange={handleChange}
          required
          fullWidth
          variant="standard"
          sx={inputStyles}
        />
      </Box>

      <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextField
          label="Contraseña"
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          required
          fullWidth
          variant="standard"
          sx={inputStyles}
        />
        <TextField
          label="Confirmar Contraseña"
          type="password"
          name="confirmPassword"
          value={values.confirmPassword}
          onChange={handleChange}
          required
          fullWidth
          variant="standard"
          sx={inputStyles}
        />
      </Box>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        className="mt-4"
        sx={{ 
          backgroundColor: '#000',
          color: '#fff',
          padding: '16px',
          fontSize: '0.875rem',
          letterSpacing: '0.15em',
          fontWeight: 300,
          borderRadius: 0,
          '&:hover': { backgroundColor: '#1a1a1a' },
          textTransform: 'uppercase'
        }}
      >
        Registrarse
      </Button>
    </Box>
  );
};

export default RegistroForm;
