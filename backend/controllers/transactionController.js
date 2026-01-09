const db = require('../config/db');

exports.createTransaction = (req, res) => {
  const { product_id, type, quantity } = req.body;

  const stockChange = type === 'IN' ? quantity : -quantity;

  db.query(
    'UPDATE products SET stock = stock + ? WHERE id=?',
    [stockChange, product_id]
  );

  db.query(
    'INSERT INTO transactions VALUES (NULL,?,?,?,?,NOW())',
    [product_id, req.user.id, type, quantity],
    () => res.json({ message: 'Transaction saved' })
  );
};

exports.getTransactions = (req, res) => {
  db.query('SELECT * FROM transactions', (e, r) => res.json(r));
};

exports.deleteTransaction = (req, res) => {
  db.query(
    'DELETE FROM transactions WHERE id=?',
    [req.params.id],
    () => res.json({ message: 'Transaction deleted' })
  );
};