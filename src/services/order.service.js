import { db } from '../config/firebase/firebase.config.js';
import OrderModel from '../models/order.model.js';
import { getRandomSixDigitNumber, getRandomString } from '../utils.js';

class OrderService {
  async createOrder(userId, email, orderItems) {
    try {
      const orderNumber = getRandomSixDigitNumber();
      const createdAt = new Date();
      const orderId = getRandomString(30); // Generates a random string for order ID.
      const newOrder = new OrderModel(userId, email, orderItems, orderNumber, createdAt);
      await db.collection('orders').doc(orderId).set(newOrder.toFirestore());
      return orderId; // Returns the ID of the new order.
    } catch (error) {
      console.error('Error creating new order:', error);
      throw new Error(error);
    }
  }

  async getOrderByUserId(userId) {
    try {
      const ordersRef = db.collection('orders').where('userId', '==', userId);
      const snapshot = await ordersRef.get();
      if (snapshot.empty) {
        console.log('No matching orders found.');
        return [];
      }
      let orders = [];
      snapshot.forEach(doc => {
        orders.push({ id: doc.id, ...doc.data() });
      });
      return orders; // Returns all orders for the given user ID.
    } catch (error) {
      console.error('Error getting orders by user ID:', error);
      throw new Error(error);
    }
  }
}



export default OrderService;
