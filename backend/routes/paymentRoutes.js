import express from "express";
import PaymentController from "../controllers/paymentController.js";
import verifyToken from "../middlewares/auth.js";
import roleCheck from "../middlewares/roleCheck.js";
import { uploadReceipt } from '../middlewares/upload.js';

const router = express.Router();

router.get(
  "/my-payments",
  verifyToken,
  roleCheck("Tenant"),
  PaymentController.getMyPayments
);

router.post('/upload-receipt/:paymentId', verifyToken, roleCheck('Tenant'), uploadReceipt.single('receipt'), PaymentController.uploadReceipt);

router.get(
  "/agent-payments",
  verifyToken,
  roleCheck("Agent"),
  PaymentController.getPortfolioPayments
);

router.patch(
  "/approve/:paymentId",
  verifyToken,
  roleCheck("Agent"),
  PaymentController.approvePayment
);

router.patch(
  "/reject/:paymentId",
  verifyToken,
  roleCheck("Agent"),
  PaymentController.rejectPayment
);

router.get(
  "/all-payments",
  verifyToken,
  roleCheck("Admin"),
  PaymentController.getPortfolioPayments 
);

router.get(
    '/owner-payments', 
    verifyToken, 
    roleCheck('Owner'), 
    PaymentController.getOwnerPayments
);

export default router;