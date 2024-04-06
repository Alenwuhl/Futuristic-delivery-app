import { db } from '../config/firebase/firebase.config.js';
import Category from '../models/category.model.js';

const collectionRef = db.collection('categories');

async function getAllCategories() {
  const snapshot = await collectionRef.get();
  const categories = [];
  snapshot.forEach(doc => {
    const category = Category.fromFirestore(doc);
    categories.push(category);
  });
  return categories;
}

async function addCategory(categoryData) {
  const result = await collectionRef.add(categoryData);
  return result.id;
}

export { getAllCategories, addCategory };
