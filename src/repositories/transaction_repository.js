import pool from '../config/db.js';

const create = async ({ description, amount, categoryId, uid }) => {
    const result = await pool.query(
        `
      INSERT INTO transactions (
        description,
        amount,
        category_id,
        created_by
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
        [description, amount, categoryId, uid]
    );

    return result.rows[0];
};

const update = async ({ id, description, amount, categoryId }) => {
    const result = await pool.query(
        `
        UPDATE transactions 
        SET description = $1, amount = $2, category_id = $3
        WHERE id = $4
        RETURNING *
        `,
        [description, amount, categoryId, id]
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