import * as categoryRepo from '../repositories/category_repository.js';

const createCategory = async (req, res, next) => {
    try {
        const { name, type } = req.body;
        const existingCategory = await categoryRepo.findByName(name);

        if (existingCategory) {
            return res.status(400).json({
                status: 'failed',
                message: 'Category already exists',
            });
        }

        const category = await categoryRepo.create({
            name, type
        });

        return res.status(201).json({
            status: 'success',
            data: category
        });
    } catch (error) {
        next(error);
    }
};

const getCategoryById = async (req, res, next) => {
    try {
        const { categoryId } = req.params;

        const category = await categoryRepo.findById(categoryId);

        if (!category) {
            return res.status(404).json({
                status: 'failed',
                message: 'Category not found',
            });
        }

        return res.status(200).json({
            status: 'success',
            data: category
        });
    } catch (error) {
        next(error);
    }
};

const deleteCategory = async (req, res, next) => {
    try {
        const { categoryId } = req.params;

        const deletedCategory = await categoryRepo.remove(categoryId);

        if (!deletedCategory) {
            return res.status(404).json({
                status: 'failed',
                message: 'Category not found',
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Category successfully deleted!'
        });
    } catch (error) {
        next(error);
    }
};

const updateCategory = async (req, res, next) => {
    try {
        const { name, type } = req.body;
        const { categoryId } = req.params;
        const existingCategory = await categoryRepo.findById(categoryId);

        if (!existingCategory) {
            return res.status(404).json({
                status: 'failed',
                message: 'Category doesnt exist',
            });
        }

        const category = await categoryRepo.update({
            id: categoryId,
            name: name || existingCategory.name,
            type: type || existingCategory.type,
        });

        return res.status(200).json({
            status: 'success',
            data: {
                category,
            },
        });
    } catch (error) {
        next(error);
    }
};

const getAllCategories = async (req, res, next) => {
    try {

        const categories = await categoryRepo.findAll();

        return res.status(200).json({
            status: 'success',
            data: categories
        });
    } catch (error) {
        next(error);
    }
};

export {
    createCategory,
    getAllCategories,
    getCategoryById,
    deleteCategory,
    updateCategory
}