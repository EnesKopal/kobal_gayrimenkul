import  { useState } from 'react';
import styles from './PropertySlider.module.css';
const BASE_URL = "http://localhost:5001";
    

function PropertySlider({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);


  const nextSlide = (e) => {
    e.preventDefault(); 
    e.stopPropagation(); // Link tıklamasını engelle
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Link tıklamasını engelle
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className={styles.slider}>
    <img 
      src={`${BASE_URL}/${images[currentIndex]?.image_url}`} 
      className={styles.image} 
      alt="Emlak Görseli" 
    />

    {images.length > 1 && (
      <>
        <button className={styles.prevBtn} onClick={prevSlide} type="button">❮</button>
        <button className={styles.nextBtn} onClick={nextSlide} type="button">❯</button>
        <div className={styles.dots}>
            {images.map((_, idx) => (
              <span 
                key={idx} 
                className={`${styles.dot} ${idx === currentIndex ? styles.active : ""}`}
              ></span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default PropertySlider;