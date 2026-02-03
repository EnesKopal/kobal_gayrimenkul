import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; 

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  rental_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Rentals',
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  due_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  payment_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'waiting_approval', 'paid', 'delayed'),
    defaultValue: 'pending'
  },
  receipt_url: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'Payments',
  timestamps: true
});

export default Payment;