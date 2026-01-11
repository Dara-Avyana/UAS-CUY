const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Fungsi pembantu untuk validasi email agar tidak diulang-ulang
const isValidEmail = (email) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

exports.register = (req, res) => {
  const { name, email, password, keyword } = req.body;

  if (!isValidEmail(email)) return res.status(400).json({ message: "Format email tidak valid!" });

  const roleTarget = keyword === "ADMINT" ? 'admin' : (keyword === "SETAFF" ? 'pegawai' : null);
  if (!roleTarget) return res.status(400).json({ message: "Keyword salah!" });

  db.query("SELECT id FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Database Error", error: err });
    if (results.length > 0) return res.status(400).json({ message: "Email sudah terdaftar!" });

    db.query("SELECT id FROM roles WHERE name = ?", [roleTarget], (err, roles) => {
      if (err || roles.length === 0) return res.status(500).json({ message: "Role tidak ditemukan" });

      const roleId = roles[0].id;
      const hashedPassword = bcrypt.hashSync(password, 10); // Gunakan hashSync agar konsisten dengan login

      const sql = "INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)";
      db.query(sql, [name, email, hashedPassword, roleId], (err, result) => {
        if (err) return res.status(500).json({ message: "Gagal menyimpan data" });
        res.status(201).json({ success: true, message: "Registrasi Berhasil!" });
      });
    });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!isValidEmail(email)) return res.status(400).json({ message: "Format email tidak valid!" });

  const sql = `SELECT users.id, users.name, users.password, roles.name AS role 
               FROM users JOIN roles ON users.role_id = roles.id WHERE email = ?`;

  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    if (results.length === 0) return res.status(401).json({ message: 'Email tidak ditemukan' });

    const user = results[0];
    if (!bcrypt.compareSync(password, user.password)) return res.status(401).json({ message: 'Password salah' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ message: 'Login berhasil', token, user: { id: user.id, name: user.name, role: user.role } });
  });
};