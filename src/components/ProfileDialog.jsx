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
              Nombre
            </Typography>
            <Typography variant="body1" className="mt-1">
              {user?.name}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" className="text-gray-600 uppercase tracking-wider text-xs">
              Email
            </Typography>
            <Typography variant="body1" className="mt-1">
              {user?.email}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" className="text-gray-600 uppercase tracking-wider text-xs">
              Rol
            </Typography>
            <Typography variant="body1" className="mt-1">
              {user?.role}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
