import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/authContext';
import { FaBuilding, FaKey, FaUsers, FaChartLine, FaClock, FaExclamationTriangle} from 'react-icons/fa';
import styles from './AgentDashboardHome.module.css';

function AgentDashboardHome() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalProperties: 0,
        activeRentals: 0,
        totalOwners: 0,
        performanceRate: 0,
        pendingApprovals: 0,
        delayedPayments: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/properties/agent-stats');
                setStats(res.data.data);
                setLoading(false);
            } catch (err) {
                console.error("İstatistikler yüklenemedi:", err);
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div>Yükleniyor...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Hoş Geldin, {user?.full_name}</h1>
                <p>İşte portföyünün güncel durumu ve performans özetin.</p>
            </header>
           

            <div className={styles.statsGrid}>
                <div className={styles.card}>
                    <div className={`${styles.iconBox} ${styles.blue}`}>
                        <FaBuilding />
                    </div>
                    <div className={styles.info}>
                        <span>Toplam Portföy</span>
                        <h3>{stats.totalProperties} İlan</h3>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={`${styles.iconBox} ${styles.green}`}>
                        <FaKey />
                    </div>
                    <div className={styles.info}>
                        <span>Aktif Kiralar</span>
                        <h3>{stats.activeRentals} Sözleşme</h3>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={`${styles.iconBox} ${styles.orange}`}>
                        <FaUsers />
                    </div>
                    <div className={styles.info}>
                        <span>Mülk Sahiplerim</span>
                        <h3>{stats.totalOwners} Kişi</h3>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={`${styles.iconBox} ${styles.purple}`}>
                        <FaChartLine />
                    </div>
                    <div className={styles.info}>
                        <span>Kiralama Oranı</span>
                        <h3>%{stats.performanceRate}</h3>
                    </div>
                </div>
            </div>

            <div className={styles.welcomeBox}>
                <span>Sistem üzerindeki tüm kira takipleri ve ilan yönetimi aktif durumdadır.</span>
            </div>
        </div>
    );
}

export default AgentDashboardHome;