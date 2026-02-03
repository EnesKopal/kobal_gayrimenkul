import React, { useState, useEffect } from "react";
import api from "../../services/api";
import styles from "./AgentOwners.module.css";
import { FaUserAlt, FaPhone, FaEnvelope, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function AgentOwners() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
  const fetchOwners = async () => {
    try {
        const res = await api.get('/properties/agent-portfolio');
        const data = res.data.data;

    
     

        const uniqueOwners = [];
        const map = new Map();

        if (data) {
            data.forEach(item => {
                const code = item.owner_code || item.Owner?.user_code;

                if (code && !map.has(code)) {
                    map.set(code, true);
                    
                    uniqueOwners.push({
                        
                        ...(item.Owner || {}), 
                      
                        user_code: code, 
                       
                        full_name: item.Owner ? `${item.Owner.first_name} ${item.Owner.last_name}` : 'Bilinmeyen Sahip',
                        phone: item.Owner?.phone || 'Telefon Yok'
                    });
                }
            });
        }
        
       
        setOwners(uniqueOwners);
        setLoading(false);
    } catch (err) {
        console.error("Mülk sahipleri listesi alınamadı:", err);
        setLoading(false);
    }
};
    fetchOwners();
  }, []);

  if (loading) return <div className={styles.loader}>Yükleniyor...</div>;

  return (
    <div className={styles.container}>
      <h1>Yönettiğim Mülk Sahipleri</h1>
      <div className={styles.grid}>
        {owners.map((owner, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.userIcon}>
              <FaUserAlt />
            </div>
            <h3>
              {owner.first_name} {owner.last_name}
            </h3>
            <div className={styles.info}>
              <p>
                <FaPhone /> {owner.phone}
              </p>
              <p>
                <FaEnvelope /> {owner.email}
              </p>
            </div>
            <button
              className={styles.detailsBtn}
              onClick={() => {
                navigate(`/agent/portfolio?owner=${owner.user_code}`);
              }}
            >
              Tüm Mülkleri Gör
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AgentOwners;
