const express = require('express');
const router = express.Router();
const {
  getMyOrders,
  updateOrderStatus,
  getOrderDetails
} = require('../controllers/staffController');
const { auth, authorize } = require('../middleware/auth');

router.use(auth);
router.use(authorize('staff'));

router.get('/orders', getMyOrders);
router.get('/orders/:id', getOrderDetails);
router.patch('/orders/:id/status', updateOrderStatus);

module.exports = router;
