import express from 'express';
import PropertyController from '../controllers/propertyController.js';
// Middleware'ler ayrı dosyalarda ve default export oldukları için süslü parantez kullanmıyoruz
import verifyToken from '../middlewares/auth.js';
import roleCheck from '../middlewares/roleCheck.js';
import { uploadProperty } from '../middlewares/upload.js';

const router = express.Router();

// --- GENEL (Public) ROTALAR ---
router.get('/', PropertyController.getPublicList);
router.get('/types/unique', PropertyController.getTypes);

// --- DANIŞMAN (Agent - role_id: 2) ROTALARI ---
router.get('/agent-portfolio', verifyToken, roleCheck('Agent'), PropertyController.getAgentPortfolio);
router.get('/agent-stats', verifyToken, roleCheck('Agent'), PropertyController.getAgentStats);

// --- MÜLK SAHİBİ (Owner) ROTALARI ---
router.get('/my-properties', verifyToken, roleCheck('Owner'), PropertyController.getOwnerPortfolio);

// --- İLAN YÖNETİM VE GÜNCELLEME ROTALARI ---
// Yeni ilan oluşturma
router.post('/', verifyToken, roleCheck('Agent'), uploadProperty.array('images', 10), PropertyController.create);

// İlan durumu (Aktif/Pasif) güncelleme
router.patch('/:id/status', verifyToken, roleCheck('Agent'), PropertyController.updateStatus);

// İlan bilgilerini güncelleme (PUT) - En son üzerinde çalıştığımız kısım
router.put('/:id', verifyToken, roleCheck('Agent'), uploadProperty.array('images', 10), PropertyController.update);

// İlan içinden tekil resim silme
router.delete('/images/:imageId', verifyToken, roleCheck('Agent'), PropertyController.deleteImage);

// İlanı tamamen silme (Agent veya Admin silebilir)
router.delete('/:id', verifyToken, roleCheck(['Agent', 'Admin']), PropertyController.deleteProperty);

// Tekil ilan detay (ID ile) - Genelde en alta yazılır ki diğer rotalarla çakışmasın
router.get('/:id', PropertyController.getPropertyById);

export default router;