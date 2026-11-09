import pool from '../config/db.js';

const create = async ({ description, amount, date, reminderDays, uid, isRecurring, recurringDay }) => {
    const result = await pool.query(
        `
      INSERT INTO cash_obligation (
        description,
        amount,
        date,
        created_by,
        reminder_days_before,
        is_recurring,
        recurring_day
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `,
        [description, amount, date, uid, reminderDays, isRecurring, recurringDay]
    );

    return result.rows[0];
};

const update = async ({ id, description, amount, date, reminderDays, isRecurring, recurringDay }) => {
    const result = await pool.query(
        `
        UPDATE cash_obligation 
        SET description = $1, amount = $2, date = $3, reminder_days_before = $4, is_recurring = $5, recurring_day = $6
        WHERE id = $7
        RETURNING *
        `,
        [description, amount, date, reminderDays, isRecurring, recurringDay, id]
    );
    return result.rows[0];

}

const findById = async (id) => {
    const result = await pool.query(
        `
      SELECT *
      FROM cash_obligation
      WHERE id = $1
    `,
        [id]
    );

    return result.rows[0];
};

const remove = async (id) => {
    const result = await pool.query(
        `
      DELETE
      FROM cash_obligation
      WHERE id = $1
      RETURNING id
    `,
        [id]
    );
    return result.rows[0];
};

const findAll = async (upcoming) => {
    let query =
        `SELECT * FROM cash_obligation `;

    if (upcoming === "true") {
        query += `
        WHERE NOW() >= (
            date - (reminder_days_before * INTERVAL '1 day')
        )
    `;
    }
    query += ` ORDER BY date ASC`;

    const result = await pool.query(query);

    return result.rows;
};

export {
    create,
    findAll,
    remove,
    findById,
    update,
};