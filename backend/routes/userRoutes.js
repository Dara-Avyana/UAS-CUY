const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");
const c = require("../controllers/userController");

router.get("/", auth, role("admin"), c.getUsers);

module.exports = router;