import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Dashboard as DashboardIcon, Person as PersonIcon } from '@mui/icons-material';

const Sidebar = ({ selectedMenu, onMenuChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'usuarios', label: 'Usuarios', icon: <PersonIcon /> }
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 280,
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          backgroundColor: '#000',
          color: '#fff',
          borderRight: 'none'
        }
      }}
    >
      <Box className="p-8">
        <Box className="text-2xl font-extralight tracking-widest mb-12">MAC</Box>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.id} disablePadding className="mb-2">
              <ListItemButton
                selected={selectedMenu === item.id}
                onClick={() => onMenuChange(item.id)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderLeft: '3px solid #fff'
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.05)'
                  },
                  paddingLeft: '24px'
                }}
              >
                <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  sx={{ '& .MuiTypography-root': { fontSize: '0.875rem', letterSpacing: '0.05em' } }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
