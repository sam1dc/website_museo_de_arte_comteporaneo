import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Paper, Grid, CircularProgress } from '@mui/material';
import { People, Palette, Image } from '@mui/icons-material';
import { apiCall } from '../services/api';

const DashboardContent = () => {
  const [stats, setStats] = useState(null);
  const [cargando, setCargando] = useState(true);
  const cargadoRef = useRef(false);

  useEffect(() => {
    if (cargadoRef.current) return;
    cargadoRef.current = true;

    const cargarDatos = async () => {
      try {
        setCargando(true);
        const response = await apiCall('/admin/dashboard');
        const data = response.data || response;
        
        setStats([
          { label: 'Compradores', value: data.usuarios_count || 0, icon: <People fontSize="large" /> },
          { label: 'Obras', value: data.obras_count || 0, icon: <Image fontSize="large" /> }
        ]);
      } catch (error) {
        console.error('Error al cargar dashboard:', error);
        setStats([
          { label: 'Compradores', value: '0', icon: <People fontSize="large" /> },
          { label: 'Obras', value: '0', icon: <Image fontSize="large" /> }
        ]);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  if (cargando) {
    return (
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" className="font-light tracking-wide mb-8">
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {stats && stats.map((stat) => (
          <Grid item xs={12} md={6} key={stat.label}>
            <Paper className="p-6 border border-gray-200" elevation={0}>
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography variant="h3" className="font-light mb-1">
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600 uppercase tracking-wider text-xs">
                    {stat.label}
                  </Typography>
                </Box>
                <Box className="text-gray-400">
                  {stat.icon}
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardContent;
