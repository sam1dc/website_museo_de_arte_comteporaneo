import { Dialog, DialogTitle, DialogContent, Box, Typography, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

const ProfileDialog = ({ open, onClose }) => {
  const { user } = useAuth();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="flex justify-between items-center border-b">
        <Typography variant="h6" className="font-light tracking-wide">
          Perfil de Usuario
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent className="mt-6">
        <Box className="flex flex-col gap-4">
          <Box>
            <Typography variant="caption" className="text-gray-600 uppercase tracking-wider text-xs">
              Nombre Completo
            </Typography>
            <Typography variant="body1" className="mt-1">
              {user?.data?.nombre || user?.data?.nombre_completo || user?.data?.nombres || 'N/A'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" className="text-gray-600 uppercase tracking-wider text-xs">
              Email
            </Typography>
            <Typography variant="body1" className="mt-1">
              {user?.data?.email || 'N/A'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" className="text-gray-600 uppercase tracking-wider text-xs">
              Rol
            </Typography>
            <Typography variant="body1" className="mt-1">
              {user?.data?.rol || 'N/A'}
            </Typography>
          </Box>
          {user?.data?.telefono && (
            <Box>
              <Typography variant="caption" className="text-gray-600 uppercase tracking-wider text-xs">
                Teléfono
              </Typography>
              <Typography variant="body1" className="mt-1">
                {user.data.telefono}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
