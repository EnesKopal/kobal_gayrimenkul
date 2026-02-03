import React, { useState, useEffect } from 'react';
import styles from './IlanlarPage.module.css';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';

import FilterSidebar from '../components/ilanlar_sayfasi/FilterSidebar';
import ListingItem from '../components/ilanlar_sayfasi/ListingItems';

function IlanlarPage() {
  const [searchParams, setSearchParams] = useSearchParams(); 
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {

        const response = await api.get(`/properties?${searchParams.toString()}`);
        setProperties(response.data.data || []);
      } catch (error) {
        console.error("İlanlar çekilemedi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [searchParams]);

  const handleFilterChange = (newFilters) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, value);
      }
    });
    setSearchParams(params);
  };

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.pageTitle}>İlanlar ({properties.length})</h2>
      
      <div className={styles.layout}>
        <div className={styles.filterColumn}>
          <FilterSidebar onFilterChange={handleFilterChange} />
        </div>

        <div className={styles.listingColumn}>
          {loading ? (
            <p className={styles.infoText}>İlanlar yükleniyor, lütfen bekleyin...</p>
          ) : properties.length > 0 ? (
            <div className={styles.listingGrid}>
              {properties.map(item => (
                <ListingItem key={item.id} listing={item} />
              ))}
            </div>
          ) : (
            <p className={styles.infoText}>Seçili kriterlere uygun ilan bulunamadı.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default IlanlarPage;