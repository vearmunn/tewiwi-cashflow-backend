import Joi from 'joi';

const validateRegisterSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().min(2).max(100).required(),
    role: Joi.string().min(2).max(100).required(),
});

export default validateRegisterSchema;