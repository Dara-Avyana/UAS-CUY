const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const userController = require('../controllers/userController');

/**
 * ADMIN ONLY
 * Lihat semua pegawai
 */
router.get(
  '/employees',
  auth,
  role('admin'),
  userController.getAllEmployees
);

/**
 * OWNER ONLY
 * Edit profil
 */
router.put(
  '/:id/profile',
  auth,
  userController.updateProfile
);

/**
 * OWNER ONLY
 * Edit password
 */
router.put(
  '/:id/password',
  auth,
  userController.updatePassword
);

module.exports = router;