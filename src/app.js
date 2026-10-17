import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import categoryRoutes from './routes/category_route.js';
import transactionRoutes from './routes/transaction_route.js';
import errorHandler from "./middlewares/error_handler.js";
import authRoutes from './routes/auth_route.js'

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: '*'
}));

app.use(express.json());
app.use('/auth', authRoutes)
app.use('/categories', categoryRoutes);
app.use('/transactions', transactionRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});