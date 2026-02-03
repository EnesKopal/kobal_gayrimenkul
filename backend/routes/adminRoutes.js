import express from 'express';
import AdminController from '../controllers/adminController.js';
import verifyToken from '../middlewares/auth.js';
import roleCheck from '../middlewares/roleCheck.js';

const router = express.Router();

router.get( '/stats', verifyToken, roleCheck('Admin'), AdminController.getDashboardStats);
router.get('/users', verifyToken, roleCheck('Admin'), AdminController.getAllUsers);
router.put('/users/:id/role', verifyToken, roleCheck('Admin'), AdminController.updateRole);
router.delete('/users/:id', verifyToken, roleCheck('Admin'), AdminController.deleteUser);
router.get('/properties', verifyToken, roleCheck('Admin'), AdminController.getAllProperties);
router.put('/properties/:id/toggle', verifyToken, roleCheck('Admin'), AdminController.toggleProperty);
router.get('/payments', verifyToken, roleCheck('Admin'), AdminController.getGlobalPayments);
router.get('/categories', verifyToken, AdminController.getCategories);
router.post('/categories', verifyToken, roleCheck('Admin'), AdminController.addCategory);
router.delete('/categories/:id', verifyToken, roleCheck('Admin'), AdminController.deleteCategory);

export default router;