/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom'; 
import { useAuth } from '../../context/authContext';
import api from '../../services/api';
import { FaEdit, FaTrash, FaExternalLinkAlt, FaPlus, FaTimes, FaHandshake } from 'react-icons/fa';
import styles from './AgentPortfolio.module.css';
import AddTenantModal from './AddTenantModal.jsx';


function AgentPortfolio() {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProp, setSelectedProp] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const ownerFilter = searchParams.get('owner');

    useEffect(() => {
        fetchPortfolio();
    }, []);

    const fetchPortfolio = async () => {
        try {
            const res = await api.get('/properties/agent-portfolio');
            setProperties(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error("Portföy yüklenemedi:", err);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bu ilanı tamamen silmek istediğinize emin misiniz?")) {
            try {
                await api.delete(`/properties/${id}`);
                setProperties(properties.filter(p => p.id !== id));
                alert("İlan başarıyla silindi.");
            } catch (err) {
                alert("Silme işlemi sırasında bir hata oluştu.");
            }
        }
    };

    const filteredProperties = ownerFilter 
        ? properties.filter(p => String(p.owner_code) === String(ownerFilter))
        : properties;

    if (loading) return <div className={styles.loader}>Yükleniyor...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleArea}>
                    <h1>{ownerFilter ? `Mülk Sahibi Portföyü: ${ownerFilter}` : 'İlan Portföyüm'}</h1>
                    {ownerFilter && (
                        <button 
                            className={styles.clearFilterBtn} 
                            onClick={() => setSearchParams({})}
                            title="Filtreyi Kaldır"
                        >
                            <FaTimes /> Filtreyi Temizle
                        </button>
                    )}
                </div>
                <Link to="/agent/add-property" className={styles.addBtn}>
                    <FaPlus /> Yeni İlan Ekle
                </Link>
            </div>

            {filteredProperties.length === 0 ? (
                <div className={styles.noData}>
                    <p>Gösterilecek ilan bulunamadı.</p>
                </div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>İlan No</th>
                                <th>Başlık</th>
                                <th>Kategori / Tip</th>
                                <th>Fiyat</th>
                                <th>Durum</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProperties.map((p) => (
                                <tr key={p.id}>
                                    <td data-label="İlan No">{p.listing_no || p.id}</td>
                                    <td data-label="Başlık">{p.title}</td>
                                    <td data-label="Kategori">{p.CategoryInfo?.name || 'Emlak'} / {p.type}</td>
                                    <td data-label="Fiyat">{Number(p.price).toLocaleString('tr-TR')} TL</td>
                                    <td data-label="Durum">
                                        <span className={p.is_active ? styles.active : styles.passive}>
                                            {p.is_active ? 'Yayında' : 'Yayında Değil'}
                                        </span>
                                    </td>
                                    <td className={styles.actions}>
                                        {p.status === 'Kiralık' && p.is_active && (
                                            <button 
                                                className={styles.rentBtn} 
                                                onClick={() => { setSelectedProp(p); setIsModalOpen(true); }}
                                                title="Kiraya Ver"
                                            >
                                                <FaHandshake />
                                            </button>
                                        )}
                                        <Link to={`/ilan/${p.id}`} target="_blank" className={styles.viewBtn}>
                                            <FaExternalLinkAlt />
                                        </Link>
                                        <Link to={`/agent/edit-property/${p.id}`} className={styles.editBtn}>
                                            <FaEdit />
                                        </Link>
                                        <button onClick={() => handleDelete(p.id)} className={styles.deleteBtn}>
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && (
                <AddTenantModal 
                    property={selectedProp} 
                    onClose={() => setIsModalOpen(false)} 
                    onSuccess={() => {
                        setIsModalOpen(false);
                        fetchPortfolio();
                    }}
                />
            )}
        </div>
    );
}

export default AgentPortfolio;