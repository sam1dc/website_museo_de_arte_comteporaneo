export const MOCK_USER = {
  email: 'admin@museo.com',
  password: 'admin123',
  name: 'María González',
  role: 'Administrador'
};

export const MOCK_GENEROS = [
  { id: 1, nombre: 'Abstracto', caracteristicas: 'Formas no representativas' },
  { id: 2, nombre: 'Surrealismo', caracteristicas: 'Expresión del subconsciente' },
  { id: 3, nombre: 'Minimalismo', caracteristicas: 'Simplicidad y geometría' },
  { id: 4, nombre: 'Pop Art', caracteristicas: 'Cultura popular y consumo' }
];

export const MOCK_ARTISTAS = [
  { 
    id: 1, 
    nombre: 'Ana Martínez', 
    biografia: 'Artista contemporánea especializada en arte abstracto. Su obra explora la relación entre color y emoción.',
    generos: [1, 3],
    pais: 'España',
    fechaNacimiento: '1985-03-15'
  },
  { 
    id: 2, 
    nombre: 'Carlos Ruiz', 
    biografia: 'Pintor surrealista reconocido internacionalmente. Sus obras han sido exhibidas en museos de todo el mundo.',
    generos: [2],
    pais: 'México',
    fechaNacimiento: '1978-07-22'
  },
  { 
    id: 3, 
    nombre: 'Laura Chen', 
    biografia: 'Artista minimalista que trabaja con instalaciones y escultura. Explora el espacio y la percepción.',
    generos: [3],
    pais: 'China',
    fechaNacimiento: '1990-11-08'
  },
  { 
    id: 4, 
    nombre: 'Diego Vargas', 
    biografia: 'Exponente del pop art latinoamericano. Su obra critica la sociedad de consumo contemporánea.',
    generos: [4],
    pais: 'Argentina',
    fechaNacimiento: '1982-05-30'
  }
];

export const MOCK_OBRAS = [
  {
    id: 1,
    titulo: 'Sinfonía en Rojo',
    artistaId: 1,
    generoId: 1,
    precio: 15000,
    año: 2023,
    dimensiones: '120x90 cm',
    tecnica: 'Óleo sobre lienzo',
    descripcion: 'Una explosión de tonos rojos que evocan pasión y energía. Esta obra representa el culmen de la exploración cromática de la artista.',
    estatus: 'disponible',
    imagen: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800'
  },
  {
    id: 2,
    titulo: 'Geometría del Silencio',
    artistaId: 3,
    generoId: 3,
    precio: 22000,
    año: 2024,
    dimensiones: '150x150 cm',
    tecnica: 'Acrílico sobre madera',
    descripcion: 'Composición minimalista que invita a la contemplación. Las formas geométricas crean un diálogo visual sobre el espacio vacío.',
    estatus: 'disponible',
    imagen: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=800'
  },
  {
    id: 3,
    titulo: 'Sueños Líquidos',
    artistaId: 2,
    generoId: 2,
    precio: 28000,
    año: 2023,
    dimensiones: '100x140 cm',
    tecnica: 'Técnica mixta',
    descripcion: 'Una ventana al subconsciente donde la realidad se funde con el sueño. Elementos flotantes crean una narrativa onírica.',
    estatus: 'disponible',
    imagen: 'https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=800'
  },
  {
    id: 4,
    titulo: 'Consumo Masivo',
    artistaId: 4,
    generoId: 4,
    precio: 18000,
    año: 2024,
    dimensiones: '110x110 cm',
    tecnica: 'Serigrafía sobre lienzo',
    descripcion: 'Crítica visual a la cultura del consumo. Iconos populares reinterpretados con colores vibrantes y composición audaz.',
    estatus: 'disponible',
    imagen: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800'
  },
  {
    id: 5,
    titulo: 'Horizonte Infinito',
    artistaId: 1,
    generoId: 1,
    precio: 19500,
    año: 2024,
    dimensiones: '130x100 cm',
    tecnica: 'Óleo sobre lienzo',
    descripcion: 'Abstracción que evoca paisajes imaginarios. Capas de color crean profundidad y movimiento.',
    estatus: 'disponible',
    imagen: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800'
  },
  {
    id: 6,
    titulo: 'Espacio Negativo',
    artistaId: 3,
    generoId: 3,
    precio: 25000,
    año: 2023,
    dimensiones: '160x120 cm',
    tecnica: 'Instalación',
    descripcion: 'Exploración del vacío como elemento compositivo. La ausencia se convierte en presencia.',
    estatus: 'vendida',
    imagen: 'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=800'
  }
];
