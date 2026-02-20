import { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Avatar, Box } from '@mui/material';
import { AccountCircle, Logout, Menu as MenuIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ProfileDialog from './ProfileDialog';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  
  const handleProfile = () => {
    setProfileOpen(true);
    handleClose();
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/login');
  };

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          width: { xs: '100%', md: 'calc(100% - 280px)' },
          ml: { xs: 0, md: '280px' },
          backgroundColor: '#fff',
          color: '#000',
          boxShadow: 'none',
          borderBottom: '1px solid #e5e5e5'
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" className="grow font-light tracking-wide text-sm sm:text-base">
            Panel Administrativo
          </Typography>
          
          <Box className="flex items-center gap-2 sm:gap-3">
            <Typography variant="body2" className="text-gray-700 hidden sm:block">
              {user?.name}
            </Typography>
            <IconButton onClick={handleMenu}>
              <Avatar sx={{ width: 32, height: 32, backgroundColor: '#000' }}>
                {user?.name?.charAt(0)}
              </Avatar>
            </IconButton>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleProfile}>
              <AccountCircle className="mr-2" fontSize="small" />
              Perfil
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout className="mr-2" fontSize="small" />
              Cerrar sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <ProfileDialog open={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
};

export default Navbar;
