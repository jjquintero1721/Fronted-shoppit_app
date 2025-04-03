// src/components/search/AdvancedSearchCategories.js
// Este archivo contendrá mapeos de términos y categorías específicas para mejorar la búsqueda

// Categorías de géneros de videojuegos con sinónimos y términos relacionados
export const gameGenres = {
    'accion': ['accion', 'action', 'pelea', 'lucha', 'beat em up'],
    'disparos': ['disparos', 'shooter', 'fps', 'first person shooter', 'third person shooter', 'tps', 'battle royale'],
    'aventura': ['aventura', 'adventure', 'punto y clic', 'point and click'],
    'rpg': ['rpg', 'rol', 'role playing', 'role-playing', 'jrpg', 'arpg', 'action rpg'],
    'estrategia': ['estrategia', 'strategy', 'rts', 'tiempo real', 'real time', 'por turnos', 'turn based'],
    'deportes': ['deportes', 'sports', 'futbol', 'soccer', 'fifa', 'nba', 'tenis', 'formula 1', 'f1'],
    'carreras': ['carreras', 'racing', 'coches', 'autos', 'simulador de conduccion', 'driving'],
    'simulacion': ['simulacion', 'simulation', 'sim', 'gestión', 'management', 'construccion', 'building'],
    'puzzle': ['puzzle', 'rompecabezas', 'logica', 'logic'],
    'plataformas': ['plataformas', 'platform', 'platformer', 'side-scroller', 'scroll lateral'],
    'terror': ['terror', 'horror', 'miedo', 'survival horror', 'suspense'],
    'mundo abierto': ['mundo abierto', 'open world', 'sandbox', 'free roam'],
    'multijugador': ['multijugador', 'multiplayer', 'online', 'cooperativo', 'coop', 'pvp', 'battle royale'],
    'roguelike': ['roguelike', 'rogue-lite', 'roguelite', 'procedural'],
    'indie': ['indie', 'independiente', 'casual']
  };
  
  // Desarrolladores y publishers importantes con juegos asociados
  export const developers = {
    'rockstar': ['rockstar', 'rockstar games', 'gta', 'grand theft auto', 'red dead', 'bully', 'la noire'],
    'naughty dog': ['naughty dog', 'uncharted', 'the last of us', 'crash bandicoot'],
    'ubisoft': ['ubisoft', 'assassins creed', 'far cry', 'watch dogs', 'rainbow six', 'ghost recon'],
    'ea': ['ea', 'electronic arts', 'fifa', 'battlefield', 'apex legends', 'need for speed', 'mass effect'],
    'activision': ['activision', 'call of duty', 'cod', 'warzone', 'crash bandicoot', 'spyro'],
    'nintendo': ['nintendo', 'mario', 'zelda', 'metroid', 'pokemon', 'splatoon', 'animal crossing'],
    'bethesda': ['bethesda', 'fallout', 'elder scrolls', 'skyrim', 'doom', 'wolfenstein', 'starfield'],
    'fromsoft': ['from software', 'fromsoft', 'dark souls', 'elden ring', 'bloodborne', 'sekiro'],
    'capcom': ['capcom', 'resident evil', 'monster hunter', 'devil may cry', 'street fighter'],
    'square enix': ['square enix', 'final fantasy', 'kingdom hearts', 'dragon quest', 'tomb raider'],
    'cd projekt': ['cd projekt', 'cdpr', 'the witcher', 'cyberpunk']
  };
  
  // Consolas y plataformas
  export const platforms = {
    'playstation': ['playstation', 'ps5', 'ps4', 'ps3', 'ps2', 'psx', 'psone', 'sony'],
    'xbox': ['xbox', 'xbox series x', 'xbox one', 'xbox 360', 'microsoft'],
    'nintendo': ['nintendo', 'switch', 'wii', 'gamecube', 'n64', 'nes', 'snes'],
    'pc': ['pc', 'windows', 'steam', 'epic games', 'ordenador', 'computadora']
  };
  
  // Función para determinar el tipo de búsqueda específica basado en la consulta
  export function determineSpecificSearchType(query) {
    const queryLower = query.toLowerCase();
    const terms = queryLower.split(/\s+/);
    
    // Objeto para almacenar los resultados de la categorización
    const result = {
      mainType: 'general',
      specificType: null,
      searchTerms: [],
      originalQuery: query
    };
    
    // Verificar desarrolladores
    for (const [dev, keywords] of Object.entries(developers)) {
      if (keywords.some(keyword => queryLower.includes(keyword))) {
        result.mainType = 'developer';
        result.specificType = dev;
        // Añadir términos clave para mejorar la búsqueda
        result.searchTerms = [...keywords];
        break;
      }
    }
    
    // Si no se encontró un desarrollador, verificar géneros
    if (result.mainType === 'general') {
      for (const [genre, keywords] of Object.entries(gameGenres)) {
        if (keywords.some(keyword => queryLower.includes(keyword))) {
          result.mainType = 'genre';
          result.specificType = genre;
          // Añadir términos clave para mejorar la búsqueda
          result.searchTerms = [...keywords];
          break;
        }
      }
    }
    
    // Si no se encontró ni desarrollador ni género, verificar plataformas
    if (result.mainType === 'general') {
      for (const [platform, keywords] of Object.entries(platforms)) {
        if (keywords.some(keyword => queryLower.includes(keyword))) {
          result.mainType = 'platform';
          result.specificType = platform;
          // Añadir términos clave para mejorar la búsqueda
          result.searchTerms = [...keywords];
          break;
        }
      }
    }
    
    // Si seguimos sin categorizar, mantener como búsqueda general
    if (result.mainType === 'general') {
      result.searchTerms = terms;
    }
    
    return result;
  }