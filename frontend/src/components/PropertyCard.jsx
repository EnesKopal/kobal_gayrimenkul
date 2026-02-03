import styles from "./PropertyCard.module.css";
import PropertySlider from "./PropertySlider";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";


function PropertyCard({ portfolio, animationDelay, priceColor }) {
  const navigate = useNavigate();
  const API_URL = api.defaults.baseURL;

  const { title, price, id, Images, address } = portfolio;

  const cardStyle = {
    animationDelay: animationDelay || "0s",
  };

  return (
    <div 
      className={styles.card} 
      style={{ ...cardStyle, cursor: 'pointer' }}
      onClick={() => navigate(`/ilan/${id}`)}
    >
      <div className={styles.imageContainer}>
        {Images && Images.length > 0 ? (
          <PropertySlider images={Images} />
        ) : (
          <img
            src="/default-property.jpg"
            alt={title}
            className={styles.image}
          />
        )}
      </div>

      <div className={styles.details}>
        <div className={styles.location}>
          <span className={styles.pinIcon}>📍</span>
          <span className={styles.addressText}>{address}</span>
        </div>
        
        <h3 className={styles.title}>{title}</h3>
        
        <p className={styles.price} style={priceColor ? { color: priceColor } : {}}>
          {price ? `${Number(price).toLocaleString("tr-TR")} TL` : "0 TL"}
        </p>
        <span className={styles.portfolioNo}>Portföy No: {id}</span>
      </div>
    </div>
  );
}

export default PropertyCard;
