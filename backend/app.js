const express = require('express');
const app = express();

app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));

module.exports = app;