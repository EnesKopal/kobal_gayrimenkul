import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FaSearch, FaUserTag, FaPhoneAlt, FaEnvelope, FaIdBadge } from 'react-icons/fa';
import styles from './AgentContacts.module.css';

function AgentContacts() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const res = await api.get('/users/contacts');
            setUsers(res.data.data);
            setFilteredUsers(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error("Müşteri listesi alınamadı:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        let result = users.filter(u => 
            (`${u.first_name} ${u.last_name}`).toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.user_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (roleFilter !== 'all') {
            result = result.filter(u => u.role_id === parseInt(roleFilter));
        }

        setFilteredUsers(result);
    }, [searchTerm, roleFilter, users]);

    if (loading) return <div>Yükleniyor...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Müşteri Rehberi</h1>
                <p>Sistemdeki tüm mülk sahipleri ve kiracılar.</p>
            </div>

            <div className={styles.filterBar}>
                <div className={styles.searchBox}>
                    <FaSearch />
                    <input 
                        type="text" 
                        placeholder="İsim, e-posta veya kod ile ara..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select 
                    className={styles.selectFilter}
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                >
                    <option value="all">Tüm Roller</option>
                    <option value="3">Mülk Sahipleri</option>
                    <option value="4">Kiracılar</option>
                </select>
            </div>

            <div className={styles.grid}>
                {filteredUsers.map(u => (
                    <div key={u.user_code} className={styles.userCard}>
                        <div className={styles.cardHeader}>
                            <div className={styles.avatar}>
                                {u.first_name[0]}{u.last_name[0]}
                            </div>
                            <span className={u.role_id === 3 ? styles.ownerBadge : styles.tenantBadge}>
                                {u.role_id === 3 ? 'Mülk Sahibi' : 'Kiracı'}
                            </span>
                        </div>
                        
                        <div className={styles.cardBody}>
                            <h3>{u.first_name} {u.last_name}</h3>
                            <div className={styles.infoLine}>
                                <FaIdBadge /> <span>{u.user_code}</span>
                            </div>
                            <div className={styles.infoLine}>
                                <FaPhoneAlt /> <span>{u.phone || 'Girilmemiş'}</span>
                            </div>
                            <div className={styles.infoLine}>
                                <FaEnvelope /> <span>{u.email}</span>
                            </div>
                        </div>

                        <div className={styles.cardActions}>
                            <a href={`mailto:${u.email}`} className={styles.actionBtn}>E-Posta Gönder</a>
                            {u.phone && <a href={`tel:${u.phone}`} className={styles.actionBtn}>Ara</a>}
                        </div>
                    </div>
                ))}
            </div>

            {filteredUsers.length === 0 && <p className={styles.noResult}>Eşleşen müşteri bulunamadı.</p>}
        </div>
    );
}

export default AgentContacts;