import AuthService from '../services/authService.js';

class AuthController {
    static async register(req, res) {
        try {
            const result = await AuthService.register(req.body);
            res.status(201).json({
                success: true,
                message: "Kullanıcı başarıyla kaydedildi.",
                data: result
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await AuthService.login(email, password);
            res.status(200).json({
                success: true,
                message: "Giriş başarılı.",
                ...result
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }
}

export default AuthController;