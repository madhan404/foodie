const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const Category = require('../models/Category');
const Order = require('../models/Order');

exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ isActive: true });
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant || !restaurant.isActive) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRestaurantMenu = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({
      restaurant: req.params.id,
      isAvailable: true
    }).populate('category');

    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMenuItemsByCategory = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({
      category: req.params.categoryId,
      isAvailable: true
    }).populate('restaurant').populate('category');

    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchMenuItems = async (req, res) => {
  try {
    const { q } = req.query;
    const menuItems = await MenuItem.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ],
      isAvailable: true
    }).populate('restaurant').populate('category');

    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { items, restaurant, deliveryAddress, notes } = req.body;

    let totalAmount = 0;
    const orderItems = items.map(item => {
      totalAmount += item.price * item.quantity;
      return {
        menuItem: item.menuItem,
        quantity: item.quantity,
        price: item.price
      };
    });

    const order = await Order.create({
      customer: req.user._id,
      items: orderItems,
      restaurant,
      totalAmount,
      deliveryAddress,
      notes,
      paymentMethod: 'cash_on_delivery'
    });

    const populatedOrder = await Order.findById(order._id)
      .populate('restaurant', 'name')
      .populate('items.menuItem', 'name price image');

    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate('restaurant', 'name image')
      .populate('items.menuItem', 'name price image')
      .populate('assignedStaff', 'name phone')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      customer: req.user._id
    })
      .populate('restaurant', 'name address phone')
      .populate('items.menuItem', 'name price image')
      .populate('assignedStaff', 'name phone');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      customer: req.user._id
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot cancel order that is already being processed' });
    }

    order.status = 'cancelled';
    await order.save();

    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
