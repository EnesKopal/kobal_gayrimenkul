import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import styles from './PropertyManagement.module.css';
import { FaBuilding, FaUserAlt, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

function PropertyManagement() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            const res = await api.get('/admin/properties');
            setProperties(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error("Mülkler yüklenemedi:", err);
            setLoading(false);
        }
    };

    if (loading) return <div className={styles.container}>Yükleniyor...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1><FaBuilding /> Mülk Portföy Yönetimi</h1>
                <p>Sistemdeki tüm ilanların detaylarını ve yayın durumlarını inceleyebilirsiniz.</p>
            </div>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>İlan Bilgisi</th>
                        <th>Danışman</th>
                        <th>Mülk Sahibi</th>
                        <th>Tür</th>
                        <th>Fiyat</th>
                        <th style={{ textAlign: 'center' }}>Durum</th>
                    </tr>
                </thead>
                <tbody>
                    {properties.map(item => (
                        <tr key={item.id}>
                            <td data-label="İlan Bilgisi">
                                <div className={styles.titleCell}>
                                    <strong>{item.title}</strong>
                                    <span><FaMapMarkerAlt /> {item.address}</span>
                                </div>
                            </td>
                            <td data-label="Danışman">
                                <div className={styles.userCell}>
                                    <FaUserAlt className={styles.icon} />
                                    <span>{item.Agent?.first_name} {item.Agent?.last_name}</span>
                                </div>
                            </td>
                            <td data-label="Mülk Sahibi">
                                <div className={styles.userCell}>
                                    <FaUserAlt className={styles.icon} />
                                    <span>{item.Owner?.first_name} {item.Owner?.last_name}</span>
                                </div>
                            </td>
                            <td data-label="Tür">
                                <span className={styles.typeTag}>{item.type}</span>
                            </td>
                            <td data-label="Fiyat">
                                <span className={styles.priceText}>
                                    {Number(item.price).toLocaleString('tr-TR')} TL
                                </span>
                            </td>
                            <td data-label="Durum" style={{ textAlign: 'center' }}>
                                {item.is_active ? (
                                    <div className={styles.activeBadge}>
                                        <FaCheckCircle /> Yayında
                                    </div>
                                ) : (
                                    <div className={styles.passiveBadge}>
                                        <FaTimesCircle /> Yayında Değil
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default PropertyManagement;