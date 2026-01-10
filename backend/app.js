const express = require('express');
const app = express();
const cors = require('cors'); // <-- Tambahkan
const errorMiddleware = require('./middlewares/errorMiddleware'); // <-- Tambahkan

app.use(express.json());
app.use(cors()); // <-- Tambahkan CORS

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));

// PENTING: Pasang Error Middleware di AKHIR setelah semua route
app.use(errorMiddleware); // <-- Tambahkan Global Error Handler

module.exports = app;