import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import styles from './Auth.module.css';

function Register() {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        phone: '',
        role_id: '3'
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', formData);
            alert("Kayıt başarılı! Giriş yapabilirsiniz.");
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || "Kayıt sırasında bir hata oluştu.");
        }
    };

    return (
        <div className={styles.authContainer}>
            <form className={styles.authForm} onSubmit={handleSubmit}>
                <h2>Kayıt Ol</h2>
                {error && <p className={styles.error}>{error}</p>}
                
                <div className={styles.row}>
                    <input 
                        type="text" placeholder="Ad" required
                        onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                    />
                    <input 
                        type="text" placeholder="Soyad" required
                        onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                    />
                </div>

                <input 
                    type="email" placeholder="E-posta" required
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                
                <input 
                    type="password" placeholder="Şifre" required
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                />

                <input 
                    type="text" placeholder="Telefon (05xx...)" required
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />

                <div className={styles.roleGroup}>
                    <label>Üyelik Tipi:</label>
                    <select 
                        value={formData.role_id}
                        onChange={(e) => setFormData({...formData, role_id: e.target.value})}
                    >
                        <option value="3">Mülk Sahibi</option>
                        <option value="4">Kiracı</option>
                    </select>
                </div>

                <button type="submit" className={styles.submitBtn}>Hesap Oluştur</button>
                <p className={styles.switchAuth}>
                    Zaten hesabınız var mı? <Link to="/login">Giriş Yap</Link>
                </p>
            </form>
        </div>
    );
}

export default Register;