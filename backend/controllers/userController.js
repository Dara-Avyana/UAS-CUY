const db = require("../config/db");

exports.getUsers = async (req, res) => {
  const [users] = await db.query("SELECT id,name,email,role FROM users");
  res.json(users);
};