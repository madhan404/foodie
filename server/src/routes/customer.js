const express = require('express');
const router = express.Router();
const {
  getAllRestaurants,
  getRestaurantById,
  getRestaurantMenu,
  getAllCategories,
  getMenuItemsByCategory,
  searchMenuItems,
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder
} = require('../controllers/customerController');
const { auth } = require('../middleware/auth');

router.get('/restaurants', getAllRestaurants);
router.get('/restaurants/:id', getRestaurantById);
router.get('/restaurants/:id/menu', getRestaurantMenu);

router.get('/categories', getAllCategories);
router.get('/categories/:categoryId/items', getMenuItemsByCategory);

router.get('/menu-items/search', searchMenuItems);

router.use(auth);

router.post('/orders', createOrder);
router.get('/orders', getMyOrders);
router.get('/orders/:id', getOrderById);
router.patch('/orders/:id/cancel', cancelOrder);

module.exports = router;
