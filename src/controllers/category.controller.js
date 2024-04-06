import * as categoryService from '../services/category.service.js';

async function getCategories(req, res) {
  try {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).send(error.toString());
  }
}

async function createCategory(req, res) {
  try {
    const newCategoryId = await categoryService.addCategory(req.body);
    res.status(201).send({message: `Categoría creada con el ID: ${newCategoryId}`, id: newCategoryId});
  } catch (error) {
    res.status(500).send(error.toString());
  }
}

export { getCategories, createCategory };
