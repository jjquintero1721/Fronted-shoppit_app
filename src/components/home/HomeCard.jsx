import { useState } from 'react';
import { BASE_URL } from '../../api';
import { Link } from 'react-router-dom';
import styles from './HomeCard.module.css';

const HomeCard = ({product}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  return (
    <div className={`col-md-3 ${styles.col}`}>
      <Link to={`/products/${product.slug}`} className={styles.link}>
        <div className={styles.card}>
          {product.category && (
            <span className={styles.categoryBadge}>{product.category}</span>
          )}
          <div className={styles.cardImgWrapper}>
            {imageLoading && <div className={styles.imagePlaceholder}></div>}
            <img
              className={styles.cardImgTop}
              src={`${BASE_URL}${product.image}`}
              alt={product.name}
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{ visibility: imageLoading ? 'hidden' : 'visible' }}
            />
            {imageError && (
              <div className={styles.imageErrorOverlay}>
                <div className={styles.imageErrorContent}>
                  <span className={styles.gameIcon}>🎮</span>
                  <span>No disponible</span>
                </div>
              </div>
            )}
          </div>
          <div className={styles.cardBody}>
            <h5 className={`${styles.cardTitle}`}>{product.name}</h5>
            <h6 className={styles.cardText}>{`$${product.price}`}</h6>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default HomeCard;