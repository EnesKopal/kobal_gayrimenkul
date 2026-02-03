import Payment from '../models/Payments.js';
import Rental from '../models/Rental.js';
import Property from '../models/Property.js';

class PaymentService {
    static async getTenantPayments(tenantCode) {
        return await Payment.findAll({
            include: [{
                model: Rental,
                where: { tenant_code: tenantCode },
                include: [Property]
            }],
            order: [['due_date', 'ASC']]
        });
    }

    static async getAgentPayments(agentCode) {
        return await Payment.findAll({
            include: [{
                model: Rental,
                include: [{
                    model: Property,
                    where: { agent_code: agentCode }
                }]
            }],
            order: [['status', 'DESC'], ['due_date', 'ASC']]
        });
    }

    static async getOwnerPayments(ownerCode) {
        return await Payment.findAll({
            include: [{
                model: Rental,
                required: true,
                include: [{
                    model: Property,
                    required: true,
                    where: { owner_code: ownerCode }
                }]
            }],
            order: [['due_date', 'DESC']]
        });
    }

    static async uploadReceipt(paymentId, fileName, tenantCode) {
        const payment = await Payment.findByPk(paymentId, {
            include: [Rental]
        });

        if (!payment) throw new Error("Ödeme kaydı bulunamadı.");
        if (payment.Rental.tenant_code !== tenantCode) throw new Error("Bu ödeme size ait değil.");

        payment.receipt_url = fileName;
        payment.status = 'waiting_approval';
        payment.payment_date = new Date();
        
        return await payment.save();
    }

    static async verifyPayment(paymentId, agentCode) {
        const payment = await Payment.findByPk(paymentId, {
            include: [{
                model: Rental,
                include: [Property]
            }]
        });

        if (!payment) throw new Error("Ödeme kaydı bulunamadı.");
        if (payment.Rental.Property.agent_code !== agentCode) throw new Error("Bu mülkü yönetme yetkiniz yok.");

        payment.status = 'paid';
        return await payment.save();
    }

    static async rejectPayment(paymentId, agentCode) {
        const payment = await Payment.findByPk(paymentId, {
            include: [{
                model: Rental,
                include: [Property]
            }]
        });

        if (!payment) throw new Error("Ödeme kaydı bulunamadı.");
        if (payment.Rental.Property.agent_code !== agentCode) throw new Error("Bu işlemi yapma yetkiniz yok.");

        payment.status = 'rejected';
        return await payment.save();
    }

    static async createPaymentsForRental(rentalId, amount, period = 12) {
        const payments = [];
        const startDate = new Date();

        for (let i = 0; i < period; i++) {
            const dueDate = new Date(startDate);
            dueDate.setMonth(startDate.getMonth() + i);

            payments.push({
                rental_id: rentalId,
                amount: amount,
                due_date: dueDate,
                status: 'pending'
            });
        }

        return await Payment.bulkCreate(payments);
    }
}

export default PaymentService;