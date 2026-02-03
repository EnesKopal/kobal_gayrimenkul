import UserService from "../services/userService.js";

class UserController {

    static async updateUserRole(req, res) {
        try {
            const { user_code, role_id } = req.body;
            const updatedUser = await UserService.updateUserRole(user_code, role_id);
            res.status(200).json({ success: true, data: updatedUser });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    static async listUsers(req, res) {
        try {
            const users = await UserService.getAllUsers();
            res.status(200).json({ success: true, data: users });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async deleteUser(req, res) {
        try {
            await UserService.deleteUser(req.params.userCode);
            res.status(200).json({ success: true, message: "Kullanıcı sistemden başarıyla silindi." })
        }
        catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    static async getAgentContacts(req, res) {
        try {
            const users = await UserService.getAgentContacts();
            res.status(200).json({ success: true, data: users });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getPublicAgents(req, res) {
    try {
        const agents = await UserService.getPublicAgents();
        res.status(200).json({ success: true, data: agents });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
}
export default UserController;