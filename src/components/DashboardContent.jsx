import { Box, Typography, Paper, Grid } from '@mui/material';
import { People, Palette, Event } from '@mui/icons-material';

const DashboardContent = () => {
  const stats = [
    { label: 'Usuarios', value: '124', icon: <People fontSize="large" /> },
    { label: 'Obras', value: '89', icon: <Palette fontSize="large" /> },
    { label: 'Eventos', value: '12', icon: <Event fontSize="large" /> }
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" className="font-light tracking-wide mb-8">
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid item xs={12} md={4} key={stat.label}>
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
