
import React from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import logoImage from "../assets/logo.png";
import { HiMenu } from "react-icons/hi";
import { useAuth } from "../context/authContext";

function Header({ onMenuClick }) {
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      {/* Mobil Menü Butonu */}
      <button className={styles.menuButton} onClick={onMenuClick}>
        <HiMenu />
        <span>Menü</span>
      </button>

      {/* Logo */}
      <Link to="/" className={styles.logoImageContainer}>
        <img src={logoImage} alt="Kobal Gayrimenkul Logo" />
      </Link>

      {/* Ana Navigasyon */}
      <nav className={styles.nav}>
        <Link to="/" className={styles.navLink}>Ana Sayfa</Link>
        <Link to="/ilanlar" className={styles.navLink}>İlanlar</Link>

        {/* Rol Bazlı Dinamik Linkler */}
        {user?.role === "Admin" && (
          <Link to="/admin/dashboard" className={styles.specialLink}>
            Admin Paneli
          </Link>
        )}

        {user?.role === "Agent" && (
          <Link to="/agent/dashboard" className={styles.specialLink}>
            Danışman Paneli
          </Link>
        )}

        {user?.role === "Owner" && (
          <Link to="/mulklerim" className={styles.navLink}>
            Mülklerim
          </Link>
        )}

        {user?.role === "Tenant" && (
          <Link to="/odemelerim" className={styles.navLink}>
            Ödemelerim
          </Link>
        )}

        <Link to="/hakkimizda" className={styles.navLink}>Hakkımızda</Link>
        <Link to="/iletisim" className={styles.navLink}>İletişim</Link>

        {/* Giriş / Kullanıcı Alanı */}
        <div className={styles.authLinks}>
          {user ? (
            <div className={styles.userSection}>
              <span className={styles.userName}>
                 <strong>{user.full_name || user.first_name}</strong>
              </span>
              <button onClick={logout} className={styles.logoutBtn}>
                Çıkış Yap
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className={styles.loginLink}>
                Giriş Yap
              </Link>
              <Link to="/register" className={styles.registerBtn}>
                Kayıt Ol
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;