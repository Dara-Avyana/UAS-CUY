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
    WHERE roles.name = 'pegawai'
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
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