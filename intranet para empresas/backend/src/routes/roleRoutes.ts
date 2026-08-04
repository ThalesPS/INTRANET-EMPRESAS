import { Router } from 'express';
import { RoleController } from '../controllers/RoleController';

const router = Router();

router.get('/', RoleController.index);
router.post('/', RoleController.create);
router.put('/:id', RoleController.update);
router.delete('/:id', RoleController.delete);

export default router;
