import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Klasör kontrolü yapan yardımcı fonksiyon
const getUploadPath = (subDir) => {
    const dir = `uploads/${subDir}/`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
};

// --- Storage (Depolama) Yapılandırması ---
const storage = (subDir) => multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, getUploadPath(subDir));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // Dosya ismi: klasör_adı-uniqueId.uzantı (Örn: receipts-12345.jpg)
        cb(null, `${subDir}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// --- Filtreleme (Sadece belirli formatlar) ---
const fileFilter = (req, file, cb) => {
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Desteklenmeyen dosya formatı! Sadece PDF, DOCX ve Resim yüklenebilir.'));
    }
};


export const uploadProperty = multer({ 
    storage: storage('properties'), 
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});


export const uploadReceipt = multer({ 
    storage: storage('receipts'), 
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});


export const uploadContract = multer({ 
    storage: storage('contracts'), 
    fileFilter,
    limits: { fileSize: 20 * 1024 * 1024 } // 20MB
});