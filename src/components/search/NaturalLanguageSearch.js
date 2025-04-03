// src/components/search/NaturalLanguageSearch.js
// Actualizar con importaciones y métodos mejorados

import OllamaConnector from '../chatbot/OllamaConnector';
import { determineSpecificSearchType, gameGenres, developers, platforms } from './AdvancedSearchCategories';

class NaturalLanguageSearch {
  constructor() {
    this.ollama = new OllamaConnector();
    this.ollamaAvailable = false;
    
    // Check Ollama availability when instantiated
    this.checkOllamaAvailability();
  }
  
  async checkOllamaAvailability() {
    try {
      this.ollamaAvailable = await this.ollama.checkAvailability();
      console.log(`Ollama ${this.ollamaAvailable ? 'está' : 'no está'} disponible para búsqueda NL`);
    } catch (error) {
      this.ollamaAvailable = false;
      console.error('Error al verificar disponibilidad de Ollama para búsqueda NL:', error);
    }
  }
  
  async processSearchQuery(query) {
    // Primera fase: intentar analizar la consulta con nuestro sistema propio
    const specificSearch = determineSpecificSearchType(query);
    console.log('Análisis de búsqueda específica:', specificSearch);
    
    // Si pudimos identificar un tipo específico (desarrollador, género, plataforma)
    if (specificSearch.mainType !== 'general') {
      return {
        processedQuery: query,
        isNaturalLanguage: true,
        searchType: specificSearch.mainType,
        specificType: specificSearch.specificType,
        searchTerms: specificSearch.searchTerms
      };
    }
    
    // Segunda fase: si no pudimos categorizar específicamente y Ollama está disponible
    if (this.ollamaAvailable) {
      return await this.processWithOllama(query);
    }
    
    // Si nada funciona, devolver la consulta original como búsqueda general
    return { 
      processedQuery: query, 
      isNaturalLanguage: false,
      searchType: 'general'
    };
  }
  
  async processWithOllama(query) {
    try {
      // Crear un prompt para Ollama para extraer la intención de búsqueda
      const prompt = `
Eres un asistente de búsqueda especializado para una tienda de videojuegos. Analiza la intención de búsqueda del usuario.
Identifica si están buscando: un juego específico, un género de juegos, juegos de un desarrollador específico, o una consola.

Tu respuesta debe estar en este formato:
TIPO: [producto|genero|desarrollador|consola]
BUSQUEDA: [palabras clave relevantes]

Ejemplos:
Usuario: "me gustaría comprar el juego red dead"
Respuesta:
TIPO: producto
BUSQUEDA: red dead redemption 2

Usuario: "tienes juegos de disparos?"
Respuesta:
TIPO: genero
BUSQUEDA: shooter fps juegos de disparos

Usuario: "juegos de rockstar"
Respuesta:
TIPO: desarrollador
BUSQUEDA: rockstar games gta red dead

Usuario: "muéstrame las consolas PlayStation"
Respuesta:
TIPO: consola
BUSQUEDA: playstation ps5 ps4

Consulta del usuario: "${query}"
Respuesta: `;

      // Obtener la consulta procesada de Ollama
      const processedResponse = await this.ollama.generateResponse(prompt);
      
      console.log("Respuesta de Ollama:", processedResponse);
      
      // Intentar extraer el tipo y la búsqueda del formato estructurado
      let searchType = 'general';
      let processedQuery = query;
      let specificType = null;
      
      const tipoMatch = processedResponse.match(/TIPO:\s*(\w+)/i);
      const busquedaMatch = processedResponse.match(/BUSQUEDA:\s*(.+?)(?:\n|$)/i);
      
      if (tipoMatch && busquedaMatch) {
        const tipoValue = tipoMatch[1].toLowerCase();
        
        // Mapear los tipos de Ollama a nuestros tipos internos
        if (tipoValue === 'genero') searchType = 'genre';
        else if (tipoValue === 'desarrollador') searchType = 'developer';
        else if (tipoValue === 'consola') searchType = 'platform';
        else if (tipoValue === 'producto') searchType = 'product';
        else searchType = tipoValue;
        
        processedQuery = busquedaMatch[1].trim();
        
        // Intentar determinar el subtipo específico basado en los términos
        if (searchType === 'genre') {
          // Buscar el género específico basado en los términos de búsqueda
          for (const [genre, keywords] of Object.entries(gameGenres)) {
            if (keywords.some(keyword => processedQuery.toLowerCase().includes(keyword))) {
              specificType = genre;
              break;
            }
          }
        } else if (searchType === 'developer') {
          // Buscar el desarrollador específico basado en los términos de búsqueda
          for (const [dev, keywords] of Object.entries(developers)) {
            if (keywords.some(keyword => processedQuery.toLowerCase().includes(keyword))) {
              specificType = dev;
              break;
            }
          }
        } else if (searchType === 'platform') {
          // Buscar la plataforma específica basado en los términos de búsqueda
          for (const [platform, keywords] of Object.entries(platforms)) {
            if (keywords.some(keyword => processedQuery.toLowerCase().includes(keyword))) {
              specificType = platform;
              break;
            }
          }
        }
        
        console.log(`Tipo detectado: ${searchType}, Específico: ${specificType}, Búsqueda: ${processedQuery}`);
      } else {
        // Si no se puede extraer el formato estructurado, usar toda la respuesta
        processedQuery = processedResponse.trim() || query;
      }
      
      return { 
        processedQuery: processedQuery, 
        isNaturalLanguage: true,
        searchType: searchType,
        specificType: specificType
      };
    } catch (error) {
      console.error('Error procesando con Ollama:', error);
      return { 
        processedQuery: query, 
        isNaturalLanguage: false,
        searchType: 'general'
      };
    }
  }
}

export default NaturalLanguageSearch;