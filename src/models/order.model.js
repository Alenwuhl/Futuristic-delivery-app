class OrderModel {
    constructor(userId, email, orderItems, orderNumber, createdAt) {
      this.userId = userId;
      this.email = email;
      this.orderItems = orderItems; // Array of category selections.
      this.orderNumber = orderNumber;
      this.createdAt = createdAt; // Date & time 
    }
  
    toFirestore() {
      return {
        userId: this.userId,
        email: this.email,
        orderItems: this.orderItems,
        orderNumber: this.orderNumber,
        createdAt: this.createdAt
      };
    }
  }
  
  export default OrderModel;
  