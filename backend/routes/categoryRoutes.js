import express from 'express';
import CategoryController from '../controllers/categoryController.js';
import verifyToken from '../middlewares/auth.js';
import roleCheck from '../middlewares/roleCheck.js';

const router = express.Router();

// Herkes görebilir
router.get('/', CategoryController.list);

// Sadece Admin yönetebilir
router.post('/', verifyToken, roleCheck('Admin'), CategoryController.create);
router.put('/:id', verifyToken, roleCheck('Admin'), CategoryController.update);
router.delete('/:id', verifyToken, roleCheck('Admin'), CategoryController.remove);

export default router;