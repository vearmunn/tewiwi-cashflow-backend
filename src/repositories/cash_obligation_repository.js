import pool from '../config/db.js';

const create = async ({ description, amount, date, reminderDays, uid }) => {
    const result = await pool.query(
        `
      INSERT INTO cash_obligation (
        description,
        amount,
        date,
        created_by,
        reminder_days_before
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `,
        [description, amount, date, uid, reminderDays]
    );

    return result.rows[0];
};

const update = async ({ id, description, amount, date, reminderDays }) => {
    const result = await pool.query(
        `
        UPDATE cash_obligation 
        SET description = $1, amount = $2, date = $3, reminder_days_before = $4
        WHERE id = $5
        RETURNING *
        `,
        [description, amount, date, reminderDays, id]
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