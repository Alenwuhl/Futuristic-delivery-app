class Extra {
    constructor(id, title, imageName, price, imageUrl) {
      this.id = id;
      this.title = title;
      this.imageName = imageName;
      this.imageUrl = imageUrl;
      this.price = price;
    }
  
    static fromFirestore(doc) {
      const { id, title, imageName, price, imageUrl} = doc.data(); 
      return new Extra(id, title, imageName, imageUrl, price); 
    }
  }
  
  export default Extra;
  