import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import PropertySlider from "../components/PropertySlider";
import styles from "./IlanDetay.module.css";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaChevronRight,
} from "react-icons/fa";

function IlanDetay() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/properties/${id}`)
      .then((res) => {
        setProperty(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("İlan detayları yüklenemedi:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return <div className={styles.loader}>İlan detayları yükleniyor...</div>;
  if (!property)
    return (
      <div className={styles.error}>İlan bulunamadı veya kaldırılmış.</div>
    );

  const isKonut = property.CategoryInfo?.name === "Konut";
  const isArsa = property.CategoryInfo?.name === "Arsa";
  const isBina = property.CategoryInfo?.name === "Bina";
  const isDevreMulk = property.CategoryInfo?.name === "Devre Mülk";
  const isIsyeri = property.CategoryInfo?.name === "İşyeri";
  const isTuristik = property.CategoryInfo?.name === "Turistik Tesis";
  
  const formattedDate = property.listing_date
    ? new Date(property.listing_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) 
    : "Belirtilmemiş";

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.breadcrumb}>
          <Link to="/">Ana Sayfa</Link>
          <FaChevronRight className={styles.separatorIcon} />
          <Link to="/ilanlar">{property.CategoryInfo?.name || "Emlak"}</Link>
          <FaChevronRight className={styles.separatorIcon} />
          <span className={styles.currentPath}>{property.title}</span>
        </div>
        <h1 className={styles.title}>{property.title}</h1>
        <p className={styles.location}>
          <FaMapMarkerAlt className={styles.locationIcon} /> {property.address}
        </p>
      </div>

      <div className={styles.topSection}>
        <div className={styles.leftCol}>
          <div className={styles.galleryWrapper}>
            <PropertySlider images={property.Images || []} />
          </div>
        </div>

        <div className={styles.rightCol}>
          <div className={styles.priceCard}>
            <div className={styles.topInfo}>
                <div className={styles.priceTag}>
                {property.price
                    ? `${Number(property.price).toLocaleString("tr-TR")} TL`
                    : "0 TL"}
                </div>
                <div className={styles.statusBadge}>{property.status}</div>
            </div>

            <div className={styles.specs}>
              <div className={styles.specItem}>
                <span> İlan No:</span>
                <strong className={styles.listingNo}>{property.listing_no || property.id}</strong>
              </div>
              <div className={styles.specItem}>
                <span>İlan Tarihi:</span>
                <strong>{formattedDate}</strong>
              </div>
              <div className={styles.specItem}>
                <span>Emlak Tipi:</span> 
                <strong>{property.status} {property.CategoryInfo?.name}</strong>
              </div>

              {(isKonut || isBina || isIsyeri || isTuristik) && (
                <>
                  {property.gross_area && (
                    <div className={styles.specItem}>
                      <span>m² (Brüt):</span>
                      <strong>{property.gross_area} m²</strong>
                    </div>
                  )}
                  {property.net_area && (
                    <div className={styles.specItem}>
                      <span>m² (Net):</span>
                      <strong>{property.net_area} m²</strong>
                    </div>
                  )}
                  <div className={styles.specItem}>
                    <span>Bina Yaşı:</span>
                    <strong>{property.building_age || "0"}</strong>
                  </div>
                  {property.floor_count && (
                    <div className={styles.specItem}>
                      <span>Kat Sayısı:</span>
                      <strong>{property.floor_count}</strong>
                    </div>
                  )}
                  <div className={styles.specItem}>
                    <span>Isıtma:</span>
                    <strong>{property.heating || "Belirtilmemiş"}</strong>
                  </div>
                </>
              )}

              {isKonut && (
                <>
                  <div className={styles.specItem}>
                    <span>Oda Sayısı:</span>
                    <strong>{property.room_count}</strong>
                  </div>
                  <div className={styles.specItem}>
                    <span>Bulunduğu Kat:</span>
                    <strong>{property.floor_level}</strong>
                  </div>
                  <div className={styles.specItem}>
                    <span>Banyo Sayısı:</span>
                    <strong>{property.bath_count || "0"}</strong>
                  </div>
                  <div className={styles.specItem}>
                    <span>Mutfak:</span>
                    <strong>{property.kitchen || "Belirtilmemiş"}</strong>
                  </div>
                  <div className={styles.specItem}>
                    <span>Balkon:</span>
                    <strong>{property.balcony || "Belirtilmemiş"}</strong>
                  </div>
                  <div className={styles.specItem}>
                    <span>Asansör:</span>
                    <strong>{property.elevator || "Belirtilmemiş"}</strong>
                  </div>
                  <div className={styles.specItem}>
                    <span>Otopark:</span>
                    <strong>{property.parking || "Belirtilmemiş"}</strong>
                  </div>
                  <div className={styles.specItem}>
                    <span>Eşyalı:</span>
                    <strong>{property.furnished || "Belirtilmemiş"}</strong>
                  </div>
                  <div className={styles.specItem}>
                    <span>Site İçerisinde:</span>
                    <strong>{property.is_in_site || "Belirtilmemiş"}</strong>
                  </div>
                  <div className={styles.specItem}>
                    <span>Aidat (TL):</span>
                    <strong>{property.maintenance_fee ? `${Number(property.maintenance_fee).toLocaleString("tr-TR")}` : "Belirtilmemiş"}</strong>
                  </div>
                  <div className={styles.specItem}>
                    <span>Depozito (TL):</span>
                    <strong>{property.deposit ? `${Number(property.deposit).toLocaleString("tr-TR")}` : "Belirtilmemiş"}</strong>
                  </div>
                </>
              )}

              {isIsyeri && (
                <>
                  <div className={styles.specItem}>
                    <span>Bölüm Sayısı:</span>
                    <strong>{property.room_count || "Belirtilmemiş"}</strong>
                  </div>
                  <div className={styles.specItem}>
                    <span>Kullanım Durumu:</span>
                    <strong>{property.usage_status || "Belirtilmemiş"}</strong>
                  </div>
                  <div className={styles.specItem}>
                    <span>Aidat (TL):</span>
                    <strong>{property.maintenance_fee ? `${Number(property.maintenance_fee).toLocaleString("tr-TR")}` : "0"}</strong>
                  </div>
                </>
              )}

              {isBina && (
                <>
                  <div className={styles.specItem}>
                    <span>Kullanım Durumu:</span>
                    <strong>{property.usage_status || "Belirtilmemiş"}</strong>
                  </div>
                  <div className={styles.specItem}>
                    <span>Asansör:</span>
                    <strong>{property.elevator || "Belirtilmemiş"}</strong>
                  </div>
                  <div className={styles.specItem}>
                    <span>Otopark:</span>
                    <strong>{property.parking || "Belirtilmemiş"}</strong>
                  </div>
                </>
              )}

              {isTuristik && (
                <>
                  <div className={styles.specItem}>
                    <span>Yatak Kapasitesi:</span>
                    <strong>{property.bed_capacity || "Belirtilmemiş"}</strong>
                  </div>
                  <div className={styles.specItem}>
                    <span>Yıldız Sayısı:</span>
                    <strong>{property.star_count || "Belirtilmemiş"}</strong>
                  </div>
                </>
              )}

              {isDevreMulk && (
                <>
                  <div className={styles.specItem}>
                    <span>Oda Sayısı:</span>
                    <strong>{property.room_count || "Belirtilmemiş"}</strong>
                  </div>
                  <div className={styles.specItem}>
                    <span>Dönem:</span>
                    <strong>{property.usage_status || "Belirtilmemiş"}</strong>
                  </div>
                  <div className={styles.specItem}>
                    <span>Bina Yaşı:</span>
                    <strong>{property.building_age || "0"}</strong>
                  </div>
                  <div className={styles.specItem}>
                    <span>Isıtma:</span>
                    <strong>{property.heating || "Belirtilmemiş"}</strong>
                  </div>
                  <div className={styles.specItem}>
                    <span>Eşyalı:</span>
                    <strong>{property.furnished || "Belirtilmemiş"}</strong>
                  </div>
                </>
              )}

              {isArsa && (
                <>
                  <div className={styles.specItem}>
                    <span>İmar Durumu:</span>
                    <strong>{property.zoning_status || "Belirtilmemiş"}</strong>
                  </div>
                  <div className={styles.specItem}>
                    <span>Ada No:</span>
                    <strong>{property.block_no || "Belirtilmemiş"}</strong>
                  </div>
                  <div className={styles.specItem}>
                    <span>Parsel No:</span>
                    <strong>{property.parcel_no || "Belirtilmemiş"}</strong>
                  </div>
                  <div className={styles.specItem}>
                    <span>Pafta No:</span>
                    <strong>{property.map_sheet_no || "Belirtilmemiş"}</strong>
                  </div>
                  <div className={styles.specItem}>
                    <span>Kaks (Emsal):</span>
                    <strong>{property.kaks || "Belirtilmemiş"}</strong>
                  </div>
                  <div className={styles.specItem}>
                    <span>Gabari:</span>
                    <strong>{property.gabari || "Belirtilmemiş"}</strong>
                  </div>
                  <div className={styles.specItem}>
                    <span>Tapu Durumu:</span>
                    <strong>{property.title_deed_status || "Belirtilmemiş"}</strong>
                  </div>
                </>
              )}
            </div>

            <div className={styles.agentSection}>
                <div className={styles.agentInner}>
                    <div className={styles.agentName}>
                      DANIŞMAN: {property.Agent?.first_name} {property.Agent?.last_name}
                    </div>
                    <a href={`tel:${property.Agent?.phone}`} className={styles.contactBtn}>
                        <FaPhoneAlt /> {property.Agent?.phone}
                    </a>
                    <a href={`mailto:${property.Agent?.email}`} className={styles.emailBtn}>
                        <FaEnvelope /> Mail Gönder
                    </a>
                </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.descriptionCard}>
        <h2>İlan Açıklaması</h2>
        <div className={styles.descriptionBody}>{property.description}</div>
      </div>
    </div>
  );
}

export default IlanDetay;