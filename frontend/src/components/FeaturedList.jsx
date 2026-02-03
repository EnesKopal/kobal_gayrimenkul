import React, { useState, useEffect } from 'react';
import FeaturedPropertyCard from './FeaturedPropertyCard'; // Yeni bileşen
import styles from './FeaturedList.module.css'; 
import api from '../services/api';

function FeaturedList() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    api.get('/properties')
      .then(res => setProperties(res.data.data.slice(0, 6))) 
      .catch(err => console.error("İlanlar yüklenemedi:", err));
  }, []);

  return (
    <section className={styles.section}> 
      <h2 className={styles.title}>Güncel İlanlarımız</h2> 
      <p className={styles.subtitle}>Portföyümüze Katılan Son Mülkler</p> 
      
      <div className={styles.listContainer}> 
        {properties.map(item => (
          <div key={item.id} className={styles.cardWrapper}>
            <FeaturedPropertyCard 
              portfolio={{
                id: item.id,
                title: item.title,
                price: item.price,
                address: item.address,
                portfolioNo: item.id,
                Images: item.Images,
                type: item.type,
                status: item.status,
                description: item.description 
              }} 
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedList;