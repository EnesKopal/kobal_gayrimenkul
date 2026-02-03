import React, { useState, useEffect } from "react";
import styles from "./HeroSearch.module.css";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function HeroSearch() {
  const [categories, setCategories] = useState([]);

  const [selectedCatId, setSelectedCatId] = useState(""); 
  const [filterDurum, setFilterDurum] = useState("");
  const [filterType, setFilterType] = useState("");
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/categories')
      .then(res => {
        const sortedCategories = res.data.data.sort((a, b) => 
          a.name.localeCompare(b.name, 'tr')
        );
        setCategories(sortedCategories);
        // Artık varsayılan olarak ilk kategoriyi seçmiyoruz, "Tüm İlanlar" aktif kalsın
      })
      .catch(err => console.error("Kategoriler yüklenemedi:", err));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    // Sadece bir kategori seçiliyse (boş değilse) parametre ekle
    if (selectedCatId) params.set('category_id', selectedCatId);
    if (filterDurum) params.set('status', filterDurum);
    if (filterType) params.set('type', filterType);
    if (searchText) params.set('search', searchText);

    navigate(`/ilanlar?${params.toString()}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.typeButtons}>
          {/* Manuel eklenen Tüm İlanlar Butonu */}
          <button
            className={`${styles.typeBtn} ${selectedCatId === "" ? styles.active : ""}`}
            onClick={() => { setSelectedCatId(""); setFilterType(""); }}
          >
            TÜM İLANLAR
          </button>

          {/* Dinamik Kategoriler */}
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`${styles.typeBtn} ${selectedCatId === cat.id ? styles.active : ""}`}
              onClick={() => { setSelectedCatId(cat.id); setFilterType(""); }}
            >
              {cat.name.toUpperCase()}
            </button>
          ))}
        </div>

        <form className={styles.searchBox} onSubmit={handleSearch}>
          <div className={styles.filterGroup}>
            <label>İlan Durumu</label>
            <select value={filterDurum} onChange={(e) => setFilterDurum(e.target.value)}>
              <option value="">Tümü</option>
              <option value="Satılık">Satılık</option>
              <option value="Kiralık">Kiralık</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Cinsi</label>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="">Seçiniz</option>
              {/* Sadece kategori seçiliyse ilgili alt tipleri göster */}
              {categories.find(c => c.id === selectedCatId)?.name === "Konut" && (
                <>
                  <option value="Daire">Daire</option>
                  <option value="Villa">Villa</option>
                  <option value="Müstakil">Müstakil</option>
                </>
              )}
            </select>
          </div>

          <div className={`${styles.filterGroup} ${styles.searchTextGroup}`}>
            <label>Arama</label>
            <input 
              type="text" 
              placeholder="İlan başlığı, adres vb." 
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <button type="submit" className={styles.submitBtn}>ARAMA YAP</button>
        </form>
      </div>
    </div>
  );
}

export default HeroSearch;