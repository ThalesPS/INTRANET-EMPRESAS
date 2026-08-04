import { Router } from 'express';
import { TicketController } from '../controllers/TicketController';

const router = Router();

router.get('/', TicketController.index);
router.get('/categories', TicketController.getCategories);
router.post('/categories', TicketController.createCategory);
router.delete('/categories/:id', TicketController.deleteCategory);
router.get('/:id', TicketController.show);
router.post('/', TicketController.create);
router.patch('/:id', TicketController.update);
router.post('/:id/messages', TicketController.addMessage);

export default router;
