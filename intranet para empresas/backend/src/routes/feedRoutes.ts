import { Router } from 'express';
import { FeedController } from '../controllers/FeedController';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configuração do multer para upload de imagens do feed
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads/feed');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

const router = Router();

router.get('/', FeedController.index);
router.post('/', upload.single('image'), FeedController.create);
router.post('/:id/like', FeedController.toggleLike);
router.post('/:id/comment', FeedController.addComment);
router.delete('/:id', FeedController.delete);

export default router;
