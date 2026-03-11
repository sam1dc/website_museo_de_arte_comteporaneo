import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useState, useEffect } from 'react';
import { catalogoService } from '../services';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Estilos personalizados para Swiper
const swiperStyles = `
  .swiper-button-next,
  .swiper-button-prev {
    color: #000 !important;
  }
  .swiper-button-next:after,
  .swiper-button-prev:after {
    font-size: 24px;
    font-weight: bold;
  }
  .swiper-button-next:hover,
  .swiper-button-prev:hover {
    color: #666 !important;
  }
  .swiper-pagination-bullet {
    background-color: #666;
    opacity: 0.5;
  }
  .swiper-pagination-bullet-active {
    background-color: #000;
    opacity: 1;
  }
`;

const HomeView = () => {
  const navigate = useNavigate();
  const [obrasDestacadas, setObrasDestacadas] = useState([]);

  useEffect(() => {
    const cargarObras = async () => {
      try {
        const obras = await catalogoService.obtenerObras();
        // Tomar las primeras 6 obras disponibles
        const destacadas = obras.filter(o => o.estatus === 'DISPONIBLE').slice(0, 6);
        setObrasDestacadas(destacadas);
      } catch (err) {
        console.error('Error al cargar obras:', err);
      }
    };
    cargarObras();
  }, []);

  return (
    <Box>
      <style>{swiperStyles}</style>
      {/* Hero Section */}
      <Box 
        className="relative h-screen flex items-center justify-center"
        sx={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1554907984-15263bfd63bd?q=80&w=2070)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
          }
        }}
      >
        <Container maxWidth="lg" className="text-center relative z-10">
          <Typography 
            variant="h1" 
            className="font-extralight tracking-widest text-black mb-6 uppercase"
            sx={{ 
              letterSpacing: '0.3em', 
              fontSize: { xs: '3rem', md: '5rem', lg: '6rem' },
              lineHeight: 1.2
            }}
          >
            MAC
          </Typography>
          <Box className="w-32 h-px bg-black mx-auto mb-8" />
          <Typography 
            variant="h5" 
            className="font-light tracking-wide text-gray-700 mb-12"
            sx={{ 
              letterSpacing: '0.15em', 
              fontSize: { xs: '1rem', md: '1.5rem' }
            }}
          >
            MUSEO DE ARTE CONTEMPORÁNEO
          </Typography>
          <Typography 
            className="font-light text-gray-600 mb-12"
            sx={{ 
              fontSize: { xs: '0.95rem', md: '1.1rem' },
              letterSpacing: '0.05em',
              lineHeight: 1.8,
              maxWidth: '600px',
              margin: '0 auto 3rem auto'
            }}
          >
            Explora nuestra colección de arte contemporáneo. 
            Descubre obras únicas de artistas reconocidos.
          </Typography>
          <Button
            onClick={() => navigate('/museo-de-arte-contemporaneo/catalogo')}
            variant="contained"
            size="large"
            sx={{
              backgroundColor: '#000',
              color: '#fff',
              padding: '16px 48px',
              fontSize: '0.875rem',
              letterSpacing: '0.2em',
              fontWeight: 300,
              borderRadius: 0,
              '&:hover': { backgroundColor: '#1a1a1a' },
              textTransform: 'uppercase'
            }}
          >
            Explorar Catálogo
          </Button>
        </Container>
      </Box>

      {/* Obras Destacadas */}
      <Box className="py-20 bg-white">
        <Container maxWidth="lg">
          <Box className="text-center mb-12">
            <Typography 
              variant="h3" 
              className="font-extralight tracking-widest text-black mb-4 uppercase"
              sx={{ letterSpacing: '0.2em', fontSize: { xs: '2rem', md: '3rem' } }}
            >
              Obras Destacadas
            </Typography>
            <Box className="w-24 h-px bg-black mx-auto" />
          </Box>

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 }
            }}
            className="pb-12"
          >
            {obrasDestacadas.map((obra) => (
              <SwiperSlide key={obra.obra_id}>
                <Box
                  onClick={() => navigate(`/museo-de-arte-contemporaneo/obra/${obra.obra_id}`)}
                  className="cursor-pointer transition-all hover:shadow-xl"
                  sx={{
                    border: '1px solid #e5e5e5',
                    height: '550px',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': { borderColor: '#000' }
                  }}
                >
                  <Box sx={{ height: '350px', overflow: 'hidden', backgroundColor: '#f5f5f5', flexShrink: 0 }}>
                    <img
                      src={obra.foto_url}
                      alt={obra.nombre}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </Box>
                  <Box className="p-6 flex flex-col flex-grow">
                    <Typography 
                      className="font-light tracking-wide mb-2 uppercase line-clamp-2"
                      sx={{ fontSize: '0.875rem', letterSpacing: '0.1em', minHeight: '2.5rem' }}
                    >
                      {obra.nombre}
                    </Typography>
                    <Typography 
                      className="text-gray-600 font-light mb-3 truncate"
                      sx={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}
                    >
                      {obra.artista?.nombre_completo}
                    </Typography>
                    <Typography 
                      className="font-light mt-auto"
                      sx={{ fontSize: '1.1rem', letterSpacing: '0.05em' }}
                    >
                      ${obra.precio_usd ? parseFloat(obra.precio_usd).toLocaleString() : '0'}
                    </Typography>
                  </Box>
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>

          <Box className="text-center mt-8">
            <Button
              onClick={() => navigate('/museo-de-arte-contemporaneo/catalogo')}
              variant="outlined"
              sx={{
                borderColor: '#000',
                color: '#000',
                padding: '12px 32px',
                fontSize: '0.875rem',
                letterSpacing: '0.15em',
                fontWeight: 300,
                borderRadius: 0,
                '&:hover': { 
                  borderColor: '#000',
                  backgroundColor: 'rgba(0,0,0,0.05)' 
                },
                textTransform: 'uppercase'
              }}
            >
              Ver Todas las Obras
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomeView;
