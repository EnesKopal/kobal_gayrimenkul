import React, { useState, useEffect } from "react";
import styles from "./Sidebar.module.css";
import { Link } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import api from "../services/api";
import { useAuth } from "../context/authContext";
import {
  FaHome,
  FaBuilding,
  FaTree,
  FaRegBuilding,
  FaUmbrellaBeach,
  FaBed,
  FaInfoCircle,
  FaHandsHelping,
  FaPhone,
  FaPlusCircle,
  FaSearch,
} from "react-icons/fa";

const iconMap = {
  Konut: <FaHome />,
  İşyeri: <FaBuilding />,
  Arsa: <FaTree />,
  Bina: <FaRegBuilding />,
  Devremülk: <FaUmbrellaBeach />,
  "Turistik Tesis": <FaBed />,
};

function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (isOpen) {
      api
        .get("/categories")
        .then((res) => {
          // Kategorileri alfabetik sırala
          const sorted = res.data.data.sort((a, b) =>
            a.name.localeCompare(b.name, "tr"),
          );
          setCategories(sorted);
        })
        .catch((err) =>
          console.error("Sidebar kategorileri yüklenemedi:", err),
        );
    }
  }, [isOpen]);

  const sidebarClasses = `${styles.sidebar} ${isOpen ? styles.open : ""}`;

  return (
    <>
      {isOpen && <div className={styles.backdrop} onClick={onClose}></div>}

      <nav className={sidebarClasses}>
        <button className={styles.closeButton} onClick={onClose}>
          <IoClose /> Kapat
        </button>

        <ul className={styles.navList}>
          <li>
            <Link to="/" onClick={onClose}>
              <FaHome /> Ana Sayfa
            </Link>
          </li>

          {/* Dinamik Kategoriler */}
          {categories.map((cat) => (
            <li key={cat.id}>
              <Link to={`/ilanlar?category_id=${cat.id}`} onClick={onClose}>
                {iconMap[cat.name] || <FaRegBuilding />} {cat.name}
              </Link>
            </li>
          ))}

          <li className={styles.divider}></li>

          {/* Rol Bazlı Linkler - Header'dan kopyalandı çünkü mobilde header menüsü gizleniyor */}
          {isAuthenticated && user?.role === "Admin" && (
            <li>
              <Link
                to="/admin/dashboard"
                onClick={onClose}
                style={{ color: "#ffc107" }}
              >
                <FaRegBuilding /> Admin Paneli
              </Link>
            </li>
          )}
          {isAuthenticated && user?.role === "Agent" && (
            <li>
              <Link
                to="/agent/dashboard"
                onClick={onClose}
                style={{ color: "#00d2d3" }}
              >
                <FaRegBuilding /> Danışman Paneli
              </Link>
            </li>
          )}
          {isAuthenticated && user?.role === "Owner" && (
            <li>
              <Link to="/mulklerim" onClick={onClose}>
                <FaBuilding /> Mülklerim
              </Link>
            </li>
          )}
          {isAuthenticated && user?.role === "Tenant" && (
            <li>
              <Link to="/odemelerim" onClick={onClose}>
                <FaHandsHelping /> Ödemelerim
              </Link>
            </li>
          )}

          <li className={styles.divider}></li>

          <li>
            <Link to="/hakkimizda" onClick={onClose}>
              <FaInfoCircle /> Hakkımızda
            </Link>
          </li>
          <li>
            <Link to="/emlak-ekle" onClick={onClose}>
              <FaPlusCircle /> Gayrimenkul Sat/Kiraya Ver
            </Link>
          </li>
          <li>
            <Link to="/talep-et" onClick={onClose}>
              <FaSearch /> Gayrimenkul Satın Al/Kirala
            </Link>
          </li>
          <li>
            <Link to="/iletisim" onClick={onClose}>
              <FaPhone /> İletişim
            </Link>
          </li>

          <li className={styles.divider}></li>

          {/* Auth İşlemleri */}
          {isAuthenticated ? (
            <>
              <li
                style={{
                  padding: "0.9rem 0.5rem",
                  opacity: 0.8,
                  fontSize: "0.9rem",
                }}
              >
                Merhaba, <strong>{user.full_name || user.first_name}</strong>
              </li>
              <li>
                <button
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className={styles.sidebarLogoutBtn}
                >
                  Çıkış Yap
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" onClick={onClose}>
                  {" "}
                  Giriş Yap
                </Link>
              </li>
              <li>
                <Link to="/register" onClick={onClose}>
                  {" "}
                  Kayıt Ol
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </>
  );
}

export default Sidebar;
