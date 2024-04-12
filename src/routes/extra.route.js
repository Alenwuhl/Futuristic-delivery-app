import express from 'express';
import * as extraController from '../controllers/extra.controller.js';

const router = express.Router();

router.get('/:extraId', extraController.getExtraById);

export default router;
