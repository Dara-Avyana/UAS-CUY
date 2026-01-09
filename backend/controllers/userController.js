const db = require('../config/db');

const getAllUsers = (req, res) => {
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

const updateProfile = (req, res) => {
  if (req.user.id != req.params.id)
    return res.status(403).json({ message: 'Forbidden' });

  db.query(
    'UPDATE users SET name=? WHERE id=?',
    [req.body.name, req.params.id],
    () => res.json({ message: 'Profile updated' })
  );
};

module.exports = {
  getAllUsers,
  updateProfile
};