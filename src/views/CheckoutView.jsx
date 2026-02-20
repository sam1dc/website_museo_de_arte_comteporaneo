import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Grid, Button, TextField, Paper } from '@mui/material';
import { useState } from 'react';
import { MOCK_OBRAS, MOCK_ARTISTAS } from '../utils/mockData';

const CheckoutView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const obra = MOCK_OBRAS.find(o => o.id === parseInt(id));
  const artista = obra ? MOCK_ARTISTAS.find(a => a.id === obra.artistaId) : null;
  const comprador = JSON.parse(localStorage.getItem('compradorAuth') || 'null');

  const [formaPago, setFormaPago] = useState('tarjeta');

  if (!comprador) {
    navigate('/login');
    return null;
  }

  if (!obra || obra.estatus !== 'disponible') {
    return (
      <Container maxWidth="xl" className="py-16">
        <Typography>Obra no disponible</Typography>
      </Container>
    );
  }

  const iva = obra.precio * 0.16;
  const total = obra.precio + iva;

  const handleConfirmar = () => {
    // Simular compra exitosa
    navigate('/museo-de-arte-contemporaneo/confirmacion', {
      state: { obra, total }
    });
  };

  const inputStyles = {
    '& .MuiInput-underline:before': { borderBottomColor: '#e5e5e5' },
    '& .MuiInput-underline:hover:before': { borderBottomColor: '#000' },
    '& .MuiInput-underline:after': { borderBottomColor: '#000' },
    '& .MuiInputLabel-root': { color: '#666', fontSize: '0.875rem', letterSpacing: '0.05em' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#000' },
  };

  return (
    <Container maxWidth="lg" className="py-16">
      <Button
        onClick={() => navigate(-1)}
        sx={{
          color: '#666',
          fontSize: '0.75rem',
          letterSpacing: '0.1em',
          fontWeight: 300,
          textTransform: 'uppercase',
          mb: 4,
          '&:hover': { backgroundColor: 'transparent', color: '#000' }
        }}
      >
        ← Volver
      </Button>

      <Typography 
        variant="h3" 
        className="font-extralight tracking-widest text-black mb-4 uppercase"
        sx={{ letterSpacing: '0.2em' }}
      >
        Checkout
      </Typography>
      <Box className="w-24 h-px bg-black mb-12" />

      <Grid container spacing={6}>
        <Grid item xs={12} md={7}>
          <Box className="mb-8">
            <Typography 
              variant="h6" 
              className="font-light tracking-wide mb-6 uppercase"
              sx={{ letterSpacing: '0.1em', fontSize: '1rem' }}
            >
              Información de Pago
            </Typography>

            <Box className="flex flex-col gap-6">
              <TextField
                select
                label="Forma de Pago"
                value={formaPago}
                onChange={(e) => setFormaPago(e.target.value)}
                variant="standard"
                fullWidth
                sx={inputStyles}
                SelectProps={{ native: true }}
              >
                <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                <option value="transferencia">Transferencia Bancaria</option>
              </TextField>

              {formaPago === 'tarjeta' && (
                <>
                  <TextField
                    label="Número de Tarjeta"
                    variant="standard"
                    fullWidth
                    placeholder="1234 5678 9012 3456"
                    sx={inputStyles}
                  />
                  <Box className="grid grid-cols-2 gap-4">
                    <TextField
                      label="Fecha de Expiración"
                      variant="standard"
                      placeholder="MM/AA"
                      sx={inputStyles}
                    />
                    <TextField
                      label="CVV"
                      variant="standard"
                      placeholder="123"
                      sx={inputStyles}
                    />
                  </Box>
                  <TextField
                    label="Nombre en la Tarjeta"
                    variant="standard"
                    fullWidth
                    sx={inputStyles}
                  />
                </>
              )}
            </Box>
          </Box>

          <Box>
            <Typography 
              variant="h6" 
              className="font-light tracking-wide mb-6 uppercase"
              sx={{ letterSpacing: '0.1em', fontSize: '1rem' }}
            >
              Dirección de Envío
            </Typography>

            <Box className="flex flex-col gap-6">
              <TextField
                label="Dirección"
                variant="standard"
                fullWidth
                sx={inputStyles}
              />
              <Box className="grid grid-cols-2 gap-4">
                <TextField
                  label="Ciudad"
                  variant="standard"
                  sx={inputStyles}
                />
                <TextField
                  label="Código Postal"
                  variant="standard"
                  sx={inputStyles}
                />
              </Box>
              <TextField
                label="País"
                variant="standard"
                fullWidth
                sx={inputStyles}
              />
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper 
            elevation={0}
            sx={{ 
              border: '1px solid #e5e5e5',
              borderRadius: 0,
              p: 4
            }}
          >
            <Typography 
              variant="h6" 
              className="font-light tracking-wide mb-6 uppercase"
              sx={{ letterSpacing: '0.1em', fontSize: '1rem' }}
            >
              Resumen de Compra
            </Typography>

            <Box className="mb-6">
              <Box
                component="img"
                src={obra.imagen}
                alt={obra.titulo}
                sx={{
                  width: '100%',
                  aspectRatio: '3/4',
                  objectFit: 'cover',
                  mb: 3
                }}
              />
              <Typography 
                className="font-light tracking-wide mb-1 uppercase"
                sx={{ fontSize: '0.875rem', letterSpacing: '0.1em' }}
              >
                {obra.titulo}
              </Typography>
              <Typography 
                className="text-gray-600 font-light"
                sx={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}
              >
                {artista?.nombre}
              </Typography>
            </Box>

            <Box className="border-t border-gray-200 pt-4 mb-4">
              <Box className="flex justify-between mb-2">
                <Typography className="text-gray-600 font-light text-sm">
                  Subtotal
                </Typography>
                <Typography className="font-light text-sm">
                  ${obra.precio.toLocaleString()}
                </Typography>
              </Box>
              <Box className="flex justify-between mb-4">
                <Typography className="text-gray-600 font-light text-sm">
                  IVA (16%)
                </Typography>
                <Typography className="font-light text-sm">
                  ${iva.toLocaleString()}
                </Typography>
              </Box>
              <Box className="flex justify-between border-t border-gray-200 pt-4">
                <Typography className="font-light uppercase" sx={{ letterSpacing: '0.1em' }}>
                  Total
                </Typography>
                <Typography className="font-light text-xl">
                  ${total.toLocaleString()}
                </Typography>
              </Box>
            </Box>

            <Button
              onClick={handleConfirmar}
              fullWidth
              variant="contained"
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
              Confirmar Compra
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckoutView;
