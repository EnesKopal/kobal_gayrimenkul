import React from 'react';
import { Link } from 'react-router-dom';
import styles from './CallToActionCards.module.css'; 

function CallToActionCards() {
  return (
    <section className={styles.section}> 
      

      <div className={`${styles.card} ${styles.sell}`}>
        <h2>Emlağınızı Satın / Kiralayın</h2>
        <p>Mülkünüzü portföyümüze ekleyin, sizin için en doğru alıcıyı veya kiracıyı bulalım.</p>

      </div>
      
      <div className={`${styles.card} ${styles.find}`}>
        <h2>Size Uygun Emlak Bulalım</h2>
        <p>Hayalinizdeki evi bulabilmemiz için lütfen bizimle iletişime geçin.</p>
      </div>
    </section>
  );
}

export default CallToActionCards;