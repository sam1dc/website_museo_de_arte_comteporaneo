import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Paper, CircularProgress, TextField, Button } from '@mui/material';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { dashboardService, reportesAdminService, obrasAdminService } from '../services/adminService';
import { Search as SearchIcon } from '@mui/icons-material';
import { obtenerNombreMes } from '../utils/constants';

const DashboardContent = () => {
  const [stats, setStats] = useState(null);
  const [reportes, setReportes] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [cargandoGraficas, setCargandoGraficas] = useState(false);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const obtenerFechasIniciales = () => {
    const hoy = new Date();
    const hace30Dias = new Date(hoy);
    hace30Dias.setDate(hoy.getDate() - 30);
    
    return {
      inicio: hace30Dias.toISOString().split('T')[0],
      fin: hoy.toISOString().split('T')[0]
    };
  };

  const generarMesesDelRango = (fechaInicio, fechaFin) => {
    const meses = [];
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    
    let actual = new Date(inicio.getFullYear(), inicio.getMonth(), 1);
    const finMes = new Date(fin.getFullYear(), fin.getMonth(), 1);
    
    while (actual <= finMes) {
      const mes = actual.getMonth() + 1;
      const anio = actual.getFullYear();
      meses.push({
        mes: obtenerNombreMes(mes),
        anio: anio,
        clave: `${anio}-${mes.toString().padStart(2, '0')}`,
        orden: anio * 100 + mes
      });
      actual.setMonth(actual.getMonth() + 1);
    }
    
    return meses;
  };

  const procesarVentasPorMes = (facturas) => {
    const mesesRango = generarMesesDelRango(fechaInicio, fechaFin);
    const ventasPorMes = {};
    
    // Inicializar todos los meses en 0
    mesesRango.forEach(m => {
      ventasPorMes[m.clave] = { 
        mes: m.mes, 
        ventas: 0, 
        ingresos: 0,
        orden: m.orden
      };
    });
    
    // Agregar datos reales
    facturas.forEach(factura => {
      if (factura.fecha) {
        const [dia, mes, anio] = factura.fecha.split('/');
        const clave = `${anio}-${mes.padStart(2, '0')}`;
        
        if (ventasPorMes[clave]) {
          ventasPorMes[clave].ventas += 1;
          ventasPorMes[clave].ingresos += parseFloat(factura.total || 0);
        }
      }
    });

    return Object.values(ventasPorMes)
      .sort((a, b) => a.orden - b.orden)
      .map(({ mes, ventas, ingresos }) => ({ mes, ventas, ingresos }));
  };

  const procesarComprasPorMes = (obrasVendidas) => {
    const mesesRango = generarMesesDelRango(fechaInicio, fechaFin);
    const comprasPorMes = {};
    
    // Inicializar todos los meses en 0
    mesesRango.forEach(m => {
      comprasPorMes[m.clave] = { 
        mes: m.mes, 
        cantidad: 0,
        orden: m.orden
      };
    });
    
    // Agregar datos reales
    obrasVendidas.forEach(venta => {
      if (venta.fecha) {
        const [dia, mes, anio] = venta.fecha.split('/');
        const clave = `${anio}-${mes.padStart(2, '0')}`;
        
        if (comprasPorMes[clave]) {
          comprasPorMes[clave].cantidad += 1;
        }
      }
    });

    return Object.values(comprasPorMes)
      .sort((a, b) => a.orden - b.orden)
      .map(({ mes, cantidad }) => ({ mes, cantidad }));
  };

  const procesarTopArtistas = (obrasVendidas) => {
    const ventasPorArtista = {};
    
    obrasVendidas.forEach(venta => {
      if (venta.artista) {
        if (!ventasPorArtista[venta.artista]) {
          ventasPorArtista[venta.artista] = { nombre: venta.artista, ventas: 0, ingresos: 0 };
        }
        ventasPorArtista[venta.artista].ventas += 1;
        ventasPorArtista[venta.artista].ingresos += parseFloat(venta.precio || 0);
      }
    });

    return Object.values(ventasPorArtista)
      .sort((a, b) => b.ventas - a.ventas)
      .slice(0, 4);
  };

  useEffect(() => {
    const inicializar = async () => {
      const fechas = obtenerFechasIniciales();
      setFechaInicio(fechas.inicio);
      setFechaFin(fechas.fin);
      
      // Cargar datos iniciales
      try {
        setCargando(true);
        
        const dashboardData = await dashboardService.obtenerResumen();
        const obrasData = await obrasAdminService.obtenerTodos();
        
        const rangoFechas = {
          fecha_inicio: fechas.inicio,
          fecha_fin: fechas.fin
        };

        const [facturacionRes, obrasVendidasRes] = await Promise.all([
          reportesAdminService.facturacion(rangoFechas),
          reportesAdminService.obrasVendidas(rangoFechas)
        ]);

        console.log('Respuestas de la API:', { facturacionRes, obrasVendidasRes });

        // Contar obras disponibles correctamente
        const obrasDisponibles = obrasData.filter(obra => obra.estatus === 'DISPONIBLE').length;
        
        setStats({
          compradores: dashboardData.usuarios_count || 0,
          obras: dashboardData.obras_count || 0,
          obrasDisponibles: obrasDisponibles
        });

        // Manejar diferentes estructuras de respuesta
        const facturacionData = facturacionRes?.data || facturacionRes || [];
        const obrasVendidasData = obrasVendidasRes?.data || obrasVendidasRes || [];

        const ventasPorMes = procesarVentasPorMes(facturacionData);
        const topArtistas = procesarTopArtistas(obrasVendidasData);
        const comprasPorMes = procesarComprasPorMes(obrasVendidasData);

        console.log('Datos procesados:', {
          facturacionData,
          obrasVendidasData,
          comprasPorMes,
          topArtistas
        });

        setReportes({
          ventasPorMes,
          comprasPorMes,
          topArtistas: topArtistas.length > 0 ? topArtistas : [
            { nombre: 'Sin ventas', ventas: 0 }
          ]
        });
      } catch (error) {
        console.error('Error al cargar dashboard:', error);
        setStats({ compradores: 0, obras: 0 });
        setReportes({
          ventasPorMes: [],
          comprasPorMes: [],
          topArtistas: []
        });
      } finally {
        setCargando(false);
      }
    };

    inicializar();
  }, []);

  const cargarDatos = async () => {
    try {
      setCargandoGraficas(true);
      
      const dashboardData = await dashboardService.obtenerResumen();
      const obrasData = await obrasAdminService.obtenerTodos();
      
      const rangoFechas = {
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin
      };

      const [facturacionRes, obrasVendidasRes] = await Promise.all([
        reportesAdminService.facturacion(rangoFechas),
        reportesAdminService.obrasVendidas(rangoFechas)
      ]);

      // Contar obras disponibles correctamente
      const obrasDisponibles = obrasData.filter(obra => obra.estatus === 'DISPONIBLE').length;
      
      setStats({
        compradores: dashboardData.usuarios_count || 0,
        obras: dashboardData.obras_count || 0,
        obrasDisponibles: obrasDisponibles
      });

      // Manejar diferentes estructuras de respuesta
      const facturacionData = facturacionRes?.data || facturacionRes || [];
      const obrasVendidasData = obrasVendidasRes?.data || obrasVendidasRes || [];

      const ventasPorMes = procesarVentasPorMes(facturacionData);
      const topArtistas = procesarTopArtistas(obrasVendidasData);
      const comprasPorMes = procesarComprasPorMes(obrasVendidasData);

      setReportes({
        ventasPorMes,
        comprasPorMes,
        topArtistas: topArtistas.length > 0 ? topArtistas : [
          { nombre: 'Sin ventas', ventas: 0 }
        ]
      });
    } catch (error) {
      console.error('Error al cargar dashboard:', error);
      setStats({ compradores: 0, obras: 0 });
      setReportes({
        ventasPorMes: [],
        comprasPorMes: [],
        topArtistas: []
      });
    } finally {
      setCargandoGraficas(false);
    }
  };

  const handleBuscar = () => {
    if (fechaInicio && fechaFin) {
      cargarDatos();
    }
  };

  if (cargando) {
    return (
      <Box sx={{ width: '100%', pb: 4 }}>
        <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <Typography variant="h4" className="font-light tracking-wide">
            Dashboard
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', pb: 4 }}>
      <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <Typography variant="h4" className="font-light tracking-wide">
          Dashboard
        </Typography>
        
        <Box className="flex flex-col sm:flex-row gap-4 items-end">
          <TextField
            label="Fecha Inicio"
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
            sx={{ minWidth: 180 }}
          />
          <TextField
            label="Fecha Fin"
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
            sx={{ minWidth: 180 }}
          />
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleBuscar}
            disabled={!fechaInicio || !fechaFin}
            sx={{
              backgroundColor: '#000',
              color: '#fff',
              borderRadius: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 300,
              '&:hover': { backgroundColor: '#1a1a1a' }
            }}
          >
            Buscar
          </Button>
        </Box>
      </Box>
      
      <div className="space-y-6">
        <Paper className="p-8 border border-gray-200" elevation={0}>
          <Typography variant="h6" className="font-light tracking-wide mb-6">
            Estadísticas Generales
          </Typography>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <Box className="text-center">
              <Typography variant="body2" className="text-gray-600 uppercase tracking-wider text-xs mb-3">
                Total Compradores
              </Typography>
              <Typography variant="h2" className="font-light">
                {stats?.compradores}
              </Typography>
            </Box>
            <Box className="text-center">
              <Typography variant="body2" className="text-gray-600 uppercase tracking-wider text-xs mb-3">
                Total Obras
              </Typography>
              <Typography variant="h2" className="font-light">
                {stats?.obras}
              </Typography>
            </Box>
            <Box className="text-center">
              <Typography variant="body2" className="text-gray-600 uppercase tracking-wider text-xs mb-3">
                Obras Disponibles
              </Typography>
              <Typography variant="h2" className="font-light">
                {stats?.obrasDisponibles || 0}
              </Typography>
            </Box>
          </div>
        </Paper>

        {cargandoGraficas ? (
          <Paper className="p-8 border border-gray-200" elevation={0}>
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          </Paper>
        ) : reportes?.ventasPorMes && (
          <Paper className="p-8 border border-gray-200" elevation={0}>
            <Typography variant="h6" className="font-light tracking-wide mb-6">
              Ventas e Ingresos Mensuales
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={reportes.ventasPorMes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="mes" stroke="#666" style={{ fontSize: '12px' }} />
                <YAxis yAxisId="left" stroke="#666" style={{ fontSize: '12px' }} />
                <YAxis yAxisId="right" orientation="right" stroke="#666" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e5e5',
                    borderRadius: 0
                  }} 
                />
                <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                <Line yAxisId="left" type="monotone" dataKey="ventas" stroke="#000" strokeWidth={2} name="Ventas" dot={{ r: 3 }} />
                <Line yAxisId="right" type="monotone" dataKey="ingresos" stroke="#808080" strokeWidth={2} name="Ingresos ($)" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {cargandoGraficas ? (
            <>
              <Paper className="p-8 border border-gray-200" elevation={0}>
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                  <CircularProgress />
                </Box>
              </Paper>
              <Paper className="p-8 border border-gray-200" elevation={0}>
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                  <CircularProgress />
                </Box>
              </Paper>
            </>
          ) : (
            <>
              {reportes?.comprasPorMes && reportes.comprasPorMes.length > 0 ? (
                <Paper className="p-8 border border-gray-200" elevation={0}>
              <Typography variant="h6" className="font-light tracking-wide mb-6">
                Obras Vendidas por Mes
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reportes.comprasPorMes}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="mes" stroke="#666" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#666" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e5e5',
                      borderRadius: 0
                    }} 
                  />
                  <Bar dataKey="cantidad" fill="#000" name="Obras Vendidas" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
              ) : (
                <Paper className="p-8 border border-gray-200" elevation={0}>
                  <Typography variant="h6" className="font-light tracking-wide mb-6">
                    Obras Vendidas por Mes
                  </Typography>
                  <Typography className="text-gray-500 text-center py-8">
                    No hay datos de ventas en el rango seleccionado
                  </Typography>
                </Paper>
              )}

          {reportes?.topArtistas && reportes.topArtistas.length > 0 ? (
            <Paper className="p-8 border border-gray-200" elevation={0}>
              <Typography variant="h6" className="font-light tracking-wide mb-6">
                Top Artistas por Ventas
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reportes.topArtistas} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis type="number" stroke="#666" style={{ fontSize: '12px' }} />
                  <YAxis dataKey="nombre" type="category" stroke="#666" width={100} style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e5e5',
                      borderRadius: 0
                    }} 
                  />
                  <Bar dataKey="ventas" fill="#000" name="Ventas" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          ) : (
            <Paper className="p-8 border border-gray-200" elevation={0}>
              <Typography variant="h6" className="font-light tracking-wide mb-6">
                Top Artistas por Ventas
              </Typography>
              <Typography className="text-gray-500 text-center py-8">
                No hay datos de ventas por artista en el rango seleccionado
              </Typography>
            </Paper>
          )}
            </>
          )}
        </div>
      </div>
    </Box>
  );
};

export default DashboardContent;
