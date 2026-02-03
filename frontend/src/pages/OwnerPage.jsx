import React, { useState, useEffect } from 'react';
import api from '../services/api';
import styles from './OwnerPage.module.css';
import { 
    FaHome, FaCheckCircle, FaClock, FaExclamationTriangle, 
    FaFileInvoice, FaArrowRight, FaBuilding 
} from 'react-icons/fa';

function OwnerPage() {
    const [payments, setPayments] = useState([]);
    const [selectedPropertyId, setSelectedPropertyId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOwnerData = async () => {
            try {
                const res = await api.get('/payments/owner-payments');
                setPayments(res.data.data);
                if (res.data.data.length > 0) {
                    setSelectedPropertyId(res.data.data[0].Rental?.Property?.id);
                }
                setLoading(false);
            } catch (err) {
                console.error("Veriler yüklenemedi:", err);
                setLoading(false);
            }
        };
        fetchOwnerData();
    }, []);

    const uniqueProperties = Array.from(new Map(
        payments.map(p => [p.Rental?.Property?.id, p.Rental?.Property])
    ).values());

    const filteredPayments = payments.filter(
        p => p.Rental?.Property?.id === selectedPropertyId
    );

    const getStatusInfo = (status) => {
        const s = status ? status.toLowerCase() : '';
        switch (s) {
            case 'paid': 
                return { icon: <FaCheckCircle className={styles.paidIcon} />, text: 'Ödendi', badge: styles.paidBadge };
            case 'waiting_approval': 
                return { icon: <FaClock className={styles.waitingIcon} />, text: 'Onay Bekliyor', badge: styles.waitingBadge };
            case 'overdue':
            case 'delayed': 
                return { icon: <FaExclamationTriangle className={styles.delayedIcon} />, text: 'Gecikti', badge: styles.delayedBadge };
            default: 
                return { icon: <FaClock className={styles.pendingIcon} />, text: 'Beklemede', badge: styles.pendingBadge };
        }
    };

    if (loading) return <div className={styles.loader}>Yükleniyor...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.headerSection}>
                <h1><FaBuilding /> Mülk Yönetim Paneli</h1>
                <p>Yönetmek istediğiniz mülkü seçerek kira detaylarını inceleyebilirsiniz.</p>
            </div>

            <div className={styles.propertyGrid}>
                {uniqueProperties.map(property => (
                    <div 
                        key={property.id} 
                        className={`${styles.propertyCard} ${selectedPropertyId === property.id ? styles.activeCard : ''}`}
                        onClick={() => setSelectedPropertyId(property.id)}
                    >
                        <div className={styles.cardIcon}><FaHome /></div>
                        <div className={styles.cardInfo}>
                            <h3>{property.title}</h3>
                            <span>{property.type}</span>
                        </div>
                        <FaArrowRight className={styles.arrow} />
                    </div>
                ))}
            </div>

            {selectedPropertyId && (
                <div className={styles.detailSection}>
                    <div className={styles.detailHeader}>
                        <h2>Kira Ödeme Geçmişi</h2>
                        <div className={styles.incomeStats}>
                            <span>Seçili Mülk Toplam Tahsilat: </span>
                            <strong>
                                {filteredPayments
                                    .filter(p => p.status?.toLowerCase() === 'paid')
                                    .reduce((sum, p) => sum + Number(p.amount), 0)
                                    .toLocaleString('tr-TR')} TL
                            </strong>
                        </div>
                    </div>

                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Vade Tarihi</th>
                                    <th>Kira Tutarı</th>
                                    <th>Durum</th>
                                    <th>Dekont</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPayments.map(payment => {
                                    const status = getStatusInfo(payment.status);
                                    return (
                                        <tr key={payment.id}>
                                            <td data-label="Vade Tarihi">{new Date(payment.due_date).toLocaleDateString('tr-TR')}</td>
                                            <td data-label="Kira Tutarı" className={styles.amount}>{Number(payment.amount).toLocaleString('tr-TR')} TL</td>
                                            <td data-label="Durum">
                                                <div className={`${styles.statusBadge} ${status.badge}`}>
                                                    {status.icon} <span>{status.text}</span>
                                                </div>
                                            </td>
                                            <td data-label="Dekont">
                                                {payment.receipt_url ? (
                                                    <a href={`http://localhost:5001/uploads/receipts/${payment.receipt_url}`} target="_blank" rel="noreferrer" className={styles.viewLink}>
                                                        <FaFileInvoice /> Görüntüle
                                                    </a>
                                                ) : <span className={styles.noReceipt}>Yüklenmedi</span>}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OwnerPage;