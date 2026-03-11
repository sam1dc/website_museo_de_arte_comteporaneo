import { Box, Container, Typography, Link as MuiLink } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <Box 
      component="footer" 
      className="bg-black text-white py-12"
    >
      <Container maxWidth="lg">
        <Box className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Columna 1 - Museo */}
          <Box>
            <Typography 
              variant="h6" 
              className="font-extralight tracking-widest mb-4 uppercase"
              sx={{ letterSpacing: '0.2em', fontSize: '1.5rem' }}
            >
              MAC
            </Typography>
            <Typography 
              className="font-light text-gray-400 mb-4"
              sx={{ fontSize: '0.875rem', letterSpacing: '0.05em', lineHeight: 1.8 }}
            >
              Museo de Arte Contemporáneo. Explorando las fronteras del arte moderno.
            </Typography>
          </Box>

          {/* Columna 2 - Enlaces */}
          <Box>
            <Typography 
              className="font-light tracking-wide mb-4 uppercase"
              sx={{ fontSize: '0.875rem', letterSpacing: '0.1em' }}
            >
              Enlaces
            </Typography>
            <Box className="flex flex-col gap-2">
              <Box
                onClick={() => navigate('/museo-de-arte-contemporaneo')}
                className="cursor-pointer font-light text-gray-400 hover:text-white transition-colors"
                sx={{ fontSize: '0.875rem', letterSpacing: '0.05em' }}
              >
                Inicio
              </Box>
              <Box
                onClick={() => navigate('/museo-de-arte-contemporaneo/catalogo')}
                className="cursor-pointer font-light text-gray-400 hover:text-white transition-colors"
                sx={{ fontSize: '0.875rem', letterSpacing: '0.05em' }}
              >
                Catálogo
              </Box>
              <Box
                onClick={() => navigate('/login')}
                className="cursor-pointer font-light text-gray-400 hover:text-white transition-colors"
                sx={{ fontSize: '0.875rem', letterSpacing: '0.05em' }}
              >
                Acceder
              </Box>
            </Box>
          </Box>

          {/* Columna 3 - Contacto */}
          <Box>
            <Typography 
              className="font-light tracking-wide mb-4 uppercase"
              sx={{ fontSize: '0.875rem', letterSpacing: '0.1em' }}
            >
              Contacto
            </Typography>
            <Box className="flex flex-col gap-2">
              <Typography 
                className="font-light text-gray-400"
                sx={{ fontSize: '0.875rem', letterSpacing: '0.05em' }}
              >
                info@mac-museo.com
              </Typography>
              <Typography 
                className="font-light text-gray-400"
                sx={{ fontSize: '0.875rem', letterSpacing: '0.05em' }}
              >
                +1 (555) 123-4567
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box className="border-t border-gray-800 pt-8 text-center">
          <Typography 
            className="font-light text-gray-500"
            sx={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}
          >
            © {new Date().getFullYear()} Museo de Arte Contemporáneo. Todos los derechos reservados.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
