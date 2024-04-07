import express from 'express';
import * as productController from '../controllers/product.controller.js';

const router = express.Router();

router.get('/:catId/category', productController.getProductsByCategory);
router.post('/', productController.createProduct);
router.get('/:productId', productController.getProductById);
router.get('/:productId/extras', productController.getProductExtras);

export default router;
