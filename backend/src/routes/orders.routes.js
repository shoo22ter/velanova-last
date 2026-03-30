const express = require('express');
const pool = require('../db');
const { authRequired, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.post('/', authRequired, async (req, res) => {
  try {
    const { items = [], totalAmount = 0, shippingAddress = '' } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order items are required' });
    }

    const [orderResult] = await pool.query(
      'INSERT INTO orders (user_id, total_amount, shipping_address) VALUES (?, ?, ?)',
      [req.user.id, Number(totalAmount), shippingAddress]
    );

    const orderId = orderResult.insertId;

    for (const item of items) {
      await pool.query(
        'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
        [orderId, Number(item.productId), Number(item.quantity), Number(item.unitPrice)]
      );
    }

    return res.status(201).json({ id: orderId, message: 'Order placed' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to place order', error: error.message });
  }
});

router.get('/mine', authRequired, async (req, res) => {
  try {
    const [orders] = await pool.query(
      'SELECT id, total_amount AS totalAmount, shipping_address AS shippingAddress, status, created_at AS createdAt FROM orders WHERE user_id = ? ORDER BY id DESC',
      [req.user.id]
    );
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

router.get('/', authRequired, adminOnly, async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT o.id, o.user_id AS userId, u.email, o.total_amount AS totalAmount, o.shipping_address AS shippingAddress, o.status, o.created_at AS createdAt
       FROM orders o
       JOIN users u ON u.id = o.user_id
       ORDER BY o.id DESC`
    );
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch all orders', error: error.message });
  }
});

module.exports = router;
