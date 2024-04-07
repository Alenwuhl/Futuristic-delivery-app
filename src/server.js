import express from "express";
import cors from 'cors';
import admin from 'firebase-admin';
import dotenv from 'dotenv'; 
import authMiddleware from "./middlewares/authMiddleware.js";
import path from 'path'
import { __dirname } from "./utils.js";

dotenv.config();

// Imports Routers
import categoryRouter from "./routes/category.route.js";
import orderRouter from "./routes/order.route.js";
import productRouter from "./routes/product.route.js"


// Initialize Express app
const app = express();

// Middleware to Cors
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/api/categories', categoryRouter);
app.use('/api/orders', authMiddleware, orderRouter);
app.use('/api/products', productRouter)

// File for the images
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
