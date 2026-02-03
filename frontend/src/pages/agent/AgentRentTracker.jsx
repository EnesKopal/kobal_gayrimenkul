/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import styles from './AgentRentTracker.module.css';
import { FaCheck, FaEye, FaBuilding, FaUser, FaCalendarAlt, FaWallet, FaTimes } from 'react-icons/fa';

function AgentRentTracker() {
    const [allPayments, setAllPayments] = useState([]);
    const [selectedPropertyId, setSelectedPropertyId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAgentPayments();
    }, []);

    const fetchAgentPayments = async () => {
        try {
            const res = await api.get('/payments/agent-payments');
            const data = res.data.data;
            setAllPayments(data);
            
            if (data.length > 0 && !selectedPropertyId) {
                setSelectedPropertyId(data[0].Rental?.Property?.id);
            }
            setLoading(false);
        } catch (err) {
            console.error("Ödemeler yüklenemedi:", err);
            setLoading(false);
        }
    };

    const handleApprove = async (paymentId) => {
        if (!window.confirm("Bu ödemeyi onaylıyor musunuz?")) return;
        try {
            await api.patch(`/payments/approve/${paymentId}`);
            alert("Ödeme başarıyla onaylandı.");
            fetchAgentPayments();
        } catch (err) {
            alert("Onay işlemi sırasında bir hata oluştu.");
        }
    };

    const handleReject = async (paymentId) => {
    if (!window.confirm("Bu ödemeyi reddetmek istediğinize emin misiniz?")) return;
    
    try {
        await api.patch(`/payments/reject/${paymentId}`);
        alert("Ödeme reddedildi.");
        fetchAgentPayments();
    } catch (err) {
        alert("Reddetme işlemi sırasında bir hata oluştu.");
    }
};

    const properties = Array.from(new Map(
        allPayments.map(p => [p.Rental?.Property?.id, p.Rental?.Property])
    ).values());

    const filteredPayments = allPayments.filter(p => p.Rental?.Property?.id === selectedPropertyId);

    const pendingCount = filteredPayments.filter(p => p.status?.toLowerCase() === 'waiting_approval').length;
    const totalCollected = filteredPayments
        .filter(p => p.status?.toLowerCase() === 'paid')
        .reduce((sum, p) => sum + Number(p.amount), 0);

    if (loading) return <div className={styles.loader}>Yükleniyor...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h2><FaWallet /> Kira Takip ve Onay Sistemi</h2>
            </header>

            <div className={styles.dashboardLayout}>
                <aside className={styles.sidebar}>
                    <div className={styles.sidebarHeader}>Mülklerim</div>
                    <div className={styles.propertyList}>
                        {properties.map(prop => (
                            <div 
                                key={prop.id} 
                                className={`${styles.propertyCard} ${selectedPropertyId === prop.id ? styles.activeCard : ''}`}
                                onClick={() => setSelectedPropertyId(prop.id)}
                            >
                                <strong>{prop.title}</strong>
                                <span>{prop.address?.substring(0, 25)}...</span>
                            </div>
                        ))}
                    </div>
                </aside>

                <main className={styles.content}>
                    {selectedPropertyId ? (
                        <>
                            <div className={styles.statsRow}>
                                <div className={styles.statBox}>
                                    <span>Bekleyen Onay</span>
                                    <strong className={styles.orange}>{pendingCount}</strong>
                                </div>
                                <div className={styles.statBox}>
                                    <span>Tahsil Edilen</span>
                                    <strong className={styles.green}>{totalCollected.toLocaleString()} TL</strong>
                                </div>
                            </div>

                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Kiracı</th>
                                        <th>Vade Tarihi</th>
                                        <th>Tutar</th>
                                        <th>Durum</th>
                                        <th>İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPayments.map(p => (
                                        <tr key={p.id}>
                                            <td data-label="Kiracı">
                                                <div className={styles.tenantCell}>
                                                    <FaUser /> {p.Rental?.Tenant?.first_name} {p.Rental?.Tenant?.last_name}
                                                </div>
                                            </td>
                                            <td data-label="Vade Tarihi"><FaCalendarAlt /> {new Date(p.due_date).toLocaleDateString('tr-TR')}</td>
                                            <td data-label="Tutar"><strong>{Number(p.amount).toLocaleString()} TL</strong></td>
                                            <td data-label="Durum">
                                                <span className={`${styles.statusBadge} ${styles[p.status?.toLowerCase()]}`}>
                                                    {p.status === 'waiting_approval' ? 'Onay Bekliyor' : p.status}
                                                </span>
                                            </td>
                                            <td data-label="İşlemler">
                                                <div className={styles.actions}>
                                                    {p.receipt_url && (
                                                        <button 
                                                            onClick={() => window.open(`http://localhost:5001/uploads/receipts/${p.receipt_url}`)} 
                                                            className={styles.viewBtn} title="Dekontu Gör"
                                                        > 
                                                            <FaEye /> Dekontu Gör
                                                        </button>
                                                    )}
                                                    {p.status?.toLowerCase() === 'waiting_approval' && (
                                                        <>
                                                            <button onClick={() => handleApprove(p.id)} className={styles.approveBtn} title="Onayla">
                                                                <FaCheck /> Onayla
                                                            </button>
                                                            <button onClick={() => handleReject(p.id)} className={styles.rejectBtn} title="Reddet">
                                                                <FaTimes /> Reddet
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    ) : (
                        <div className={styles.emptyState}>Lütfen listeden bir mülk seçin.</div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default AgentRentTracker;