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

const getAllTransactions = async (req, res, next) => {
    try {
        const { startDate, endDate, categoryId, type, search, limit } = req.query;
        const transactions = await transactionRepo.findAll(startDate, endDate, categoryId, type, search, limit);

        return res.status(200).json({
            status: 'success',
            data: transactions
        });
    } catch (error) {
        next(error);
    }
};
const getSummary = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        const summary = await transactionRepo.fetchSummary(startDate, endDate);

        const totalIncome = summary.reduce((acc, item) => acc + Number(item.income), 0)
        const totalExpense = summary.reduce((acc, item) => acc + Number(item.expense), 0)
        const cashFlow = totalIncome - totalExpense

        return res.status(200).json({
            status: 'success',
            total_income: totalIncome,
            total_expense: totalExpense,
            net_cashflow: cashFlow,
            transaction_number: summary.length,
            data: summary
        });
    } catch (error) {
        next(error);
    }
};

export {
    createTransaction,
    getAllTransactions,
    getTransactionById,
    deleteTransaction,
    updateTransaction,
    getSummary
}