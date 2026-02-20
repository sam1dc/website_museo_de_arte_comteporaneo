import { useState } from 'react';
import { Box } from '@mui/material';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import DashboardContent from '../components/DashboardContent';
import UsuariosContent from '../components/UsuariosContent';

const DashboardView = () => {
  const [selectedMenu, setSelectedMenu] = useState('dashboard');

  return (
    <Box className="flex">
      <Sidebar selectedMenu={selectedMenu} onMenuChange={setSelectedMenu} />
      <Box className="flex-grow ml-[280px]">
        <Navbar />
        <Box component="main" className="mt-16 p-8">
          {selectedMenu === 'dashboard' && <DashboardContent />}
          {selectedMenu === 'usuarios' && <UsuariosContent />}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardView;
