"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const NotaFiscalController_1 = require("../controllers/NotaFiscalController");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = (0, express_1.Router)();
// Garantir que o diretório existe
const uploadDir = path_1.default.join(process.cwd(), 'uploads/nfs');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 } // Limite de 50MB
});
router.get('/', NotaFiscalController_1.NotaFiscalController.index);
router.get('/check-pending', NotaFiscalController_1.NotaFiscalController.checkPendingAlert);
router.post('/', upload.single('arquivo'), NotaFiscalController_1.NotaFiscalController.create);
router.patch('/:id/status', NotaFiscalController_1.NotaFiscalController.updateStatus);
router.patch('/:id/reupload', upload.single('arquivo'), NotaFiscalController_1.NotaFiscalController.reupload);
router.post('/cobrar-pendente', NotaFiscalController_1.NotaFiscalController.cobrarPendente);
exports.default = router;
