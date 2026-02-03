/* eslint-disable no-unused-vars */
import jwt from 'jsonwebtoken';
import db from '../models/index.js';
import process from 'process';

const verifyToken = async (req, res, next) => {
    // Authorization header'ından "Bearer TOKEN" formatında token'ı alıyoruz
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "Token gerekli!" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Kullanıcıyı rolüyle birlikte çekiyoruz (role_id: 2 burada Role tablosuna bağlanır)
        const user = await db.User.findByPk(decoded.id, {
            include: [{ model: db.Role }]
        });

        if (!user) {
            return res.status(404).json({ success: false, message: "Kullanıcı bulunamadı." });
        }

        // Request nesnesine kullanıcı bilgilerini ekliyoruz
        // roleCheck middleware'i buradaki 'role' bilgisini kullanacak
        req.user = {
            id: user.id,
            user_code: user.user_code,
            role: user.Role?.role_name // Veritabanındaki 'Agent', 'Admin' gibi isimler
        };

        next();
    } catch (err) {
        return res.status(403).json({ success: false, message: "Geçersiz veya süresi dolmuş token!" });
    }
};

export default verifyToken;