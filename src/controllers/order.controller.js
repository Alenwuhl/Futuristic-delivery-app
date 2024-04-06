import OrderService from '../services/order.service.js';

const orderService = new OrderService();

export const createOrder = async (req, res) => {
  try {
    const { userId, email, orderItems } = req.body;
    const orderId = await orderService.createOrder(userId, email, orderItems);
    res.status(201).json({ message: 'Order created successfully', orderId });
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

export const getLastOrder = async (req, res) => {
    try {
      const { userId } = req.params;
      const ordersRef = db.collection('orders')
                          .where('userId', '==', userId)
                          .orderBy('createdAt', 'desc')
                          .limit(1);
      const snapshot = await ordersRef.get();
      if (snapshot.empty) {
        console.log('No matching orders found.');
        return res.status(404).json({ message: 'No orders found for this user.' });
      }
      let lastOrder;
      snapshot.forEach(doc => {
        lastOrder = { id: doc.id, ...doc.data() };
      });
      res.status(200).json(lastOrder);
    } catch (error) {
      console.error('Error getting the last order by user ID:', error);
      res.status(500).json({ message: 'Error getting the last order', error: error.message });
    }
  };
