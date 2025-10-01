const express = require('express');
const router = express.Router();
const {
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  createCategory,
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
  getAllOrders,
  assignOrderToStaff,
  getStaffList
} = require('../controllers/adminController');
const { auth, authorize } = require('../middleware/auth');

router.use(auth);
router.use(authorize('admin'));

router.post('/restaurants', createRestaurant);
router.put('/restaurants/:id', updateRestaurant);
router.delete('/restaurants/:id', deleteRestaurant);

router.post('/menu-items', createMenuItem);
router.put('/menu-items/:id', updateMenuItem);
router.delete('/menu-items/:id', deleteMenuItem);

router.post('/categories', createCategory);

router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.patch('/users/:id/toggle-status', toggleUserStatus);

router.get('/orders', getAllOrders);
router.patch('/orders/:id/assign', assignOrderToStaff);

router.get('/staff', getStaffList);

module.exports = router;
