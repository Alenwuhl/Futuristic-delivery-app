class Order {
  constructor(userId, email, orderItems, orderNumber, createdAt, totalAmount) {
    this.userId = userId;
    this.email = email;
    this.orderItems = orderItems; 
    this.orderNumber = orderNumber;
    this.createdAt = createdAt; // Date & time
    this.totalAmount = totalAmount;
  }

  toFirestore() {
    return {
      userId: this.userId,
      email: this.email,
      orderItems: this.orderItems,
      orderNumber: this.orderNumber,
      createdAt: this.createdAt,
      totalAmount: this.totalAmount,
    };
  }
}

class OrderItem {
  constructor(productId, quantity, extrasIds) {
    this.productId = productId;
    this.quantity = quantity;
    this.extrasIds = extrasIds;
  }

  toFirestore() {
    return {
      productId: this.productId,
      quantity: this.quantity,
      extrasIds: thisextrasIds
    };
  }
}

export {Order, OrderItem}
