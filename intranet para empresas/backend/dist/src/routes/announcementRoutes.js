"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AnnouncementController_1 = require("../controllers/AnnouncementController");
const router = (0, express_1.Router)();
router.get('/', AnnouncementController_1.AnnouncementController.index);
router.post('/', AnnouncementController_1.AnnouncementController.create);
router.get('/stats', AnnouncementController_1.AnnouncementController.stats);
exports.default = router;
