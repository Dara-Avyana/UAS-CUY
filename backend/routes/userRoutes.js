const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const userController = require('../controllers/userController');

router.get(
  '/',
  auth,
  role('admin'),
  userController.getAllUsers
);

router.put(
  '/:id',
  auth,
  userController.updateProfile
);

module.exports = router;