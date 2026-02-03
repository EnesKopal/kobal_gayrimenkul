import express from 'express';
import cors from 'cors';
import path from 'path';
import 'dotenv/config';
import process from 'process';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import rentalRoutes from './routes/rentalRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


app.use(cors());
app.use(express.json());


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotalar
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/rentals', rentalRoutes); 
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);


// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error("❌ Beklenmedik Hata:", err.stack);
    res.status(500).json({ 
        success: false, 
        message: "Sunucu tarafında bir hata oluştu!",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`🚀 Sunucu ${PORT} portunda yayında...`);
    console.log(`📂 Statik dosyalar için adres: http://localhost:${PORT}/uploads`);
});