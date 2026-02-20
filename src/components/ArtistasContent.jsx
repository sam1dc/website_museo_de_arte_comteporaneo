import { useState } from 'react';
import { Box, Typography, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const ArtistasContent = () => {
  const [artistas, setArtistas] = useState([
    { 
      id: 1, 
      nombre: 'Pablo Picasso', 
      nacionalidad: 'Español',
      fechaNacimiento: '1881-10-25',
      biografia: 'Pintor y escultor español, creador del cubismo',
      generos: 'Pintura, Escultura'
    },
    { 
      id: 2, 
      nombre: 'Frida Kahlo', 
      nacionalidad: 'Mexicana',
      fechaNacimiento: '1907-07-06',
      biografia: 'Pintora mexicana conocida por sus autorretratos',
      generos: 'Pintura'
    },
    { 
      id: 3, 
      nombre: 'Auguste Rodin', 
      nacionalidad: 'Francés',
      fechaNacimiento: '1840-11-12',
      biografia: 'Escultor francés, considerado padre de la escultura moderna',
      generos: 'Escultura'
    }
  ]);

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentArtista, setCurrentArtista] = useState({
    nombre: '',
    nacionalidad: '',
    fechaNacimiento: '',
    biografia: '',
    generos: ''
  });

  const handleOpen = (artista = null) => {
    if (artista) {
      setCurrentArtista(artista);
      setEditMode(true);
    } else {
      setCurrentArtista({
        nombre: '',
        nacionalidad: '',
        fechaNacimiento: '',
        biografia: '',
        generos: ''
      });
      setEditMode(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentArtista({
      nombre: '',
      nacionalidad: '',
      fechaNacimiento: '',
      biografia: '',
      generos: ''
    });
  };

  const handleSave = () => {
    if (editMode) {
      setArtistas(artistas.map(a => a.id === currentArtista.id ? currentArtista : a));
    } else {
      setArtistas([...artistas, { ...currentArtista, id: Date.now() }]);
    }
    handleClose();
  };

  const handleDelete = (id) => {
    setArtistas(artistas.filter(a => a.id !== id));
  };

  const handleChange = (field, value) => {
    setCurrentArtista({ ...currentArtista, [field]: value });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4" sx={{ width: '100%' }}>
        <Box>
          <Typography variant="h4" className="font-light tracking-wide mb-2">
            Artistas
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            Gestiona los artistas y sus datos
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
          Nuevo Artista
        </Button>
      </Box>

      {/* Vista Desktop */}
      <TableContainer component={Paper} className="hidden md:block" sx={{ boxShadow: 'none', border: '1px solid #e5e5e5', width: '100%' }}>
        <Table sx={{ width: '100%' }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#fafafa' }}>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Nacionalidad</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Fecha Nacimiento</TableCell>
              <TableCell sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Géneros</TableCell>
              <TableCell align="right" sx={{ fontWeight: 500, letterSpacing: '0.05em' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {artistas.map((artista) => (
              <TableRow key={artista.id} hover>
                <TableCell>
                  <Typography className="font-medium">{artista.nombre}</Typography>
                </TableCell>
                <TableCell>{artista.nacionalidad}</TableCell>
                <TableCell>{new Date(artista.fechaNacimiento).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Typography variant="body2" className="text-gray-600">
                    {artista.generos}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleOpen(artista)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(artista.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Vista Mobile */}
      <Box className="block md:hidden space-y-4">
        {artistas.map((artista) => (
          <Paper key={artista.id} className="p-4 border border-gray-200" sx={{ boxShadow: 'none' }}>
            <Box className="flex justify-between items-start mb-3">
              <Box>
                <Typography className="font-medium text-lg">{artista.nombre}</Typography>
                <Typography variant="body2" className="text-gray-600">{artista.nacionalidad}</Typography>
              </Box>
              <Box>
                <IconButton size="small" onClick={() => handleOpen(artista)}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => handleDelete(artista.id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
            <Typography variant="body2" className="text-gray-600 mb-2">
              <span className="font-medium">Nacimiento:</span> {new Date(artista.fechaNacimiento).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              <span className="font-medium">Géneros:</span> {artista.generos}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle className="font-light tracking-wide">
          {editMode ? 'Editar Artista' : 'Nuevo Artista'}
        </DialogTitle>
        <DialogContent>
          <Box className="flex flex-col gap-6 mt-4">
            <TextField
              label="Nombre Completo"
              value={currentArtista.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              fullWidth
              variant="standard"
            />
            <TextField
              label="Nacionalidad"
              value={currentArtista.nacionalidad}
              onChange={(e) => handleChange('nacionalidad', e.target.value)}
              fullWidth
              variant="standard"
            />
            <TextField
              label="Fecha de Nacimiento"
              type="date"
              value={currentArtista.fechaNacimiento}
              onChange={(e) => handleChange('fechaNacimiento', e.target.value)}
              fullWidth
              variant="standard"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Biografía"
              value={currentArtista.biografia}
              onChange={(e) => handleChange('biografia', e.target.value)}
              fullWidth
              multiline
              rows={3}
              variant="standard"
            />
            <TextField
              label="Géneros"
              value={currentArtista.generos}
              onChange={(e) => handleChange('generos', e.target.value)}
              fullWidth
              variant="standard"
              helperText="Ej: Pintura, Escultura"
            />
          </Box>
        </DialogContent>
        <DialogActions className="p-6">
          <Button onClick={handleClose} sx={{ color: '#666' }}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              backgroundColor: '#000',
              color: '#fff',
              borderRadius: 0,
              '&:hover': { backgroundColor: '#1a1a1a' }
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ArtistasContent;
