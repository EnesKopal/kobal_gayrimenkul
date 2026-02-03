import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Rental = sequelize.define('Rental', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    property_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Properties', key: 'id' }
    },
    tenant_code: {
        type: DataTypes.STRING(10),
        allowNull: false,
        references: { model: 'Users', key: 'user_code' }
    },
    contract_url: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    start_date: { type: DataTypes.DATEONLY, allowNull: false },
    end_date: { type: DataTypes.DATEONLY },
    monthly_rent: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    due_day: { 
        type: DataTypes.INTEGER, 
        validate: { min: 1, max: 31 } 
    }
}, {
    tableName: 'Rentals',
    timestamps: false
});

export default Rental;