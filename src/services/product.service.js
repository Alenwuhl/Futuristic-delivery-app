import { db, bucket } from "../config/firebase/firebase.config.js";
import * as extraService from "../services/extra.service.js";
import Product from "../models/product.model.js";
import { downloadImage } from "../utils.js";
import path from "path";
import dotenv from 'dotenv';
dotenv.config();

const hostname = process.env.HOST;

const collectionRef = db.collection("products");

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

        imageUrl = `${hostname}/images/${productData.imageName}`;
      } catch (error) {
        console.error(
          `Error on the image ${productData.imageName}:`,
          error
        );
        imageUrl = ""; 
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

  return extras;
}

async function downloadExtraImage(imageName){
  let imageUrl = "";

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
      imageUrl = `${hostname}/images/${imageName}`;
    } catch (error) {
      console.error(
        `Error al obtener URL firmada para imagen ${imageName}:`,
        error
      );
      imageUrl = "";
    }
  }
  return imageUrl
}

export { getProductsByCategory, addProduct, getProductExtras, getProductById };
