const db = require('../config/db');

exports.createProduct = (req, res) => {
  const { name, price, stock } = req.body;
  db.query(
    'INSERT INTO products VALUES (NULL,?,?,?)',
    [name, price, stock],
    () => res.json({ message: 'Product added' })
  );
};

exports.getProducts = (req, res) => {
  db.query('SELECT * FROM products', (e, r) => res.json(r));
};

exports.deleteProduct = (req, res) => {
  db.query('DELETE FROM products WHERE id=?', [req.params.id],
    () => res.json({ message: 'Product deleted' })
  );
};