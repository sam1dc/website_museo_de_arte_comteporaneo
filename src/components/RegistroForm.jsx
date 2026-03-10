import { useState } from 'react';
import { Box, TextField, Button, Alert, Typography, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Stepper, Step, StepLabel } from '@mui/material';
import useForm from '../hooks/useForm';

const RegistroForm = ({ onSubmit }) => {
  const [error, setError] = useState('');
  const [paso, setPaso] = useState(0);
  const [membresia, setMembresia] = useState('ninguna');
  const { values, handleChange } = useForm({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    pais: '',
    password: '',
    confirmPassword: '',
    tarjeta_titular: '',
    tarjeta_ultimos4: '',
    tarjeta_marca: '',
    tarjeta_exp_mes: '',
    tarjeta_exp_anio: ''
  });

  const pasos = ['Información Personal', 'Membresía', 'Datos de Pago'];

  const handleSiguiente = () => {
    setError('');
    
    // Validar paso 1
    if (paso === 0) {
      if (!values.nombre || !values.apellido || !values.email || !values.telefono || 
          !values.direccion || !values.ciudad || !values.pais || !values.password || !values.confirmPassword) {
        setError('Por favor completa todos los campos');
        return;
      }
      if (values.password !== values.confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
      }
      if (values.password.length < 8) {
        setError('La contraseña debe tener al menos 8 caracteres');
        return;
      }
    }

    // Validar paso 2 (si eligió membresía, ir a paso 3, sino enviar)
    if (paso === 1) {
      if (membresia === 'ninguna') {
        handleSubmitFinal();
        return;
      }
    }

    // Validar paso 3
    if (paso === 2) {
      if (!values.tarjeta_titular || !values.tarjeta_ultimos4 || !values.tarjeta_exp_mes || !values.tarjeta_exp_anio) {
        setError('Por favor completa los datos de la tarjeta');
        return;
      }
      if (values.tarjeta_ultimos4.length !== 4) {
        setError('Los últimos 4 dígitos deben ser exactamente 4 números');
        return;
      }
      handleSubmitFinal();
      return;
    }

    setPaso(paso + 1);
  };

  const handleAtras = () => {
    setError('');
    setPaso(paso - 1);
  };

  const handleSubmitFinal = () => {
    const datosRegistro = {
      nombre: values.nombre,
      apellido: values.apellido,
      email: values.email,
      telefono: values.telefono,
      direccion: values.direccion,
      ciudad: values.ciudad,
      pais: values.pais,
      password: values.password,
      membresia: membresia
    };

    if (membresia !== 'ninguna') {
      datosRegistro.tarjeta_titular = values.tarjeta_titular;
      datosRegistro.tarjeta_ultimos4 = values.tarjeta_ultimos4;
      datosRegistro.tarjeta_marca = values.tarjeta_marca;
      datosRegistro.tarjeta_exp_mes = parseInt(values.tarjeta_exp_mes);
      datosRegistro.tarjeta_exp_anio = parseInt(values.tarjeta_exp_anio);
    }

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
    <Box className="flex flex-col gap-6">
      {error && (
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Stepper */}
      <Stepper activeStep={paso} alternativeLabel sx={{ mb: 4 }}>
        {pasos.map((label, index) => {
          // Ocultar paso 3 si no hay membresía
          if (index === 2 && membresia === 'ninguna') return null;
          return (
            <Step key={label}>
              <StepLabel sx={{
                '& .MuiStepLabel-label': { fontSize: '0.75rem', letterSpacing: '0.05em' }
              }}>
                {label}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>

      {/* Paso 1: Información Personal */}
      {paso === 0 && (
        <Box className="flex flex-col gap-6">
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
        </Box>
      )}

      {/* Paso 2: Membresía */}
      {paso === 1 && (
        <Box>
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend" sx={{ color: '#000', fontSize: '0.875rem', letterSpacing: '0.05em', mb: 3 }}>
              Selecciona tu Membresía
            </FormLabel>
            <RadioGroup value={membresia} onChange={(e) => setMembresia(e.target.value)}>
              <Box className="space-y-3">
                <Box className="border p-4 hover:border-black transition-colors cursor-pointer" onClick={() => setMembresia('ninguna')}>
                  <FormControlLabel 
                    value="ninguna" 
                    control={<Radio sx={{ color: '#666', '&.Mui-checked': { color: '#000' } }} />} 
                    label={
                      <Box>
                        <Typography sx={{ fontSize: '0.875rem', letterSpacing: '0.05em', fontWeight: 500 }}>
                          Sin Membresía
                        </Typography>
                        <Typography variant="caption" className="text-gray-600">
                          Acceso básico al catálogo
                        </Typography>
                      </Box>
                    }
                  />
                </Box>

                <Box className="border p-4 hover:border-black transition-colors cursor-pointer" onClick={() => setMembresia('basica')}>
                  <FormControlLabel 
                    value="basica" 
                    control={<Radio sx={{ color: '#666', '&.Mui-checked': { color: '#000' } }} />} 
                    label={
                      <Box>
                        <Typography sx={{ fontSize: '0.875rem', letterSpacing: '0.05em', fontWeight: 500 }}>
                          Membresía Básica - $10 USD
                        </Typography>
                        <Typography variant="caption" className="text-gray-600">
                          Código de seguridad + Beneficios exclusivos
                        </Typography>
                      </Box>
                    }
                  />
                </Box>

                <Box className="border p-4 hover:border-black transition-colors cursor-pointer" onClick={() => setMembresia('premium')}>
                  <FormControlLabel 
                    value="premium" 
                    control={<Radio sx={{ color: '#666', '&.Mui-checked': { color: '#000' } }} />} 
                    label={
                      <Box>
                        <Typography sx={{ fontSize: '0.875rem', letterSpacing: '0.05em', fontWeight: 500 }}>
                          Membresía Premium - $10 USD
                        </Typography>
                        <Typography variant="caption" className="text-gray-600">
                          Todos los beneficios + Acceso prioritario
                        </Typography>
                      </Box>
                    }
                  />
                </Box>
              </Box>
            </RadioGroup>
          </FormControl>

          {membresia !== 'ninguna' && (
            <Alert severity="info" sx={{ mt: 3 }}>
              Se realizará un cargo de $10 USD. Recibirás tu código de seguridad por correo electrónico.
            </Alert>
          )}
        </Box>
      )}

      {/* Paso 3: Datos de Pago */}
      {paso === 2 && membresia !== 'ninguna' && (
        <Box className="flex flex-col gap-6">
          <Typography variant="h6" className="font-light tracking-wide mb-2" sx={{ fontSize: '1rem', letterSpacing: '0.1em' }}>
            Datos de Pago
          </Typography>
          
          <TextField
            label="Titular de la Tarjeta"
            name="tarjeta_titular"
            value={values.tarjeta_titular}
            onChange={handleChange}
            required
            fullWidth
            variant="standard"
            sx={inputStyles}
          />

          <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField
              label="Últimos 4 dígitos"
              name="tarjeta_ultimos4"
              value={values.tarjeta_ultimos4}
              onChange={handleChange}
              required
              inputProps={{ maxLength: 4, pattern: '[0-9]{4}' }}
              fullWidth
              variant="standard"
              sx={inputStyles}
              placeholder="1234"
            />
            <TextField
              label="Marca (Visa, Mastercard, etc.)"
              name="tarjeta_marca"
              value={values.tarjeta_marca}
              onChange={handleChange}
              fullWidth
              variant="standard"
              sx={inputStyles}
            />
          </Box>

          <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField
              label="Mes de Vencimiento"
              name="tarjeta_exp_mes"
              value={values.tarjeta_exp_mes}
              onChange={handleChange}
              required
              type="number"
              inputProps={{ min: 1, max: 12 }}
              fullWidth
              variant="standard"
              sx={inputStyles}
              placeholder="12"
            />
            <TextField
              label="Año de Vencimiento"
              name="tarjeta_exp_anio"
              value={values.tarjeta_exp_anio}
              onChange={handleChange}
              required
              type="number"
              inputProps={{ min: new Date().getFullYear(), max: new Date().getFullYear() + 20 }}
              fullWidth
              variant="standard"
              sx={inputStyles}
              placeholder={new Date().getFullYear().toString()}
            />
          </Box>
        </Box>
      )}

      {/* Botones de navegación */}
      <Box className="flex gap-4 mt-4">
        {paso > 0 && (
          <Button
            onClick={handleAtras}
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
          {paso === 2 ? 'Finalizar Registro' : 
           paso === 1 && membresia === 'ninguna' ? 'Registrarse' : 
           'Siguiente'}
        </Button>
      </Box>
    </Box>
  );
};

export default RegistroForm;
