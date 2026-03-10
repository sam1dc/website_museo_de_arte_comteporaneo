import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Grid, Button, TextField, Paper, CircularProgress, Alert } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import { catalogoService, compraService } from '../services';

const CheckoutView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [obra, setObra] = useState(null);
  const [artista, setArtista] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);
  const [formaPago, setFormaPago] = useState('tarjeta');
  const [formData, setFormData] = useState({
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    pais: '',
    numeroTarjeta: '',
    fechaExpiracion: '',
    cvv: '',
    nombreTarjeta: '',
    codigoSeguridad: ''
  });
  const cargadoRef = useRef(false);
  const comprador = JSON.parse(localStorage.getItem('compradorAuth') || 'null');

  useEffect(() => {
    if (!comprador) {
      navigate('/login');
      return;
    }

    if (cargadoRef.current) return;
    cargadoRef.current = true;

    const cargarDatos = async () => {
      try {
        setCargando(true);
        const obraData = await catalogoService.obtenerObraDetalle(id);
        console.log('Obra data:', obraData);
        console.log('Estatus:', obraData.estatus);
        setObra(obraData);
        
        if (obraData.estatus && obraData.estatus.toUpperCase() !== 'DISPONIBLE') {
          setError('Obra no disponible');
        }
      } catch (err) {
        setError('Obra no encontrada');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [id, comprador, navigate]);

  const handleConfirmar = async () => {
    try {
      setEnviando(true);
      setError(null);

      const solicitud = {
        obra_id: obra.obra_id,
        comprador_id: comprador.data?.comprador_id || comprador.comprador_id,
        codigo_seguridad: formData.codigoSeguridad
      };

      const response = await compraService.crearSolicitud(solicitud);
      
      navigate('/museo-de-arte-contemporaneo/confirmacion', {
        state: { 
          obra, 
          total, 
          comisionMuseo, 
          precioBase, 
          solicitud: response 
        }
      });
    } catch (err) {
      setError(err.message || 'Error al procesar la compra');
      console.error(err);
    } finally {
      setEnviando(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (cargando) {
    return (
      <Container maxWidth="xl" className="py-16">
        <Box className="flex justify-center">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error && !obra) {
    return (
      <Container maxWidth="xl" className="py-16">
        <Box className="text-center">
          <Typography className="text-red-500 font-light tracking-wide mb-4">
            {error}
          </Typography>
          <Button onClick={() => navigate('/museo-de-arte-contemporaneo')}>
            Volver al catálogo
          </Button>
        </Box>
      </Container>
    );
  }

  if (!obra || (obra.estatus && obra.estatus.toUpperCase() !== 'DISPONIBLE')) {
    return (
      <Container maxWidth="xl" className="py-16">
        <Typography>Obra no disponible</Typography>
      </Container>
    );
  }

  const precioBase = parseFloat(obra.precio_usd || 0);
  const comisionMuseo = precioBase * (obra.artista?.porcentaje_comision || 0.07);
  const total = precioBase + comisionMuseo;

  const inputStyles = {
    '& .MuiInput-underline:before': { borderBottomColor: '#e5e5e5' },
    '& .MuiInput-underline:hover:before': { borderBottomColor: '#000' },
    '& .MuiInput-underline:after': { borderBottomColor: '#000' },
    '& .MuiInputLabel-root': { color: '#666', fontSize: '0.875rem', letterSpacing: '0.05em' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#000' },
  };

  return (
    <Container maxWidth="lg" className="py-16">
      {error && (
        <Alert severity="error" className="mb-6" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

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
                    name="numeroTarjeta"
                    value={formData.numeroTarjeta}
                    onChange={handleInputChange}
                    sx={inputStyles}
                  />
                  <Box className="grid grid-cols-2 gap-4">
                    <TextField
                      label="Fecha de Expiración"
                      variant="standard"
                      placeholder="MM/AA"
                      name="fechaExpiracion"
                      value={formData.fechaExpiracion}
                      onChange={handleInputChange}
                      sx={inputStyles}
                    />
                    <TextField
                      label="CVV"
                      variant="standard"
                      placeholder="123"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      sx={inputStyles}
                    />
                  </Box>
                  <TextField
                    label="Nombre en la Tarjeta"
                    variant="standard"
                    fullWidth
                    name="nombreTarjeta"
                    value={formData.nombreTarjeta}
                    onChange={handleInputChange}
                    sx={inputStyles}
                  />
                </>
              )}
              
              <TextField
                label="Código de Seguridad (6 dígitos)"
                variant="standard"
                fullWidth
                required
                name="codigoSeguridad"
                value={formData.codigoSeguridad}
                onChange={handleInputChange}
                placeholder="123456"
                helperText="Código de seguridad del comprador"
                inputProps={{ maxLength: 6 }}
                sx={inputStyles}
              />
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
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                sx={inputStyles}
              />
              <Box className="grid grid-cols-2 gap-4">
                <TextField
                  label="Ciudad"
                  variant="standard"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleInputChange}
                  sx={inputStyles}
                />
                <TextField
                  label="Código Postal"
                  variant="standard"
                  name="codigoPostal"
                  value={formData.codigoPostal}
                  onChange={handleInputChange}
                  sx={inputStyles}
                />
              </Box>
              <TextField
                label="País"
                variant="standard"
                fullWidth
                name="pais"
                value={formData.pais}
                onChange={handleInputChange}
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
                src={obra.foto_url}
                alt={obra.nombre}
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
                {obra.nombre}
              </Typography>
              <Typography 
                className="text-gray-600 font-light"
                sx={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}
              >
                {artista?.nombre_completo}
              </Typography>
            </Box>

            <Box className="border-t border-gray-200 pt-4 mb-4">
              <Box className="flex justify-between mb-2">
                <Typography className="text-gray-600 font-light text-sm">
                  Precio Obra
                </Typography>
                <Typography className="font-light text-sm">
                  ${precioBase.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
              </Box>
              <Box className="flex justify-between mb-4 pb-4 border-b border-gray-200">
                <Typography className="text-gray-600 font-light text-sm">
                  Comisión Museo ({((obra.artista?.porcentaje_comision || 0.07) * 100).toFixed(0)}%)
                </Typography>
                <Typography className="font-light text-sm">
                  ${comisionMuseo.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
              </Box>
              <Box className="flex justify-between">
                <Typography className="font-light uppercase" sx={{ letterSpacing: '0.1em' }}>
                  Total
                </Typography>
                <Typography className="font-light text-xl">
                  ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
              </Box>
              <Typography 
                className="text-gray-500 font-light mt-2"
                sx={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}
              >
                *IVA será calculado en la factura
              </Typography>
            </Box>

            <Button
              onClick={handleConfirmar}
              disabled={enviando}
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
              {enviando ? <CircularProgress size={20} color="inherit" /> : 'Confirmar Compra'}
            </Button>

            <Typography 
              className="text-gray-500 font-light text-center mt-4"
              sx={{ fontSize: '0.7rem', letterSpacing: '0.05em', lineHeight: 1.6 }}
            >
              La factura será generada por un administrador del museo una vez confirmada la compra.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckoutView;
