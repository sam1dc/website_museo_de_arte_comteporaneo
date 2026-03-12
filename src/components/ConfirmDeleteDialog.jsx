import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';

const ConfirmDeleteDialog = ({ open, onClose, onConfirm, title, message, itemName }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="font-light tracking-wide flex items-center gap-3">
        <WarningIcon sx={{ color: '#666' }} />
        {title || 'Confirmar Eliminación'}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" className="mb-6">
          {message || '¿Estás seguro de que deseas eliminar este elemento?'}
        </Typography>
        {itemName && (
          <Box className="bg-gray-50 p-3 rounded border-l-4 border-gray-500 my-6">
            <Typography variant="body2" className="font-medium text-gray-700">
              {itemName}
            </Typography>
          </Box>
        )}
        <Typography variant="body2" className="text-gray-600 mt-6">
          Esta acción no se puede deshacer.
        </Typography>
      </DialogContent>
      <DialogActions className="p-6">
        <Button 
          onClick={onClose} 
          sx={{ color: '#666' }}
        >
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            backgroundColor: '#000',
            color: '#fff',
            borderRadius: 0,
            '&:hover': { backgroundColor: '#1a1a1a' }
          }}
        >
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
