import Joi from 'joi';

const validateCategorySchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    type: Joi.string().valid('income', 'expense').required(),
});

export default validateCategorySchema;