import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Grid, Button, TextField, Paper, CircularProgress, Alert } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import { catalogoService, compraService } from '../services';

const CheckoutView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [obra, setObra] = useState(null);
  const [artista, setArtista] = useState(null);
  const [tarjetasGuardadas, setTarjetasGuardadas] = useState([]);
  const [usarTarjetaGuardada, setUsarTarjetaGuardada] = useState(true);
  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState(null);
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

        // Cargar tarjetas guardadas del comprador
        console.log('Comprador:', comprador);
        
        if (comprador?.data?.tarjetas && comprador.data.tarjetas.length > 0) {
          console.log('Tarjetas desde localStorage (data):', comprador.data.tarjetas);
          setTarjetasGuardadas(comprador.data.tarjetas);
          setTarjetaSeleccionada(comprador.data.tarjetas[0].tarjeta_id);
        } else if (comprador?.tarjetas && comprador.tarjetas.length > 0) {
          console.log('Tarjetas desde localStorage (directo):', comprador.tarjetas);
          setTarjetasGuardadas(comprador.tarjetas);
          setTarjetaSeleccionada(comprador.tarjetas[0].tarjeta_id);
        } else {
          console.log('No hay tarjetas en localStorage, cargando desde backend...');
          // Si no hay tarjetas en localStorage, intentar cargar desde el backend
          try {
            const compradorId = comprador?.data?.comprador_id || comprador?.comprador_id;
            console.log('Comprador ID:', compradorId);
            
            if (compradorId) {
              const { compradoresAdminService } = await import('../services');
              const compradorData = await compradoresAdminService.obtenerDetalle(compradorId);
              console.log('Datos del comprador desde backend:', compradorData);
              
              if (compradorData.tarjetas && compradorData.tarjetas.length > 0) {
                console.log('Tarjetas encontradas:', compradorData.tarjetas);
                setTarjetasGuardadas(compradorData.tarjetas);
                setTarjetaSeleccionada(compradorData.tarjetas[0].tarjeta_id);
              } else {
                console.log('No hay tarjetas en el backend');
                setUsarTarjetaGuardada(false);
              }
            } else {
              console.log('No hay comprador ID');
              setUsarTarjetaGuardada(false);
            }
          } catch (err) {
            console.error('Error al cargar tarjetas:', err);
            setUsarTarjetaGuardada(false);
          }
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
          subtotal,
          iva,
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
  const subtotal = precioBase + comisionMuseo;
  const iva = subtotal * 0.13; // IVA 13%
  const total = subtotal + iva;

  const inputStyles = {
    '& .MuiInput-underline:before': { borderBottomColor: '#e5e5e5' },
    '& .MuiInput-underline:hover:before': { borderBottomColor: '#000' },
    '& .MuiInput-underline:after': { borderBottomColor: '#000' },
    '& .MuiInputLabel-root': { color: '#666', fontSize: '0.875rem', letterSpacing: '0.05em' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#000' },
  };

  return (
    <Container maxWidth="lg" className="py-8 md:py-16 px-4 md:px-6">
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
        sx={{ letterSpacing: '0.2em', fontSize: { xs: '1.75rem', md: '2.5rem' } }}
      >
        Checkout
      </Typography>
      <Box className="w-24 h-px bg-black mb-12" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div>
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
                  {tarjetasGuardadas.length > 0 && (
                    <Box className="mb-4">
                      <TextField
                        select
                        label="Usar tarjeta guardada"
                        value={usarTarjetaGuardada ? 'si' : 'no'}
                        onChange={(e) => setUsarTarjetaGuardada(e.target.value === 'si')}
                        variant="standard"
                        fullWidth
                        sx={inputStyles}
                        SelectProps={{ native: true }}
                      >
                        <option value="si">Sí, usar tarjeta guardada</option>
                        <option value="no">No, ingresar nueva tarjeta</option>
                      </TextField>
                    </Box>
                  )}

                  {usarTarjetaGuardada && tarjetasGuardadas.length > 0 ? (
                    <Box className="space-y-4">
                      {tarjetasGuardadas.map((tarjeta) => (
                        <Box
                          key={tarjeta.tarjeta_id}
                          onClick={() => setTarjetaSeleccionada(tarjeta.tarjeta_id)}
                          className={`border p-4 cursor-pointer transition-colors ${
                            tarjetaSeleccionada === tarjeta.tarjeta_id ? 'border-black bg-gray-50' : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <Box className="flex items-center justify-between">
                            <Box>
                              <Typography className="font-medium text-sm">
                                {tarjeta.marca || 'Tarjeta'} •••• {tarjeta.ultimos4}
                              </Typography>
                              <Typography variant="caption" className="text-gray-600">
                                {tarjeta.titular}
                              </Typography>
                              <Typography variant="caption" className="text-gray-500 block">
                                Vence: {tarjeta.exp_mes}/{tarjeta.exp_anio}
                              </Typography>
                            </Box>
                            {tarjetaSeleccionada === tarjeta.tarjeta_id && (
                              <Box className="w-5 h-5 rounded-full bg-black flex items-center justify-center">
                                <Box className="w-2 h-2 rounded-full bg-white" />
                              </Box>
                            )}
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  ) : (
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
        </div>

        <div>
          <Paper 
            elevation={0}
            sx={{ 
              border: '1px solid #e5e5e5',
              borderRadius: 0,
              p: 4
            }}
          >
            <Typography 
              variant="h5" 
              className="font-extralight tracking-widest mb-6 uppercase"
              sx={{ letterSpacing: '0.15em', fontSize: '1.25rem' }}
            >
              Resumen de Compra
            </Typography>
            <Box className="w-16 h-px bg-black mb-6" />

            <Box className="mb-6">
              <Box
                component="img"
                src={obra.foto_url}
                alt={obra.nombre}
                sx={{
                  width: '100%',
                  height: '250px',
                  objectFit: 'cover',
                  mb: 3,
                  border: '1px solid #e5e5e5'
                }}
              />
              <Typography 
                className="font-light tracking-wide mb-2 uppercase"
                sx={{ fontSize: '0.875rem', letterSpacing: '0.1em' }}
              >
                {obra.nombre}
              </Typography>
              <Typography 
                className="text-gray-600 font-light mb-1"
                sx={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}
              >
                {artista?.nombre_completo}
              </Typography>
              <Typography 
                className="text-gray-500 font-light capitalize"
                sx={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}
              >
                {obra.tipo}
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
              <Box className="flex justify-between mb-2">
                <Typography className="text-gray-600 font-light text-sm">
                  Comisión Museo ({((obra.artista?.porcentaje_comision || 0.07) * 100).toFixed(0)}%)
                </Typography>
                <Typography className="font-light text-sm">
                  ${comisionMuseo.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
              </Box>
              <Box className="flex justify-between mb-2 pb-2 border-b border-gray-200">
                <Typography className="text-gray-600 font-light text-sm">
                  Subtotal
                </Typography>
                <Typography className="font-light text-sm">
                  ${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
              </Box>
              <Box className="flex justify-between mb-4 pb-4 border-b border-gray-200">
                <Typography className="text-gray-600 font-light text-sm">
                  IVA (13%)
                </Typography>
                <Typography className="font-light text-sm">
                  ${iva.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
        </div>
      </div>
    </Container>
  );
};

export default CheckoutView;
