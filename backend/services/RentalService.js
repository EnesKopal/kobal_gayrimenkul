import db from '../models/index.js';
const { Rental, Property, User } = db;

class RentalService {
    static async createRentalWithFile(rentalData, filePath) {
        const { property_id, tenant_code, start_date, end_date, monthly_rent } = rentalData;

        const property = await Property.findByPk(property_id);
        if (!property) throw new Error("Mülk bulunamadı.");

        const tenant = await User.findOne({ where: { user_code: tenant_code, role_id: 4 } });
        if (!tenant) throw new Error("Geçersiz kiracı kodu.");


        const rental = await Rental.create({
            property_id,
            tenant_code,
            contract_url: filePath,
            start_date,
            end_date,
            monthly_rent
        });

        property.is_active = false;
        await property.save();

        return rental;
    }

    static async getMyContracts(userCode, role) {
        if (role === 'Owner') {
            return await Rental.findAll({
                include: [{
                    model: Property,
                    where: { owner_code: userCode },
                    attributes: ['title', 'address']
                }, {
                    model: User, as: 'Tenant', attributes: ['first_name', 'last_name']
                }]
            });
        } else {
            return await Rental.findAll({
                where: { tenant_code: userCode },
                include: [{
                    model: Property,
                    include: [{ model: User, as: 'Owner', attributes: ['first_name', 'last_name'] }]
                }]
            });
        }
    }

    static async terminateRental(rentalId) {
    const rental = await Rental.findByPk(rentalId);
    if (!rental) throw new Error("Sözleşme bulunamadı.");


    await Property.update({ is_active: true }, { where: { id: rental.property_id } });
    
    return await rental.destroy();
}

static async getAgentRentals(agentCode) {
    return await Rental.findAll({
        include: [{
            model: Property,
            where: { agent_code: agentCode },
            attributes: ['title', 'address', 'listing_no']
        }, {
            model: User, as: 'Tenant', attributes: ['first_name', 'last_name', 'phone']
        }]
    });
}
}

export default RentalService;