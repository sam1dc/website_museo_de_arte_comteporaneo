import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, FormControl, InputLabel, Select, MenuItem, CircularProgress, Alert, Avatar, Tooltip } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Image as ImageIcon, Close as CloseIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { obrasAdminService, artistasAdminService, generosAdminService } from '../services';

const ObrasContent = () => {
  const [obras, setObras] = useState([]);
  const [artistas, setArtistas] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [fotoModal, setFotoModal] = useState({ open: false, url: '', nombre: '' });
  const [detalleModal, setDetalleModal] = useState({ open: false, obra: null, loading: false });
  const cargadoRef = useRef(false);
  const [currentObra, setCurrentObra] = useState({
    nombre: '',
    artista_id: '',
    genero_id: '',
    precio_usd: '',
    fecha_creacion: '',
    estatus: 'DISPONIBLE',
    descripcion: '',
    foto_url: '',
    tipo: '',
    // Pintura
    tecnica: '',
    soporte: '',
    alto_cm: '',
    ancho_cm: '',
    // Escultura
    material: '',
    peso_kg: '',
    largo_cm: '',
    profundidad_cm: '',
    // Fotografía
    camara: '',
    lente: '',
    tipo_impresion: '',
    edicion: '',
    // Orfebrería
    metal_principal: '',
    pureza: '',
    piedras: '',
    peso_gramos: '',
    // Cerámica
    tipo_pasta: '',
    esmalte: '',
    temperatura_coccion_c: ''
  });

  const estatusOptions = ['DISPONIBLE', 'RESERVADA', 'VENDIDA'];
  const tipoOptions = [
    { value: '', label: 'Sin especificar' },
    { value: 'pintura', label: 'Pintura' },
    { value: 'escultura', label: 'Escultura' },
    { value: 'fotografia', label: 'Fotografía' },
    { value: 'orfebreria', label: 'Orfebrería' },
    { value: 'ceramica', label: 'Cerámica' }
  ];

  useEffect(() => {
    if (cargadoRef.current) return;
    cargadoRef.current = true;

    const cargarDatos = async () => {
      try {
        setCargando(true);
        const [obrasData, artistasData, generosData] = await Promise.all([
          obrasAdminService.obtenerTodos(),
          artistasAdminService.obtenerTodos(),
          generosAdminService.obtenerTodos()
        ]);
        setObras(obrasData);
        setArtistas(artistasData);
        setGeneros(generosData);
      } catch (err) {
        setError('Error al cargar los datos');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  const handleOpen = async (obra = null) => {
    if (obra) {
      // Abrir modal inmediatamente con datos básicos
      setCurrentObra({
        ...obra,
        fecha_creacion: obra.fecha_creacion ? obra.fecha_creacion.split('T')[0] : '',
        tipo: obra.tipo || '',
        tecnica: '',
        soporte: '',
        alto_cm: '',
        ancho_cm: '',
        material: '',
        peso_kg: '',
        largo_cm: '',
        profundidad_cm: '',
        camara: '',
        lente: '',
        tipo_impresion: '',
        edicion: '',
        metal_principal: '',
        pureza: '',
        piedras: '',
        peso_gramos: '',
        tipo_pasta: '',
        esmalte: '',
        temperatura_coccion_c: ''
      });
      setEditMode(true);
      setOpen(true);
      setCargandoDetalle(true);
      
      try {
        // Cargar detalle completo con subtipos en segundo plano
        const obraCompleta = await obrasAdminService.obtenerDetalle(obra.obra_id);
        
        setCurrentObra({
          ...obraCompleta,
          fecha_creacion: obraCompleta.fecha_creacion ? obraCompleta.fecha_creacion.split('T')[0] : '',
          tipo: obraCompleta.tipo || '',
          tecnica: obraCompleta.pintura?.tecnica || '',
          soporte: obraCompleta.pintura?.soporte || '',
          alto_cm: obraCompleta.pintura?.alto_cm || obraCompleta.escultura?.alto_cm || obraCompleta.fotografia?.alto_cm || obraCompleta.ceramica?.alto_cm || '',
          ancho_cm: obraCompleta.pintura?.ancho_cm || obraCompleta.escultura?.ancho_cm || obraCompleta.fotografia?.ancho_cm || obraCompleta.ceramica?.ancho_cm || '',
          material: obraCompleta.escultura?.material || '',
          peso_kg: obraCompleta.escultura?.peso_kg || '',
          largo_cm: obraCompleta.escultura?.largo_cm || obraCompleta.ceramica?.largo_cm || '',
          profundidad_cm: obraCompleta.escultura?.profundidad_cm || '',
          camara: obraCompleta.fotografia?.camara || '',
          lente: obraCompleta.fotografia?.lente || '',
          tipo_impresion: obraCompleta.fotografia?.tipo_impresion || '',
          edicion: obraCompleta.fotografia?.edicion || '',
          metal_principal: obraCompleta.orfebreria?.metal_principal || '',
          pureza: obraCompleta.orfebreria?.pureza || '',
          piedras: obraCompleta.orfebreria?.piedras || '',
          peso_gramos: obraCompleta.orfebreria?.peso_gramos || '',
          tipo_pasta: obraCompleta.ceramica?.tipo_pasta || '',
          esmalte: obraCompleta.ceramica?.esmalte || '',
          temperatura_coccion_c: obraCompleta.ceramica?.temperatura_coccion_c || ''
        });
      } catch (err) {
        console.error('Error al cargar detalle:', err);
      } finally {
        setCargandoDetalle(false);
      }
    } else {
      setCurrentObra({
        nombre: '',
        artista_id: '',
        genero_id: '',
        precio_usd: '',
        fecha_creacion: '',
        estatus: 'DISPONIBLE',
        descripcion: '',
        foto_url: '',
        tipo: '',
        tecnica: '',
        soporte: '',
        alto_cm: '',
        ancho_cm: '',
        material: '',
        peso_kg: '',
        largo_cm: '',
        profundidad_cm: '',
        camara: '',
        lente: '',
        tipo_impresion: '',
        edicion: '',
        metal_principal: '',
        pureza: '',
        piedras: '',
        peso_gramos: '',
        tipo_pasta: '',
        esmalte: '',
        temperatura_coccion_c: ''
      });
      setEditMode(false);
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    try {
      setEnviando(true);
      setError(null);

      // Preparar datos, convirtiendo strings vacíos a null
      const datosAEnviar = {
        ...currentObra,
        tipo: currentObra.tipo || null
      };

      if (editMode) {
        await obrasAdminService.actualizar(currentObra.obra_id, datosAEnviar);
      } else {
        await obrasAdminService.crear(datosAEnviar);
      }
      
      // Recargar todas las obras para obtener los datos completos del backend
      const obrasData = await obrasAdminService.obtenerTodos();
      setObras(obrasData);
      
      handleClose();
    } catch (err) {
      setError(err.message || 'Error al guardar la obra');
      console.error(err);
    } finally {
      setEnviando(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta obra?')) {
      try {
        await obrasAdminService.eliminar(id);
        setObras(obras.filter(o => o.obra_id !== id));
      } catch (err) {
        setError('Error al eliminar la obra');
        console.error(err);
      }
    }
  };

  const handleChange = (field, value) => {
    setCurrentObra({ ...currentObra, [field]: value });
  };

  const handleVerDetalle = async (obra) => {
    // Abrir modal inmediatamente con loading
    setDetalleModal({ open: true, obra: null, loading: true });
    
    try {
      const obraCompleta = await obrasAdminService.obtenerDetalle(obra.obra_id);
      setDetalleModal({ open: true, obra: obraCompleta, loading: false });
    } catch (err) {
      console.error('Error al cargar detalle:', err);
      setDetalleModal({ open: true, obra, loading: false });
    }
  };

  const getEstatusColor = (estatus) => {
    switch (estatus?.toUpperCase()) {
      case 'DISPONIBLE': return { bg: '#e8f5e9', color: '#2e7d32' };
      case 'RESERVADA': return { bg: '#fff3e0', color: '#e65100' };
      case 'VENDIDA': return { bg: '#ffebee', color: '#c62828' };
      default: return { bg: '#f5f5f5', color: '#666' };
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {error && (
        <Alert severity="error" className="mb-6" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4" sx={{ width: '100%' }}>
        <Box>
          <Typography variant="h4" className="font-light tracking-wide mb-2">
            Obras de Arte
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            Gestiona las obras en exposición
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
          Nueva Obra
        </Button>
      </Box>

      {cargando ? (
        <Box className="flex justify-center py-16">
          <CircularProgress />
        </Box>
      ) : (
      <>
      {/* Vista Desktop */}
      <TableContainer component={Paper} className="hidden md:block" sx={{ boxShadow: 'none', border: '1px solid #e5e5e5', width: '100%' }}>
        <Table sx={{ width: '100%' }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#fafafa' }}>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Foto</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Obra</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Artista</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Género</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Tipo</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Precio</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Fecha Creación</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Estatus</TableCell>
              <TableCell align="right" sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {obras.map((obra) => {
              const estatusStyle = getEstatusColor(obra.estatus);
              return (
                <TableRow key={obra.obra_id} hover>
                  <TableCell>
                    {obra.foto_url ? (
                      <Tooltip title="Ver foto">
                        <Avatar 
                          src={obra.foto_url} 
                          alt={obra.nombre}
                          sx={{ width: 40, height: 40, cursor: 'pointer' }}
                          onClick={() => setFotoModal({ open: true, url: obra.foto_url, nombre: obra.nombre })}
                        />
                      </Tooltip>
                    ) : (
                      <Avatar sx={{ width: 40, height: 40, bgcolor: '#e0e0e0' }}>
                        <ImageIcon sx={{ color: '#999' }} />
                      </Avatar>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography className="font-medium">{obra.nombre}</Typography>
                    {obra.descripcion && (
                      <Tooltip title={obra.descripcion}>
                        <Typography variant="caption" className="text-gray-500" sx={{ 
                          maxWidth: '150px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          display: 'block'
                        }}>
                          {obra.descripcion}
                        </Typography>
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell>{obra.artista?.nombre_completo || 'N/A'}</TableCell>
                  <TableCell>{obra.genero?.nombre || 'N/A'}</TableCell>
                  <TableCell>
                    {obra.tipo ? (
                      <Box className="flex items-center gap-2">
                        <Chip 
                          label={obra.tipo.charAt(0).toUpperCase() + obra.tipo.slice(1)} 
                          size="small"
                          sx={{ 
                            backgroundColor: '#f5f5f5',
                            color: '#666',
                            borderRadius: 0,
                            fontSize: '0.7rem',
                            letterSpacing: '0.05em'
                          }}
                        />
                        <Tooltip title="Ver detalles técnicos">
                          <IconButton 
                            size="small" 
                            onClick={() => handleVerDetalle(obra)}
                            sx={{ padding: '4px' }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    ) : 'N/A'}
                  </TableCell>
                  <TableCell>${parseFloat(obra.precio_usd || 0).toLocaleString()}</TableCell>
                  <TableCell>{obra.fecha_creacion ? new Date(obra.fecha_creacion).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={obra.estatus} 
                      size="small"
                      sx={{ 
                        backgroundColor: estatusStyle.bg,
                        color: estatusStyle.color,
                        borderRadius: 0,
                        textTransform: 'uppercase',
                        fontSize: '0.7rem',
                        letterSpacing: '0.05em'
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleOpen(obra)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(obra.obra_id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Vista Mobile */}
      <Box className="block md:hidden space-y-4">
        {obras.map((obra) => {
          const estatusStyle = getEstatusColor(obra.estatus);
          return (
            <Paper key={obra.obra_id} className="p-4 border border-gray-200" sx={{ boxShadow: 'none' }}>
              <Box className="flex gap-3 mb-3">
                {obra.foto_url ? (
                  <Avatar 
                    src={obra.foto_url} 
                    alt={obra.nombre}
                    sx={{ width: 60, height: 60, cursor: 'pointer' }}
                    onClick={() => setFotoModal({ open: true, url: obra.foto_url, nombre: obra.nombre })}
                  />
                ) : (
                  <Avatar sx={{ width: 60, height: 60, bgcolor: '#e0e0e0' }}>
                    <ImageIcon sx={{ color: '#999' }} />
                  </Avatar>
                )}
                <Box className="flex-1">
                  <Typography className="font-medium text-lg">{obra.nombre}</Typography>
                  <Typography variant="body2" className="text-gray-600">{obra.artista?.nombre_completo}</Typography>
                </Box>
                <Box>
                  <IconButton size="small" onClick={() => handleOpen(obra)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(obra.obra_id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
              <Box className="space-y-2">
                <Typography variant="body2" className="text-gray-600">
                  <span className="font-medium">Género:</span> {obra.genero?.nombre}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  <span className="font-medium">Precio:</span> ${parseFloat(obra.precio_usd || 0).toLocaleString()}
                </Typography>
                <Chip 
                  label={obra.estatus} 
                  size="small"
                  sx={{ 
                    backgroundColor: estatusStyle.bg,
                    color: estatusStyle.color,
                    borderRadius: 0,
                    textTransform: 'uppercase',
                    fontSize: '0.7rem',
                    letterSpacing: '0.05em'
                  }}
                />
              </Box>
            </Paper>
          );
        })}
      </Box>
      </>
      )}

      {/* Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle className="font-light tracking-wide">
          {editMode ? 'Editar Obra' : 'Nueva Obra'}
          {cargandoDetalle && <CircularProgress size={20} sx={{ ml: 2 }} />}
        </DialogTitle>
        <DialogContent>
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <TextField
              label="Nombre de la Obra"
              value={currentObra.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              fullWidth
              variant="standard"
              className="md:col-span-2"
            />
            <FormControl fullWidth variant="standard">
              <InputLabel>Artista</InputLabel>
              <Select
                value={currentObra.artista_id}
                onChange={(e) => handleChange('artista_id', e.target.value)}
                label="Artista"
              >
                {artistas.map((artista) => (
                  <MenuItem key={artista.artista_id} value={artista.artista_id}>
                    {artista.nombre_completo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth variant="standard">
              <InputLabel>Género</InputLabel>
              <Select
                value={currentObra.genero_id}
                onChange={(e) => handleChange('genero_id', e.target.value)}
                label="Género"
              >
                {generos.map((genero) => (
                  <MenuItem key={genero.genero_id} value={genero.genero_id}>
                    {genero.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Precio (USD)"
              type="number"
              value={currentObra.precio_usd}
              onChange={(e) => handleChange('precio_usd', e.target.value)}
              fullWidth
              variant="standard"
            />
            <TextField
              label="Fecha de Creación"
              type="date"
              value={currentObra.fecha_creacion}
              onChange={(e) => handleChange('fecha_creacion', e.target.value)}
              fullWidth
              variant="standard"
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth variant="standard">
              <InputLabel>Estatus</InputLabel>
              <Select
                value={currentObra.estatus}
                onChange={(e) => handleChange('estatus', e.target.value)}
                label="Estatus"
              >
                {estatusOptions.map((estatus) => (
                  <MenuItem key={estatus} value={estatus}>
                    {estatus}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth variant="standard">
              <InputLabel>Tipo de Obra</InputLabel>
              <Select
                value={currentObra.tipo || ''}
                onChange={(e) => handleChange('tipo', e.target.value)}
                label="Tipo de Obra"
              >
                {tipoOptions.map((tipo) => (
                  <MenuItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Campos específicos por tipo - justo después del tipo */}
            {!cargandoDetalle && currentObra.tipo === 'pintura' && (
              <>
                <TextField
                  label="Técnica"
                  value={currentObra.tecnica}
                  onChange={(e) => handleChange('tecnica', e.target.value)}
                  fullWidth
                  variant="standard"
                />
                <TextField
                  label="Soporte"
                  value={currentObra.soporte}
                  onChange={(e) => handleChange('soporte', e.target.value)}
                  fullWidth
                  variant="standard"
                />
                <TextField
                  label="Alto (cm)"
                  type="number"
                  value={currentObra.alto_cm}
                  onChange={(e) => handleChange('alto_cm', e.target.value)}
                  fullWidth
                  variant="standard"
                />
                <TextField
                  label="Ancho (cm)"
                  type="number"
                  value={currentObra.ancho_cm}
                  onChange={(e) => handleChange('ancho_cm', e.target.value)}
                  fullWidth
                  variant="standard"
                />
              </>
            )}

            {!cargandoDetalle && currentObra.tipo === 'escultura' && (
              <>
                <TextField
                  label="Material"
                  value={currentObra.material}
                  onChange={(e) => handleChange('material', e.target.value)}
                  fullWidth
                  variant="standard"
                />
                <TextField
                  label="Peso (kg)"
                  type="number"
                  value={currentObra.peso_kg}
                  onChange={(e) => handleChange('peso_kg', e.target.value)}
                  fullWidth
                  variant="standard"
                />
                <TextField
                  label="Alto (cm)"
                  type="number"
                  value={currentObra.alto_cm}
                  onChange={(e) => handleChange('alto_cm', e.target.value)}
                  fullWidth
                  variant="standard"
                />
                <TextField
                  label="Ancho (cm)"
                  type="number"
                  value={currentObra.ancho_cm}
                  onChange={(e) => handleChange('ancho_cm', e.target.value)}
                  fullWidth
                  variant="standard"
                />
                <TextField
                  label="Largo (cm)"
                  type="number"
                  value={currentObra.largo_cm}
                  onChange={(e) => handleChange('largo_cm', e.target.value)}
                  fullWidth
                  variant="standard"
                />
                <TextField
                  label="Profundidad (cm)"
                  type="number"
                  value={currentObra.profundidad_cm}
                  onChange={(e) => handleChange('profundidad_cm', e.target.value)}
                  fullWidth
                  variant="standard"
                />
              </>
            )}

            {!cargandoDetalle && currentObra.tipo === 'fotografia' && (
              <>
                <TextField
                  label="Cámara"
                  value={currentObra.camara}
                  onChange={(e) => handleChange('camara', e.target.value)}
                  fullWidth
                  variant="standard"
                />
                <TextField
                  label="Lente"
                  value={currentObra.lente}
                  onChange={(e) => handleChange('lente', e.target.value)}
                  fullWidth
                  variant="standard"
                />
                <TextField
                  label="Tipo de Impresión"
                  value={currentObra.tipo_impresion}
                  onChange={(e) => handleChange('tipo_impresion', e.target.value)}
                  fullWidth
                  variant="standard"
                />
                <TextField
                  label="Edición"
                  value={currentObra.edicion}
                  onChange={(e) => handleChange('edicion', e.target.value)}
                  fullWidth
                  variant="standard"
                />
                <TextField
                  label="Alto (cm)"
                  type="number"
                  value={currentObra.alto_cm}
                  onChange={(e) => handleChange('alto_cm', e.target.value)}
                  fullWidth
                  variant="standard"
                />
                <TextField
                  label="Ancho (cm)"
                  type="number"
                  value={currentObra.ancho_cm}
                  onChange={(e) => handleChange('ancho_cm', e.target.value)}
                  fullWidth
                  variant="standard"
                />
              </>
            )}

            {!cargandoDetalle && currentObra.tipo === 'orfebreria' && (
              <>
                <TextField
                  label="Metal Principal"
                  value={currentObra.metal_principal}
                  onChange={(e) => handleChange('metal_principal', e.target.value)}
                  fullWidth
                  variant="standard"
                />
                <TextField
                  label="Pureza"
                  value={currentObra.pureza}
                  onChange={(e) => handleChange('pureza', e.target.value)}
                  fullWidth
                  variant="standard"
                />
                <TextField
                  label="Piedras"
                  value={currentObra.piedras}
                  onChange={(e) => handleChange('piedras', e.target.value)}
                  fullWidth
                  variant="standard"
                  className="md:col-span-2"
                />
                <TextField
                  label="Peso (gramos)"
                  type="number"
                  value={currentObra.peso_gramos}
                  onChange={(e) => handleChange('peso_gramos', e.target.value)}
                  fullWidth
                  variant="standard"
                />
              </>
            )}

            {!cargandoDetalle && currentObra.tipo === 'ceramica' && (
              <>
                <TextField
                  label="Tipo de Pasta"
                  value={currentObra.tipo_pasta}
                  onChange={(e) => handleChange('tipo_pasta', e.target.value)}
                  fullWidth
                  variant="standard"
                />
                <TextField
                  label="Esmalte"
                  value={currentObra.esmalte}
                  onChange={(e) => handleChange('esmalte', e.target.value)}
                  fullWidth
                  variant="standard"
                />
                <TextField
                  label="Temperatura de Cocción (°C)"
                  type="number"
                  value={currentObra.temperatura_coccion_c}
                  onChange={(e) => handleChange('temperatura_coccion_c', e.target.value)}
                  fullWidth
                  variant="standard"
                />
                <TextField
                  label="Alto (cm)"
                  type="number"
                  value={currentObra.alto_cm}
                  onChange={(e) => handleChange('alto_cm', e.target.value)}
                  fullWidth
                  variant="standard"
                />
                <TextField
                  label="Ancho (cm)"
                  type="number"
                  value={currentObra.ancho_cm}
                  onChange={(e) => handleChange('ancho_cm', e.target.value)}
                  fullWidth
                  variant="standard"
                />
                <TextField
                  label="Largo (cm)"
                  type="number"
                  value={currentObra.largo_cm}
                  onChange={(e) => handleChange('largo_cm', e.target.value)}
                  fullWidth
                  variant="standard"
                />
              </>
            )}

            <TextField
              label="URL de Foto"
              value={currentObra.foto_url}
              onChange={(e) => handleChange('foto_url', e.target.value)}
              fullWidth
              variant="standard"
              className="md:col-span-2"
            />
            <TextField
              label="Descripción"
              value={currentObra.descripcion}
              onChange={(e) => handleChange('descripcion', e.target.value)}
              fullWidth
              multiline
              rows={4}
              variant="standard"
              className="md:col-span-2"
            />
          </Box>
        </DialogContent>
        <DialogActions className="p-6">
          <Button onClick={handleClose} sx={{ color: '#666' }}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={enviando}
            variant="contained"
            sx={{
              backgroundColor: '#000',
              color: '#fff',
              borderRadius: 0,
              '&:hover': { backgroundColor: '#1a1a1a' }
            }}
          >
            {enviando ? <CircularProgress size={20} color="inherit" /> : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Foto */}
      <Dialog 
        open={fotoModal.open} 
        onClose={() => setFotoModal({ open: false, url: '', nombre: '' })}
        maxWidth="lg"
        PaperProps={{
          sx: { borderRadius: 0, m: 2 }
        }}
      >
        <DialogTitle className="font-light tracking-wide flex justify-between items-center border-b">
          {fotoModal.nombre}
          <IconButton onClick={() => setFotoModal({ open: false, url: '', nombre: '' })} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5' }}>
          <img 
            src={fotoModal.url} 
            alt={fotoModal.nombre}
            style={{ maxWidth: '100%', maxHeight: '65vh', width: 'auto', height: 'auto', objectFit: 'contain' }}
          />
        </DialogContent>
      </Dialog>

      {/* Modal Detalles Técnicos */}
      <Dialog open={detalleModal.open} onClose={() => setDetalleModal({ open: false, obra: null, loading: false })} maxWidth="sm" fullWidth>
        <DialogTitle className="font-light tracking-wide flex justify-between items-center border-b">
          Detalles Técnicos
          <IconButton onClick={() => setDetalleModal({ open: false, obra: null, loading: false })} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className="mt-4">
          {detalleModal.loading ? (
            <Box className="flex justify-center py-8">
              <CircularProgress />
            </Box>
          ) : detalleModal.obra ? (
            <Box className="space-y-3">
              <Typography variant="h6" className="font-light mb-3">{detalleModal.obra.nombre}</Typography>
              
              {detalleModal.obra.tipo === 'pintura' && detalleModal.obra.pintura && (
                <>
                  {detalleModal.obra.pintura.tecnica && (
                    <Box><Typography variant="caption" className="text-gray-600">Técnica:</Typography><Typography>{detalleModal.obra.pintura.tecnica}</Typography></Box>
                  )}
                  {detalleModal.obra.pintura.soporte && (
                    <Box><Typography variant="caption" className="text-gray-600">Soporte:</Typography><Typography>{detalleModal.obra.pintura.soporte}</Typography></Box>
                  )}
                  {(detalleModal.obra.pintura.alto_cm || detalleModal.obra.pintura.ancho_cm) && (
                    <Box><Typography variant="caption" className="text-gray-600">Dimensiones:</Typography><Typography>{detalleModal.obra.pintura.alto_cm} x {detalleModal.obra.pintura.ancho_cm} cm</Typography></Box>
                  )}
                </>
              )}

              {detalleModal.obra.tipo === 'escultura' && detalleModal.obra.escultura && (
                <>
                  {detalleModal.obra.escultura.material && (
                    <Box><Typography variant="caption" className="text-gray-600">Material:</Typography><Typography>{detalleModal.obra.escultura.material}</Typography></Box>
                  )}
                  {detalleModal.obra.escultura.peso_kg && (
                    <Box><Typography variant="caption" className="text-gray-600">Peso:</Typography><Typography>{detalleModal.obra.escultura.peso_kg} kg</Typography></Box>
                  )}
                  {(detalleModal.obra.escultura.alto_cm || detalleModal.obra.escultura.ancho_cm || detalleModal.obra.escultura.largo_cm) && (
                    <Box><Typography variant="caption" className="text-gray-600">Dimensiones:</Typography><Typography>{detalleModal.obra.escultura.alto_cm} x {detalleModal.obra.escultura.ancho_cm} x {detalleModal.obra.escultura.largo_cm} cm</Typography></Box>
                  )}
                </>
              )}

              {detalleModal.obra.tipo === 'fotografia' && detalleModal.obra.fotografia && (
                <>
                  {detalleModal.obra.fotografia.camara && (
                    <Box><Typography variant="caption" className="text-gray-600">Cámara:</Typography><Typography>{detalleModal.obra.fotografia.camara}</Typography></Box>
                  )}
                  {detalleModal.obra.fotografia.lente && (
                    <Box><Typography variant="caption" className="text-gray-600">Lente:</Typography><Typography>{detalleModal.obra.fotografia.lente}</Typography></Box>
                  )}
                  {detalleModal.obra.fotografia.tipo_impresion && (
                    <Box><Typography variant="caption" className="text-gray-600">Tipo de Impresión:</Typography><Typography>{detalleModal.obra.fotografia.tipo_impresion}</Typography></Box>
                  )}
                  {detalleModal.obra.fotografia.edicion && (
                    <Box><Typography variant="caption" className="text-gray-600">Edición:</Typography><Typography>{detalleModal.obra.fotografia.edicion}</Typography></Box>
                  )}
                </>
              )}

              {detalleModal.obra.tipo === 'orfebreria' && detalleModal.obra.orfebreria && (
                <>
                  {detalleModal.obra.orfebreria.metal_principal && (
                    <Box><Typography variant="caption" className="text-gray-600">Metal Principal:</Typography><Typography>{detalleModal.obra.orfebreria.metal_principal}</Typography></Box>
                  )}
                  {detalleModal.obra.orfebreria.pureza && (
                    <Box><Typography variant="caption" className="text-gray-600">Pureza:</Typography><Typography>{detalleModal.obra.orfebreria.pureza}</Typography></Box>
                  )}
                  {detalleModal.obra.orfebreria.piedras && (
                    <Box><Typography variant="caption" className="text-gray-600">Piedras:</Typography><Typography>{detalleModal.obra.orfebreria.piedras}</Typography></Box>
                  )}
                  {detalleModal.obra.orfebreria.peso_gramos && (
                    <Box><Typography variant="caption" className="text-gray-600">Peso:</Typography><Typography>{detalleModal.obra.orfebreria.peso_gramos} g</Typography></Box>
                  )}
                </>
              )}

              {detalleModal.obra.tipo === 'ceramica' && detalleModal.obra.ceramica && (
                <>
                  {detalleModal.obra.ceramica.tipo_pasta && (
                    <Box><Typography variant="caption" className="text-gray-600">Tipo de Pasta:</Typography><Typography>{detalleModal.obra.ceramica.tipo_pasta}</Typography></Box>
                  )}
                  {detalleModal.obra.ceramica.esmalte && (
                    <Box><Typography variant="caption" className="text-gray-600">Esmalte:</Typography><Typography>{detalleModal.obra.ceramica.esmalte}</Typography></Box>
                  )}
                  {detalleModal.obra.ceramica.temperatura_coccion_c && (
                    <Box><Typography variant="caption" className="text-gray-600">Temperatura de Cocción:</Typography><Typography>{detalleModal.obra.ceramica.temperatura_coccion_c}°C</Typography></Box>
                  )}
                </>
              )}

              {!detalleModal.obra.tipo && (
                <Typography variant="body2" className="text-gray-500">No hay detalles técnicos disponibles</Typography>
              )}
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions className="p-4 border-t">
          <Button onClick={() => setDetalleModal({ open: false, obra: null, loading: false })} sx={{ borderRadius: 0 }}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ObrasContent;
