import { Router } from 'express';
import { NotaFiscalController } from '../controllers/NotaFiscalController';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Garantir que o diretório existe
const uploadDir = path.join(process.cwd(), 'uploads/nfs');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // Limite de 50MB
});

router.get('/', NotaFiscalController.index);
router.get('/check-pending', NotaFiscalController.checkPendingAlert);
router.post('/', upload.single('arquivo'), NotaFiscalController.create);
router.patch('/:id/status', NotaFiscalController.updateStatus);
router.patch('/:id/reupload', upload.single('arquivo'), NotaFiscalController.reupload);
router.post('/cobrar-pendente', NotaFiscalController.cobrarPendente);

export default router;
