const db = require("../config/db");

exports.createTransaction = async (req, res) => {
  const { product_id, quantity } = req.body;

  const [[product]] = await db.query(
    "SELECT price FROM products WHERE id=?",
    [product_id]
  );

  const total = product.price * quantity;

  await db.query(
    "INSERT INTO transactions VALUES (NULL,?,?,?,?,NOW())",
    [req.user.id, product_id, quantity, total]
  );

  res.json({ message: "Transaction success" });
};