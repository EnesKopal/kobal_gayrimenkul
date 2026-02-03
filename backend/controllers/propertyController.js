/* eslint-disable no-unused-vars */
import PropertyService from "../services/propertyService.js";

class PropertyController {
  static async create(req, res) {
    try {
      const agentCode = req.user.user_code;
      const files = req.files;
      const property = await PropertyService.createProperty(req.body, files, agentCode);
      res.status(201).json({ success: true, data: property });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

 static async update(req, res) {
  try {
    const { id } = req.params;
    const agentCode = req.user.user_code;
    const files = req.files; 
   
    if (req.body.removedImageIds && typeof req.body.removedImageIds === 'string') {
      try {
        req.body.removedImageIds = JSON.parse(req.body.removedImageIds);
      } catch (e) {
        req.body.removedImageIds = [req.body.removedImageIds];
      }
    }
    const updatedProperty = await PropertyService.updateProperty(
      id, 
      req.body, 
      files, 
      agentCode
    );

    res.status(200).json({ 
      success: true, 
      message: "İlan başarıyla güncellendi.", 
      data: updatedProperty 
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

  static async getPublicList(req, res) {
    try {
      const filters = req.query;
      const properties = await PropertyService.getActiveProperties(filters);
      res.status(200).json({ success: true, data: properties });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { is_active } = req.body;
      const agentCode = req.user.user_code;
      const updatedProperty = await PropertyService.updatePropertyStatus(id, agentCode, is_active);
      res.status(200).json({
        success: true,
        message: is_active ? "Mülk yayına alındı." : "Mülk satıldı/kiralandı olarak işaretlendi.",
        data: updatedProperty,
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getAgentPortfolio(req, res) {
    try {
      const portfolio = await PropertyService.getAgentPortfolio(req.user.user_code);
      res.status(200).json({ success: true, data: portfolio });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getOwnerPortfolio(req, res) {
    try {
      const ownerCode = req.user.user_code;
      const portfolio = await PropertyService.getOwnerPortfolio(ownerCode);
      res.status(200).json({ success: true, count: portfolio.length, data: portfolio });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteImage(req, res) {
    try {
      const { imageId } = req.params;
      const agentCode = req.user.user_code;
      const result = await PropertyService.deletePropertyImage(imageId, agentCode);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getTypes(req, res) {
    try {
      const { category_id } = req.query;
      const types = await PropertyService.getUniqueTypes(category_id);
      res.status(200).json({ success: true, data: types });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getPropertyById(req, res) {
    try {
      const { id } = req.params;
      const property = await PropertyService.getPropertyById(id);
      if (!property) return res.status(404).json({ success: false, message: "BENİ YANLIŞ ÇAĞIRDIN!" });
      res.status(200).json({ success: true, data: property });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteProperty(req, res) {
    try {
      const { id } = req.params;
      const agentCode = req.user.user_code;
      const result = await PropertyService.deleteProperty(id, agentCode);
      res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getAgentStats(req, res) {
    try {
      const agentCode = req.user.user_code;
      const stats = await PropertyService.getAgentStats(agentCode);
      res.status(200).json({ success: true, data: stats });
    } catch (error) {
      res.status(500).json({ success: false, message: "İstatistikler yüklenemedi: " + error.message });
    }
  }
}

export default PropertyController;