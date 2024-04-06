class Category {
    constructor(id, code, title, image, selections = []) {
      this.id = id;
      this.code = code;
      this.title = title;
      this.image = image;
      this.selections = selections;
    }
  
    static fromFirestore(doc) {
      return new Category(doc.id, doc.data().code, doc.data().title, doc.data().image, doc.data().selections);
    }
  }
  
  export default Category;
  