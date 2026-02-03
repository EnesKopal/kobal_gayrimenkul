import React, { useState, useEffect } from "react";
import api from "../services/api.js";
import styles from "./Iletisim.module.css";
import { FaEnvelope, FaPhone, FaWhatsapp, FaUserTie } from "react-icons/fa";

function Iletisim() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await api.get("/users/public/agents");
        const agentList = res.data.data.filter(
          (u) => u.Role?.role_name === "Agent"
        );
        setAgents(agentList);
        setLoading(false);
      } catch (err) {
        console.error("Danışmanlar yüklenemedi:", err);
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  if (loading) return <div className={styles.loader}>Yükleniyor...</div>;

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1>Profesyonel Ekibimiz</h1>
        <p>
          Kobal Gayrimenkul'ün uzman danışmanları ile hayalinizdeki mülke bir
          adım daha yaklaşın.
        </p>
      </section>

      <div className={styles.grid}>
        {agents.map((agent, index) => (
          <div key={agent.id || index} className={styles.agentCard}>
            <div className={styles.imageSection}>
              <div className={styles.placeholderImg}>
                <FaUserTie />
              </div>
              <div className={styles.badge}>Danışman</div>
            </div>
            <div className={styles.infoSection}>
              <h3>
                {agent.first_name} {agent.last_name}
              </h3>
              <p className={styles.title}>Gayrimenkul Yatırım Uzmanı</p>

              <div className={styles.contactDetails}>
                <div className={styles.contactRow}>
                  <FaEnvelope className={styles.icon} />
                  <span>{agent.email}</span>
                </div>

                <div className={styles.contactRow}>
                  <FaPhone className={styles.icon} />
                  <span>
                    {agent.phone ? agent.phone : "Numara Belirtilmedi"}
                  </span>
                </div>
              </div>

              <div className={styles.buttonGroup}>
                <a href={`mailto:${agent.email}`} className={styles.mailBtn}>
                  E-posta Gönder
                </a>

                {agent.phone && (
                  <a
                    href={`https://wa.me/${agent.phone
                      .replace(/\s+/g, "")
                      .replace("+", "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.whatsappBtn}
                  >
                    <FaWhatsapp /> WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Iletisim;
