import express from 'express';
import * as transactionController from '../controllers/transaction_controller.js';
import authenticate from '../middlewares/authenticate.js'

const router = express.Router();

router.post('/', authenticate, transactionController.createTransaction);
router.get('/', authenticate, transactionController.getAllTransactions);
router.get('/:transactionId', authenticate, transactionController.getTransactionById);
router.delete('/:transactionId', authenticate, transactionController.deleteTransaction);
router.put('/:transactionId', authenticate, transactionController.updateTransaction);

export default router;