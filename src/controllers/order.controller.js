import OrderService from '../services/order.service.js';

const orderService = new OrderService();

export const createOrder = async (req, res) => {
  try {
    const { userId, email, orderItems, totalAmount } = req.body;
    const orderId = await orderService.createOrder(userId, email, orderItems, totalAmount);
    res.status(200).json({ message: 'Order created successfully', orderId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

export const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await orderService.getOrderByUserId(userId);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error getting orders by user ID', error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const orders = await orderService.getOrderById(orderId);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error getting orders by user ID', error: error.message });
  }
};

export const deleteOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const orders = await orderService.deleteOrderById(orderId);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error getting orders by user ID', error: error.message });
  }
};