import * as productService from '../services/product.service.js';

async function getProductsByCategory(req, res) {
    try {
      const { catId } = req.params;
      console.log('CategoryId:', catId);
      if (!catId ) {
        return res.status(400).send('Missing categoryId');
      }
      const products = await productService.getProductsByCategory(catId);
      res.json(products);
    } catch (error) {
      res.status(500).send(error.toString());
    }
  }

async function createProduct(req, res) {
  try {
    const newProductId = await productService.addProduct(req.body);
    res.status(201).send({message: `Product created with ID: ${newProductId}`, id: newProductId});
  } catch (error) {
    res.status(500).send(error.toString());
  }
}

async function getProductById(req, res) {
    const productId = req.params.productId;
  
    try {
      const product = await productService.getProductById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      res.json({ product });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  
  async function getProductExtras(req, res) {
    const productId = req.params.productId;
  
    try {
      const extras = await productService.getProductExtras(productId);
      if (!extras) {
        return res.status(404).json({ message: 'Extras no encontrados para este producto' });
      }
      res.json({ extras });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

export { getProductsByCategory, createProduct, getProductExtras, getProductById};
