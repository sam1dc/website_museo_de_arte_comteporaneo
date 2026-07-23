import { useState } from 'react';
import { Box, TextField, Button, Alert, Typography, Stepper, Step, StepLabel } from '@mui/material';
import { authService } from '../services';

const RecuperarCodigoForm = ({ onSuccess, onCancel }) => {
  const [paso, setPaso] = useState(0);
  const [email, setEmail] = useState('');
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState(['', '', '']);
  const [enviado, setEnviado] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const inputStyles = {
    '& .MuiInput-underline:before': { borderBottomColor: '#e5e5e5' },
    '& .MuiInput-underline:hover:before': { borderBottomColor: '#000' },
    '& .MuiInput-underline:after': { borderBottomColor: '#000' },
    '& .MuiInputLabel-root': { color: '#666', fontSize: '0.875rem', letterSpacing: '0.05em' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#000' },
  };

  const handleSiguiente = async () => {
    setError('');
    
    if (paso === 0) {
      if (!email) {
        setError('Por favor ingresa tu email');
        return;
      }

      setCargando(true);
      try {
        const response = await authService.obtenerPreguntasSeguridad(email);
        
        if (response.data && response.data.length === 3) {
          setPreguntas(response.data);
          setPaso(1);
        } else {
          setError('No se encontraron preguntas de seguridad para este email');
        }
      } catch (err) {
        setError(err.message || 'Error al obtener las preguntas');
      } finally {
        setCargando(false);
      }
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (respuestas.some(r => !r.trim())) {
      setError('Por favor responde todas las preguntas');
      return;
    }

    setCargando(true);
    setError('');

    try {
      const data = await authService.recuperarCodigoSeguridad(email, respuestas);
      // Mostrar pantalla de éxito con el mensaje del servidor
      setEnviado(true);
      setMensajeExito(data.message || 'Si las respuestas son correctas, recibirás tu nuevo código de seguridad por correo.');
    } catch (err) {
      setError(err.message || 'Error al recuperar el código');
    } finally {
      setCargando(false);
    }
  };

  // Pantalla de éxito después de enviar
  if (enviado) {
    return (
      <Box className="flex flex-col gap-6 items-center text-center py-8">
        <Box className="w-16 h-16 rounded-full bg-black flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </Box>
        <Typography 
          variant="h6" 
          className="font-light tracking-wide"
          sx={{ letterSpacing: '0.1em' }}
        >
          Solicitud Enviada
        </Typography>
        <Typography 
          variant="body2" 
          className="text-gray-600 font-light leading-relaxed"
          sx={{ maxWidth: 400 }}
        >
          {mensajeExito}
        </Typography>
        <Box className="bg-gray-50 border border-gray-200 p-4 mt-2 w-full">
          <Typography 
            variant="caption" 
            className="text-gray-500 font-light block"
            sx={{ letterSpacing: '0.05em', lineHeight: 1.8 }}
          >
            📧 Revisa tu bandeja de entrada y también la carpeta de <strong>correo no deseado (spam)</strong>.
          </Typography>
          <Typography 
            variant="caption" 
            className="text-gray-500 font-light block mt-2"
            sx={{ letterSpacing: '0.05em', lineHeight: 1.8 }}
          >
            El código de seguridad tiene 6 dígitos y lo necesitarás al momento de confirmar la compra de una obra.
          </Typography>
        </Box>
        {onCancel && (
          <Button
            onClick={onCancel}
            variant="outlined"
            sx={{
              borderColor: '#000',
              color: '#000',
              padding: '12px 32px',
              fontSize: '0.875rem',
              letterSpacing: '0.15em',
              fontWeight: 300,
              borderRadius: 0,
              mt: 2,
              '&:hover': { 
                borderColor: '#000',
                backgroundColor: 'rgba(0,0,0,0.05)' 
              },
              textTransform: 'uppercase'
            }}
          >
            Cerrar
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Box className="flex flex-col gap-6">
      {error && (
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Stepper activeStep={paso} alternativeLabel sx={{ mb: 4 }}>
        <Step>
          <StepLabel sx={{ '& .MuiStepLabel-label': { fontSize: '0.75rem', letterSpacing: '0.05em' } }}>
            Email
          </StepLabel>
        </Step>
        <Step>
          <StepLabel sx={{ '& .MuiStepLabel-label': { fontSize: '0.75rem', letterSpacing: '0.05em' } }}>
            Preguntas de Seguridad
          </StepLabel>
        </Step>
      </Stepper>

      {paso === 0 && (
        <Box>
          <Typography variant="body2" className="text-gray-600 mb-4">
            Ingresa tu email para recuperar tu código de seguridad
          </Typography>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            variant="standard"
            sx={inputStyles}
          />
        </Box>
      )}

      {paso === 1 && (
        <Box className="flex flex-col gap-6">
          <Typography variant="body2" className="text-gray-600">
            Responde las siguientes preguntas de seguridad
          </Typography>
          {preguntas.map((item, index) => (
            <Box key={index}>
              <Typography variant="caption" className="text-gray-600 mb-2 block">
                {index + 1}. {item.pregunta}
              </Typography>
              <TextField
                value={respuestas[index]}
                onChange={(e) => {
                  const nuevas = [...respuestas];
                  nuevas[index] = e.target.value;
                  setRespuestas(nuevas);
                }}
                required
                fullWidth
                variant="standard"
                sx={inputStyles}
              />
            </Box>
          ))}
        </Box>
      )}

      <Box className="flex gap-4 mt-4">
        {paso > 0 && (
          <Button
            onClick={() => setPaso(0)}
            variant="outlined"
            sx={{
              borderColor: '#000',
              color: '#000',
              padding: '12px 32px',
              fontSize: '0.875rem',
              letterSpacing: '0.15em',
              fontWeight: 300,
              borderRadius: 0,
              '&:hover': { 
                borderColor: '#000',
                backgroundColor: 'rgba(0,0,0,0.05)' 
              },
              textTransform: 'uppercase'
            }}
          >
            Atrás
          </Button>
        )}
        
        <Button
          onClick={handleSiguiente}
          variant="contained"
          fullWidth
          disabled={cargando}
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
          {cargando ? 'Procesando...' : paso === 0 ? 'Siguiente' : 'Recuperar Código'}
        </Button>
      </Box>

      {onCancel && (
        <Button
          onClick={onCancel}
          sx={{
            color: '#666',
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          }}
        >
          Cancelar
        </Button>
      )}
    </Box>
  );
};

export default RecuperarCodigoForm;
