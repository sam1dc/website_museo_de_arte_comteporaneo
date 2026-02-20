import { useState } from 'react';
import { Box, Container, Typography, Alert } from '@mui/material';
import LoginForm from '../components/LoginForm';
import { useAuth } from '../hooks/useAuth';

const LoginView = () => {
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = (credentials) => {
    const success = login(credentials.email, credentials.password);
    if (!success) {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Fondo artístico */}
      <Box className="absolute inset-0 opacity-10">
        <Box className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        <Box className="absolute bottom-20 right-20 w-96 h-96 bg-gray-400 rounded-full blur-3xl" />
      </Box>

      <Container maxWidth="sm" className="relative z-10">
        <Box className="bg-white/95 backdrop-blur-sm p-16 border border-gray-100">
          <Box className="mb-12">
            <Typography 
              variant="h3" 
              className="font-extralight tracking-widest text-black mb-3 uppercase"
              sx={{ letterSpacing: '0.2em' }}
            >
              MAC
            </Typography>
            <Box className="w-16 h-px bg-black mb-6" />
            <Typography variant="body1" className="text-gray-700 font-light tracking-wide">
              Museo de Arte Contemporáneo
            </Typography>
          </Box>
          
          {error && (
            <Alert severity="error" className="mb-6" onClose={() => setError('')}>
              {error}
            </Alert>
          )}
          
          <LoginForm onSubmit={handleLogin} />
        </Box>
      </Container>
    </Box>
  );
};

export default LoginView;
