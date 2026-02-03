import RentalService from '../services/RentalService.js'
import PaymentService from '../services/PaymentService.js';

class RentalController {
    static async create(req, res) {
        try {
            const { property_id, tenant_code, start_date, end_date, monthly_rent } = req.body;
            const rental = await RentalService.createRentalWithFile({ property_id, tenant_code, start_date, end_date, monthly_rent }, req.file.path);
            await PaymentService.createPaymentsForRental(rental.id, req.body.monthly_rent, 12);
            res.status(201).json({ success: true, message: "Kiralama sözleşmesi başarıyla oluşturuldu.", data: rental });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    static async getMyContracts(req, res) {
        try {
            const { role, user_code } = req.user;
            let contracts;

            if (role === 'Owner') {
                contracts = await RentalService.getOwnerRentals(user_code);
            } else if (role === 'Tenant') {
                contracts = await RentalService.getTenantRentals(user_code);
            } else {
                return res.status(403).json({ message: "Bu rol için sözleşme listesi bulunmuyor." });
            }

            res.status(200).json({ success: true, data: contracts });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async terminate(req, res) {
    try {
        await RentalService.terminateRental(req.params.id);
        res.status(200).json({ success: true, message: "Sözleşme sonlandırıldı, mülk tekrar yayında." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

static async getAgentRentals(req, res) {
    try {
        const rentals = await RentalService.getAgentRentals(req.user.user_code);
        res.status(200).json({ success: true, data: rentals });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
}

export default RentalController;