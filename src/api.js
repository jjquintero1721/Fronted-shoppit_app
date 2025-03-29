import axios from "axios"
import { jwtDecode } from "jwt-decode"

export const BASE_URL = "http://127.0.0.1:8001"

const api = axios.create({
    baseURL: "http://127.0.0.1:8001",
})

// Función para buscar productos con lógica de búsqueda inteligente
api.searchProducts = async (query) => {
    try {
        // Primero intentamos buscar directamente usando el backend
        // Si existe un endpoint de búsqueda, descomenta la siguiente línea
        // const response = await api.get(`/search/?q=${encodeURIComponent(query)}`);
        // return response.data;
        
        // Si no hay endpoint de búsqueda, implementamos la búsqueda del lado del cliente
        const productsResponse = await api.get('/products/');
        const allProducts = productsResponse.data;
        
        // Implementar búsqueda inteligente en el cliente
        const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 1);
        
        // Función para calcular la relevancia de un producto
        const calculateRelevance = (product) => {
            let score = 0;
            const productName = product.name ? product.name.toLowerCase() : '';
            const productDesc = product.description ? product.description.toLowerCase() : '';
            const productCategory = product.category ? product.category.toLowerCase() : '';
            
            for (const term of searchTerms) {
                // Coincidencia en nombre (mayor peso)
                if (productName.includes(term)) {
                    score += 10;
                    // Coincidencia exacta o al inicio del nombre
                    if (productName === term || productName.startsWith(term + ' ')) {
                        score += 15;
                    }
                }
                
                // Coincidencia en descripción (peso medio)
                if (productDesc && productDesc.includes(term)) {
                    score += 5;
                }
                
                // Coincidencia en categoría (peso medio-alto)
                if (productCategory && productCategory.includes(term)) {
                    score += 8;
                }
            }
            
            return score;
        };
        
        // Calcular puntuación para cada producto
        const scoredProducts = allProducts.map(product => ({
            ...product,
            relevanceScore: calculateRelevance(product)
        }));
        
        // Filtrar productos con puntuación positiva como resultados directos
        const directResults = scoredProducts
            .filter(product => product.relevanceScore > 0)
            .sort((a, b) => b.relevanceScore - a.relevanceScore);
            
        // Obtener productos relacionados (basado en la categoría de los resultados principales)
        let relatedProducts = [];
        
        if (directResults.length > 0) {
            // Tomar las categorías de los primeros resultados
            const categories = [...new Set(directResults.slice(0, 3).map(p => p.category).filter(Boolean))];
            
            // Encontrar productos en las mismas categorías que no son resultados directos
            relatedProducts = allProducts
                .filter(p => p.category && categories.includes(p.category))
                .filter(p => !directResults.some(r => r.id === p.id))
                .slice(0, 8); // Limitamos a 8 productos relacionados
        } else {
            // Si no hay resultados directos, mostrar algunos productos aleatorios como "relacionados"
            // Crear una copia del array antes de ordenar para no modificar el original
            relatedProducts = [...allProducts]
                .sort(() => 0.5 - Math.random()) // Mezclar aleatoriamente
                .slice(0, 8);
        }
        
        // Devolver un objeto con la estructura esperada
        return {
            results: directResults.map(p => {
                // Eliminamos la propiedad de puntuación antes de devolver
                const { relevanceScore, ...product } = p;
                return product;
            }),
            related: relatedProducts
        };
    } catch (error) {
        console.error('Error en la búsqueda de productos:', error);
        throw error;
    }
};

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access")
        if(token){
            const decoded = jwtDecode(token)
            const expiry_date = decoded.exp
            const current_time = Date.now() / 1000
            if(expiry_date > current_time){
                config.headers.Authorization = `Bearer ${token}`
            }
            
        }
        return config;
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default api