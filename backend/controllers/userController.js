const db = require('../config/db');
const bcrypt = require('bcryptjs');

/**
 * ADMIN ONLY - Melihat semua user (admin & pegawai) dengan Filtering & Pagination
 */
exports.getAllUsers = (req, res) => {
    const search = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const sortBy = req.query.sort_by || 'id';
    const order = (req.query.order || 'ASC').toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const offset = (page - 1) * limit;

    // 2. Query pertama: Hitung total data untuk keperluan pagination di Frontend
    const countSql = `
        SELECT COUNT(*) as total 
        FROM users u 
        JOIN roles r ON u.role_id = r.id 
        WHERE u.name LIKE ? OR u.email LIKE ?`;
    db.query(countSql, [`%${search}%`, `%${search}%`], (err, countResult) => {
        if (err) return res.status(500).json({ message: err.message });
        const totalItems = countResult[0].total;
        const totalPages = Math.ceil(totalItems / limit);

        // 3. Query kedua: Ambil data spesifik sesuai halaman, pencarian, dan sorting
        const allowedSorts = ['id', 'name', 'email', 'role'];
        const sortColumn = allowedSorts.includes(sortBy) ? sortBy : 'id';
        const sql = `
            SELECT u.id, u.name, u.email, r.name AS role 
            FROM users u 
            JOIN roles r ON u.role_id = r.id 
            WHERE u.name LIKE ? OR u.email LIKE ? 
            ORDER BY u.${sortColumn} ${order} 
            LIMIT ? OFFSET ?`;
        db.query(sql, [`%${search}%`, `%${search}%`, limit, offset], (err, results) => {
            if (err) return res.status(500).json({ message: err.message });
            res.json({
                data: results,
                pagination: {
                    totalItems,
                    totalPages,
                    currentPage: page,
                    itemsPerPage: limit
                }
            });
        });
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
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (req.user.id !== userId) {
    return res.status(403).json({
      message: 'Anda hanya boleh mengedit profil sendiri'
    });
  }

  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Nama dan email harus diisi' });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Format email tidak valid' });
  }

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
  const { id } = req.params; // Lebih singkat
  const { oldPassword, newPassword } = req.body;
  const userIdFromToken = req.user.id;

  // 1. Validasi Kepemilikan (Gunakan != agar fleksibel string/number)
  if (id != userIdFromToken) {
    return res.status(403).json({ message: 'Akses ditolak: Ini bukan akun Anda.' });
  }

  // 2. Validasi Input
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Data tidak lengkap.' });
  }

  // 3. Verifikasi Password Lama
  const sqlSelect = 'SELECT password FROM users WHERE id = ?';
  db.query(sqlSelect, [userIdFromToken], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error.' });
    if (results.length === 0) return res.status(404).json({ message: 'User tidak ditemukan.' });

    const user = results[0];
    const isMatch = bcrypt.compareSync(oldPassword, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Password lama tidak sesuai.' });
    }

    // 4. Update Password Baru
    const salt = 10;
    const hashed = bcrypt.hashSync(newPassword, salt);
    const sqlUpdate = 'UPDATE users SET password = ? WHERE id = ?';

    db.query(sqlUpdate, [hashed, userIdFromToken], (err, result) => {
      if (err) return res.status(500).json({ message: 'Gagal memperbarui password.' });
      
      // Berhasil
      return res.status(200).json({ message: 'Password berhasil diubah.' });
    });
  });
};