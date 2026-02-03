import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import logoImage from '../../assets/logo.png'; 
import { 
    FaHome, 
    FaUsers, 
    FaBuilding, 
    FaWallet, 
    FaTags, 
    FaSignOutAlt,
    FaEllipsisV,
    FaTimes,
    FaInfoCircle 
} from 'react-icons/fa';
import styles from './AdminLayout.module.css';

function AdminLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const isActive = (path) => location.pathname === path ? styles.activeLink : '';

    return (
        <div className={styles.layout}>
            {/* Mobil Toggle Butonu */}
            <button 
                className={styles.mobileToggleBtn} 
                onClick={toggleSidebar}
            >
                {isSidebarOpen ? <FaTimes /> : <FaEllipsisV />}
            </button>

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className={styles.overlay} 
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
                <div className={styles.sidebarHeader}>
                    <Link to="/" className={styles.logoLink}>
                        <img src={logoImage} alt="Kobal Gayrimenkul Logo" className={styles.logo} />
                    </Link>
                    <div className={styles.userInfo}>
                        <p className={styles.userName}>{user?.full_name}</p>
                        <small className={styles.roleTag}>Admin Paneli</small>
                    </div>
                </div>
                
                <nav className={styles.nav}>
                    <Link to="/" className={`${styles.navLink}`}>
                        <FaHome /> <span>Ana Sayfa</span>
                    </Link>
                    <Link to="/admin/dashboard" className={`${styles.navLink} ${isActive('/admin/dashboard')}`}>
                        <FaInfoCircle /> <span>Özet</span>
                    </Link>
                    <Link to="/admin/users" className={`${styles.navLink} ${isActive('/admin/users')}`}>
                        <FaUsers /> <span>Kullanıcı Yönetimi</span>
                    </Link>
                    <Link to="/admin/properties" className={`${styles.navLink} ${isActive('/admin/properties')}`}>
                        <FaBuilding /> <span>Mülk Yönetimi</span>
                    </Link>
                    <Link to="/admin/payments" className={`${styles.navLink} ${isActive('/admin/payments')}`}>
                        <FaWallet /> <span>Global Ödemeler</span>
                    </Link>
                    <Link to="/admin/categories" className={`${styles.navLink} ${isActive('/admin/categories')}`}>
                        <FaTags /> <span>Kategori Yönetimi</span>
                    </Link>
                </nav>

                <button onClick={handleLogout} className={styles.logoutBtn}>
                    <FaSignOutAlt /> <span>Güvenli Çıkış</span>
                </button>
            </aside>

            <main className={styles.content}>
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;