import { TextField, Button, Box, Link, Alert } from '@mui/material';
import useForm from '../hooks/useForm';

const LoginForm = ({ onSubmit, error }) => {
  const { values, handleChange } = useForm({
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className="flex flex-col gap-8">
      <TextField
        label="Email"
        type="email"
        name="email"
        value={values.email}
        onChange={handleChange}
        required
        fullWidth
        variant="standard"
        sx={{
          '& .MuiInput-underline:before': { borderBottomColor: '#e5e5e5' },
          '& .MuiInput-underline:hover:before': { borderBottomColor: '#000' },
          '& .MuiInput-underline:after': { borderBottomColor: '#000' },
          '& .MuiInputLabel-root': { color: '#666', fontSize: '0.875rem', letterSpacing: '0.05em' },
          '& .MuiInputLabel-root.Mui-focused': { color: '#000' },
        }}
      />

      <TextField
        label="Contraseña"
        type="password"
        name="password"
        value={values.password}
        onChange={handleChange}
        required
        fullWidth
        variant="standard"
        sx={{
          '& .MuiInput-underline:before': { borderBottomColor: '#e5e5e5' },
          '& .MuiInput-underline:hover:before': { borderBottomColor: '#000' },
          '& .MuiInput-underline:after': { borderBottomColor: '#000' },
          '& .MuiInputLabel-root': { color: '#666', fontSize: '0.875rem', letterSpacing: '0.05em' },
          '& .MuiInputLabel-root.Mui-focused': { color: '#000' },
        }}
      />

      {error && <Alert severity="error" className="border-l-4 border-red-600">{error}</Alert>}

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
        Acceder
      </Button>

      <Link
        href="#"
        className="text-center text-xs tracking-wider"
        underline="hover"
        sx={{ 
          color: '#666',
          '&:hover': { color: '#000' },
          letterSpacing: '0.1em'
        }}
      >
        Recuperar contraseña
      </Link>
    </Box>
  );
};

export default LoginForm;
