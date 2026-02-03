import express from 'express';
import RentalController from '../controllers/rentalController.js';
import verifyToken from '../middlewares/auth.js';
import roleCheck from '../middlewares/roleCheck.js';
import { uploadContract} from '../middlewares/upload.js';

const router = express.Router();


router.post('/', verifyToken, roleCheck('Agent'), uploadContract.single('contract_file'), RentalController.create);

router.get('/my-contracts', verifyToken, roleCheck('Owner', 'Tenant'), RentalController.getMyContracts);

router.get('/agent', verifyToken, roleCheck('Agent'), RentalController.getAgentRentals);
router.delete('/:id', verifyToken, roleCheck('Agent'), RentalController.terminate);

export default router;