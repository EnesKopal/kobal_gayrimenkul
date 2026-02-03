import db from '../models/index.js';
const { Property, User, Rental, Role, Payment, Category } = db;

class AdminService {
    static async getSystemStats() {
        const totalProperties = await Property.count();
        const activeProperties = await Property.count({ where: { is_active: true } });
        const totalRentals = await Rental.count();
        const totalUsers = await User.count();

        const allPayments = await Payment.findAll({ raw: true });
        
        const totalRevenue = allPayments
            .filter(p => p.status?.toLowerCase() === 'paid')
            .reduce((sum, p) => sum + Number(p.amount), 0);
            
        const pendingRevenue = allPayments
            .filter(p => p.status?.toLowerCase() === 'pending' || p.status?.toLowerCase() === 'waiting_approval')
            .reduce((sum, p) => sum + Number(p.amount), 0);

        const overdueCount = allPayments.filter(p => 
            p.status?.toLowerCase() === 'overdue' || p.status?.toLowerCase() === 'delayed'
        ).length;

      

        const usersByRole = await User.findAll({
            attributes: [
                [db.sequelize.fn('COUNT', db.sequelize.col('User.id')), 'count'],
                [db.sequelize.col('Role.role_name'), 'role']
            ],


    
            include: [{ model: Role, attributes: [] }],
            group: ['Role.role_name'],
            raw: true
        });

        const propertiesByType = await Property.findAll({
            attributes: [
                'type',
                [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
            ],
            group: ['type'],
            raw: true
        });

        return {
            summary: {
                totalProperties,
                activeProperties,
                passiveProperties: totalProperties - activeProperties,
                totalRentals,
                totalUsers,
                occupancyRate: totalProperties > 0 ? Math.round((totalRentals / totalProperties) * 100) : 0
            },
            finance: {
                totalRevenue,
                pendingRevenue,
                overdueCount
            },
            usersByRole,
            propertiesByType
        };
    }

    static async getAllUsers() {
        return await User.findAll({
            include: [{
                model: Role,
                attributes: ['role_name']
            }],
            attributes: { exclude: ['password_hash'] }, 
            order: [['created_at', 'DESC']]
        });
    }

    static async updateUserRole(userId, newRoleId) {
        const user = await User.findByPk(userId);
        if (!user) throw new Error("Kullanıcı bulunamadı.");
        
        user.role_id = newRoleId;
        return await user.save();
    }

    static async deleteUser(userId) {
        const user = await User.findByPk(userId);
        if (!user) throw new Error("Kullanıcı bulunamadı.");
        

        return await user.destroy();
    }
    static async getAllProperties() {
        return await Property.findAll({
            include: [
                { model: User, as: 'Agent', attributes: ['first_name', 'last_name', 'user_code'] },
                { model: User, as: 'Owner', attributes: ['first_name', 'last_name', 'user_code'] }
            ],
            order: [['id', 'DESC']]
        });
    }

   static async togglePropertyStatus(propertyId) {
   
    const property = await Property.findByPk(propertyId, {
        include: [{
            model: Rental,
            where: { is_active: true }, 
            required: false
        }]
    });
    console.log(property);
    if (!property) throw new Error("Mülk bulunamadı.");

    if (!property.is_active && property.Rentals && property.Rentals.length > 0) {
        throw new Error("Bu mülkte aktif bir kiracı/kontrat olduğu için yayına alınamaz. Önce kontratı sonlandırmalısınız.");
    }

    property.is_active = !property.is_active;
    return await property.save();
}

    static async getAllPaymentsGrouped() {
        return await Payment.findAll({
            include: [{
                model: Rental,
                required: true,
                include: [
                    { 
                        model: Property, 
                        required: true,
                        include: [{ model: User, as: 'Agent', attributes: ['first_name', 'last_name'] }]
                    },
                    { model: User, as: 'Tenant', attributes: ['first_name', 'last_name'] }
                ]
            }],
            order: [['due_date', 'DESC']]
        });
    }

    static async getAllCategories() {
        return await Category.findAll({ order: [['name', 'ASC']] });
    }

    static async addCategory(name) {
        return await Category.create({ name });
    }

    static async deleteCategory(id) {
 
        const usageCount = await Property.count({ where: { category_id: id } });
        if (usageCount > 0) throw new Error("Bu kategoriye bağlı ilanlar olduğu için silinemez.");
        
        return await Category.destroy({ where: { id } });
    }
}

export default AdminService;