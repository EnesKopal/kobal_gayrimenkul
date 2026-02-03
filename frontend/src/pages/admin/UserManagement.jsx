/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import styles from './UserManagement.module.css';
import { FaUserShield, FaTrash, FaSearch } from 'react-icons/fa';

// Rol isimlerini eşleştirmek için bir nesne oluşturalım
const roleNamesTR = {
    Admin: "Yönetici",
    Agent: "Danışman",
    Owner: "Mülk Sahibi",
    Tenant: "Kiracı"
};

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error("Kullanıcılar yüklenemedi:", err);
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRoleId) => {
        try {
            await api.put(`/admin/users/${userId}/role`, { role_id: newRoleId });
            alert("Rol başarıyla güncellendi.");
            fetchUsers();
        } catch (err) {
            alert("Hata: Rol güncellenemedi.");
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) return;
        try {
            await api.delete(`/admin/users/${userId}`);
            fetchUsers();
        } catch (err) {
            alert("Silme işlemi başarısız.");
        }
    };

    const filteredUsers = users.filter(u => 
        (u.first_name + " " + u.last_name).toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.user_code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className={styles.loading}>Yükleniyor...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1><FaUserShield /> Kullanıcı Yönetimi</h1>
                <div className={styles.searchBox}>
                    <FaSearch />
                    <input 
                        type="text" 
                        placeholder="İsim veya kullanıcı kodu ile ara..." 
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Kod</th>
                        <th>Ad Soyad</th>
                        <th>E-posta</th>
                        <th>Mevcut Rol</th>
                        <th>Rol Değiştir</th>
                        <th>İşlemler</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map(user => (
                        <tr key={user.id}>
                            <td data-label="Kod"><code>{user.user_code}</code></td>
                            <td data-label="Ad Soyad">{user.first_name} {user.last_name}</td>
                            <td data-label="E-posta">{user.email}</td>
                            <td data-label="Mevcut Rol">
        
                                <span className={`${styles.roleBadge} ${styles[user.Role?.role_name]}`}>
                                    {roleNamesTR[user.Role?.role_name] || user.Role?.role_name}
                                </span>
                            </td>
                            <td data-label="Rol Değiştir">
                                <select 
                                    className={styles.select}
                                    value={user.role_id}
                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                >
                                    <option value="1">Yönetici</option>
                                    <option value="2">Danışman</option>
                                    <option value="3">Mülk Sahibi</option>
                                    <option value="4">Kiracı</option>
                                </select>
                            </td>
                            <td data-label="İşlemler">
                                <button className={styles.deleteBtn} onClick={() => handleDelete(user.id)} title="Kullanıcıyı Sil">
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserManagement;