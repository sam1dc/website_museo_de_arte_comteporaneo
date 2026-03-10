import { useState } from 'react';
import { Box, Container, Typography, Alert, ToggleButtonGroup, ToggleButton, Link as MuiLink, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import RegistroForm from '../components/RegistroForm';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services';

const LoginView = () => {
  const [error, setError] = useState('');
  const [mode, setMode] = useState('login'); // 'login' o 'registro'
  const [cargando, setCargando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    try {
      setCargando(true);
      setError('');
      
      const response = await authService.login(credentials.email, credentials.password);
      
      // Actualizar el contexto de autenticación
      login(response);
      
      // Redirigir según el tipo de usuario
      if (response.tipo === 'admin' || response.tipo === 'empleado') {
        navigate('/');
      } else {
        navigate('/museo-de-arte-contemporaneo');
      }
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const handleRegistro = async (data) => {
    try {
      setCargando(true);
      setError('');
      
      const response = await authService.registro(data);
      
      // Actualizar el contexto de autenticación
      login(response);
      navigate('/museo-de-arte-contemporaneo');
    } catch (err) {
      setError(err.message || 'Error al registrarse');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden py-12">
      <Box className="absolute inset-0 opacity-10">
        <Box className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        <Box className="absolute bottom-20 right-20 w-96 h-96 bg-gray-400 rounded-full blur-3xl" />
      </Box>

      <Container maxWidth={mode === 'registro' ? 'md' : 'sm'} className="relative z-10 px-4">
        <Box className="bg-white/95 backdrop-blur-sm p-6 sm:p-12 md:p-16 border border-gray-100">
          <Box className="mb-8 sm:mb-12">
            <Typography 
              variant="h3" 
              className="font-extralight tracking-widest text-black mb-3 uppercase text-2xl sm:text-3xl"
              sx={{ letterSpacing: '0.2em' }}
            >
              MAC
            </Typography>
            <Box className="w-16 h-px bg-black mb-6" />
            <Typography variant="body1" className="text-gray-700 font-light tracking-wide">
              Museo de Arte Contemporáneo
            </Typography>
          </Box>

          {/* Toggle Login/Registro */}
          <Box className="flex justify-center mb-8">
            <ToggleButtonGroup
              value={mode}
              exclusive
              onChange={(e, newMode) => newMode && setMode(newMode)}
              sx={{
                '& .MuiToggleButton-root': {
                  border: 'none',
                  borderBottom: '2px solid transparent',
                  borderRadius: 0,
                  px: 3,
                  py: 1,
                  color: '#999',
                  fontSize: '0.875rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontWeight: 300,
                  '&.Mui-selected': {
                    backgroundColor: 'transparent',
                    borderBottom: '2px solid #000',
                    color: '#000',
                    '&:hover': {
                      backgroundColor: 'transparent',
                    }
                  },
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: '#666'
                  }
                }
              }}
            >
              <ToggleButton value="login">Acceder</ToggleButton>
              <ToggleButton value="registro">Registrarse</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {mode === 'login' && (
            <>
              {error && (
                <Alert severity="error" className="mb-6" onClose={() => setError('')}>
                  {error}
                </Alert>
              )}

              <LoginForm onSubmit={handleLogin} disabled={cargando} />

              {cargando && (
                <Box className="flex justify-center my-4">
                  <CircularProgress size={24} />
                </Box>
              )}

              <Box className="mt-6 text-center">
                <MuiLink
                  onClick={() => navigate('/museo-de-arte-contemporaneo')}
                  className="cursor-pointer text-xs tracking-wider"
                  underline="hover"
                  sx={{ 
                    color: '#999',
                    '&:hover': { color: '#666' },
                    letterSpacing: '0.1em'
                  }}
                >
                  Volver al catálogo
                </MuiLink>
              </Box>
            </>
          )}

          {mode === 'registro' && (
            <>
              {error && (
                <Alert severity="error" className="mb-6" onClose={() => setError('')}>
                  {error}
                </Alert>
              )}

              <RegistroForm onSubmit={handleRegistro} disabled={cargando} />
              
              {cargando && (
                <Box className="flex justify-center my-4">
                  <CircularProgress size={24} />
                </Box>
              )}
              
              <Box className="mt-6 text-center">
                <MuiLink
                  onClick={() => navigate('/museo-de-arte-contemporaneo')}
                  className="cursor-pointer text-xs tracking-wider"
                  underline="hover"
                  sx={{ 
                    color: '#999',
                    '&:hover': { color: '#666' },
                    letterSpacing: '0.1em'
                  }}
                >
                  Volver al catálogo
                </MuiLink>
              </Box>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default LoginView;
