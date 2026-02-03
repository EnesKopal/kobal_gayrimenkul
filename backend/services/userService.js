import db from '../models/index.js';

const { User, Role } = db;

class UserService {

    static async updateUserRole(user_code, role_id) {
      
        if (!user_code || role_id === undefined) {
            throw new Error("Eksik veri: user_code ve role_id zorunludur.");
        }

      
        const [updatedRows] = await User.update(
            { role_id: Number(role_id) }, 
            { where: { user_code: user_code } }
        );

        if (updatedRows === 0) {
            throw new Error("Kullanıcı bulunamadı veya rol zaten aynı.");
        }

        return await User.findOne({
            where: { user_code: user_code },
            include: [{ model: Role }],
            attributes: { exclude: ['password_hash'] }
        });
    }

    static async getAllUsers() {
        return await User.findAll({
            include: [{ model: Role }],
            attributes: { exclude: ['password_hash'] }
        });
    }

    static async deleteUser(userCode) {
        const user = await User.findOne({ where: { user_code: userCode } });
        if (!user) throw new Error("Kullanıcı bulunamadı.");
        
        await user.destroy();
        return true;
    }

    static async getAgentContacts() {
    return await db.User.findAll({
        where: {
            role_id: [3, 4]
        },
        attributes: ['user_code', 'first_name', 'last_name', 'email', 'phone', 'role_id', 'created_at'],
        order: [['first_name', 'ASC']]
    });
}

static async getPublicAgents() {
    try {
        return await User.findAll({
            where: {
                role_id: 2 
            },
            
            attributes: [
                'user_code', 
                'first_name', 
                'last_name', 
                'email', 
                'phone'
            ],
            
            include: [{
                model: Role,
                attributes: ['role_name']
            }],
            order: [['first_name', 'ASC']] 
        });
    } catch (error) {
        console.error("getPublicAgents Hatası:", error);
        throw new Error("Danışman listesi şu an alınamıyor.");
    }
}
}

export default UserService;