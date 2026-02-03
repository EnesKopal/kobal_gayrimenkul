import React, { useState, useEffect } from 'react';
import styles from './FilterSidebar.module.css';
import api from '../../services/api';
import { useSearchParams } from 'react-router-dom';

function FilterSidebar({ onFilterChange }) {
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]); 
  const [searchParams] = useSearchParams();
  
  const [filters, setFilters] = useState({
    category_id: searchParams.get('category_id') || '',
    status: searchParams.get('status') || '',
    search: searchParams.get('search') || '',
    type: searchParams.get('type') || ''
  });


  useEffect(() => {
    api.get('/categories')
      .then(res => setCategories(res.data.data.sort((a, b) => a.name.localeCompare(b.name, 'tr'))))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
 
    api.get(`/properties/types/unique?category_id=${filters.category_id}`)
      .then(res => {
        setTypes(res.data.data);
      
        if (filters.type && !res.data.data.includes(filters.type)) {
          setFilters(prev => ({ ...prev, type: '' }));
        }
      })
      .catch(err => console.error(err));
  }, [filters.category_id]); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanFilters = Object.fromEntries(
      // eslint-disable-next-line no-unused-vars
      Object.entries(filters).filter(([_, v]) => v !== "")
    );
    onFilterChange(cleanFilters);
  };

  return (
    <aside className={styles.filterSidebar}>
      <form onSubmit={handleSubmit}>
        <h3 className={styles.title}>Filtrele</h3>
        
      
        <div className={styles.filterGroup}>
          <label>Kategori</label>
          <select name="category_id" value={filters.category_id} onChange={handleInputChange}>
            <option value="">Tümü</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

      
        <div className={styles.filterGroup}>
          <label>Cinsi</label>
          <select 
            name="type" 
            value={filters.type} 
            onChange={handleInputChange}
            disabled={types.length === 0} 
          >
            <option value="">{types.length > 0 ? "Tümü" : "Uygun tip bulunamadı"}</option>
            {types.map((t, index) => (
              <option key={index} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Durumu</label>
          <select name="status" value={filters.status} onChange={handleInputChange}>
            <option value="">Tümü</option>
            <option value="Satılık">Satılık</option>
            <option value="Kiralık">Kiralık</option>
          </select>
        </div>

        <button className={styles.searchButton} type="submit">ARA</button>
      </form>
    </aside>
  );
}

export default FilterSidebar;