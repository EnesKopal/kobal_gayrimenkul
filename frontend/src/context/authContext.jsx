import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

const login = async (email, password) => {
    try {
        const res = await api.post('/auth/login', { email, password });
        

        const { token, user: userData } = res.data;

     
        if (!userData || !userData.role) {
            throw new Error("Kullanıcı yetki bilgisi (role) alınamadı.");
        }

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);

      
        if (userData.role === 'Admin') {
            navigate('/admin');
        } else if (userData.role === 'Agent') {
            navigate('/agent');
        } else {
           
            navigate('/');
        }

        return { success: true, user: userData };

    } catch (err) {
        console.error("Login Hatası:", err);
        return { 
            success: false, 
            message: err.response?.data?.message || err.message || 'Giriş yapılamadı' 
        };
    }
};

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth bir AuthProvider içinde kullanılmalıdır.");
    }
    return context;
};