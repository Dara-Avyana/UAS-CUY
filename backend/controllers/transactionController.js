// controllers/transactionController.js
const db = require('../config/db');

exports.getTransactions = (req, res, next) => {
  // 1. Ambil Parameter dari Query
  const {
    page = 1,
    limit = 10,
    sort_by = 'created_at',
    order = 'DESC',
    type,
    product_id
  } = req.query;

  const offset = (parseInt(page) - 1) * parseInt(limit);
  const validLimit = parseInt(limit);
  const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  // 2. Base Query dengan JOIN untuk detail nama user dan produk
  let sql = `
        SELECT 
            t.id, t.product_id, t.quantity, t.type, t.user_id, t.created_at, 
            u.name AS user_name, p.name AS product_name 
        FROM transactions t
        JOIN users u ON t.user_id = u.id
        JOIN products p ON t.product_id = p.id
    `;
  let countSql = `SELECT COUNT(*) as total FROM transactions t`;

  // 3. Filtering Logic (WHERE clause)
  const filters = [];
  const params = []; // Parameter untuk kedua query (data dan count)

  if (type && ['masuk', 'keluar'].includes(type.toLowerCase())) {
    filters.push('t.type = ?');
    params.push(type.toLowerCase());
  }

  if (product_id) {
    filters.push('t.product_id = ?');
    params.push(product_id);
  }

  if (filters.length > 0) {
    const whereClause = ' WHERE ' + filters.join(' AND ');
    sql += whereClause;
    countSql += whereClause;
  }

  // 4. Sorting Logic
  const allowedSorts = ['id', 'created_at', 'quantity', 'type', 'product_name', 'user_name'];
  const sortByColumn = allowedSorts.includes(sort_by.toLowerCase()) ? `t.${sort_by}` : 't.created_at';

  sql += ` ORDER BY ${sortByColumn} ${sortOrder}`;

  // 5. Pagination Logic (LIMIT and OFFSET)
  sql += ' LIMIT ? OFFSET ?';
  const dataParams = [...params, validLimit, offset];

  // Jalankan query Count (Total Items)
  db.query(countSql, params, (err, countResults) => {
    if (err) return next(err);
    const totalItems = countResults[0].total;
    const totalPages = Math.ceil(totalItems / validLimit);

    // Jalankan query Data utama
    db.query(sql, dataParams, (err, results) => {
      if (err) return next(err);

      res.json({
        data: results,
        pagination: {
          totalItems,
          currentPage: parseInt(page),
          pageSize: validLimit,
          totalPages,
        }
      });
    });
  });
};

// Fungsi createTransaction (Logika Stok sudah benar dari sebelumnya)
exports.createTransaction = (req, res, next) => {
  const { product_id, quantity, type } = req.body;
  const userId = req.user.id;

  if (!['masuk', 'keluar'].includes(type)) {
    return res.status(400).json({ message: "Tipe transaksi harus 'masuk' atau 'keluar'" });
  }

  // 1. Ambil stok produk saat ini
  db.query('SELECT stock FROM products WHERE id = ?', [product_id], (err, productResults) => {
    if (err) return next(err);
    if (productResults.length === 0) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    const currentStock = productResults[0].stock;
    let stockUpdateSql;

    if (type === 'masuk') {
      // Barang Masuk: Stok bertambah
      stockUpdateSql = 'UPDATE products SET stock = stock + ? WHERE id = ?';
    } else { // type === 'keluar'
      // Barang Keluar: Cek ketersediaan stok
      if (currentStock < quantity) {
        return res.status(400).json({ message: `Stok tidak cukup. Stok tersedia: ${currentStock}` });
      }
      // Stok berkurang
      stockUpdateSql = 'UPDATE products SET stock = stock - ? WHERE id = ?';
    }

    // 2. Update Stok Produk
    db.query(stockUpdateSql, [quantity, product_id], (err) => {
      if (err) return next(err);

      // 3. Insert Transaksi
      const insertSql = 'INSERT INTO transactions (product_id, quantity, type, user_id) VALUES (?, ?, ?, ?)';
      db.query(insertSql, [product_id, quantity, type, userId], (err, result) => {
        if (err) return next(err);

        res.status(201).json({
          message: 'Transaksi dan update stok berhasil',
          transactionId: result.insertId,
        });
      });
    });
  });
};

// Fungsi deleteTransaction
exports.deleteTransaction = (req, res, next) => {
  // Catatan: Fungsi ini hanya menghapus transaksi, tidak mengembalikan stok
  // Jika Anda ingin mengembalikan stok, logika ini perlu diubah menjadi sangat kompleks (undo stock update)
  db.query(
    'DELETE FROM transactions WHERE id=?',
    [req.params.id],
    (err) => {
      if (err) return next(err);
      res.json({ message: 'Transaksi berhasil dihapus' });
    }
  );
};