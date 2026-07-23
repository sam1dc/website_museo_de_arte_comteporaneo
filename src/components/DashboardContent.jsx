import { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, TextField, Button, MenuItem } from '@mui/material';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { dashboardService, reportesAdminService, obrasAdminService } from '../services/adminService';
import { Search as SearchIcon } from '@mui/icons-material';
import { obtenerNombreMes, MESES } from '../utils/constants';

// Generar lista de años (últimos 10)
const aniosDisponibles = () => {
  const anioActual = new Date().getFullYear();
  const anios = [];
  for (let i = anioActual - 10; i <= anioActual + 1; i++) {
    anios.push(i);
  }
  return anios;
};

const DashboardContent = () => {
  const [stats, setStats] = useState(null);
  const [reportes, setReportes] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [cargandoGraficas, setCargandoGraficas] = useState(false);
  
  const hoy = new Date();
  const mesActual = hoy.getMonth() + 1;
  const anioActual = hoy.getFullYear();
  const mesAnterior = mesActual === 1 ? 12 : mesActual - 1;
  const anioAnterior = mesActual === 1 ? anioActual - 1 : anioActual;
  
  const [mesInicio, setMesInicio] = useState(mesAnterior);
  const [anioInicio, setAnioInicio] = useState(anioAnterior);
  const [mesFin, setMesFin] = useState(mesActual);
  const [anioFin, setAnioFin] = useState(anioActual);

  const mesToFecha = (mes, anio) => `${anio}-${String(mes).padStart(2, '0')}-01`;
  
  const mesToFechaFin = (mes, anio) => {
    const ultimoDia = new Date(anio, mes, 0).getDate();
    return `${anio}-${String(mes).padStart(2, '0')}-${String(ultimoDia).padStart(2, '0')}`;
  };

  const generarMesesDelRango = (inicio, fin) => {
    const meses = [];
    // Construir fechas con componentes locales para evitar el offset UTC
    // inicio/fin vienen como "YYYY-MM-DD"
    const [anioIni, mesIni] = inicio.split('-').map(Number);
    const [anioFin, mesFin] = fin.split('-').map(Number);
    let actual = new Date(anioIni, mesIni - 1, 1);
    const finMes = new Date(anioFin, mesFin - 1, 1);
    
    while (actual <= finMes) {
      const mes = actual.getMonth() + 1;
      const anio = actual.getFullYear();
      meses.push({
        orden: anio * 100 + mes,
        label: `${obtenerNombreMes(mes)} ${anio}`,
        anio,
        clave: `${anio}-${mes.toString().padStart(2, '0')}`
      });
      actual.setMonth(actual.getMonth() + 1);
    }
    return meses;
  };

  const ordenToLabel = (orden) => {
    const anio = Math.floor(orden / 100);
    const mes = orden % 100;
    return `${obtenerNombreMes(mes)} ${anio}`;
  };

  const procesarVentasPorMes = (facturas, inicio, fin) => {
    // Retornar array en orden cronológico directo
    return generarMesesDelRango(inicio, fin).map(m => {
      const item = { orden: m.orden, label: m.label, ventas: 0, ingresos: 0 };
      facturas.forEach(factura => {
        if (factura.fecha) {
          const [dia, mes, anio] = factura.fecha.split('/');
          if (m.clave === `${anio}-${mes.padStart(2, '0')}`) {
            item.ventas += 1;
            item.ingresos += parseFloat(factura.total || 0);
          }
        }
      });
      return item;
    });
  };

  const procesarComprasPorMes = (obrasVendidas, inicio, fin) => {
    return generarMesesDelRango(inicio, fin).map(m => {
      const item = { orden: m.orden, label: m.label, cantidad: 0 };
      obrasVendidas.forEach(venta => {
        if (venta.fecha) {
          const [dia, mes, anio] = venta.fecha.split('/');
          if (m.clave === `${anio}-${mes.padStart(2, '0')}`) {
            item.cantidad += 1;
          }
        }
      });
      return item;
    });
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
    return Object.values(ventasPorArtista).sort((a, b) => b.ventas - a.ventas).slice(0, 4);
  };

  useEffect(() => {
    const inicializar = async () => {
      setCargando(true);
      await cargarDatos();
      setCargando(false);
    };
    inicializar();
  }, []);

  const cargarDatos = async () => {
    try {
      setCargandoGraficas(true);
      
      const dashboardData = await dashboardService.obtenerResumen();
      const obrasData = await obrasAdminService.obtenerTodos();
      
      const fechaInicio = mesToFecha(mesInicio, anioInicio);
      const fechaFin = mesToFechaFin(mesFin, anioFin);
      
      const rangoFechas = { fecha_inicio: fechaInicio, fecha_fin: fechaFin };

      const [facturacionRes, obrasVendidasRes] = await Promise.all([
        reportesAdminService.facturacion(rangoFechas),
        reportesAdminService.obrasVendidas(rangoFechas)
      ]);

      const totalObrasMongo = obrasData.length;
      const obrasDisponibles = obrasData.filter(obra => obra.estatus === 'DISPONIBLE').length;
      const obrasVendidasMongo = obrasData.filter(obra => obra.estatus === 'VENDIDA' || obra.estatus === 'VENDIDO').length;
      const obrasReservadasMongo = obrasData.filter(obra => obra.estatus === 'RESERVADA').length;

      setStats({
        compradores: dashboardData.usuarios_count || 0,
        obras: totalObrasMongo,
        obrasDisponibles,
        obrasReservadas: obrasReservadasMongo,
        obrasVendidas: obrasVendidasMongo,
        solicitudesPendientes: dashboardData.solicitudes_pendientes || 0,
        facturasEmitidas: dashboardData.facturas_emitidas || 0,
      });

      const facturacionData = facturacionRes?.data || facturacionRes || [];
      const obrasVendidasData = obrasVendidasRes?.data || obrasVendidasRes || [];

      setReportes({
        ventasPorMes: procesarVentasPorMes(facturacionData, fechaInicio, fechaFin),
        comprasPorMes: procesarComprasPorMes(obrasVendidasData, fechaInicio, fechaFin),
        topArtistas: (() => {
          const artistas = procesarTopArtistas(obrasVendidasData);
          return artistas.length > 0 ? artistas : [{ nombre: 'Sin ventas', ventas: 0 }];
        })()
      });
    } catch (error) {
      console.error('Error al cargar dashboard:', error);
      setStats({ compradores: 0, obras: 0, obrasDisponibles: 0 });
      setReportes({ ventasPorMes: [], comprasPorMes: [], topArtistas: [] });
    } finally {
      setCargandoGraficas(false);
    }
  };

  if (cargando) {
    return (
      <Box sx={{ width: '100%', pb: 4 }}>
        <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <Typography variant="h4" className="font-light tracking-wide">Dashboard</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', pb: 4 }}>
      <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <Typography variant="h4" className="font-light tracking-wide">Dashboard</Typography>
        
        <Box className="flex flex-row gap-3 items-end">
          <TextField select label="Mes Inicio" value={mesInicio} onChange={(e) => setMesInicio(Number(e.target.value))} size="small" sx={{ minWidth: 130 }}>
            {MESES.map((m) => (<MenuItem key={m.numero} value={m.numero}>{m.nombreCompleto}</MenuItem>))}
          </TextField>
          <TextField select label="Año Inicio" value={anioInicio} onChange={(e) => setAnioInicio(Number(e.target.value))} size="small" sx={{ minWidth: 100 }}>
            {aniosDisponibles().map(a => (<MenuItem key={a} value={a}>{a}</MenuItem>))}
          </TextField>
          <Typography sx={{ color: '#999', pt: 1 }}>→</Typography>
          <TextField select label="Mes Fin" value={mesFin} onChange={(e) => setMesFin(Number(e.target.value))} size="small" sx={{ minWidth: 130 }}>
            {MESES.map((m) => (<MenuItem key={m.numero} value={m.numero}>{m.nombreCompleto}</MenuItem>))}
          </TextField>
          <TextField select label="Año Fin" value={anioFin} onChange={(e) => setAnioFin(Number(e.target.value))} size="small" sx={{ minWidth: 100 }}>
            {aniosDisponibles().map(a => (<MenuItem key={a} value={a}>{a}</MenuItem>))}
          </TextField>
          <Button variant="contained" startIcon={<SearchIcon />} onClick={cargarDatos} sx={{ backgroundColor: '#000', color: '#fff', borderRadius: 0, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 300, '&:hover': { backgroundColor: '#1a1a1a' } }}>
            Buscar
          </Button>
        </Box>
      </Box>
      
      <div className="space-y-6">
        <Paper className="p-8 border border-gray-200" elevation={0}>
          <Typography variant="h6" className="font-light tracking-wide mb-6">Estadísticas Generales</Typography>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
            <Box className="text-center">
              <Typography variant="body2" className="text-gray-600 uppercase tracking-wider text-xs mb-3">Compradores</Typography>
              <Typography variant="h2" className="font-light">{stats?.compradores}</Typography>
            </Box>
            <Box className="text-center">
              <Typography variant="body2" className="text-gray-600 uppercase tracking-wider text-xs mb-3">Obras Totales</Typography>
              <Typography variant="h2" className="font-light">{stats?.obras}</Typography>
            </Box>
            <Box className="text-center">
              <Typography variant="body2" className="text-gray-600 uppercase tracking-wider text-xs mb-3">Disponibles</Typography>
              <Typography variant="h2" className="font-light">{stats?.obrasDisponibles || 0}</Typography>
            </Box>
            <Box className="text-center">
              <Typography variant="body2" className="text-gray-600 uppercase tracking-wider text-xs mb-3">Solicitudes</Typography>
              <Typography variant="h2" className="font-light">{stats?.solicitudesPendientes || 0}</Typography>
            </Box>
          </div>
        </Paper>

        {cargandoGraficas ? (
          <Paper className="p-8 border border-gray-200" elevation={0}>
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
          </Paper>
        ) : (
          <>
            <Paper className="p-8 border border-gray-200" elevation={0}>
              <Typography variant="h6" className="font-light tracking-wide mb-6">Ventas e Ingresos Mensuales</Typography>
              {reportes?.ventasPorMes && reportes.ventasPorMes.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={reportes.ventasPorMes}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis dataKey="label" type="category" stroke="#666" style={{ fontSize: '12px' }} />
                    <YAxis yAxisId="left" stroke="#666" style={{ fontSize: '12px' }} />
                    <YAxis yAxisId="right" orientation="right" stroke="#666" style={{ fontSize: '12px' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: 0 }} />
                    <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                    <Line yAxisId="left" type="monotone" dataKey="ventas" stroke="#000" strokeWidth={2} name="Ventas" dot={{ r: 3 }} />
                    <Line yAxisId="right" type="monotone" dataKey="ingresos" stroke="#808080" strokeWidth={2} name="Ingresos ($)" dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Typography className="text-gray-500 text-center py-8">No hay datos de ventas en el período seleccionado</Typography>
              )}
            </Paper>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Paper className="p-8 border border-gray-200" elevation={0}>
                <Typography variant="h6" className="font-light tracking-wide mb-6">Obras Vendidas por Mes</Typography>
                {reportes?.comprasPorMes && reportes.comprasPorMes.some(c => c.cantidad > 0) ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={reportes.comprasPorMes}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                      <XAxis dataKey="label" type="category" stroke="#666" style={{ fontSize: '12px' }} />
                      <YAxis stroke="#666" style={{ fontSize: '12px' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: 0 }} />
                      <Bar dataKey="cantidad" fill="#000" name="Obras Vendidas" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Typography className="text-gray-500 text-center py-8">No hay ventas en el período seleccionado</Typography>
                )}
              </Paper>

              <Paper className="p-8 border border-gray-200" elevation={0}>
                <Typography variant="h6" className="font-light tracking-wide mb-6">Top Artistas por Ventas</Typography>
                {reportes?.topArtistas && reportes.topArtistas.some(a => a.ventas > 0) ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={reportes.topArtistas} layout="vertical" margin={{ left: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                      <XAxis type="number" stroke="#666" style={{ fontSize: '12px' }} />
                      <YAxis dataKey="nombre" type="category" stroke="#666" width={100} style={{ fontSize: '12px' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: 0 }} />
                      <Bar dataKey="ventas" fill="#000" name="Ventas" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Typography className="text-gray-500 text-center py-8">No hay ventas por artista en el período seleccionado</Typography>
                )}
              </Paper>
            </div>
          </>
        )}
      </div>
    </Box>
  );
};

export default DashboardContent;