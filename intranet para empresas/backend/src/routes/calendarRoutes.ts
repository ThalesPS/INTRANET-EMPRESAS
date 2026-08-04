import { Router } from 'express';
import { CalendarController } from '../controllers/CalendarController';

const router = Router();

router.get('/upcoming', CalendarController.getUpcoming);
router.post('/events', CalendarController.createEvent);
router.put('/events/:id', CalendarController.updateEvent);
router.delete('/events/:id', CalendarController.deleteEvent);

export default router;
