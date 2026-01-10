const express = require('express');
const app = express();
const cors = require('cors'); 
const errorMiddleware = require('./middlewares/errorMiddleware'); 

// WAJIB ADA DAN DI DEPAN
app.use(express.json()); // <-- INI YANG MEMBACA DATA JSON DARI BODY REQUEST
app.use(cors()); 
// END WAJIB

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));

app.use(errorMiddleware); 

module.exports = app;