class Category {
    constructor(id, title, image, imageName, imageUrl) {
      this.id = id;
      this.title = title;
      this.image = image;
      this.imageName = imageName;
      this.imageUrl = imageUrl;
    }
  
    static fromFirestore(doc) {
      return new Category(doc.id, doc.data().title, doc.data().image, doc.data().imageName, doc.data().imageUrl);
    }
  }
  
  export default Category;
  