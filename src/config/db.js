import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config();

const { Pool } = pg;

// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
// });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ca = fs.readFileSync(
    path.join(__dirname, '../../certificates/prod-ca-2021.crt'),
    'utf8'
);

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 1,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 10000,
    ssl: {
        ca,
        rejectUnauthorized: true
    }
});

export default pool;