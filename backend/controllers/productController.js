const db = require('../config/db');

exports.createProduct = (req, res, next) => { // Tambahkan 'next'
  const { name, price, stock } = req.body;
  db.query(
    'INSERT INTO products VALUES (NULL,?,?,?)',
    [name, price, stock],
    (err, result) => { // Tambahkan callback
      if (err) return next(err); // Tangani error
      res.json({ message: 'Product added', id: result.insertId });
    }
  );
};

exports.getProducts = (req, res, next) => { // Tambahkan 'next'
  db.query('SELECT * FROM products', (err, results) => { // Gunakan nama variabel yang jelas
    if (err) return next(err); // Tangani error
    res.json(results);
  });
};

exports.deleteProduct = (req, res, next) => { // Tambahkan 'next'
  db.query(
    'DELETE FROM products WHERE id=?',
    [req.params.id],
    (err) => { // Tambahkan callback
      if (err) return next(err); // Tangani error
      res.json({ message: 'Product deleted' });
    }
  );
};