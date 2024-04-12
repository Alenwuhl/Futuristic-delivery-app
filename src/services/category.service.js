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
  const hostname = HOST // '192.168.2.120:3000'; //'192.168.68.105:3000';

  for (let doc of snapshot.docs) {
    const data = doc.data();
    let imageUrl = '';

    if (data.imageName) {
      try {
        // Define el path donde se guardará la imagen descargada
        const localImagePath = path.join('src', 'public', 'images', data.imageName);
        // Descarga la imagen de Firebase Storage
        console.log('LocalImagePath: ', localImagePath);

        // Crea un URL para acceder a la imagen desde el servidor
        data.imageUrl = `${protocol}://${hostname}/images/${data.imageName}`;
        console.log('imageUrl - ', data.imageUrl)

        setTimeout(() => {
         downloadImage(`images/${data.imageName}`, localImagePath);
        }, 7000);

      } catch (error) {
        console.error(`Error al descargar la imagen ${data.imageName}:`, error);
        imageUrl = ''; // O una URL de imagen predeterminada en caso de error.
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

/*import { db } from '../config/firebase/firebase.config.js';
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
*/