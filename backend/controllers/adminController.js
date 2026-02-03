import AdminService from '../services/adminService.js';

class AdminController {
    static async getDashboardStats(req, res) {
        try {
            const stats = await AdminService.getSystemStats();
            console.log(stats);
            res.status(200).json({ success: true, data: stats });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getAllUsers(req, res) {
        try {
            const users = await AdminService.getAllUsers();
            res.status(200).json({ success: true, data: users });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async updateRole(req, res) {
        try {
            const { id } = req.params;
            const { role_id } = req.body;
            await AdminService.updateUserRole(id, role_id);
            res.status(200).json({ success: true, message: "Başarılı" });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async deleteUser(req, res) {
        try {
            await AdminService.deleteUser(req.params.id);
            res.status(200).json({ success: true, message: "Silindi" });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getAllProperties(req, res) {
        try {
            const properties = await AdminService.getAllProperties();
            res.status(200).json({ success: true, data: properties });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async toggleProperty(req, res) {
        try {
            await AdminService.togglePropertyStatus(req.params.id);
            res.status(200).json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getGlobalPayments(req, res) {
        try {
            const payments = await AdminService.getAllPaymentsGrouped();
            res.status(200).json({ success: true, data: payments });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getCategories(req, res) {
        try {
            const categories = await AdminService.getAllCategories();
            res.status(200).json({ success: true, data: categories });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async addCategory(req, res) {
        try {
            const category = await AdminService.addCategory(req.body.name);
            res.status(201).json({ success: true, data: category });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async deleteCategory(req, res) {
        try {
            await AdminService.deleteCategory(req.params.id);
            res.status(200).json({ success: true });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}

export default AdminController;