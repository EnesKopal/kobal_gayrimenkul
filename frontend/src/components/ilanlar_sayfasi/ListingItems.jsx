import React from 'react';
import styles from './ListingItems.module.css';
import { Link, useNavigate } from 'react-router-dom';

function ListingItem({ listing }) {
  const navigate = useNavigate();
  if (!listing) return null;

  const { id, title, price, address, Images, type, status } = listing;
  const API_URL = "http://localhost:5001/";


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ' TL';
  };

  const coverImage = Images && Images.length > 0 
    ? `${API_URL}${Images[0].image_url}` 
    : '/default-property.jpg';

  return (
    <div 
      className={styles.item} 
      onClick={() => navigate(`/ilan/${id}`)}
      style={{ cursor: 'pointer' }}
    >
      <img src={coverImage} alt={title} className={styles.image} />
      
      <div className={styles.details}>
        <h3 className={styles.title}>
         {title}
        </h3>
     
        <p className={styles.price}>{formatCurrency(price)}</p>
        <p className={styles.location}>{address}</p>
        <div className={styles.tags}>
          <span className={styles.tag}>{status}</span>
          <span className={styles.tag}>{type}</span>
        </div>
      </div>
    </div>
  );
}

export default ListingItem;