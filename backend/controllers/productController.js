const db = require("../config/db");

exports.createProduct = async (req, res) => {
  const { name, price, stock } = req.body;
  await db.query("INSERT INTO products VALUES (NULL,?,?,?)", [
    name,
    price,
    stock,
  ]);
  res.json({ message: "Product added" });
};

exports.getProducts = async (req, res) => {
  const [data] = await db.query("SELECT * FROM products");
  res.json(data);
};