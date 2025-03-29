// OllamaConnector.js - Para comunicarse con el servidor Ollama local

class OllamaConnector {
    constructor() {
      // URL de la API de Ollama (por defecto se ejecuta en localhost:11434)
      this.OLLAMA_API_URL = 'http://localhost:11434/api';
      
      // El modelo a utilizar (puedes cambiarlo según el que hayas descargado)
      this.MODEL_NAME = 'mistral'; // alternativas: 'gemma:2b', 'llama2', 'phi', etc.
      
      // Parámetros de generación
      // Parámetros de generación
    this.defaultParams = {
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 150,    // Reducir de 500 a 150 para respuestas más cortas
        stream: false
    };
    }
  
    /**
     * Genera una respuesta usando el modelo de Ollama
     * @param {string} prompt El texto de entrada para el modelo
     * @param {object} customParams Parámetros personalizados opcionales
     * @returns {Promise<string>} La respuesta generada
     */
    async generateResponse(prompt, customParams = {}) {
      try {
        // Combinar parámetros por defecto con personalizados
        const params = { ...this.defaultParams, ...customParams };
        
        // Crear la solicitud a la API de Ollama
        const response = await fetch(`${this.OLLAMA_API_URL}/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: this.MODEL_NAME,
            prompt: prompt,
            ...params
          })
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error de Ollama (${response.status}): ${errorText}`);
        }
  
        const data = await response.json();
        return data.response || '';
      } catch (error) {
        console.error('Error al comunicarse con Ollama:', error);
        throw error;
      }
    }
  
    /**
     * Método alternativo que usa el formato de chat similar a OpenAI
     * @param {Array} messages Array de mensajes en formato {role, content}
     * @returns {Promise<string>} La respuesta generada
     */
    async chatCompletion(messages) {
      try {
        const response = await fetch(`${this.OLLAMA_API_URL}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: this.MODEL_NAME,
            messages: messages,
            temperature: this.defaultParams.temperature,
            top_p: this.defaultParams.top_p,
            max_tokens: this.defaultParams.max_tokens,
            stream: false
          })
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error de Ollama (${response.status}): ${errorText}`);
        }
  
        const data = await response.json();
        return data.message?.content || '';
      } catch (error) {
        console.error('Error al usar chat de Ollama:', error);
        throw error;
      }
    }
  
    /**
     * Verifica si el servicio de Ollama está disponible
     * @returns {Promise<boolean>} True si Ollama está disponible
     */
    async checkAvailability() {
      try {
        const response = await fetch(`${this.OLLAMA_API_URL}/tags`, {
          method: 'GET'
        });
        
        return response.ok;
      } catch (error) {
        console.error('Ollama no parece estar disponible:', error);
        return false;
      }
    }
  }
  
  export default OllamaConnector;