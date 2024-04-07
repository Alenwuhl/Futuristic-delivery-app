import { db } from '../config/firebase/firebase.config.js';
import { bucket } from '../config/firebase/firebase.config.js';
import admin from 'firebase-admin' // Asume que has inicializado Firebase Admin SDK aquí
import Category from '../models/category.model.js';
import fs from 'fs';
import path from 'path';
import os from 'os';
import stream from 'stream';
import { log } from 'console';

const collectionRef = db.collection('categories');
//const bucket = admin.bucket //.storage().bucket();
console.log('bucket -', bucket);


async function getAllCategories() {
  const snapshot = await collectionRef.get();
  const categories = [];
  const protocol = 'http';
  const hostname = 'localhost:3000';

  for (let doc of snapshot.docs) {
    const data = doc.data();
    let imageUrl = '';

    if (data.imageName) {
      try {
        // Define el path donde se guardará la imagen descargada
        const localImagePath = path.join('src', 'public', 'images', data.imageName);
        // Descarga la imagen de Firebase Storage
       // localImagePath  = getSignedUrlForImage(filePath);
        console.log('LocalImagePath: ', localImagePath);
        setTimeout(() => {
         downloadImage(`images/${data.imageName}`, localImagePath);
        }, 3000);

        // Crea un URL para acceder a la imagen desde el servidor
        imageUrl = `${protocol}://${hostname}/images/${data.imageName}`;
      } catch (error) {
        console.error(`Error al descargar la imagen ${data.imageName}:`, error);
        imageUrl = ''; // O una URL de imagen predeterminada en caso de error.
      }
    }
    
    categories.push({
      ...data,
      imageUrl,
    });
  }
  return categories;
}

// Función para descargar la imagen de Firebase Storage
async function downloadImage(storagePath, localPath) {
  const dest = fs.createWriteStream(localPath);
  await bucket.file(storagePath).createReadStream().pipe(dest);
}


async function getSignedUrlForImage(filePath) {
  const options = {
      action: 'read',
      expires: Date.now() + 1000 * 60 * 60, // URL expira en 1 hora
  };
  console.log('filepath: ', filePath)
  try {
      const [url] = await bucket.file(filePath).getSignedUrl(options);
      console.log('url', url)
      return url;
  } catch (error) {
      throw error; // Propaga el error para manejarlo en el bloque try-catch de arriba.
  }
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