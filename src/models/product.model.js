class Product {
    constructor(id, title, image, price, categoryId, extrasIds) {
      this.id = id;
      this.title = title;
      this.image = image;
      this.price = price;
      this.categoryId = categoryId;
      this.extrasIds = extrasIds;
    }
  
    static fromFirestore(doc) {
      const { id, title, image, price, categoryId, extrasIds } = doc.data(); 
      return new Product(id, title, image, price, categoryId, extrasIds); 
    }
  }
  
  export default Product;
  