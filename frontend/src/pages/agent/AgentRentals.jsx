/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import styles from './AgentPortfolio.module.css';
import { FaUserTag, FaCalendarCheck, FaTrashAlt, FaFileContract } from 'react-icons/fa';

function AgentRentals() {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRentals();
    }, []);

    const fetchRentals = async () => {
        try {
            const res = await api.get('/rentals/agent');
            setRentals(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error("Veriler alınamadı:", err);
            setLoading(false);
        }
    };

    const handleTerminate = async (id) => {
        if (window.confirm("Sözleşmeyi sonlandırmak istiyor musunuz?")) {
            try {
                await api.delete(`/rentals/${id}`);
                setRentals(rentals.filter(r => r.id !== id));
                alert("Sözleşme sonlandırıldı.");
            } catch (err) {
                alert("İşlem başarısız.");
            }
        }
    };

    if (loading) return <div>Yükleniyor...</div>;

    return (
        <div className={styles.container}>
            <h1>Aktif Kira Sözleşmeleri</h1>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>İlan No</th>
                            <th>Mülk / Adres</th>
                            <th>Kiracı</th>
                            <th>Başlangıç</th>
                            <th>Kira Bedeli</th>
                            <th>Sözleşme</th>
                            <th>İşlem</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rentals.map(r => (
                            <tr key={r.id}>
                                <td data-label="İlan No">{r.Property?.listing_no}</td>
                                <td data-label="Mülk / Adres">
                                    <strong>{r.Property?.title}</strong><br/>
                                    <small>{r.Property?.address}</small>
                                </td>
                                <td data-label="Kiracı">
                                    <FaUserTag /> {r.Tenant?.first_name} {r.Tenant?.last_name}<br/>
                                    <small>{r.Tenant?.phone}</small>
                                </td>
                                <td data-label="Başlangıç"><FaCalendarCheck /> {new Date(r.start_date).toLocaleDateString('tr-TR')}</td>
                                <td data-label="Kira Bedeli">{Number(r.monthly_rent).toLocaleString('tr-TR')} TL</td>
                                <td data-label="Sözleşme">
                                    {r.contract_url && (
                                        <a href={`http://localhost:5001/${r.contract_url}`} target="_blank" rel="noreferrer">
                                            <FaFileContract /> Görüntüle
                                        </a>
                                    )}
                                </td>
                                <td data-label="İşlem">
                                    <button onClick={() => handleTerminate(r.id)} className={styles.deleteBtn}>
                                        <FaTrashAlt />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AgentRentals;