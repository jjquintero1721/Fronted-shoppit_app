// src/components/search/SearchResults.jsx
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import HomeCard from '../home/HomeCard';
import Spinner from '../ui/Spinner';
import api from '../../api';
import styles from './SearchResults.module.css';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const isNaturalLanguage = searchParams.get('nl') === 'true';
  const searchType = searchParams.get('type') || 'general';
  const specificType = searchParams.get('specific') || null;
  
  const [results, setResults] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchInfo, setSearchInfo] = useState(null);
  
  // Mapeo de tipos de búsqueda a términos amigables para el usuario
  const searchTypeLabels = {
    'general': 'resultados para',
    'product': 'productos que coinciden con',
    'genre': 'juegos del género',
    'developer': 'juegos desarrollados por',
    'platform': 'juegos y consolas de',
    'categoria': 'productos en la categoría',
    'consola': 'consolas y juegos de'
  };
  
  // Nombres para mostrar de los tipos específicos
  const specificTypeNames = {
    // Géneros
    'accion': 'acción',
    'disparos': 'shooters y FPS',
    'aventura': 'aventura',
    'rpg': 'rol (RPG)',
    'estrategia': 'estrategia',
    'deportes': 'deportes',
    'carreras': 'carreras',
    'simulacion': 'simulación',
    'puzzle': 'puzles y lógica',
    'plataformas': 'plataformas',
    'terror': 'terror y horror',
    'mundo abierto': 'mundo abierto',
    'multijugador': 'multijugador',
    'roguelike': 'roguelike',
    'indie': 'indie',
    
    // Desarrolladores
    'rockstar': 'Rockstar Games',
    'naughty dog': 'Naughty Dog',
    'ubisoft': 'Ubisoft',
    'ea': 'Electronic Arts',
    'activision': 'Activision',
    'nintendo': 'Nintendo',
    'bethesda': 'Bethesda',
    'fromsoft': 'From Software',
    'capcom': 'Capcom',
    'square enix': 'Square Enix',
    'cd projekt': 'CD Projekt Red',
    
    // Plataformas
    'playstation': 'PlayStation',
    'xbox': 'Xbox',
    'pc': 'PC / Windows'
  };

  useEffect(() => {
    if (!query) return;
    
    setLoading(true);
    setError('');
    
    console.log(`Realizando búsqueda: "${query}" (Tipo: ${searchType}, Específico: ${specificType})`);
    
    // Usar la función de búsqueda con tipo específico
    api.searchProducts(query, searchType, specificType)
      .then(data => {
        setResults(data.results || []);
        setRelatedProducts(data.related || []);
        setSearchInfo(data.searchInfo || null);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error searching products:', err);
        setError('Ocurrió un error al buscar productos. Por favor, intenta de nuevo.');
        setLoading(false);
      });
  }, [query, searchType, specificType]);

  // Obtener el nombre amigable para el tipo específico
  const getSpecificTypeName = () => {
    if (!specificType) return '';
    return specificTypeNames[specificType] || specificType;
  };
  
  // Construir el título de búsqueda
  const getSearchTitle = () => {
    if (!query) return 'Todos los productos';
    
    let title = '';
    
    if (isNaturalLanguage) {
      title = 'Entendimos que buscas ';
    }
    
    // Añadir el tipo de búsqueda
    title += searchTypeLabels[searchType] || 'relacionados con';
    
    // Añadir el tipo específico si existe
    if (specificType && specificTypeNames[specificType]) {
      title += ` ${getSpecificTypeName()}: "${query}"`;
    } else {
      title += `: "${query}"`;
    }
    
    return title;
  };

  if (loading) {
    return <div className="text-center py-5"><Spinner loading={true} /></div>;
  }

  return (
    <div className="container py-4">
      <h2 className={styles.searchTitle}>
        {getSearchTitle()}
      </h2>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {!loading && !error && results.length === 0 && (
        <div className={styles.noResults}>
          <p>No encontramos productos que coincidan con "{query}".</p>
          {relatedProducts.length > 0 && (
            <p>Pero aquí hay algunos productos relacionados que podrían interesarte:</p>
          )}
        </div>
      )}
      
      {results.length > 0 && (
        <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center mb-5">
          {results.map(product => (
            <HomeCard key={product.id} product={product} />
          ))}
        </div>
      )}
      
      {relatedProducts.length > 0 && results.length === 0 && (
        <div className="mt-4">
          <h3 className={styles.relatedTitle}>Productos relacionados</h3>
          <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
            {relatedProducts.map(product => (
              <HomeCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
      
      <div className="text-center mt-4">
        <Link to="/" className="btn btn-outline-primary">
          Volver a la tienda
        </Link>
      </div>
    </div>
  );
};

export default SearchResults;