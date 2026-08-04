import { Router } from 'express';
import { AnnouncementController } from '../controllers/AnnouncementController';

const router = Router();

router.get('/', AnnouncementController.index);
router.post('/', AnnouncementController.create);
router.get('/stats', AnnouncementController.stats);

export default router;
