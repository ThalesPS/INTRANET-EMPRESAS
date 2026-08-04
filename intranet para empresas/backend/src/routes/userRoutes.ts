import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const router = Router();

router.get('/', UserController.index);
router.post('/', UserController.create);
router.post('/login', UserController.login);
router.get('/:id', UserController.show);
router.patch('/:id/accept-policy', UserController.acceptPolicy);
router.patch('/:id', UserController.update);
router.delete('/:id', UserController.delete);

export default router;
