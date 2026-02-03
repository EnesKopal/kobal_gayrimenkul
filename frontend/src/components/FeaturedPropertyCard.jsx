import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FeaturedPropertyCard.module.css';
import { FaRegBookmark } from 'react-icons/fa';


function FeaturedPropertyCard({ portfolio }) {
  const navigate = useNavigate();
  const API_URL = "http://localhost:5001/";

  const { id, title, price, address, Images, type, status, description } = portfolio;


  const bgImage = Images && Images.length > 0 
    ? `${API_URL}${Images[0].image_url}` 
    : '/default-property.jpg';

  const formatPrice = (p) => {
    return p ? `${Number(p).toLocaleString("tr-TR")} TL` : "Fiyat Yok";
  };

  return (
    <div 
      className={styles.card} 
    >
      {/* Arka Plan Görseli */}
      <img src={bgImage} alt={title} className={styles.image} />
      
      {/* Karartma */}
      <div className={styles.overlay}></div>

     

      {/* İçerik */}
      <div className={styles.content}>
        <div className={styles.headerRow}>
          <h3 className={styles.title}>{title}</h3>
        </div>

        <p className={styles.description}>
          {address} — {type} — {status}
          {description && ` — ${description}`} 
        </p>

        <div className={styles.tagsRow}>
          
           <div className={styles.tags}>
              <span className={styles.tag}>{type}</span>
              <span className={styles.tag}>{status}</span>
           <div className={styles.priceBadge}>{formatPrice(price)}</div>
           </div>

       
        </div>

        <button 
          className={styles.actionButton}
          onClick={() => navigate(`/ilan/${id}`)}
        >
          İlanı İncele
        </button>
      </div>
    </div>
  );
}

export default FeaturedPropertyCard;
