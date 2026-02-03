import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import logoImage from '../assets/logo.png'; 
import { 
    FaHome, 
    FaList, 
    FaUserFriends, 
    FaPlusCircle, 
    FaSignOutAlt, 
    FaKey,
    FaAddressBook,
    FaFileInvoiceDollar,
    FaEllipsisV,
    FaTimes
} from 'react-icons/fa';
import styles from './AgentLayout.module.css';

function AgentLayout() {
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

            {/* Sidebar Overlay (Mobilde açıkken arka planı karartmak için) */}
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
                        <small className={styles.roleTag}>Danışman Paneli</small>
                    </div>
                </div>
                
                <nav className={styles.nav}>
                    <Link to="/agent/dashboard" className={`${styles.navLink} ${isActive('/agent/dashboard')}`}>
                        <FaHome /> <span>Özet</span>
                    </Link>
                    <Link to="/agent/portfolio" className={`${styles.navLink} ${isActive('/agent/portfolio')}`}>
                        <FaList /> <span>Portföyüm</span>
                    </Link>
                    <Link to="/agent/rentals" className={`${styles.navLink} ${isActive('/agent/rentals')}`}>
                        <FaKey /> <span>Aktif Kiralarım</span>
                    </Link>
                    {/* YENİ: Kira Takibi Linki */}
                    <Link to="/agent/rent-tracker" className={`${styles.navLink} ${isActive('/agent/rent-tracker')}`}>
                        <FaFileInvoiceDollar /> <span>Kira Takibi</span>
                    </Link>
                    <Link to="/agent/contacts" className={`${styles.navLink} ${isActive('/agent/contacts')}`}>
                        <FaAddressBook /> <span>Müşteri Rehberi</span>
                    </Link>
                    <Link to="/agent/owners" className={`${styles.navLink} ${isActive('/agent/owners')}`}>
                        <FaUserFriends /> <span>Mülk Sahiplerim</span>
                    </Link>
                    <Link to="/agent/add-property" className={`${styles.navLink} ${isActive('/agent/add-property')}`}>
                        <FaPlusCircle /> <span>Yeni İlan Ekle</span>
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

export default AgentLayout;