import pool from '../config/db.js';

const create = async ({ description, amount, categoryId, date, uid }) => {
    const result = await pool.query(
        `
      INSERT INTO transactions (
        description,
        amount,
        category_id,
        created_by,
        date
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `,
        [description, amount, categoryId, uid, date]
    );

    return result.rows[0];
};

const update = async ({ id, description, amount, categoryId, date }) => {
    const result = await pool.query(
        `
        UPDATE transactions 
        SET description = $1, amount = $2, category_id = $3, date = $4
        WHERE id = $5
        RETURNING *
        `,
        [description, amount, categoryId, date, id]
    );
    return result.rows[0];

}

const findById = async (id) => {
    const result = await pool.query(
        `
      SELECT *
      FROM transactions
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
      FROM transactions
      WHERE id = $1
      RETURNING id
    `,
        [id]
    );
    return result.rows[0];
};

const findAll = async () => {
    const result = await pool.query(
        "SELECT * FROM transactions",
    );

    return result.rows;
};


export {
    create,
    findAll,
    remove,
    findById,
    update
};