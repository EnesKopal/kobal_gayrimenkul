import CategoryService from '../services/categoryService.js';

class CategoryController {
    // POST /api/categories
    static async create(req, res) {
        try {
            const { name } = req.body;
            const category = await CategoryService.createCategory(name);
            res.status(201).json({ success: true, data: category });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    // GET /api/categories
    static async list(req, res) {
        try {
            const categories = await CategoryService.getAllCategories();
            res.status(200).json({ success: true, data: categories });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // PUT /api/categories/:id
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;
            const updated = await CategoryService.updateCategory(id, name);
            res.status(200).json({ success: true, data: updated });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    // DELETE /api/categories/:id
    static async remove(req, res) {
        try {
            const { id } = req.params;
            await CategoryService.deleteCategory(id);
            res.status(200).json({ success: true, message: "Kategori başarıyla silindi." });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}

export default CategoryController;