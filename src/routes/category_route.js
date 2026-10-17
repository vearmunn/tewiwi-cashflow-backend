import express from 'express';
import validate from '../middlewares/validate.js';
import * as categoryController from '../controllers/category_controller.js';
import validateCategorySchema from '../schemas/category_schema.js';
import authenticate from '../middlewares/authenticate.js'

const router = express.Router();

router.post('/', authenticate, validate(validateCategorySchema), categoryController.createCategory);
router.get('/', authenticate, categoryController.getAllCategories);
router.get('/:categoryId', authenticate, categoryController.getCategoryById);
router.delete('/:categoryId', authenticate, categoryController.deleteCategory);
router.put('/:categoryId', authenticate, categoryController.updateCategory);

export default router;