import { Router } from 'express';
import { createOrder, getOrdersByUserId, getOrderById, deleteOrderById } from '../controllers/order.controller.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

// To find de user:
router.use(authMiddleware);

router.post('/', createOrder);
router.get('/:userId/user', getOrdersByUserId);
router.get('/:orderId', getOrderById);
router.delete('/:orderId', deleteOrderById)


export default router;
