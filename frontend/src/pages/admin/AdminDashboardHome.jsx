import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../../services/api';
import styles from './AdminDashboardHome.module.css';
import { FaUsers, FaBuilding, FaMoneyBillWave, FaExclamationCircle } from 'react-icons/fa';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

function AdminDashboardHome() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/stats')
            .then(res => {
                setStats(res.data.data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    if (loading) return <div>Veriler yükleniyor...</div>;

    const chartData = stats.propertiesByType.map(item => ({
        name: item.type || "Diğer",
        value: parseInt(item.count)
    }));

    return (
        <div className={styles.container}>
            <div className={styles.statsGrid}>
                <div className={styles.card}>
                    <FaMoneyBillWave className={styles.iconBlue} />
                    <div><span>Toplam Ciro</span><h3>{stats.finance.totalRevenue.toLocaleString()} TL</h3></div>
                </div>
                <div className={styles.card}>
                    <FaBuilding className={styles.iconGreen} />
                    <div><span>Aktif Mülkler</span><h3>{stats.summary.activeProperties}</h3></div>
                </div>
                <div className={styles.card}>
                    <FaUsers className={styles.iconPurple} />
                    <div><span>Toplam Kullanıcı</span><h3>{stats.summary.totalUsers}</h3></div>
                </div>
            </div>

            <div className={styles.chartsRow}>
                <div className={styles.chartBox}>
                    <h3>Mülk Türü Dağılımı</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={chartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                {chartData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className={styles.infoBox}>
                    <h3>Platform Doluluk Oranı</h3>
                    <div className={styles.progressCircle}>
                        <strong>%{stats.summary.occupancyRate}</strong>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboardHome;