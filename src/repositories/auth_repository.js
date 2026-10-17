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

export {
    create
}