/* eslint-disable no-unused-vars */
import db from "../models/index.js";
import fs from "fs/promises";
import path from "path";
import process from "process";
import { Op } from "sequelize";

const { Property, User, Rental, PropertyImage, Category, Payment } = db;

class PropertyService {
  static async createProperty(propertyData, files, agentCode) {
    const {
      owner_code,
      title,
      description,
      category_id,
      type,
      status,
      price,
      address,
      gross_area,
      net_area,
      room_count,
      building_age,
      floor_count,
      floor_level,
      heating,
      bath_count,
      kitchen,
      balcony,
      elevator,
      parking,
      furnished,
      usage_status,
      is_in_site,
      site_name,
      maintenance_fee,
      deposit,
      zoning_status,
      block_no,
      parcel_no,
      map_sheet_no,
      kaks,
      gabari,
      title_deed_status,
      listed_by,
    } = propertyData;

    const owner = await User.findOne({
      where: { user_code: owner_code, role_id: 3 },
    });
    if (!owner) throw new Error("Geçersiz mülk sahibi kodu.");

    const category = await Category.findByPk(category_id);
    if (!category) throw new Error("Seçilen kategori sistemde bulunamadı.");

    const listing_no = Math.floor(
      1000000000 + Math.random() * 9000000000,
    ).toString();

    const property = await Property.create({
      agent_code: agentCode,
      owner_code,
      title,
      description,
      category_id,
      type,
      status,
      price,
      address,
      gross_area,
      net_area,
      room_count,
      building_age,
      floor_count,
      floor_level,
      listing_no,
      heating,
      bath_count,
      kitchen,
      balcony,
      elevator,
      parking,
      furnished,
      usage_status,
      is_in_site,
      site_name,
      maintenance_fee,
      deposit,
      zoning_status,
      block_no,
      parcel_no,
      map_sheet_no,
      kaks,
      gabari,
      title_deed_status,
      listed_by,
      listing_date: propertyData.listing_date || new Date(),
      is_active: true,
    });

    if (files && files.length > 0) {
      const imageRecords = files.map((file) => ({
        property_id: property.id,
        image_url: file.path.replace(/\\/g, "/"),
      }));
      await PropertyImage.bulkCreate(imageRecords);
    }

    return property;
  }

  static async getActiveProperties(filters = {}) {
    const { category_id, status, type, search } = filters;
    let whereClause = { is_active: true };

    if (category_id) whereClause.category_id = category_id;
    if (status) whereClause.status = status;
    if (type) whereClause.type = type;

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { address: { [Op.like]: `%${search}%` } },
      ];
    }

    return await Property.findAll({
      where: whereClause,
      order: [["id", "DESC"]],
      include: [
        {
          model: User,
          as: "Agent",
          attributes: ["first_name", "last_name", "phone"],
        },
        { model: db.PropertyImage, as: "Images" },
      ],
    });
  }

  static async getAgentPortfolio(agentCode) {
    return await Property.findAll({
      where: { agent_code: agentCode },
      include: [
        {
          model: User,
          as: "Owner",
          attributes: [
            "first_name",
            "last_name",
            "phone",
            "email",
            "user_code",
          ],
        },
        { model: PropertyImage, as: "Images" },
        { model: Category, as: "CategoryInfo", attributes: ["name"] },
      ],
    });
  }

  static async getOwnerPortfolio(ownerCode) {
    return await Property.findAll({
      where: { owner_code: ownerCode },
      include: [
        {
          model: User,
          as: "Agent",
          attributes: ["first_name", "last_name", "phone"],
        },
        {
          model: Rental,
          attributes: ["id", "start_date", "end_date", "monthly_rent"],
          include: [
            {
              model: User,
              as: "Tenant",
              attributes: ["first_name", "last_name", "phone"],
            },
          ],
        },
        { model: PropertyImage, as: "Images" },
      ],
      order: [["id", "DESC"]],
    });
  }

  static async updatePropertyStatus(propertyId, agentCode, isActive) {
    const property = await Property.findOne({
      where: { id: propertyId, agent_code: agentCode },
    });

    if (!property)
      throw new Error("Mülk bulunamadı veya bu işlem için yetkiniz yok.");

    property.is_active = isActive;
    await property.save();

    return property;
  }

  static async deletePropertyImage(imageId, agentCode) {
    console.log("imageId", imageId);
    console.log("agentCode", agentCode);
    const image = await db.PropertyImage.findOne({
      where: { id: imageId },
      include: [
        {
          model: db.Property,
          where: { agent_code: agentCode },
        },
      ],
    });

    if (!image) {
      throw new Error("Görsel bulunamadı veya bu işlem için yetkiniz yok.");
    }

    try {
      const filePath = path.join(process.cwd(), image.image_url);
      await fs.unlink(filePath);
    } catch (err) {
      console.error(err.message);
    }

    await image.destroy();

    return { message: "Görsel başarıyla silindi." };
  }

  static async getUniqueTypes(category_id) {
    const whereClause = { is_active: true };

    if (category_id) {
      whereClause.category_id = category_id;
    }

    const types = await Property.findAll({
      attributes: [
        [db.sequelize.fn("DISTINCT", db.sequelize.col("type")), "type"],
      ],
      where: whereClause,
    });

    return types.map((t) => t.type).filter((t) => t);
  }

  static async getPropertyById(id) {
    return await Property.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: "Agent",
          attributes: ["first_name", "last_name", "phone", "email"],
        },
        {
          model: PropertyImage,
          as: "Images",
        },
        {
          model: Category,
          as: "CategoryInfo",
          attributes: ["name"],
        },
      ],
    });
  }

  static async updateProperty(id, propertyData, files, agentCode) {
    const property = await Property.findOne({
      where: { id, agent_code: agentCode },
    });

    if (!property) {
      throw new Error("İlan bulunamadı veya bu ilanı düzenleme yetkiniz yok.");
    }

    // 1. MEVCUT FOTOĞRAFLARI SİLME (Eğer ID listesi geldiyse)
    if (propertyData.removedImageIds) {
      // Frontend'den JSON string veya array olarak gelebilir
      const idsToDelete = Array.isArray(propertyData.removedImageIds)
        ? propertyData.removedImageIds
        : JSON.parse(propertyData.removedImageIds);

      for (const imageId of idsToDelete) {
        try {
          await this.deletePropertyImage(imageId, agentCode);
        } catch (err) {
          console.error(`Görsel silinemedi (ID: ${imageId}):`, err.message);
        }
      }
    }

    // 2. TEMEL BİLGİLERİ GÜNCELLEME
    const {
      title,
      description,
      category_id,
      type,
      status,
      price,
      address,
      gross_area,
      net_area,
      room_count,
      building_age,
      floor_count,
      floor_level,
      heating,
      bath_count,
      kitchen,
      balcony,
      elevator,
      parking,
      furnished,
      usage_status,
      is_in_site,
      site_name,
      maintenance_fee,
      deposit,
      zoning_status,
      block_no,
      parcel_no,
      map_sheet_no,
      kaks,
      gabari,
      title_deed_status,
      listed_by,
    } = propertyData;

    await property.update({
      title,
      description,
      category_id,
      type,
      status,
      price,
      address,
      gross_area,
      net_area,
      room_count,
      building_age,
      floor_count,
      floor_level,
      heating,
      bath_count,
      kitchen,
      balcony,
      elevator,
      parking,
      furnished,
      usage_status,
      is_in_site,
      site_name,
      maintenance_fee,
      deposit,
      zoning_status,
      block_no,
      parcel_no,
      map_sheet_no,
      kaks,
      gabari,
      title_deed_status,
      listed_by,
    });

    // 3. YENİ FOTOĞRAFLARI EKLEME
    if (files && files.length > 0) {
      const imageRecords = files.map((file) => ({
        property_id: property.id,
        image_url: file.path.replace(/\\/g, "/"),
      }));
      await PropertyImage.bulkCreate(imageRecords);
    }

    return property;
  }

  static async deleteProperty(id, agentCode) {
    const property = await Property.findOne({
      where: { id, agent_code: agentCode },
      include: [{ model: db.PropertyImage, as: "Images" }],
    });

    if (!property) {
      throw new Error("İlan bulunamadı veya bu işlemi yapmaya yetkiniz yok.");
    }

    try {
      if (property.Images && property.Images.length > 0) {
        for (const image of property.Images) {
          const filePath = path.join(process.cwd(), image.image_url);
          await fs.unlink(filePath).catch(() => {});
        }
      }
      await property.destroy();
      return { message: "İlan ve bağlı tüm dosyalar başarıyla silindi." };
    } catch (error) {
      throw new Error("Veritabanı kısıtlaması nedeniyle silinemedi.");
    }
  }

  static async getAgentStats(agentCode) {
    const totalProperties = await Property.count({
      where: { agent_code: agentCode },
    });

    const activeRentals = await Rental.count({
      include: [
        {
          model: Property,
          where: { agent_code: agentCode },
        },
      ],
    });

    const totalOwners = await Property.count({
      where: { agent_code: agentCode },
      distinct: true,
      col: "owner_code",
    });

    const performanceRate =
      totalProperties > 0
        ? ((activeRentals / totalProperties) * 100).toFixed(1)
        : "0.0";

    return {
      totalProperties,
      activeRentals,
      totalOwners,
      performanceRate,
    };
  }
}

export default PropertyService;
