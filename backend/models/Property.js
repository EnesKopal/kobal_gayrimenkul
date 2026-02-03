import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Property = sequelize.define('Property', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    agent_code: {
        type: DataTypes.STRING(10),
        allowNull: false,
        references: {
            model: User,
            key: 'user_code'
        }
    },
    owner_code: {
        type: DataTypes.STRING(10),
        allowNull: false,
        references: {
            model: User,
            key: 'user_code'
        }
    },
    title: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('Satılık', 'Kiralık'),
        defaultValue: 'Kiralık'
    },
    price: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true 
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Categories',
            key: 'id'
        }
    },
    type: { 
        type: DataTypes.STRING(50),
        allowNull: true
    },
    gross_area: {
        type: DataTypes.INTEGER,
        allowNull: true 
    },
    net_area: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    room_count: {
        type: DataTypes.STRING(20), 
        allowNull: true
    },
    building_age: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    floor_count: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    floor_level: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    listing_no: { type: DataTypes.STRING(20), allowNull: true },
    heating: { type: DataTypes.STRING(50), allowNull: true },
    bath_count: { type: DataTypes.INTEGER, allowNull: true },
    kitchen: { type: DataTypes.STRING(50), allowNull: true },
    balcony: { type: DataTypes.STRING(20), allowNull: true },
    elevator: { type: DataTypes.STRING(20), allowNull: true },
    parking: { type: DataTypes.STRING(50), allowNull: true },
    furnished: { type: DataTypes.STRING(20), allowNull: true },
    usage_status: { type: DataTypes.STRING(50), allowNull: true },
    is_in_site: { type: DataTypes.STRING(20), allowNull: true },
    site_name: { type: DataTypes.STRING(100), allowNull: true },
    maintenance_fee: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
    deposit: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
    zoning_status: { type: DataTypes.STRING(50), allowNull: true },
    block_no: { type: DataTypes.STRING(20), allowNull: true },
    parcel_no: { type: DataTypes.STRING(20), allowNull: true },
    map_sheet_no: { type: DataTypes.STRING(20), allowNull: true },
    kaks: { type: DataTypes.STRING(20), allowNull: true },
    gabari: { type: DataTypes.STRING(20), allowNull: true },
    title_deed_status: { type: DataTypes.STRING(50), allowNull: true },
    listed_by: { type: DataTypes.STRING(50), allowNull: true },
    listing_date: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    },
}, {
    tableName: 'Properties',
    timestamps: false 
});

export default Property;