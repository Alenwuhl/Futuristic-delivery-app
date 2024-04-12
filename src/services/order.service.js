import { db } from "../config/firebase/firebase.config.js";
import {Order, OrderItem} from "../models/order.model.js";
import { getRandomSixDigitNumber, getRandomString } from "../utils.js";

class OrderService {
  async createOrder(userId, email, orderItems, totalAmount) {
    try {
      const orderNumber = getRandomSixDigitNumber();
      const createdAt = new Date()
      console.log('0');
      const orderId = getRandomString(30); // Generates a random string for order ID.
      console.log('orderId -', orderId);
      console.log('1');
      const newOrder = new Order(
        userId,
        email,
        orderItems,
        orderNumber,
        createdAt,
        totalAmount
      );
      console.log('OrderService newOrder -', newOrder);
      await db.collection("orders").doc(orderId).set(newOrder.toFirestore());
      return orderId; // Returns the ID of the new order.
    } catch (error) {
      console.error("OrderService Error creating new order:", error);
      throw new Error(error);
    }
  }

  async getOrderByUserId(userId) {
    try {
      const ordersRef = db.collection("orders").where("userId", "==", userId);
      const snapshot = await ordersRef.get();
      if (snapshot.empty) {
        console.log("No matching orders found.");
        return [];
      }
      let orders = [];
      snapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });
      return orders; // Returns all orders for the given user ID.
    } catch (error) {
      console.error("Error getting orders by user ID:", error);
      throw new Error(error);
    }
  }
  async getOrderById(orderId) {
    try {
      const orderSnapshot = await db.collection("orders").doc(orderId).get();

      if (!orderSnapshot.exists) {
        throw new Error("Order not found");
      }

      return {
        id: orderSnapshot.id,
        ...orderSnapshot.data(),
      };
    } catch (error) {
      throw new Error("Error getting order by ID: " + error.message);
    }
  }

  async deleteOrderById(orderId) {
    try {
      await db.collection("orders").doc(orderId).delete();

      return { message: "Order successfully deleted" };
    } catch (error) {
      throw new Error("Error deleting order by ID: " + error.message);
    }
  }
}

export default OrderService;
