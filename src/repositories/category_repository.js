import pool from '../config/db.js';

const create = async ({ name, type }) => {
    const result = await pool.query(
        `
      INSERT INTO categories (
        name,
        type
      )
      VALUES ($1, $2)
      RETURNING *
    `,
        [name, type]
    );

    return result.rows[0];
};

const update = async ({ id, name, type }) => {
    const result = await pool.query(
        `
        UPDATE categories 
        SET name = $1, type = $2
        WHERE id = $3
        RETURNING *
        `,
        [name, type, id]
    );
    return result.rows[0];

}

const findByName = async (name) => {
    const result = await pool.query(
        `
      SELECT *
      FROM categories
      WHERE name = $1
    `,
        [name]
    );

    return result.rows[0];
};


const findById = async (id) => {
    const result = await pool.query(
        `
      SELECT *
      FROM categories
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
      FROM categories
      WHERE id = $1
      RETURNING id
    `,
        [id]
    );
    return result.rows[0];
};

const findAll = async () => {
    const result = await pool.query(
        "SELECT * FROM categories",
    );

    return result.rows;
};


export {
    create,
    findByName,
    findAll,
    remove,
    findById,
    update
};