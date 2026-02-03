import React, { useState, useEffect } from 'react';
import api from '../services/api';
import styles from './TenantPayments.module.css';
import { 
    FaCloudUploadAlt, FaCheckCircle, FaClock, 
    FaExclamationTriangle, FaHome, FaArrowRight, FaFileInvoice, FaTimesCircle 
} from 'react-icons/fa';

function TenantPayments() {
    const [payments, setPayments] = useState([]);
    const [selectedPropertyId, setSelectedPropertyId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const res = await api.get('/payments/my-payments');
            setPayments(res.data.data);
            if (res.data.data.length > 0) {
                setSelectedPropertyId(res.data.data[0].Rental?.Property?.id);
            }
            setLoading(false);
        } catch (err) {
            console.error("Ödemeler yüklenemedi:", err);
            setLoading(false);
        }
    };

    const uniqueProperties = Array.from(new Map(
        payments.map(p => [p.Rental?.Property?.id, p.Rental?.Property])
    ).values());

    const filteredPayments = payments.filter(
        p => p.Rental?.Property?.id === selectedPropertyId
    );

    const handleFileUpload = async (paymentId, file) => {
        if (!file) return;
        const formData = new FormData();
        formData.append('receipt', file);
        try {
            await api.post(`/payments/upload-receipt/${paymentId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Dekont başarıyla yüklendi, onay bekleniyor.");
            fetchPayments(); 
        } catch (err) {
            alert(err.response?.data?.message || "Yükleme başarısız.");
        }
    };

    const getStatusInfo = (status) => {
        const s = status ? status.toLowerCase() : '';
        switch (s) {
            case 'paid': return { icon: <FaCheckCircle className={styles.paidIcon} />, text: 'Ödendi', badge: styles.paidBadge };
            case 'waiting_approval': return { icon: <FaClock className={styles.waitingIcon} />, text: 'Onay Bekliyor', badge: styles.waitingBadge };
            case 'rejected': return { icon: <FaTimesCircle className={styles.rejectedIcon} />, text: 'Reddedildi', badge: styles.rejectedBadge };
            case 'overdue':
            case 'delayed': return { icon: <FaExclamationTriangle className={styles.delayedIcon} />, text: 'Gecikti', badge: styles.delayedBadge };
            default: return { icon: <FaClock className={styles.pendingIcon} />, text: 'Ödenmedi', badge: styles.pendingBadge };
        }
    };

    if (loading) return <div className={styles.loader}>Yükleniyor...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.headerSection}>
                <h1>Kiraladığım Mülkler ve Ödemeler</h1>
                <p>Ödeme yapmak veya geçmişi görmek için ilgili mülkü seçiniz.</p>
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
                        <h2>Ödeme Takvimi</h2>
                        <div className={styles.summaryBadge}>
                            <span>Kalan Toplam Borç: </span>
                            <strong>
                                {filteredPayments
                                    .filter(p => p.status?.toLowerCase() !== 'paid')
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
                                    <th>Tutar</th>
                                    <th>Durum</th>
                                    <th>İşlem</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPayments.map(payment => {
                                    const status = getStatusInfo(payment.status);
                                    const s = payment.status?.toLowerCase();
                                    return (
                                        <tr key={payment.id}>
                                            <td data-label="Vade Tarihi">{new Date(payment.due_date).toLocaleDateString('tr-TR')}</td>
                                            <td data-label="Tutar">{Number(payment.amount).toLocaleString('tr-TR')} TL</td>
                                            <td data-label="Durum">
                                                <div className={`${styles.statusBadge} ${status.badge}`}>
                                                    {status.icon} <span>{status.text}</span>
                                                </div>
                                            </td>
                                            <td data-label="İşlem">
                                                {(s === 'pending' || s === 'overdue' || s === 'delayed' || s === 'rejected') ? (
                                                    <label className={styles.uploadBtn}>
                                                        <FaCloudUploadAlt /> Dekont Yükle
                                                        <input type="file" hidden onChange={(e) => handleFileUpload(payment.id, e.target.files[0])} />
                                                    </label>
                                                ) : payment.receipt_url ? (
                                                    <a href={`http://localhost:5001/uploads/receipts/${payment.receipt_url}`} target="_blank" rel="noreferrer" className={styles.viewLink}>
                                                        <FaFileInvoice /> Dekontu Gör
                                                    </a>
                                                ) : "-"}
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

export default TenantPayments;