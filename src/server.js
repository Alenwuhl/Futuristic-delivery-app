import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import authMiddleware from "./middlewares/authMiddleware.js";
import path from 'path';
import { __dirname } from "./utils.js";
import categoryRouter from './routes/category.route.js';
import extraRouter from './routes/extra.route.js';
import orderRouter from './routes/order.route.js';
import productRouter from './routes/product.route.js';

dotenv.config();

// Initialize Express app
const app = express();

// Middleware to Cors
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/api/categories', categoryRouter);
app.use('/api/orders', authMiddleware, orderRouter);
app.use('/api/products', productRouter);
app.use('/api/extras', extraRouter);

// File for the images
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

const PORT = process.env.PORT;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
