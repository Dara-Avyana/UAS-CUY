const db = require('../config/db');
const bcrypt = require('bcryptjs');

/**
 * ADMIN ONLY
 * Melihat semua pegawai
 */
exports.getAllEmployees = (req, res) => {
  const sql = `
    SELECT users.id, users.name, users.email, roles.name AS role
    FROM users
    JOIN roles ON users.role_id = roles.id
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};


// Helper untuk kirim error agar tidak ngetik berulang
const sendError = (res, err) => res.status(500).json({ message: "Database Error", error: err.message });

/**
 * ADMIN ONLY - Melihat semua pegawai
 */
exports.getAllEmployees = (req, res) => {
    const sql = `SELECT u.id, u.name, u.email, r.name AS role 
                 FROM users u JOIN roles r ON u.role_id = r.id 
                 WHERE r.name = 'pegawai'`;
    
    db.query(sql, (err, results) => {
        if (err) return sendError(res, err);
        res.json(results);
    });
};

/**
 * USER ONLY - Melihat profil sendiri (Versi Ringkas)
 */
exports.getMe = (req, res) => {
    const sql = `SELECT u.id, u.name, u.email, r.name AS role_name 
                 FROM users u JOIN roles r ON u.role_id = r.id 
                 WHERE u.id = ?`;

    db.query(sql, [req.user.id], (err, results) => {
        if (err) return sendError(res, err);
        if (!results.length) return res.status(404).json({ message: "User not found" });
        res.json(results[0]);
    });
};


/**
 * OWNER ONLY
 * Edit profil (nama & email)
 */
exports.updateProfile = (req, res) => {
  const userId = parseInt(req.params.id);

  if (req.user.id !== userId) {
    return res.status(403).json({
      message: 'Anda hanya boleh mengedit profil sendiri'
    });
  }

  const { name, email } = req.body;

  db.query(
    'UPDATE users SET name=?, email=? WHERE id=?',
    [name, email, userId],
    () => res.json({ message: 'Profil berhasil diperbarui' })
  );
};

/**
 * OWNER ONLY
 * Ganti password
 */
exports.updatePassword = (req, res) => {
  const userId = parseInt(req.params.id);

  if (req.user.id !== userId) {
    return res.status(403).json({
      message: 'Anda hanya boleh mengubah password sendiri'
    });
  }

  const hashed = bcrypt.hashSync(req.body.password, 10);

  db.query(
    'UPDATE users SET password=? WHERE id=?',
    [hashed, userId],
    () => res.json({ message: 'Password berhasil diperbarui' })
  );
};