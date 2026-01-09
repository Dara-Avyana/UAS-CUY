const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = (req, res) => {
  const { name, email, password, role_id } = req.body;

  if (!name || !email || !password || !role_id) {
    return res.status(400).json({ message: 'Data tidak lengkap' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const sql = `
    INSERT INTO users (name, email, password, role_id)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [name, email, hashedPassword, role_id], (err) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: 'Register berhasil' });
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