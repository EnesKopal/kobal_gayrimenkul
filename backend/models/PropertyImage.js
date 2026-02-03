import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const PropertyImage = sequelize.define('PropertyImage', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    property_id: { type: DataTypes.INTEGER, allowNull: false },
    image_url: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'PropertyImages', timestamps: false });

export default PropertyImage;