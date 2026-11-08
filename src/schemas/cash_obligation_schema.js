import Joi from 'joi';

const validateCashObligationSchema = Joi.object({
    description: Joi.string().min(2).max(150).required(),
    amount: Joi.number().positive().required(),
    date: Joi.date().iso().required(),
    reminder_days: Joi.number().integer().min(0).required()
});

export default validateCashObligationSchema;