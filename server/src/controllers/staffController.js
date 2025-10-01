const Order = require('../models/Order');

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ assignedStaff: req.user._id })
      .populate('customer', 'name email phone')
      .populate('restaurant', 'name address phone')
      .populate('items.menuItem', 'name price')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOne({
      _id: req.params.id,
      assignedStaff: req.user._id
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found or not assigned to you' });
    }

    order.status = status;
    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate('customer', 'name email phone')
      .populate('restaurant', 'name')
      .populate('items.menuItem', 'name price');

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      assignedStaff: req.user._id
    })
      .populate('customer', 'name email phone')
      .populate('restaurant', 'name address phone')
      .populate('items.menuItem', 'name price image');

    if (!order) {
      return res.status(404).json({ message: 'Order not found or not assigned to you' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
