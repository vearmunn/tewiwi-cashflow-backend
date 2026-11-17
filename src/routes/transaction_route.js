import express from 'express';
import * as transactionController from '../controllers/transaction_controller.js';
import authenticate from '../middlewares/authenticate.js'

const router = express.Router();


/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create a new transaction
 *     description: Creates a new income or expense transaction for the authenticated user.
 *     tags:
 *       - Transactions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *               - amount
 *               - categoryId
 *               - date
 *             properties:
 *               description:
 *                 type: string
 *                 example: Pembelian Bahan baku
 *               amount:
 *                 type: number
 *                 example: 250000
 *               categoryId:
 *                 type: string
 *                 example: "1"
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-11-17T10:00:00+07:00"
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   description: The newly created transaction.
 *       400:
 *         description: Invalid transaction data
 *       401:
 *         description: Unauthorized - authentication token is missing or invalid
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticate, transactionController.createTransaction);


/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get all transactions
 *     description: Retrieves transactions belonging to the authenticated user, with optional filtering and search parameters.
 *     tags:
 *       - Transactions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Filter transactions from this date.
 *         example: "2026-11-01"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Filter transactions up to this date.
 *         example: "2026-11-30"
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter transactions by category ID.
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *         required: false
 *         description: Filter transactions by type.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *         description: Search transactions by description.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: false
 *         description: Maximum number of transactions to return.
 *         example: 10
 *     responses:
 *       200:
 *         description: Transactions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Transaction information.
 *       401:
 *         description: Unauthorized - authentication token is missing or invalid
 *       500:
 *         description: Internal server error
 */
router.get('/', authenticate, transactionController.getAllTransactions);

/**
 * @swagger
 * /transactions/summary:
 *   get:
 *     summary: Get transaction summary
 *     description: Retrieves income, expense, net cashflow, transaction count, and category breakdown within an optional date range.
 *     tags:
 *       - Transactions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Start date for the summary period.
 *         example: "2026-11-01"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: End date for the summary period.
 *         example: "2026-11-30"
 *     responses:
 *       200:
 *         description: Transaction summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 total_income:
 *                   type: number
 *                   example: 5000000
 *                 total_expense:
 *                   type: number
 *                   example: 2000000
 *                 net_cashflow:
 *                   type: number
 *                   example: 3000000
 *                 transaction_number:
 *                   type: integer
 *                   example: 25
 *                 sum_income:
 *                   type: array
 *                   description: Income totals grouped by category.
 *                   items:
 *                     type: object
 *                     properties:
 *                       category_id:
 *                         type: string
 *                         format: uuid
 *                       category_name:
 *                         type: string
 *                         example: Sales
 *                       type:
 *                         type: string
 *                         example: income
 *                       total:
 *                         type: number
 *                         example: 5000000
 *                 sum_expense:
 *                   type: array
 *                   description: Expense totals grouped by category.
 *                   items:
 *                     type: object
 *                 data:
 *                   type: array
 *                   description: Transaction summary grouped by date.
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized - authentication token is missing or invalid
 *       500:
 *         description: Internal server error
 */
router.get('/summary', authenticate, transactionController.getSummary);

/**
 * @swagger
 * /transactions/{transactionId}:
 *   get:
 *     summary: Get transaction by ID
 *     description: Retrieves a specific transaction using its ID.
 *     tags:
 *       - Transactions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the transaction.
 *         example: "1"
 *     responses:
 *       200:
 *         description: Transaction retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   description: Retrieved transaction information.
 *       401:
 *         description: Unauthorized - authentication token is missing or invalid
 *       404:
 *         description: Transaction not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: Transaction not found
 *       500:
 *         description: Internal server error
 */
router.get('/:transactionId', authenticate, transactionController.getTransactionById);

/**
 * @swagger
 * /transactions/{transactionId}:
 *   delete:
 *     summary: Delete a transaction
 *     description: Deletes a transaction using its ID.
 *     tags:
 *       - Transactions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the transaction to delete.
 *         example: "1"
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Transaction successfully deleted!
 *       401:
 *         description: Unauthorized - authentication token is missing or invalid
 *       404:
 *         description: Transaction not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: Transaction not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:transactionId', authenticate, transactionController.deleteTransaction);

/**
 * @swagger
 * /transactions/{transactionId}:
 *   put:
 *     summary: Update a transaction
 *     description: Updates an existing transaction. Only the provided fields will be changed.
 *     tags:
 *       - Transactions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the transaction to update.
 *         example: "1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               description:
 *                 type: string
 *                 example: Pembelian bahan baku
 *               amount:
 *                 type: number
 *                 example: 300000
 *               categoryId:
 *                 type: string
 *                 example: "1"
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-11-17T10:00:00+07:00"
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     transaction:
 *                       type: object
 *                       description: Updated transaction information.
 *       401:
 *         description: Unauthorized - authentication token is missing or invalid
 *       404:
 *         description: Transaction not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: failed
 *                 message:
 *                   type: string
 *                   example: Transaction doesnt exist
 *       500:
 *         description: Internal server error
 */
router.put('/:transactionId', authenticate, transactionController.updateTransaction);

export default router;