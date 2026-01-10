// routes/transactionRoutes.js 
const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware"); 
const c = require("../controllers/transactionController");

// POST hanya untuk Admin (berdasarkan permintaan "staff tidak bisa send method pos kecuali admin")
router.post("/", auth, role('admin'), c.createTransaction); 

// GET bisa diakses oleh Admin atau Pegawai
router.get("/", auth, c.getTransactions);

// DELETE hanya untuk Admin
router.delete("/:id", auth, role('admin'), c.deleteTransaction); 

module.exports = router;