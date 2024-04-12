import { db, bucket } from "../config/firebase/firebase.config.js";
import * as extraService from "../services/extra.service.js";
import Product from "../models/product.model.js";
import { downloadImage } from "../utils.js";
import path from "path";
import dotenv from 'dotenv';
dotenv.config();
const HOST = process.env.HOST;

// Configura la dirección del servidor y el protocolo si es necesario
const protocol = "http";
const hostname = HOST;
//const hostname = "192.168.68.105:3000";

const collectionRef = db.collection("products");

async function getSignedUrlForImage(filePath) {
  const options = {
    action: "read",
    expires: Date.now() + 1000 * 60 * 60, // URL expira en 1 hora
  };
  try {
    const [url] = bucket.file(filePath).getSignedUrl(options);
    return url;
  } catch (error) {
    throw error;
  }
}

async function getProductsByCategory(categoryId) {
  if (!categoryId) {
    throw new Error("Missing categoryId");
  }
  const snapshot = await collectionRef
    .where("categoryId", "==", categoryId)
    .get();
  const products = [];

  for (let doc of snapshot.docs) {
    const productData = doc.data();
    const product = Product.fromFirestore(doc);
    let imageUrl = "";

    // Aquí asumimos que tienes un campo 'imageName' en tus documentos de productos que contiene el nombre del archivo de imagen en Firebase Storage.
    if (productData.imageName) {
      try {
        const localImagePath = path.join(
          "src",
          "public",
          "images",
          productData.imageName
        );
        setTimeout(() => {
          downloadImage(`images/${productData.imageName}`, localImagePath);
        }, 5000);
        imageUrl = `${protocol}://${hostname}/images/${productData.imageName}`;
      } catch (error) {
        console.error(
          `Error al obtener URL firmada para imagen ${productData.imageName}:`,
          error
        );
        imageUrl = ""; // O una URL de imagen predeterminada en caso de error.
      }
    }

    products.push({
      ...productData,
      imageUrl,
    });
  }
  return products;
}

async function addProduct(productData) {
  const result = await collectionRef.add(productData);
  return result.id;
}

async function getProductById(productId) {
  try {
    const snapshot = await collectionRef.where("id", "==", productId).get();
    let product = new Product();

    for (let doc of snapshot.docs) {
      const productData = doc.data();
      product = new Product(
        productId,
        productData.title,
        productData.image,
        productData.price,
        productData.categoryId,
        productData.extrasIds
      );
    }
    console.log(product);

    if (!product) {
      return null;
    }
    return product;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getProductExtras(productId) {
  if (!productId) {
    throw new Error("Missing productId");
  }

  const product = await getProductById(productId);

  if (!product) {
    return null;
  }

  const extras = [];
  for (const extraId of product.extrasIds) {
    const extra = await extraService.getExtraById(extraId);
    extra.imageUrl = await downloadExtraImage(extra.imageName);
    extras.push(extra);
  }

  console.log("extras - ", extras);
  return extras;
}

async function downloadExtraImage(imageName){
  let imageUrl = "";

  // Aquí asumimos que tienes un campo 'imageName' en tus documentos de productos que contiene el nombre del archivo de imagen en Firebase Storage.
  if (imageName) {
    try {
      const localImagePath = path.join(
        "src",
        "public",
        "images",
        imageName
      );
      setTimeout(() => {
        downloadImage(`images/${imageName}`, localImagePath);
      }, 5000);
      imageUrl = `${protocol}://${hostname}/images/${imageName}`;
    } catch (error) {
      console.error(
        `Error al obtener URL firmada para imagen ${imageName}:`,
        error
      );
      imageUrl = ""; // O una URL de imagen predeterminada en caso de error.
    }
  }
  return imageUrl
}

export { getProductsByCategory, addProduct, getProductExtras, getProductById };
