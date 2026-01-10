const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = (req, res) => {
  const { name, email, password, keyword } = req.body;

  // 1. Tentukan role berdasarkan keyword
  let roleTarget = keyword === "ADMINT" ? 'admin' : (keyword === "SETAFF" ? 'pegawai' : null);

  if (!roleTarget) {
    return res.status(400).json({ message: "Keyword salah!" });
  }

  // Cek apakah email sudah terdaftar
  db.query("SELECT id FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Database Error", error: err });

    if (results.length > 0) {
      return res.status(400).json({ message: "Email sudah terdaftar! Silakan gunakan email lain." });
    }

    // 2. Cari Role ID
    db.query("SELECT id FROM roles WHERE name = ?", [roleTarget], (err, roles) => {
      if (err) return res.status(500).json({ message: "Database Error", error: err });
      if (roles.length === 0) return res.status(500).json({ message: "Role tidak ditemukan" });

      const roleId = roles[0].id;

      // 3. Hash Password
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return res.status(500).json({ message: "Bcrypt Error" });

        // 4. Simpan User
        const sql = "INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)";
        db.query(sql, [name, email, hashedPassword, roleId], (err, result) => {
          if (err) {
            // Jika masih error di sini, berarti ada masalah server/db lain
            return res.status(500).json({ message: "Gagal menyimpan data ke database" });
          }
          
          //5.Berhasil
          res.status(201).json({
            success: true,
            message: "Registrasi Berhasil!",
            userId: result.insertId
          });
        });
      });
    });
  });
};

  exports.login = (req, res) => {
    const { email, password } = req.body;

    const sql = `
    SELECT users.id, users.name, users.password, roles.name AS role
    FROM users
    JOIN roles ON users.role_id = roles.id
    WHERE email = ?
  `;

    db.query(sql, [email], (err, results) => {
      if (err) return res.status(500).json({ message: err.message });
      if (results.length === 0)
        return res.status(401).json({ message: 'Email tidak ditemukan' });

      const user = results[0];
      const validPassword = bcrypt.compareSync(password, user.password);

      if (!validPassword)
        return res.status(401).json({ message: 'Password salah' });

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.json({
        message: 'Login berhasil',
        token,
        user: {
          id: user.id,
          name: user.name,
          role: user.role
        }
      });
    });
  };