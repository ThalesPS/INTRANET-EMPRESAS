import { Router } from 'express';
import { DocumentController } from '../controllers/DocumentController';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), 'uploads/documentos');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Setup multer storage
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
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

router.get('/', DocumentController.index);
router.post('/', upload.single('file'), DocumentController.create);
router.post('/categories', DocumentController.createCategory);
router.put('/categories/:id', DocumentController.updateCategory);
router.delete('/categories/:id', DocumentController.deleteCategory);
router.delete('/:id', DocumentController.delete);

export default router;
