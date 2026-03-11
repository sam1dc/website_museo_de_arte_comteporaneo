// Constantes para el dashboard y reportes

export const MESES = [
  { numero: 1, nombre: 'Ene', nombreCompleto: 'Enero' },
  { numero: 2, nombre: 'Feb', nombreCompleto: 'Febrero' },
  { numero: 3, nombre: 'Mar', nombreCompleto: 'Marzo' },
  { numero: 4, nombre: 'Abr', nombreCompleto: 'Abril' },
  { numero: 5, nombre: 'May', nombreCompleto: 'Mayo' },
  { numero: 6, nombre: 'Jun', nombreCompleto: 'Junio' },
  { numero: 7, nombre: 'Jul', nombreCompleto: 'Julio' },
  { numero: 8, nombre: 'Ago', nombreCompleto: 'Agosto' },
  { numero: 9, nombre: 'Sep', nombreCompleto: 'Septiembre' },
  { numero: 10, nombre: 'Oct', nombreCompleto: 'Octubre' },
  { numero: 11, nombre: 'Nov', nombreCompleto: 'Noviembre' },
  { numero: 12, nombre: 'Dic', nombreCompleto: 'Diciembre' }
];

export const obtenerNombreMes = (numeroMes) => {
  const mes = MESES.find(m => m.numero === parseInt(numeroMes));
  return mes ? mes.nombre : '';
};

export const obtenerNombreMesCompleto = (numeroMes) => {
  const mes = MESES.find(m => m.numero === parseInt(numeroMes));
  return mes ? mes.nombreCompleto : '';
};

export const COLORES_GRAFICAS = ['#000000', '#404040', '#808080', '#a0a0a0', '#c0c0c0'];
