import db from '../models/index.js';
const { Category , Property} = db;

class CategoryService {
    static async createCategory(name) {
        return await Category.create({ name });
    }

    static async getAllCategories() {
        return await Category.findAll({ order: [['name', 'ASC']] });
    }

    static async updateCategory(id, name) {
        const category = await Category.findByPk(id);
        if (!category) throw new Error("Kategori bulunamadı.");
        
        category.name = name;
        await category.save();
        return category;
    }

    static async deleteCategory(id) {
       
        const propertyCount = await Property.count({ where: { category_id: id } });
        
        if (propertyCount > 0) {
            throw new Error(`Bu kategoriye bağlı ${propertyCount} adet mülk bulunmaktadır. Silme işlemi için önce mülkleri başka bir kategoriye taşımalı veya silmelisiniz.`);
        }

        const category = await Category.findByPk(id);
        if (!category) throw new Error("Kategori bulunamadı.");
        
        await category.destroy();
        return true;
    }
}

export default CategoryService;