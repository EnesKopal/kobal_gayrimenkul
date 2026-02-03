import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import process from 'process';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT,
    logging: false,
    define: {
      timestamps: false,
      freezeTableName: true
    }
  }
);

export default sequelize;