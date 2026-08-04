"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SettingsController_1 = require("../controllers/SettingsController");
const router = (0, express_1.Router)();
router.get('/:key', SettingsController_1.SettingsController.getSetting);
router.put('/:key', SettingsController_1.SettingsController.updateSetting);
exports.default = router;
