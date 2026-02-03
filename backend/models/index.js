import sequelize from "../config/database.js";
import User from "./User.js";
import Role from "./Role.js";
import Property from "./Property.js";
import Rental from "./Rental.js";
import Category from "./Category.js";
import PropertyImage from "./PropertyImage.js";
import Payment from "./Payments.js";

const db = {};

db.Sequelize = sequelize.constructor;
db.sequelize = sequelize;

db.User = User;
db.Role = Role;
db.Property = Property;
db.Rental = Rental;
db.Category = Category;
db.PropertyImage = PropertyImage;
db.Payment = Payment;

// 1. User - Role İlişkisi
db.Role.hasMany(db.User, { foreignKey: "role_id" });
db.User.belongsTo(db.Role, { foreignKey: "role_id" });

// 2. Property - User  İlişkisi
// Agent İlişkisi
db.User.hasMany(db.Property, {
  foreignKey: "agent_code",
  sourceKey: "user_code",
  as: "AgentProperties",
});
db.Property.belongsTo(db.User, {
  foreignKey: "agent_code",
  targetKey: "user_code",
  as: "Agent",
});

// Owner İlişkisi
db.User.hasMany(db.Property, {
  foreignKey: "owner_code",
  sourceKey: "user_code",
  as: "OwnedProperties",
});
db.Property.belongsTo(db.User, {
  foreignKey: "owner_code",
  targetKey: "user_code",
  as: "Owner",
});

//  Rental - Property İlişkisi
db.Property.hasMany(db.Rental, { foreignKey: "property_id" });
db.Rental.belongsTo(db.Property, { foreignKey: "property_id" });

//  Rental - User (Tenant) İlişkisi
db.User.hasMany(db.Rental, {
  foreignKey: "tenant_code",
  sourceKey: "user_code",
  as: "Rentals",
});
db.Rental.belongsTo(db.User, {
  foreignKey: "tenant_code",
  targetKey: "user_code",
  as: "Tenant",
});

// Kategori - Property İlişkisi
db.Category.hasMany(db.Property, { foreignKey: "category_id" });
db.Property.belongsTo(db.Category, {
  foreignKey: "category_id",
  as: "CategoryInfo",
});

db.Property.hasMany(db.PropertyImage, {
  foreignKey: "property_id",
  as: "Images", 
});
db.PropertyImage.belongsTo(db.Property, { foreignKey: "property_id" });

// Bir kiralama kontratının birçok ödemesi olabilir (12 aylık kira gibi)
Rental.hasMany(Payment, { foreignKey: 'rental_id' });
Payment.belongsTo(Rental, { foreignKey: 'rental_id' });

export default db;
