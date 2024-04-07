import { db } from '../config/firebase/firebase.config.js';
import Product from '../models/product.model.js';

const collectionRef = db.collection('products');

async function getProductsByCategory(categoryId) {
    if (!categoryId) {
        throw new Error('Missing categoryId');
      }
    const snapshot = await collectionRef.where('categoryId', '==', categoryId).get();
    const products = [];
    snapshot.forEach(doc => {
      const product = Product.fromFirestore(doc);
      products.push(product);
    });
    return products;
  }

async function addProduct(productData) {
  const result = await collectionRef.add(productData);
  return result.id;
}

async function getProductById(productId) {
    try {
      const productRef = db.collection('products').doc(productId);
      const doc = await productRef.get();
  
      if (!doc.exists) {
        return null;
      }
  
      const productData = doc.data();
      const product = new Product(productId, productData.title, productData.image, productData.price, productData.categoryId, productData.extrasIds);
      return product;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  
  async function getProductExtras(productId) {
    try {
      const product = await getProductById(productId);
  
      if (!product) {
        return null;
      }
  
      const extras = [];
      const extraRefs = product.extrasIds.map(extraId => db.collection('extras').doc(extraId));
      const extraSnapshots = await Promise.all(extraRefs.map(ref => ref.get()));
  
      extraSnapshots.forEach(snapshot => {
        if (snapshot.exists) {
          const extraData = snapshot.data();
          // Aquí puedes crear objetos Extra si tienes un modelo para ellos
          extras.push(extraData);
        }
      });
  
      return extras;
    } catch (error) {
      throw new Error(error.message);
    }
  }

export { getProductsByCategory, addProduct, getProductExtras, getProductById };
