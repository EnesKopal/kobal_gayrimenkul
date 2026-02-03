import PaymentService from '../services/PaymentService.js';

class PaymentController {
    static async getMyPayments(req, res) {
        try {
            const userCode = req.user.user_code;
            const payments = await PaymentService.getTenantPayments(userCode);
            res.status(200).json({ success: true, data: payments });
        } catch (error) {
            res.status(500).json({ success: false, message: "Ödemeler getirilemedi: " + error.message });
        }
    }

    static async getPortfolioPayments(req, res) {
        try {
            const agentCode = req.user.user_code;
            const payments = await PaymentService.getAgentPayments(agentCode);
            res.status(200).json({ success: true, data: payments });
        } catch (error) {
            res.status(500).json({ success: false, message: "Portföy ödemeleri getirilemedi: " + error.message });
        }
    }

    static async uploadReceipt(req, res) {
        try {
            const { paymentId } = req.params;
            const userCode = req.user.user_code;

            if (!req.file) {
                return res.status(400).json({ success: false, message: "Lütfen bir dekont dosyası yükleyin." });
            }

            const updatedPayment = await PaymentService.uploadReceipt(
                paymentId, 
                req.file.filename, 
                userCode
            );

            res.status(200).json({ 
                success: true, 
                message: "Dekont başarıyla yüklendi.", 
                data: updatedPayment 
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    static async approvePayment(req, res) {
        try {
            const { paymentId } = req.params;
            const agentCode = req.user.user_code;

            const updatedPayment = await PaymentService.verifyPayment(paymentId, agentCode);

            res.status(200).json({ 
                success: true, 
                message: "Kira ödemesi onaylandı.", 
                data: updatedPayment 
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    static async rejectPayment(req, res) {
        try {
            const { paymentId } = req.params;
            const agentCode = req.user.user_code;

            const updatedPayment = await PaymentService.rejectPayment(paymentId, agentCode);

            res.status(200).json({ 
                success: true, 
                message: "Kira ödemesi reddedildi.", 
                data: updatedPayment 
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    static async getOwnerPayments(req, res) {
        try {
            const ownerCode = req.user.user_code; 
            const payments = await PaymentService.getOwnerPayments(ownerCode);
            res.status(200).json({ success: true, data: payments });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

export default PaymentController;