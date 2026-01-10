require('dotenv').config();
const app = require('./app');
const db = require('./config/db'); // <-- PASTIKAN DATABASE KONEK
const cors = require('cors'); // <-- PENTING UNTUK CORS
const errorMiddleware = require('./middlewares/errorMiddleware'); // <-- IMPORT ERROR HANDLER

// Tambahkan Middleware Global di app.js atau di sini
app.use(cors()); // Mengaktifkan CORS untuk semua route
app.use(errorMiddleware); // Mengaktifkan Global Error Handler

// Koneksi Database sudah ada di config/db.js. Pastikan environment variables dimuat sebelum koneksi.

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});