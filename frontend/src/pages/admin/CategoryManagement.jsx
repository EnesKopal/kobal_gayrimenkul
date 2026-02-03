import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import styles from './CategoryManagement.module.css';
import { FaPlus, FaTrash, FaTags } from 'react-icons/fa';

function CategoryManagement() {
    const [categories, setCategories] = useState([]);
    const [newName, setNewName] = useState("");

    useEffect(() => { fetchCategories(); }, []);

    const fetchCategories = async () => {
        const res = await api.get('/admin/categories');
        setCategories(res.data.data);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/categories', { name: newName });
            setNewName("");
            fetchCategories();
        } catch (err) { alert(err.response?.data?.message || "Hata!"); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Silmek istediğinize emin misiniz?")) return;
        try {
            await api.delete(`/admin/categories/${id}`);
            fetchCategories();
        } catch (err) { alert(err.response?.data?.message); }
    };

    return (
        <div className={styles.container}>
            <h1><FaTags /> Kategori Yönetimi</h1>
            
            <form onSubmit={handleAdd} className={styles.addForm}>
                <input 
                    type="text" 
                    placeholder="Yeni kategori adı (Örn: Villa)" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                />
                <button type="submit"><FaPlus /> Ekle</button>
            </form>

            <div className={styles.list}>
                {categories.map(cat => (
                    <div key={cat.id} className={styles.item}>
                        <span>{cat.name}</span>
                        <button onClick={() => handleDelete(cat.id)}><FaTrash /></button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CategoryManagement;