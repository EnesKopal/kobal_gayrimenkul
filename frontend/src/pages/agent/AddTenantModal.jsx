import React, { useState } from 'react';
import api from '../../services/api';
import { FaTimes, FaCloudUploadAlt, FaSave } from 'react-icons/fa';
import styles from './AddTenantModal.module.css';

function AddTenantModal({ property, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        property_id: property.id,
        tenant_code: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        monthly_rent: property.price
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // MANTIKSAL KONTROL: Bitiş tarihi başlangıçtan önce veya aynı olamaz
        if (new Date(formData.end_date) <= new Date(formData.start_date)) {
            alert("Hata: Sözleşme bitiş tarihi, başlangıç tarihinden sonraki bir gün olmalıdır.");
            return;
        }

        setLoading(true);
        const data = new FormData();
        data.append('property_id', formData.property_id);
        data.append('tenant_code', formData.tenant_code);
        data.append('start_date', formData.start_date);
        data.append('end_date', formData.end_date);
        data.append('monthly_rent', formData.monthly_rent);
        if (file) data.append('contract_file', file);

        try {
            await api.post('/rentals', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Mülk başarıyla kiralandı.");
            onSuccess();
        } catch (err) {
            alert(err.response?.data?.message || "Kiralama işlemi başarısız.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h2>Mülkü Kiraya Ver</h2>
                    <button onClick={onClose} className={styles.closeBtn}><FaTimes /></button>
                </div>
                
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.field}>
                        <label>Kiracı User Code</label>
                        <input type="text" required placeholder="Örn: USR101" 
                               onChange={e => setFormData({...formData, tenant_code: e.target.value})} />
                    </div>

                    <div className={styles.grid}>
                        <div className={styles.field}>
                            <label>Başlangıç Tarihi</label>
                            <input 
                                type="date" 
                                required 
                                value={formData.start_date}
                                onChange={e => setFormData({...formData, start_date: e.target.value})} 
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Bitiş Tarihi</label>
                            <input 
                                type="date" 
                                required 
                                value={formData.end_date}
                                // HTML SEVİYESİNDE KISITLAMA: min özelliği ile başlangıçtan öncesi seçilemez
                                min={formData.start_date}
                                onChange={e => setFormData({...formData, end_date: e.target.value})} 
                            />
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label>Aylık Kira Bedeli (TL)</label>
                        <input type="number" value={formData.monthly_rent}
                               onChange={e => setFormData({...formData, monthly_rent: e.target.value})} />
                    </div>

                    <div className={styles.field}>
                        <label>Sözleşme Dosyası</label>
                        <input type="file" id="cFile" onChange={e => setFile(e.target.files[0])} hidden />
                        <label htmlFor="cFile" className={styles.fileArea}>
                            <FaCloudUploadAlt /> {file ? file.name : "Sözleşmeyi Yükle"}
                        </label>
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        <FaSave /> {loading ? "İşleniyor..." : "İşlemi Tamamla"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddTenantModal;