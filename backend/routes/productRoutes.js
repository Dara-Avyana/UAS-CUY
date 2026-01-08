const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");
const c = require("../controllers/productController");

router.post("/", auth, role("admin"), c.createProduct);
router.get("/", c.getProducts);

module.exports = router;