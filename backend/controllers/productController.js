const db = require('../config/db');

// Fungsi Create Product
exports.createProduct = (req, res, next) => {
    const { name, price, stock } = req.body;
    const sql = 'INSERT INTO products (name, price, stock) VALUES (?,?,?)';
    db.query(sql, [name, price, stock], (err, result) => {
        if (err) return next(err);
        res.status(201).json({ message: 'Product added', id: result.insertId });
    });
};

// Fungsi Get Products (Searching & Pagination)
exports.getProducts = (req, res, next) => {
    const search = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const offset = (page - 1) * limit;
    
    // Fitur Searching: Menggunakan LIKE %nama%
    const countSql = "SELECT COUNT(*) as total FROM products WHERE name LIKE ?";
    
    db.query(countSql, [`%${search}%`], (err, countResult) => {
        if (err) return next(err);

        const totalItems = countResult[0].total;
        const totalPages = Math.ceil(totalItems / limit);

        // Query Utama dengan limit dan offset untuk pagination
        const sql = `SELECT * FROM products WHERE name LIKE ? ORDER BY id DESC LIMIT ? OFFSET ?`;
        
        db.query(sql, [`%${search}%`, limit, offset], (err, results) => {
            if (err) return next(err);
            res.json({
                data: results,
                pagination: { totalItems, totalPages, currentPage: page }
            });
        });
    });
};

// Fungsi Delete Product
exports.deleteProduct = (req, res, next) => {
    db.query('DELETE FROM products WHERE id=?', [req.params.id], (err) => {
        if (err) return next(err);
        res.json({ message: 'Product deleted' });
    });
};