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

const findAll = async (startDate, endDate, categoryId, type, search, limit) => {
    let query =
        `
        SELECT
        t.id,
        t.description,
        t.amount,
        t.category_id,
        t.created_by,
        TO_CHAR(
        t.date AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD"T"HH24:MI:SS') || '+07:00' AS date,
        c.type AS category_type
    FROM transactions AS t
    INNER JOIN categories AS c
        ON t.category_id = c.id
    WHERE 1=1
        `;
    const values = []


    if (startDate) {
        values.push(startDate);
        query += ` AND t.date >= ($${values.length}::date::timestamp AT TIME ZONE 'Asia/Jakarta')`;
    }

    if (endDate) {
        values.push(endDate);
        query += ` AND t.date < (($${values.length}::date + INTERVAL '1 day') AT TIME ZONE 'Asia/Jakarta')`;
    }

    if (categoryId) {
        values.push(categoryId);
        query += ` AND t.category_id = $${values.length}`;
    }

    if (type) {
        values.push(type);
        query += ` AND c.type = $${values.length}`;
    }

    if (search) {
        values.push(`%${search}%`);
        query += ` AND t.description ILIKE $${values.length}`;
    }

    query += ` ORDER BY t.date DESC`;

    if (limit) {
        values.push(limit);
        query += ` LIMIT $${values.length}`;
    }
    const result = await pool.query(query, values);

    return result.rows;
};

const fetchSummary = async (startDate, endDate) => {

    let query = `SELECT
        TO_CHAR(t.date AT TIME ZONE 'Asia/Jakarta','YYYY-MM-DD') AS date,
        COALESCE(
            SUM(CASE WHEN c.type = 'income' THEN t.amount ELSE 0 END),
            0
        ) AS income,
        COALESCE(
            SUM(CASE WHEN c.type = 'expense' THEN t.amount ELSE 0 END),
            0
        ) AS expense
    FROM transactions AS t
    INNER JOIN categories AS c
        ON t.category_id = c.id
    WHERE 1=1`;

    const values = []
    if (startDate) {
        values.push(startDate);
        query += ` AND t.date >= ($${values.length}::date::timestamp AT TIME ZONE 'Asia/Jakarta')`;
    }

    if (endDate) {
        values.push(endDate);
        query += ` AND t.date < (($${values.length}::date + INTERVAL '1 day') AT TIME ZONE 'Asia/Jakarta')`;
    }


    query += `  GROUP BY  TO_CHAR(t.date AT TIME ZONE 'Asia/Jakarta','YYYY-MM-DD')
        ORDER BY  TO_CHAR(t.date AT TIME ZONE 'Asia/Jakarta','YYYY-MM-DD') ASC`;

    const result = await pool.query(query, values);

    return result.rows;
}


export {
    create,
    findAll,
    remove,
    findById,
    update,
    fetchSummary
};