"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FeedController_1 = require("../controllers/FeedController");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Configuração do multer para upload de imagens do feed
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path_1.default.join(process.cwd(), 'uploads/feed');
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = (0, multer_1.default)({ storage });
const router = (0, express_1.Router)();
router.get('/', FeedController_1.FeedController.index);
router.post('/', upload.single('image'), FeedController_1.FeedController.create);
router.post('/:id/like', FeedController_1.FeedController.toggleLike);
router.post('/:id/comment', FeedController_1.FeedController.addComment);
router.delete('/:id', FeedController_1.FeedController.delete);
exports.default = router;
