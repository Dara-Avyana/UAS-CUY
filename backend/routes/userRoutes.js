const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const userController = require('../controllers/userController');

/**
 * ADMIN ONLY
 * Lihat semua user (admin & pegawai)
 */
router.get(
  '/all',
  auth,
  role('admin'),
  userController.getAllUsers
);

router.get(
  '/me',
  auth,
  userController.getMe
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