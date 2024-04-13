import { db } from '../config/firebase/firebase.config.js';
import { bucket } from '../config/firebase/firebase.config.js';
import { downloadImage } from '../utils.js';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
const HOST = process.env.HOST;

const collectionRef = db.collection('categories');

async function getAllCategories() {
  const snapshot = await collectionRef.get();
  const categories = [];
  const protocol = 'http';
  const hostname = HOST 

  for (let doc of snapshot.docs) {
    const data = doc.data();
    let imageUrl = '';

    if (data.imageName) {
      try {
        const localImagePath = path.join('src', 'public', 'images', data.imageName);
        data.imageUrl = `${protocol}://${hostname}/images/${data.imageName}`;

        setTimeout(() => {
         downloadImage(`images/${data.imageName}`, localImagePath);
        }, 7000);

      } catch (error) {
        console.error(`Error al descargar la imagen ${data.imageName}:`, error);
        imageUrl = ''; 
      }
    }
    
    categories.push({
      ...data
    });
  }
  return categories;
}

async function addCategory(categoryData) {
  const result = await collectionRef.add(categoryData);
  return result.id;
}

export { getAllCategories, addCategory };

