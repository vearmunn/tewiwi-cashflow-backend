import * as cashObligationRepo from '../repositories/cash_obligation_repository.js';

const createCashObligation = async (req, res, next) => {
    try {
        const { description, amount, reminder_days, date, is_recurring, recurring_day } = req.body;

        const cashObligation = await cashObligationRepo.create({
            description, amount, date, reminderDays: reminder_days, uid: req.user.id, isRecurring: is_recurring, recurringDay: recurring_day
        });

        return res.status(201).json({
            status: 'success',
            data: cashObligation
        });
    } catch (error) {
        next(error);
    }
};


const getCashObligationById = async (req, res, next) => {
    try {
        const { cashObligationId } = req.params;

        const cashObligation = await cashObligationRepo.findById(cashObligationId);

        if (!cashObligation) {
            return res.status(404).json({
                status: 'failed',
                message: 'Transaction not found',
            });
        }

        return res.status(200).json({
            status: 'success',
            data: cashObligation
        });
    } catch (error) {
        next(error);
    }
};


const deleteCashObligation = async (req, res, next) => {
    try {
        const { cashObligationId } = req.params;

        const deletedCashObligation = await cashObligationRepo.remove(cashObligationId);

        if (!deletedCashObligation) {
            return res.status(404).json({
                status: 'failed',
                message: 'Cash obligation not found',
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Cash obligation successfully deleted!'
        });
    } catch (error) {
        next(error);
    }
};


const updateCashObligation = async (req, res, next) => {
    try {
        const { description, amount, reminder_days, date, is_recurring, recurring_day } = req.body;
        const { cashObligationId } = req.params;
        const existingCashObligation = await cashObligationRepo.findById(cashObligationId);

        if (!existingCashObligation) {
            return res.status(404).json({
                status: 'failed',
                message: 'Cash obligation doesnt exist',
            });
        }

        const cashObligation = await cashObligationRepo.update({
            id: cashObligationId,
            description: description || existingCashObligation.description,
            amount: amount || existingCashObligation.amount,
            date: date || existingCashObligation.date,
            reminderDays: reminder_days || existingCashObligation.reminder_days_before,
            isRecurring: is_recurring ?? existingCashObligation.is_recurring,
            recurringDay: is_recurring === false
                ? null
                : recurring_day ?? existingCashObligation.recurring_day
        });

        return res.status(200).json({
            status: 'success',
            data: {
                cashObligation,
            },
        });
    } catch (error) {
        next(error);
    }
};


const getCashObligations = async (req, res, next) => {
    try {
        const { upcoming } = req.query;
        const cashObligations = await cashObligationRepo.findAll(upcoming);

        return res.status(200).json({
            status: 'success',
            data: cashObligations
        });
    } catch (error) {
        next(error);
    }
};

export {
    createCashObligation,
    getCashObligations,
    getCashObligationById,
    deleteCashObligation,
    updateCashObligation
}