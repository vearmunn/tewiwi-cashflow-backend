import Joi from 'joi';

const validateCashObligationSchema = Joi.object({
    description: Joi.string().min(2).max(150).required(),
    amount: Joi.number().positive().required(),
    date: Joi.date().iso().required(),
    reminder_days: Joi.number().integer().min(0).required(),
    is_recurring: Joi.boolean().required(),
    recurring_day: Joi.when("is_recurring", {
        is: true,
        then: Joi.number().integer().min(1).max(31).required(),
        otherwise: Joi.valid(null).optional()
    })
});

export default validateCashObligationSchema;