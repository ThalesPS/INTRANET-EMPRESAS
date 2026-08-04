"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const DocumentController_1 = require("../controllers/DocumentController");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = (0, express_1.Router)();
// Ensure upload directory exists
const uploadDir = path_1.default.join(process.cwd(), 'uploads/documentos');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
// Setup multer storage
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
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});
router.get('/', DocumentController_1.DocumentController.index);
router.post('/', upload.single('file'), DocumentController_1.DocumentController.create);
router.post('/categories', DocumentController_1.DocumentController.createCategory);
router.put('/categories/:id', DocumentController_1.DocumentController.updateCategory);
router.delete('/categories/:id', DocumentController_1.DocumentController.deleteCategory);
router.delete('/:id', DocumentController_1.DocumentController.delete);
exports.default = router;
