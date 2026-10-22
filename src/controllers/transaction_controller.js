import * as transactionRepo from '../repositories/transaction_repository.js';

const createTransaction = async (req, res, next) => {
    try {
        const { description, amount, categoryId, date } = req.body;

        const transaction = await transactionRepo.create({
            description, amount, categoryId, date, uid: req.user.id
        });

        return res.status(201).json({
            status: 'success',
            data: transaction
        });
    } catch (error) {
        next(error);
    }
};

const getTransactionById = async (req, res, next) => {
    try {
        const { transactionId } = req.params;

        const transaction = await transactionRepo.findById(transactionId);

        if (!transaction) {
            return res.status(404).json({
                status: 'failed',
                message: 'Transaction not found',
            });
        }

        return res.status(200).json({
            status: 'success',
            data: transaction
        });
    } catch (error) {
        next(error);
    }
};

const deleteTransaction = async (req, res, next) => {
    try {
        const { transactionId } = req.params;

        const deletedTransaction = await transactionRepo.remove(transactionId);

        if (!deletedTransaction) {
            return res.status(404).json({
                status: 'failed',
                message: 'Transaction not found',
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Transaction successfully deleted!'
        });
    } catch (error) {
        next(error);
    }
};

const updateTransaction = async (req, res, next) => {
    try {
        const { description, amount, categoryId, date } = req.body;
        const { transactionId } = req.params;
        const existingTransaction = await transactionRepo.findById(transactionId);

        if (!existingTransaction) {
            return res.status(404).json({
                status: 'failed',
                message: 'Transaction doesnt exist',
            });
        }

        const transaction = await transactionRepo.update({
            id: transactionId,
            description: description || existingTransaction.description,
            amount: amount || existingTransaction.amount,
            date: date || existingTransaction.date,
            categoryId: categoryId || existingTransaction.category_id,
        });

        return res.status(200).json({
            status: 'success',
            data: {
                transaction,
            },
        });
    } catch (error) {
        next(error);
    }
};

const getAllCategories = async (req, res, next) => {
    try {

        const categories = await transactionRepo.findAll();

        return res.status(200).json({
            status: 'success',
            data: categories
        });
    } catch (error) {
        next(error);
    }
};

export {
    createTransaction,
    getAllCategories,
    getTransactionById,
    deleteTransaction,
    updateTransaction
}