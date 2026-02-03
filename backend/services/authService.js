import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../models/index.js';
import process from 'process';

const { User, Role } = db;

class AuthService {
    static async generateUniqueUserCode() {
        let isUnique = false;
        let newCode = '';
        while (!isUnique) {
            newCode = Math.random().toString(36).substring(2, 12).toUpperCase();
            const existing = await User.findOne({ where: { user_code: newCode } });
            if (!existing) isUnique = true;
        }
        return newCode;
    }

    static async register(userData) {
        const { first_name, last_name, email, password, role_id, phone } = userData;

      
        const allowedRoles = [3, 4];
        if (!allowedRoles.includes(Number(role_id))) {
            throw new Error("Bu rol ile kayıt olamazsınız. Sadece Mülk Sahibi veya Kiracı rolleri seçilebilir.");
        }

      
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) throw new Error("Bu e-posta adresi zaten kullanımda.");


        const hashedPassword = await bcrypt.hash(password, 10);
        const user_code = await this.generateUniqueUserCode();

        // 4. Kayıt İşlemi
        return await User.create({
            user_code,
            first_name,
            last_name,
            email,
            password_hash: hashedPassword,
            role_id,
            phone
        });
    }

    static async login(email, password) {
        const user = await User.findOne({
            where: { email },
            include: [{ model: Role }]
        });

        if (!user) throw new Error("Kullanıcı bulunamadı.");
        
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) throw new Error("Hatalı şifre.");

        const token = jwt.sign(
            { id: user.id, user_code: user.user_code, role: user.Role?.role_name || 'User' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return {
            token,
            user: {
                user_code: user.user_code,
                full_name: `${user.first_name} ${user.last_name}`,
                role: user.Role?.role_name
            }
        };
    }
}

export default AuthService;