const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const c = require("../controllers/transactionController");

router.post("/", auth, c.createTransaction);

module.exports = router;