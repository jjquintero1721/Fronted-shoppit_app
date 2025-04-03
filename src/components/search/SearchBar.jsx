// src/components/search/SearchBar.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import styles from './SearchBar.module.css';
import NaturalLanguageSearch from './NaturalLanguageSearch';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const nlSearch = new NaturalLanguageSearch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (query.trim()) {
      setIsProcessing(true);
      
      try {
        // Procesar la consulta con comprensión de lenguaje natural
        const { 
          processedQuery, 
          isNaturalLanguage, 
          searchType, 
          specificType,
          searchTerms
        } = await nlSearch.processSearchQuery(query.trim());
        
        console.log("Búsqueda procesada:", { 
          processedQuery, 
          isNaturalLanguage, 
          searchType, 
          specificType,
          searchTerms
        });
        
        // Construir la URL de búsqueda con todos los parámetros relevantes
        let searchUrl = `/search?q=${encodeURIComponent(processedQuery)}`;
        
        // Añadir parámetros adicionales si están disponibles
        if (isNaturalLanguage) searchUrl += '&nl=true';
        if (searchType) searchUrl += `&type=${searchType}`;
        if (specificType) searchUrl += `&specific=${specificType}`;
        
        // Navegar a los resultados de búsqueda
        navigate(searchUrl);
        
        // Limpiar la caja de búsqueda
        setQuery('');
      } catch (error) {
        console.error('Error durante el procesamiento de la búsqueda:', error);
        // Volver a búsqueda básica si hay un error
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        setQuery('');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <form className={styles.searchForm} onSubmit={handleSubmit}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Buscar productos, géneros, desarrolladores..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.searchInput}
          aria-label="Buscar productos"
        />
        <button 
          type="submit" 
          className={styles.searchButton} 
          aria-label="Buscar"
          disabled={isProcessing}
        >
          <FaSearch />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;