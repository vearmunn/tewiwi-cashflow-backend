import express from 'express';
import * as cashObligationController from '../controllers/cash_obligation_controller.js';
import authenticate from '../middlewares/authenticate.js'
import validate from '../middlewares/validate.js';
import validateCashObligationSchema from '../schemas/cash_obligation_schema.js';

const router = express.Router();

router.post('/', authenticate, validate(validateCashObligationSchema), cashObligationController.createCashObligation);
router.get('/', authenticate, cashObligationController.getCashObligations);
router.get('/:cashObligationId', authenticate, cashObligationController.getCashObligationById);
router.delete('/:cashObligationId', authenticate, cashObligationController.deleteCashObligation);
router.put('/:cashObligationId', authenticate, cashObligationController.updateCashObligation);

export default router;