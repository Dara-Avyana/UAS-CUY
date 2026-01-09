const db = require('../config/db');

exports.getTransactions = (req, res) => {
  db.query('SELECT * FROM transactions', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.createTransaction = (req, res) => {
  const { product_id, quantity, type } = req.body;

  db.query(
    'INSERT INTO transactions (product_id, quantity, type, user_id) VALUES (?, ?, ?, ?)',
    [product_id, quantity, type, req.user.id],
    () => res.json({ message: 'Transaksi berhasil ditambahkan' })
  );
};

exports.deleteTransaction = (req, res) => {
  db.query(
    'DELETE FROM transactions WHERE id=?',
    [req.params.id],
    () => res.json({ message: 'Transaksi berhasil dihapus' })
  );
};