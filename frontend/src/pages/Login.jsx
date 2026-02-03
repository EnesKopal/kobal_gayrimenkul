import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import styles from './Auth.module.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        const result = await login(email, password);
     
       if (result.success) {
        const userRole = result.user?.role;
    

   
    if (userRole === 'Admin') {
        navigate('/admin/dashboard');
    } else if (userRole === 'Agent') {
        navigate('/agent/dashboard');
    } else {
       
        navigate('/');
        }
    } else {
        setError(result.message);
    }
    };

    return (
        <div className={styles.authContainer}>
            <form className={styles.authForm} onSubmit={handleSubmit}>
                <h2>Giriş Yap</h2>
                {error && <p className={styles.error}>{error}</p>}
                
                <input 
                    type="email" 
                    placeholder="E-posta" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                
                <input 
                    type="password" 
                    placeholder="Şifre" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit" className={styles.submitBtn}>Giriş Yap</button>
                
                <p className={styles.switchAuth}>
                    Henüz hesabınız yok mu? <Link to="/register">Kayıt Ol</Link>
                </p>
            </form>
        </div>
    );
}

export default Login;