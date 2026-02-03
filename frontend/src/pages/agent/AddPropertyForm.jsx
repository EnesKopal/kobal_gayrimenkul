import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import styles from "./AddPropertyForm.module.css";
import { FaCloudUploadAlt, FaSave, FaTimes } from "react-icons/fa";

function AddPropertyForm() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    owner_code: "",
    category_id: "",
    type: "",
    title: "",
    description: "",
    status: "Kiralık",
    price: "",
    address: "",
    listing_date: new Date().toISOString().split("T")[0],
    gross_area: "",
    net_area: "",
    room_count: "",
    building_age: "",
    floor_count: "",
    floor_level: "",
    heating: "",
    bath_count: "",
    kitchen: "",
    balcony: "Yok",
    elevator: "Yok",
    parking: "",
    furnished: "Hayır",
    usage_status: "",
    is_in_site: "Hayır",
    site_name: "",
    maintenance_fee: "",
    deposit: "",
    zoning_status: "",
    block_no: "",
    parcel_no: "",
    map_sheet_no: "",
    kaks: "",
    gabari: "",
    title_deed_status: "",
    listed_by: "Emlak Ofisinden",
  });

  useEffect(() => {
    api
      .get("/admin/categories")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        setCategories(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    const numericFields = [
      "price",
      "gross_area",
      "net_area",
      "building_age",
      "floor_count",
      "maintenance_fee",
      "deposit",
      "bath_count",
    ];

    Object.keys(formData).forEach((key) => {
      let value = formData[key];

      if (numericFields.includes(key) && value === "") {
        value = null;
      }

      if (value !== null && value !== undefined) {
        data.append(key, value);
      }
    });

    selectedFiles.forEach((file) => data.append("images", file));

    try {
      await api.post("/properties", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("İlan başarıyla oluşturuldu.");
      navigate("/agent/portfolio");
    } catch (err) {
      alert(err.response?.data?.message || "İlan eklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = categories.find((c) => c.id === parseInt(formData.category_id));

  const isKonut = selectedCategory?.name === "Konut";
  const isArsa = selectedCategory?.name === "Arsa";
  const isIsyeri = selectedCategory?.name === "İşyeri";
  const isBina = selectedCategory?.name === "Bina";
  const isTuristik = selectedCategory?.name === "Turistik Tesis";
  const isDevreMulk = selectedCategory?.name === "Devre Mülk";

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.header}>
          <h1>Yeni İlan Oluştur</h1>
          <div className={styles.actions}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className={styles.cancelBtn}
            >
              <FaTimes /> İptal
            </button>
            <button type="submit" className={styles.saveBtn} disabled={loading}>
              <FaSave /> {loading ? "Kaydediliyor..." : "İlanı Yayınla"}
            </button>
          </div>
        </div>

        <div className={styles.section}>
          <h3>Genel Bilgiler</h3>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label>İlan Başlığı</label>
              <input type="text" name="title" required onChange={handleChange} />
            </div>
            <div className={styles.field}>
              <label>Mülk Sahibi Kodu</label>
              <input type="text" name="owner_code" required onChange={handleChange} />
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
              <label>Emlak Tipi</label>
              <input type="text" name="type" required onChange={handleChange} />
            </div>
            <div className={styles.field}>
              <label>Durum</label>
              <select name="status" onChange={handleChange} value={formData.status}>
                <option value="Kiralık">Kiralık</option>
                <option value="Satılık">Satılık</option>
              </select>
            </div>
            <div className={styles.field}>
              <label>Fiyat (TL)</label>
              <input type="number" name="price" required onChange={handleChange} />
            </div>
            <div className={styles.field}>
              <label>İlan Tarihi</label>
              <input type="date" name="listing_date" value={formData.listing_date} onChange={handleChange} />
            </div>
          </div>
        </div>

        {isKonut && (
          <div className={styles.section}>
            <h3>Konut Teknik Detayları</h3>
            <div className={styles.grid}>
              <div className={styles.field}><label>m² (Brüt)</label><input type="number" name="gross_area" onChange={handleChange} /></div>
              <div className={styles.field}><label>m² (Net)</label><input type="number" name="net_area" onChange={handleChange} /></div>
              <div className={styles.field}><label>Oda Sayısı</label><input type="text" name="room_count" onChange={handleChange} /></div>
              <div className={styles.field}><label>Bina Yaşı</label><input type="number" name="building_age" onChange={handleChange} /></div>
              <div className={styles.field}><label>Bulunduğu Kat</label><input type="text" name="floor_level" onChange={handleChange} /></div>
              <div className={styles.field}><label>Kat Sayısı</label><input type="number" name="floor_count" onChange={handleChange} /></div>
              <div className={styles.field}><label>Isıtma</label><input type="text" name="heating" onChange={handleChange} /></div>
              <div className={styles.field}><label>Banyo Sayısı</label><input type="number" name="bath_count" onChange={handleChange} /></div>
              <div className={styles.field}>
                <label>Eşyalı mı?</label>
                <select name="furnished" onChange={handleChange} value={formData.furnished}>
                  <option value="Hayır">Hayır</option>
                  <option value="Evet">Evet</option>
                </select>
              </div>
              <div className={styles.field}><label>Aidat (TL)</label><input type="number" name="maintenance_fee" onChange={handleChange} /></div>
              <div className={styles.field}><label>Otopark</label><input type="text" name="parking" onChange={handleChange} /></div>
            </div>
          </div>
        )}

        {isIsyeri && (
          <div className={styles.section}>
            <h3>İşyeri Teknik Detayları</h3>
            <div className={styles.grid}>
              <div className={styles.field}><label>m² (Net)</label><input type="number" name="net_area" onChange={handleChange} /></div>
              <div className={styles.field}><label>Bölüm Sayısı</label><input type="text" name="room_count" onChange={handleChange} /></div>
              <div className={styles.field}><label>Bina Yaşı</label><input type="number" name="building_age" onChange={handleChange} /></div>
              <div className={styles.field}><label>Isıtma</label><input type="text" name="heating" onChange={handleChange} /></div>
              <div className={styles.field}><label>Kullanım Durumu</label><input type="text" name="usage_status" onChange={handleChange} /></div>
              <div className={styles.field}><label>Aidat (TL)</label><input type="number" name="maintenance_fee" onChange={handleChange} /></div>
            </div>
          </div>
        )}

        {isArsa && (
          <div className={styles.section}>
            <h3>Arsa Teknik Detayları</h3>
            <div className={styles.grid}>
              <div className={styles.field}><label>Ada No</label><input type="text" name="block_no" onChange={handleChange} /></div>
              <div className={styles.field}><label>Parsel No</label><input type="text" name="parcel_no" onChange={handleChange} /></div>
              <div className={styles.field}><label>Pafta No</label><input type="text" name="map_sheet_no" onChange={handleChange} /></div>
              <div className={styles.field}><label>İmar Durumu</label><input type="text" name="zoning_status" onChange={handleChange} /></div>
              <div className={styles.field}><label>m² (Toplam)</label><input type="number" name="gross_area" required onChange={handleChange} /></div>
              <div className={styles.field}><label>KAKS (Emsal)</label><input type="text" name="kaks" onChange={handleChange} /></div>
              <div className={styles.field}><label>Gabari</label><input type="text" name="gabari" onChange={handleChange} /></div>
              <div className={styles.field}><label>Tapu Durumu</label><input type="text" name="title_deed_status" onChange={handleChange} /></div>
            </div>
          </div>
        )}

        {isBina && (
          <div className={styles.section}>
            <h3>Bina Teknik Detayları</h3>
            <div className={styles.grid}>
              <div className={styles.field}><label>Toplam Kat Sayısı</label><input type="number" name="floor_count" onChange={handleChange} /></div>
              <div className={styles.field}><label>Bina Yaşı</label><input type="number" name="building_age" onChange={handleChange} /></div>
              <div className={styles.field}><label>Isıtma</label><input type="text" name="heating" onChange={handleChange} /></div>
              <div className={styles.field}><label>m² (Arsa Alanı)</label><input type="number" name="gross_area" onChange={handleChange} /></div>
              <div className={styles.field}><label>Otopark Durumu</label><input type="text" name="parking" onChange={handleChange} /></div>
              <div className={styles.field}><label>İmar Durumu</label><input type="text" name="zoning_status" onChange={handleChange} /></div>
            </div>
          </div>
        )}

        {isTuristik && (
          <div className={styles.section}>
            <h3>Turistik Tesis Detayları</h3>
            <div className={styles.grid}>
              <div className={styles.field}><label>m² (Açık/Kapalı)</label><input type="number" name="gross_area" onChange={handleChange} /></div>
              <div className={styles.field}><label>Yatak Kapasitesi</label><input type="number" name="bed_capacity" onChange={handleChange} /></div>
              <div className={styles.field}><label>Bina Yaşı</label><input type="number" name="building_age" onChange={handleChange} /></div>
              <div className={styles.field}><label>Isıtma</label><input type="text" name="heating" onChange={handleChange} /></div>
              <div className={styles.field}><label>Yıldız Sayısı</label><input type="number" name="star_count" onChange={handleChange} /></div>
            </div>
          </div>
        )}

        {isDevreMulk && (
          <div className={styles.section}>
            <h3>Devre Mülk Detayları</h3>
            <div className={styles.grid}>
              <div className={styles.field}><label>Oda Sayısı</label><input type="text" name="room_count" onChange={handleChange} /></div>
              <div className={styles.field}><label>Dönem</label><input type="text" name="usage_status" placeholder="Yaz/Kış" onChange={handleChange} /></div>
              <div className={styles.field}><label>Bina Yaşı</label><input type="number" name="building_age" onChange={handleChange} /></div>
              <div className={styles.field}><label>Isıtma</label><input type="text" name="heating" onChange={handleChange} /></div>
              <div className={styles.field}>
                <label>Eşyalı mı?</label>
                <select name="furnished" onChange={handleChange} value={formData.furnished}>
                  <option value="Hayır">Hayır</option>
                  <option value="Evet">Evet</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className={styles.section}>
          <h3>Konum ve Açıklama</h3>
          <div className={styles.field}>
            <label>Tam Adres</label>
            <textarea name="address" required onChange={handleChange} rows="3"></textarea>
          </div>
          <div className={styles.field}>
            <label>İlan Açıklaması</label>
            <textarea name="description" required onChange={handleChange} rows="6"></textarea>
          </div>
        </div>

        <div className={styles.section}>
          <h3>Fotoğraflar</h3>
          <div className={styles.uploadArea}>
            <input type="file" multiple accept="image/*" onChange={handleFileChange} id="fileInput" hidden />
            <label htmlFor="fileInput" className={styles.uploadLabel}>
              <FaCloudUploadAlt />
              <span>Görselleri Seçmek İçin Tıklayın</span>
              <small>{selectedFiles.length} dosya seçildi</small>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddPropertyForm;