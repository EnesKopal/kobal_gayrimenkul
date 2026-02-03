import express from 'express';
import UserController from '../controllers/userController.js';
import verifyToken from '../middlewares/auth.js';
import roleCheck from '../middlewares/roleCheck.js';


const router = express.Router();

router.get('/', verifyToken, roleCheck('Admin'), UserController.listUsers);
router.patch('/update-role', verifyToken, roleCheck('Admin'), UserController.updateUserRole);
router.delete('/:userCode', verifyToken, roleCheck('Admin'), UserController.deleteUser);
router.get('/contacts', verifyToken, roleCheck('Agent', 'Admin'), UserController.getAgentContacts);
router.get('/public/agents', UserController.getPublicAgents);


export default router;