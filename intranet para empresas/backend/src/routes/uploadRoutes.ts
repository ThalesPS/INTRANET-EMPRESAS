import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Certifica de que a pasta uploads existe
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Ex: avatar-163456789.jpg
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });
const router = Router();

router.post('/', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    }
    
    // Retorna a URL do arquivo
    // Assume que o servidor está rodando na mesma origem, e /uploads está servido de forma estática
    const fileUrl = `/uploads/${req.file.filename}`;
    
    res.status(201).json({ url: fileUrl });
  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({ error: 'Erro ao processar o upload do arquivo.' });
  }
});

export default router;
