// controllers/productController.js (MODIFIED)
const db = require('../config/db');

exports.createProduct = (req, res, next) => {
    const { name, price, stock } = req.body;
    db.query(
        'INSERT INTO products (name, price, stock) VALUES (?,?,?)', // Tambahkan nama kolom agar lebih eksplisit
        [name, price, stock],
        (err, result) => {
            if (err) return next(err);
            res.json({ message: 'Product added', id: result.insertId });
        }
    );
};

exports.getProducts = (req, res, next) => {
    const { search } = req.query; // Ambil query string 'search'
    let sql = 'SELECT * FROM products';
    let params = [];
    
    // Jika ada kata kunci pencarian, tambahkan klausa WHERE
    if (search) {
      sql += ' WHERE name LIKE ?';
      params.push(`%${search}%`); // Mencari produk yang mengandung kata kunci
    }

    db.query(sql, params, (err, results) => {
        if (err) return next(err);
        res.json(results);
    });
};

exports.deleteProduct = (req, res, next) => {
    db.query(
        'DELETE FROM products WHERE id=?',
        [req.params.id],
        (err) => {
            if (err) return next(err);
            res.json({ message: 'Product deleted' });
        }
    );
};