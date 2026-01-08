const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  await db.query("INSERT INTO users VALUES (NULL,?,?,?,?)", [
    name,
    email,
    hashed,
    "user",
  ]);
  res.json({ message: "Register success" });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await db.query("SELECT * FROM users WHERE email=?", [
    email,
  ]);

  if (!rows.length) return res.status(404).json({ message: "User not found" });

  const valid = await bcrypt.compare(password, rows[0].password);
  if (!valid) return res.status(401).json({ message: "Wrong password" });

  const token = jwt.sign(
    { id: rows[0].id, role: rows[0].role },
    process.env.JWT_SECRET
  );

  res.json({ token });
};