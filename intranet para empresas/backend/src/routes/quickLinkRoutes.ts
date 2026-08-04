import { Router } from 'express';
import { QuickLinkController } from '../controllers/QuickLinkController';

const router = Router();

router.get('/', QuickLinkController.index);
router.post('/', QuickLinkController.create);
router.put('/:id', QuickLinkController.update);
router.delete('/:id', QuickLinkController.delete);

export default router;
