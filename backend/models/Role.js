import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Role = sequelize.define('Role', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    role_name: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'Roles',
    timestamps: false
});

export default Role;