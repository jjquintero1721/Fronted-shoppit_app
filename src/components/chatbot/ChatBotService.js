import OllamaConnector from './OllamaConnector';
import api from '../../api';

class ChatBotService {
  constructor(api) {
    this.api = api;
    this.ollama = new OllamaConnector();
    this.ollamaAvailable = false;
    
    // Verificar disponibilidad de Ollama al iniciar
    this.checkOllamaAvailability();
    
    // Define keywords and patterns for intent recognition
    this.intents = {
      greeting: {
        patterns: ['hola', 'buenos días', 'buenas tardes', 'buenas noches', 'saludos', 'hey', 'hi', 'hello'],
        responses: [
          '¡Hola! ¿En qué puedo ayudarte hoy?',
          '¡Saludos! ¿Cómo puedo asistirte?',
          '¡Bienvenido a A.I.A.G! ¿Qué estás buscando hoy?'
        ]
      },
      farewell: {
        patterns: ['adiós', 'chao', 'hasta luego', 'nos vemos', 'bye', 'gracias', 'thanks'],
        responses: [
          '¡Hasta luego! Estoy aquí si necesitas algo más.',
          '¡Gracias por chatear! Vuelve pronto.',
          '¡Que tengas un excelente día! Estoy disponible 24/7 si me necesitas.'
        ]
      },
      product_search: {
        // Patrones más específicos para evitar falsos positivos
        patterns: ['buscar producto', 'encontrar juego', 'busco un', 'quiero comprar', 'tienen a la venta', 
                 'venden', 'donde consigo', 'hay disponible'],
        action: 'searchProducts'
      },
      product_price: {
        patterns: ['precio', 'costo', 'vale', 'cuanto cuesta', 'cuánto vale', 'cuánto es'],
        action: 'getProductPrice'
      },
      order_status: {
        patterns: ['pedido', 'orden', 'compra', 'status', 'estado', 'seguimiento', 'donde está', 'track'],
        action: 'getOrderStatus'
      },
      payment_methods: {
        patterns: ['pago', 'pagar', 'método', 'metodo', 'tarjeta', 'paypal', 'flutterwave', 'efectivo', 'transferencia'],
        responses: [
          'Aceptamos pagos a través de PayPal y Flutterwave. Puedes elegir tu método preferido durante el proceso de checkout.',
          'Disponemos de dos métodos de pago: PayPal y Flutterwave. Ambos son seguros y rápidos.'
        ]
      },
      shipping: {
        patterns: ['envío', 'envio', 'entrega', 'shipping', 'llegada', 'recibir', 'cuando llega'],
        responses: [
          'Los envíos normalmente toman entre 3-5 días hábiles dependiendo de tu ubicación.',
          'Realizamos envíos a través de servicio estándar (3-5 días) y express (1-2 días, con cargo adicional).'
        ]
      },
      return_policy: {
        patterns: ['devolver', 'devolución', 'devolucion', 'retorno', 'cambio', 'garantía', 'garantia'],
        responses: [
          'Nuestra política de devoluciones te permite devolver productos en un plazo de 14 días tras la recepción. El producto debe estar en su estado original.',
          'Ofrecemos un período de 14 días para devoluciones. Contacta con nuestro servicio de atención al cliente para iniciar el proceso.'
        ]
      },
      account: {
        patterns: ['cuenta', 'perfil', 'contraseña', 'password', 'registro', 'registrar', 'login', 'iniciar sesión', 'acceder'],
        action: 'getAccountInfo'
      },
      contact: {
        patterns: ['contacto', 'contactar', 'teléfono', 'telefono', 'email', 'correo', 'atención al cliente', 'servicio'],
        responses: [
          'Puedes contactar con nuestro equipo de atención al cliente en jjquintero_9@cue.edu.co o llamando al +57 313 7082781.',
          'Estamos disponibles por email (jjquintero_9@cue.edu.co) o teléfono (+57 313 7082781) de lunes a viernes, de 9:00 a 18:00.'
        ]
      },
      help: {
        patterns: ['ayuda', 'help', 'asistencia', 'soporte', 'problemas', 'duda', 'dudas', 'pregunta', 'preguntas'],
        responses: [
          'Puedo ayudarte con búsqueda de productos, información de tu pedido, métodos de pago, envíos, devoluciones y más. ¿Con qué necesitas ayuda específicamente?',
          '¡Estoy aquí para ayudarte! Puedo darte información sobre productos, pedidos, envíos, pagos o cualquier otra consulta relacionada con nuestra tienda.'
        ]
      }
    };
  }
  
  // Verificar si Ollama está disponible
  async checkOllamaAvailability() {
    try {
      this.ollamaAvailable = await this.ollama.checkAvailability();
      console.log(`Ollama ${this.ollamaAvailable ? 'está' : 'no está'} disponible`);
    } catch (error) {
      this.ollamaAvailable = false;
      console.error('Error al verificar disponibilidad de Ollama:', error);
    }
  }

  // Process a message and return an appropriate response
  async processMessage(message, isAuthenticated) {
    console.log("Procesando mensaje:", message);
    console.log("Ollama disponible:", this.ollamaAvailable);
    
    // Convert message to lowercase for better matching
    const lowerMessage = message.toLowerCase();
    
    // Try pattern matching first for specific queries
    const patternMatch = await this.tryPatternMatching(lowerMessage, isAuthenticated);
    
    if (patternMatch) {
      console.log("Respuesta por coincidencia de patrón:", patternMatch);
      return patternMatch;
    }
    
    // Si no hay coincidencia de patrones y Ollama está disponible
    if (this.ollamaAvailable) {
      console.log("Usando Ollama para respuesta...");
      try {
        const ollamaResponse = await this.getOllamaResponse(message, isAuthenticated);
        console.log("Respuesta de Ollama:", ollamaResponse);
        return ollamaResponse;
      } catch (error) {
        console.error('Error al obtener respuesta de Ollama:', error);
        return this.getDefaultResponse();
      }
    } else {
      console.log("Ollama no disponible, devolviendo respuesta predeterminada");
      return this.getDefaultResponse();
    }
  }
  
  // Try to match the message with predefined patterns
  async tryPatternMatching(lowerMessage, isAuthenticated) {
    // Check if message matches any intent
    for (const intent in this.intents) {
      const { patterns, responses, action } = this.intents[intent];
      
      // Mejorar la detección de patrones usando una puntuación mínima
      // para evitar coincidencias parciales que generan falsos positivos
      let bestMatch = null;
      let highestScore = 0.7; // Umbral mínimo de coincidencia
      
      for (const pattern of patterns) {
        // Coincidencia exacta (prioridad máxima)
        if (lowerMessage.includes(pattern)) {
          const score = pattern.length / lowerMessage.length;
          if (score > highestScore) {
            highestScore = score;
            bestMatch = pattern;
          }
        }
      }
      
      if (bestMatch) {
        console.log(`Patrón coincidente: ${bestMatch} (score: ${highestScore})`);
        
        // Si hay una acción, ejecutarla
        if (action) {
          return await this[action](lowerMessage, isAuthenticated);
        }
        
        // Devolver una respuesta aleatoria del array de respuestas
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }
    
    return null; // No pattern match found
  }
  
  // Get a response from Ollama
  // Reemplaza el método getOllamaResponse en ChatBotService.js con esta versión mejorada

async getOllamaResponse(message, isAuthenticated) {
    // Recopilar información sobre la tienda para dar contexto
    let storeInfo = "";
    let videoGames = [];
    let electronics = [];
    
    try {
      const response = await this.api.get('products/');
      const products = response.data;
      
      if (products && products.length > 0) {
        // Separar productos entre videojuegos y electrónicos
        products.forEach(product => {
          // Clasificar basado en el nombre o categoría del producto
          const name = product.name.toLowerCase();
          if (name.includes('ps5') || name.includes('xbox') || name.includes('switch') || 
              name.includes('playstation') || name.includes('nintendo') || 
              name.includes('consola') || name.includes('control') || 
              (product.category && (product.category.toLowerCase().includes('electronicos')))) {
            electronics.push(product.name);
          } else {
            videoGames.push(product.name);
          }
        });
        
        // Construir información contextual
        if (videoGames.length > 0) {
          storeInfo += `Videojuegos disponibles: ${videoGames.slice(0, 5).join(", ")}${videoGames.length > 5 ? ", y más" : ""}.`;
        }
        
        if (electronics.length > 0) {
          storeInfo += ` Electrónicos disponibles: ${electronics.slice(0, 3).join(", ")}${electronics.length > 3 ? ", y más" : ""}.`;
        }
      }
    } catch (error) {
      console.error('Error fetching products for context:', error);
    }
    
    // El resto del método permanece igual...
    const messages = [
      {
        role: "system",
        content: `Eres un asistente virtual conciso para la tienda A.I.A.G de videojuegos y electrónicos. 
        Responde siempre de forma BREVE y DIRECTA, con un máximo de 2-3 oraciones.
        
        Información importante de la tienda:
        - Diferencia claramente entre VIDEOJUEGOS (títulos de juegos como FIFA, Call of Duty, Mario Bros) y ELECTRÓNICOS (consolas como PS5, Xbox, Nintendo Switch, y otros dispositivos).
        - Las consolas NO son videojuegos, son dispositivos electrónicos para jugar videojuegos.
        - Cuando pregunten por videojuegos, menciona títulos específicos (FIFA 24, God of War, Mario Kart, etc.).
        - Cuando pregunten por consolas o electrónicos, menciona PlayStation 5, Xbox Series X, Nintendo Switch, etc.
        - Aceptamos pagos con PayPal y Flutterwave.
        - Los envíos toman entre 3-5 días hábiles.
        
        Ejemplos de VIDEOJUEGOS específicos en nuestro catálogo:
        - Juegos de PS5: FIFA 24, God of War Ragnarok, Spider-Man 2, Call of Duty Modern Warfare
        - Juegos de Xbox: Halo Infinite, Forza Horizon 5, Starfield
        - Juegos de Switch: Zelda: Tears of the Kingdom, Mario Kart 8, Animal Crossing

        Información importante:
            - A.I.A.G es una tienda especializada en videojuegos y electrónicos.
            - Aceptamos pagos con PayPal y Flutterwave.
            - Los envíos toman entre 3-5 días hábiles.
            - Tenemos política de devolución de 14 días.
        
        ${storeInfo}
        
        ${isAuthenticated ? 'El usuario ha iniciado sesión.' : 'El usuario no ha iniciado sesión.'}
        
        IMPORTANTE: Mantén tus respuestas cortas y precisas, máximo 2-3 oraciones.`
      },
      {
        role: "user",
        content: message
      }
    ];
    
    try {
      // Usar el método de chat de Ollama
      const response = await this.ollama.chatCompletion(messages);
      return response || this.getDefaultResponse();
    } catch (error) {
      console.error('Error getting Ollama response:', error);
      
      // Si falla el método de chat, intentar con generación simple
      try {
        const prompt = `${messages[0].content}\n\nUsuario: ${message}\n\nAsistente:`;
        const fallbackResponse = await this.ollama.generateResponse(prompt);
        return fallbackResponse || this.getDefaultResponse();
      } catch (secondError) {
        console.error('Error en fallback de Ollama:', secondError);
        return this.getDefaultResponse();
      }
    }
  }
  
  // Calculate similarity between two strings (simple implementation)
  calculateSimilarity(str1, str2) {
    // Simple Jaccard similarity
    const set1 = new Set(str1.split(' '));
    const set2 = new Set(str2.split(' '));
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return intersection.size / union.size;
  }
  
  // Extract product name from message
  extractProductName(message) {
    // Lista ampliada de palabras para filtrar
    const commonWords = [
      'buscar', 'encontrar', 'producto', 'productos', 'quiero', 'busco', 'tienes', 'tienen',
      'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'del', 'por', 'para',
      'con', 'sin', 'sobre', 'bajo', 'tras', 'mediante', 'hacia', 'contra', 'según',
      'durante', 'mediante', 'versus', 'y', 'o', 'u', 'ni', 'e', 'pero', 'sino', 'aunque',
      'porque', 'pues', 'que', 'si', 'cuando', 'como', 'donde', 'cual', 'cuales', 'quien',
      'quienes', 'cuyo', 'cuyos', 'cuya', 'cuyas', 'me', 'te', 'se', 'nos', 'os', 'les',
      'hay', 'hay', 'son', 'están', 'comprar', 'adquirir', 'obtener', 'conseguir'
    ];
    
    // Remove common words and just keep potential product terms
    const words = message.split(' ');
    const filteredWords = words.filter(word => !commonWords.includes(word.toLowerCase()));
    
    return filteredWords.join(' ').trim();
  }
  
  // Handle product search
  async searchProducts(message) {
    const productQuery = this.extractProductName(message);
    
    if (!productQuery || productQuery.length < 2) {
      return 'Por favor, indícame qué producto estás buscando.';
    }
    
    try {
      // Call API to get products
      const response = await this.api.get('products/');
      const products = response.data;
      
      // Filter products that match the query
      const matchingProducts = products.filter(product => 
        product.name.toLowerCase().includes(productQuery) || 
        (product.description && product.description.toLowerCase().includes(productQuery)) ||
        (product.category && product.category.toLowerCase().includes(productQuery))
      );
      
      if (matchingProducts.length === 0) {
        return `Lo siento, no encontré productos que coincidan con "${productQuery}". ¿Quieres buscar algo más?`;
      }
      
      // Return information about matching products
      if (matchingProducts.length === 1) {
        const product = matchingProducts[0];
        return `He encontrado el producto "${product.name}" por $${product.price}. Puedes verlo en detalle visitando la página del producto.`;
      } else {
        // Format a response with multiple products
        let response = `He encontrado ${matchingProducts.length} productos relacionados con "${productQuery}":\n\n`;
        matchingProducts.slice(0, 3).forEach((product, index) => {
          response += `${index + 1}. ${product.name} - $${product.price}\n`;
        });
        
        if (matchingProducts.length > 3) {
          response += `\nY ${matchingProducts.length - 3} más. Por favor, ve a la página principal para ver todos los resultados.`;
        }
        
        return response;
      }
    } catch (error) {
      console.error('Error searching products:', error);
      return 'Lo siento, tuve un problema al buscar productos. Por favor, intenta usar la barra de búsqueda en la página principal.';
    }
  }
  
  // Handle product price inquiries
  async getProductPrice(message) {
    const productQuery = this.extractProductName(message);
    
    if (!productQuery || productQuery.length < 2) {
      return 'Por favor, indica para qué producto quieres saber el precio.';
    }
    
    try {
      // Call API to get products
      const response = await this.api.get('products/');
      const products = response.data;
      
      // Find the product that best matches the query
      const matchingProduct = products.find(product => 
        product.name.toLowerCase().includes(productQuery)
      );
      
      if (!matchingProduct) {
        return `Lo siento, no encontré un producto que coincida con "${productQuery}". ¿Quieres preguntar por otro producto?`;
      }
      
      return `El precio de ${matchingProduct.name} es $${matchingProduct.price}.`;
    } catch (error) {
      console.error('Error getting product price:', error);
      return 'Lo siento, tuve un problema al obtener el precio. Por favor, intenta buscar el producto directamente en nuestra tienda.';
    }
  }
  
  // Handle order status inquiries
  async getOrderStatus(message, isAuthenticated) {
    if (!isAuthenticated) {
      return 'Para consultar el estado de tu pedido, necesitas iniciar sesión en tu cuenta. ¿Ya tienes una cuenta con nosotros?';
    }
    
    try {
      // Call API to get user info including order history
      const response = await this.api.get('user_info');
      const userInfo = response.data;
      const orderItems = userInfo.items || [];
      
      if (orderItems.length === 0) {
        return 'No encontré pedidos recientes en tu cuenta. Si acabas de realizar una compra, puede tardar unos minutos en aparecer en tu historial.';
      }
      
      // Group items by order ID to show the most recent order
      const orderGroups = {};
      orderItems.forEach(item => {
        if (!orderGroups[item.order_id]) {
          orderGroups[item.order_id] = {
            id: item.order_id,
            date: item.order_date,
            items: []
          };
        }
        orderGroups[item.order_id].items.push(item);
      });
      
      // Get the most recent order
      const orderIds = Object.keys(orderGroups);
      const mostRecentOrderId = orderIds.sort((a, b) => 
        new Date(orderGroups[b].date) - new Date(orderGroups[a].date)
      )[0];
      
      const mostRecentOrder = orderGroups[mostRecentOrderId];
      
      return `Tu pedido más reciente (${mostRecentOrder.id}) fue realizado el ${new Date(mostRecentOrder.date).toLocaleDateString()}. Contiene ${mostRecentOrder.items.length} producto(s) y ha sido entregado. Puedes ver todos los detalles de tus pedidos en la sección "Mi perfil".`;
    } catch (error) {
      console.error('Error getting order status:', error);
      return 'Lo siento, tuve un problema al obtener el estado de tu pedido. Por favor, visita la sección "Mi perfil" para ver tu historial de pedidos o contacta a nuestro servicio de atención al cliente.';
    }
  }
  
  // Handle account related inquiries
  async getAccountInfo(message, isAuthenticated) {
    if (!isAuthenticated) {
      if (message.includes('registrar') || message.includes('registro')) {
        return 'Puedes registrarte fácilmente haciendo clic en "Registrarse" en la parte superior de la página. Necesitarás proporcionar un nombre de usuario, email, contraseña y algunos datos personales.';
      } else if (message.includes('login') || message.includes('iniciar sesión') || message.includes('acceder')) {
        return 'Puedes iniciar sesión haciendo clic en "Iniciar Sesión" en la parte superior de la página. Necesitarás tu nombre de usuario y contraseña.';
      } else if (message.includes('contraseña') || message.includes('password')) {
        return 'Si olvidaste tu contraseña, puedes restablecerla haciendo clic en "¿Olvidaste tu contraseña?" en la página de inicio de sesión.';
      }
      
      return 'Para acceder a la información de tu cuenta, debes iniciar sesión primero. ¿Necesitas ayuda para iniciar sesión o registrarte?';
    }
    
    try {
      // Call API to get user info
      const response = await this.api.get('user_info');
      const userInfo = response.data;
      
      if (message.includes('perfil') || message.includes('cuenta')) {
        return `Tu cuenta está activa. Tu nombre de usuario es ${userInfo.username} y tu email registrado es ${userInfo.email}. Puedes editar tu información personal desde la sección "Mi perfil".`;
      } else if (message.includes('contraseña') || message.includes('password')) {
        return 'Para cambiar tu contraseña, ve a la sección "Mi perfil" y haz clic en "Editar perfil". Allí podrás actualizar tu contraseña.';
      }
      
      return `Tu cuenta está activa y configurada correctamente. ¿Necesitas ayuda con algo específico relacionado con tu cuenta?`;
    } catch (error) {
      console.error('Error getting account info:', error);
      return 'Lo siento, tuve un problema al obtener la información de tu cuenta. Por favor, visita la sección "Mi perfil" para ver tus datos o contacta a nuestro servicio de atención al cliente.';
    }
  }
  
  // Default response when no intent is matched
  getDefaultResponse() {
    const defaultResponses = [
      'No estoy seguro de entender tu pregunta. ¿Puedes reformularla o ser más específico?',
      'Hmm, no tengo información sobre eso. ¿Puedo ayudarte con algo más, como información de productos o estado de pedidos?',
      'Parece que esa consulta está fuera de mi conocimiento. Puedo ayudarte con búsqueda de productos, información de pedidos, métodos de pago y envíos.',
      'No tengo respuesta para esa pregunta. ¿Te gustaría saber sobre nuestros productos, políticas de envío o métodos de pago?'
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  // Agregar estos métodos a la clase ChatBotService en src/components/chatbot/ChatBotService.js

// Método para obtener información de productos
async getProductInfo(productQuery) {
  try {
    // Buscar el producto
    const searchResults = await api.searchProducts(productQuery);
    
    if (searchResults.results && searchResults.results.length > 0) {
      const product = searchResults.results[0]; // Obtener el mejor resultado
      
      return {
        found: true,
        product: product,
        message: `¡He encontrado "${product.name}"! Precio: $${product.price}. ¿Quieres ver más detalles?`,
        url: `/products/${product.slug}`
      };
    } else {
      return {
        found: false,
        message: `Lo siento, no encontré ningún producto que coincida con "${productQuery}". ¿Quieres buscar algo más?`
      };
    }
  } catch (error) {
    console.error('Error al obtener información del producto:', error);
    return {
      found: false,
      message: "Lo siento, tuve un problema al buscar ese producto. ¿Puedes intentar con otro término de búsqueda?"
    };
  }
}

async processMessage(message, isAuthenticated) {
  console.log("Procesando mensaje:", message);
  console.log("Ollama disponible:", this.ollamaAvailable);
  
  // Patrones para detectar consultas de productos
  const productInquiryPatterns = [
    /quiero comprar (.*)/i,
    /busco (.*)/i,
    /tienes (.*)/i,
    /hay (.*)/i,
    /precio de (.*)/i,
    /cuanto cuesta (.*)/i,
    /me gustaria comprar (.*)/i,
    /informacion sobre (.*)/i,
    /info de (.*)/i,
    /detalles de (.*)/i
  ];
  
  const categoryInquiryPatterns = [
    /tienes juegos de (.*)/i,
    /hay juegos de (.*)/i,
    /busco juegos de (.*)/i,
    /juegos de (.*) disponibles/i,
    /tienes (.*) games/i,
    /me gustan los juegos de (.*)/i,
    /me interesan los juegos de (.*)/i,
    /quiero ver (.*) games/i,
    /tienes consolas (.*)/i,
    /consolas (.*) disponibles/i,
    /busco consolas (.*)/i,
    /hay consolas (.*)/i,
    /tienes productos de (.*)/i
  ];

  for (const pattern of productInquiryPatterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      const productQuery = match[1].trim();
      const productInfo = await this.getProductInfo(productQuery);
      
      console.log("Información del producto:", productInfo);
      
      // Devolver directamente el mensaje (HTML o texto plano)
      return productInfo.message;
    }
  }

  for (const pattern of categoryInquiryPatterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      const categoryQuery = match[1].trim();
      console.log("Categoría detectada:", categoryQuery);
      
      const categoryResults = await this.searchProductsByCategory(categoryQuery);
      console.log("Resultados de categoría:", categoryResults);
      
      return categoryResults.message;
    }
  }
  
  // Convertir mensaje a minúsculas para mejor coincidencia
  const lowerMessage = message.toLowerCase();
  
  // Intentar coincidencia de patrones primero para consultas específicas
  const patternMatch = await this.tryPatternMatching(lowerMessage, isAuthenticated);
  
  if (patternMatch) {
    console.log("Respuesta por coincidencia de patrón:", patternMatch);
    return patternMatch;
  }
  
  // Si no hay coincidencia de patrones y Ollama está disponible
  if (this.ollamaAvailable) {
    console.log("Usando Ollama para respuesta...");
    try {
      const ollamaResponse = await this.getOllamaResponse(message, isAuthenticated);
      console.log("Respuesta de Ollama:", ollamaResponse);
      return ollamaResponse;
    } catch (error) {
      console.error('Error al obtener respuesta de Ollama:', error);
      return this.getDefaultResponse();
    }
  } else {
    console.log("Ollama no disponible, devolviendo respuesta predeterminada");
    return this.getDefaultResponse();
  }
}

async getProductInfo(productQuery) {
  try {
    console.log("Buscando información para:", productQuery);
    
    // Buscar el producto
    const searchResults = await api.searchProducts(productQuery);
    
    if (searchResults.results && searchResults.results.length > 0) {
      const product = searchResults.results[0]; // Obtener el mejor resultado
      console.log("Producto encontrado:", product);
      
      // Construir un mensaje HTML con el enlace incorporado
      const productLink = `<a href="/products/${product.slug}" class="product-link" target="_blank">Ver ${product.name}</a>`;
      
      return {
        found: true,
        product: product,
        message: `¡Sí, tenemos "${product.name}"! Precio: ${product.price}. ${productLink}`,
        htmlMessage: true
      };
    } else {
      return {
        found: false,
        message: `Lo siento, no encontré ningún producto que coincida con "${productQuery}". ¿Quieres buscar algo más?`,
        htmlMessage: false
      };
    }
  } catch (error) {
    console.error('Error al obtener información del producto:', error);
    return {
      found: false,
      message: "Lo siento, tuve un problema al buscar ese producto. ¿Puedes intentar con otro término de búsqueda?",
      htmlMessage: false
    };
  }
}

// Agregar estos métodos a ChatBotService.js

// Método para buscar productos por categoría o género
async searchProductsByCategory(category) {
  try {
    console.log("Buscando productos de la categoría:", category);
    
    // Determinar si es una búsqueda de género o de categoría/consola
    let searchType = 'general';
    
    // Lista de géneros comunes de videojuegos
    const genres = [
      'accion', 'action', 'shooter', 'fps', 'disparos', 'aventura', 'adventure',
      'rpg', 'rol', 'estrategia', 'strategy', 'deportes', 'sports', 'carreras', 'racing',
      'simulacion', 'simulation', 'puzzle', 'arcade', 'plataformas', 'platform',
      'terror', 'horror', 'supervivencia', 'survival', 'mundo abierto', 'open world'
    ];
    
    // Lista de consolas
    const consoles = [
      'ps5', 'ps4', 'playstation', 'playstation 5', 'playstation 4',
      'xbox', 'xbox one', 'xbox series', 'xbox series x', 'xbox series s',
      'nintendo', 'switch', 'nintendo switch', 'pc', 'windows'
    ];
    
    // Determinar el tipo de búsqueda basado en la categoría
    const categoryLower = category.toLowerCase();
    
    if (genres.some(genre => categoryLower.includes(genre))) {
      searchType = 'genero';
    } else if (consoles.some(console => categoryLower.includes(console))) {
      searchType = 'consola';
    } else {
      searchType = 'categoria';
    }
    
    // Realizar la búsqueda usando la API
    const searchResults = await api.searchProducts(category, searchType);
    
    if (searchResults.results && searchResults.results.length > 0) {
      // Limitar a 5 resultados para no sobrecargar el mensaje
      const topResults = searchResults.results.slice(0, 5);
      
      // Construir un mensaje HTML con enlaces a los productos
      let messageHTML = `<p>He encontrado ${searchResults.results.length} productos en la categoría "${category}":</p><ul style="margin-top: 8px; padding-left: 20px;">`;
      
      topResults.forEach(product => {
        messageHTML += `<li style="margin-bottom: 5px;"><a href="/products/${product.slug}" class="product-link" target="_blank">${product.name}</a> - $${product.price}</li>`;
      });
      
      if (searchResults.results.length > 5) {
        messageHTML += `<li>Y ${searchResults.results.length - 5} productos más...</li>`;
      }
      
      messageHTML += '</ul>';
      
      return {
        found: true,
        count: searchResults.results.length,
        message: messageHTML,
        htmlMessage: true
      };
    } else {
      return {
        found: false,
        message: `Lo siento, no encontré productos en la categoría "${category}". ¿Quieres buscar en otra categoría?`,
        htmlMessage: false
      };
    }
  } catch (error) {
    console.error('Error al buscar productos por categoría:', error);
    return {
      found: false,
      message: "Lo siento, tuve un problema al buscar esa categoría. ¿Puedes intentar con otra búsqueda?",
      htmlMessage: false
    };
  }
}

}




export default ChatBotService;