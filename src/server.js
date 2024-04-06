import express from "express";
import cors from 'cors';
import admin from 'firebase-admin';
import dotenv from 'dotenv';
import authMiddleware from "./middlewares/authMiddleware.js";

dotenv.config();

// Imports Routers
import categoryRouter from "./routes/category.route.js";
import orderRouter from "./routes/order.route.js";


// Initialize Express app
const app = express();

// Middleware to Cors
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/api/categories', categoryRouter);
app.use('/api/orders', authMiddleware, orderRouter);

const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
