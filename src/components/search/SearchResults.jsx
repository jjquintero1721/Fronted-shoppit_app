import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import HomeCard from '../home/HomeCard';
import Spinner from '../ui/Spinner';
import api from '../../api';
import styles from './SearchResults.module.css';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!query) return;
    
    setLoading(true);
    setError('');
    
    // Usar la función de búsqueda inteligente
    api.searchProducts(query)
      .then(data => {
        setResults(data.results || []);
        setRelatedProducts(data.related || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error searching products:', err);
        setError('Ocurrió un error al buscar productos. Por favor, intenta de nuevo.');
        setLoading(false);
      });
  }, [query]);

  if (loading) {
    return <div className="text-center py-5"><Spinner loading={true} /></div>;
  }

  return (
    <div className="container py-4">
      <h2 className={styles.searchTitle}>
        {query ? `Resultados de búsqueda para "${query}"` : 'Todos los productos'}
      </h2>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {!loading && !error && results.length === 0 && (
        <div className={styles.noResults}>
          <p>No se encontraron productos que coincidan con "{query}".</p>
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