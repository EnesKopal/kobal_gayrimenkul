import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import styles from './AddPropertyForm.module.css';
import { FaSave, FaTimes, FaCloudUploadAlt, FaTrash } from 'react-icons/fa';

function EditPropertyForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({});
    
    const [existingImages, setExistingImages] = useState([]);
    const [imagesToDelete, setImagesToDelete] = useState([]);
    const [newFiles, setNewFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [catRes, propRes] = await Promise.all([
                    api.get('/admin/categories'),
                    api.get(`/properties/${id}`)
                ]);
                
                const catData = Array.isArray(catRes.data) ? catRes.data : (catRes.data.data || []);
                setCategories(catData);
                
                const propertyData = propRes.data.data;
                setFormData(propertyData);
                setExistingImages(propertyData.Images || []);
                setLoading(false);
            } catch (err) {
                console.error("Veriler yüklenemedi:", err);
                setLoading(false);
            }
        };
        loadInitialData();
    }, [id]);

    useEffect(() => {
        return () => {
            previewUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [previewUrls]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setNewFiles(files);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(newPreviews);
    };

    const handleDeleteExistingImage = (imageId) => {
        setImagesToDelete(prev => [...prev, imageId]);
        setExistingImages(prev => prev.filter(img => img.id !== imageId));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const data = new FormData();
        const numericFields = ['price', 'gross_area', 'net_area', 'building_age', 'floor_count', 'maintenance_fee', 'deposit', 'bath_count'];

        Object.keys(formData).forEach(key => {
            if (key === 'Images' || key === 'Agent' || key === 'Owner' || key === 'Category') return;
            let value = formData[key];
            
            if (numericFields.includes(key) && (value === '' || value === undefined)) {
                value = null;
            }

            if (value !== null && value !== undefined) {
                data.append(key, value);
            }
        });

        if (imagesToDelete.length > 0) {
            data.append('removedImageIds', JSON.stringify(imagesToDelete));
        }

        newFiles.forEach(file => {
            data.append('images', file);
        });

        try {
            await api.put(`/properties/${id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("İlan başarıyla güncellendi.");
            navigate('/agent/portfolio');
        } catch (err) {
            alert(err.response?.data?.message || "Güncelleme sırasında bir hata oluştu.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className={styles.loader}>Yükleniyor...</div>;

    const selectedCategory = categories.find(c => c.id === parseInt(formData.category_id));
    const catName = selectedCategory?.name || "";

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.header}>
                    <h1>İlanı Düzenle: {formData.listing_no || id}</h1>
                    <div className={styles.actions}>
                        <button type="button" onClick={() => navigate(-1)} className={styles.cancelBtn} disabled={isSubmitting}>
                            <FaTimes /> İptal
                        </button>
                        <button type="submit" className={styles.saveBtn} disabled={isSubmitting}>
                            {isSubmitting ? 'Güncelleniyor...' : <><FaSave /> Güncelle</>}
                        </button>
                    </div>
                </div>

                <div className={styles.section}>
                    <h3>Genel Bilgiler</h3>
                    <div className={styles.grid}>
                        <div className={styles.field}>
                            <label>İlan Başlığı</label>
                            <input type="text" name="title" value={formData.title || ''} onChange={handleChange} required />
                        </div>
                        <div className={styles.field}>
                            <label>Kategori</label>
                            <select name="category_id" required onChange={handleChange} value={formData.category_id}>
                                <option value="">Seçiniz</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.field}>
                            <label>Fiyat (TL)</label>
                            <input type="number" name="price" value={formData.price || ''} onChange={handleChange} required />
                        </div>
                        <div className={styles.field}>
                            <label>Durum</label>
                            <select name="status" value={formData.status || ''} onChange={handleChange}>
                                <option value="Satılık">Satılık</option>
                                <option value="Kiralık">Kiralık</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className={styles.section}>
                    <h3>{catName} Teknik Detayları</h3>
                    <div className={styles.grid}>
                        <div className={styles.field}><label>m² (Brüt/Toplam)</label><input type="number" name="gross_area" value={formData.gross_area || ''} onChange={handleChange} /></div>
                        <div className={styles.field}><label>m² (Net)</label><input type="number" name="net_area" value={formData.net_area || ''} onChange={handleChange} /></div>
                        
                        {(catName === "Konut" || catName === "İşyeri" || catName === "Bina" || catName === "Turistik Tesis" || catName === "Devre Mülk") && (
                            <div className={styles.field}><label>Bina Yaşı</label><input type="number" name="building_age" value={formData.building_age || ''} onChange={handleChange} /></div>
                        )}

                        {(catName === "Konut" || catName === "İşyeri" || catName === "Bina") && (
                            <div className={styles.field}><label>Isıtma</label><input type="text" name="heating" value={formData.heating || ''} onChange={handleChange} /></div>
                        )}

                        {catName === "Arsa" && (
                            <>
                                <div className={styles.field}><label>Ada No</label><input type="text" name="block_no" value={formData.block_no || ''} onChange={handleChange} /></div>
                                <div className={styles.field}><label>Parsel No</label><input type="text" name="parcel_no" value={formData.parcel_no || ''} onChange={handleChange} /></div>
                                <div className={styles.field}><label>İmar Durumu</label><input type="text" name="zoning_status" value={formData.zoning_status || ''} onChange={handleChange} /></div>
                            </>
                        )}
                    </div>
                </div>

                <div className={styles.section}>
                    <h3>Fotoğraf Yönetimi</h3>
                    <div className={styles.imageGrid}>
                        {existingImages.map(img => (
                            <div key={img.id} className={styles.imageContainer}>
                                <img src={`http://localhost:5001/${img.image_url}`} alt="Mülk" className={styles.previewImage} />
                                <button type="button" onClick={() => handleDeleteExistingImage(img.id)} className={styles.deleteBtn}>
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                        
                        {previewUrls.map((url, index) => (
                            <div key={index} className={`${styles.imageContainer} ${styles.newPreview}`}>
                                <img src={url} alt="Yeni" className={styles.previewImage} />
                                <div className={styles.newBadge}>Yeni</div>
                            </div>
                        ))}
                    </div>
                    
                    <div className={styles.uploadArea}>
                        <input type="file" multiple accept="image/*" onChange={handleFileChange} id="fileInput" hidden />
                        <label htmlFor="fileInput" className={styles.uploadLabel}>
                            <FaCloudUploadAlt />
                            <span>Yeni Görsel Eklemek İçin Tıklayın</span>
                            <small>{newFiles.length} yeni dosya seçildi</small>
                        </label>
                    </div>
                </div>

                <div className={styles.section}>
                    <h3>Konum ve Açıklama</h3>
                    <div className={styles.field}>
                        <label>Tam Adres</label>
                        <textarea name="address" value={formData.address || ''} onChange={handleChange} required rows="3"></textarea>
                    </div>
                    <div className={styles.field}>
                        <label>İlan Açıklaması</label>
                        <textarea name="description" value={formData.description || ''} onChange={handleChange} required rows="6"></textarea>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default EditPropertyForm;