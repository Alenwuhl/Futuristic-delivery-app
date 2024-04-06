import { Router } from 'express';
import { createOrder, getOrdersByUserId, getLastOrder } from '../controllers/order.controller.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

// To find de user:
router.use(authMiddleware);

router.post('/', createOrder);
router.get('/:userId', getOrdersByUserId);
router.get('/last/:userId', getLastOrder);

export default router;
