import pool from '../config/db.js';

const create = async ({ id, email, name, role }) => {
    const result = await pool.query(
        `
      INSERT INTO profiles (
        id,
        email,
        name,
        role
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
        [id, email, name, role]
    );

    return result.rows[0];
};

const update = async ({ id, name, role }) => {
    const result = await pool.query(
        `
        UPDATE profiles 
        SET name = $1, role = $2
        WHERE id = $3
        RETURNING *
        `,
        [name, role, id]
    );
    return result.rows[0];

}

const findById = async (id) => {
    const result = await pool.query(
        `
      SELECT *
      FROM profiles
      WHERE id = $1
    `,
        [id]
    );

    return result.rows[0];
};

export {
    create,
    update,
    findById
}