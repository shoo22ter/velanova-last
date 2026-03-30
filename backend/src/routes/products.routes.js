const express = require('express');
const pool = require('../db');
const { authRequired, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, category, price, sale_price AS salePrice, stock, description, image_url AS image, is_new AS isNew, is_on_sale AS isOnSale, created_at AS createdAt FROM products ORDER BY id DESC'
    );
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
});

router.post('/', authRequired, adminOnly, async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      salePrice = null,
      stock = 0,
      description = '',
      image = '',
      isNew = false,
      isOnSale = false,
    } = req.body;

    if (!name || !category || price === undefined || price === null) {
      return res.status(400).json({ message: 'name, category, and price are required' });
    }

    const [result] = await pool.query(
      `INSERT INTO products (name, category, price, sale_price, stock, description, image_url, is_new, is_on_sale)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, category, Number(price), salePrice !== null && salePrice !== '' ? Number(salePrice) : null, Number(stock), description, image, Boolean(isNew), Boolean(isOnSale)]
    );

    return res.status(201).json({ id: result.insertId, message: 'Product created' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
});

router.put('/:id', authRequired, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      category,
      price,
      salePrice = null,
      stock = 0,
      description = '',
      image = '',
      isNew = false,
      isOnSale = false,
    } = req.body;

    const [result] = await pool.query(
      `UPDATE products
       SET name = ?, category = ?, price = ?, sale_price = ?, stock = ?, description = ?, image_url = ?, is_new = ?, is_on_sale = ?
       WHERE id = ?`,
      [name, category, Number(price), salePrice !== null && salePrice !== '' ? Number(salePrice) : null, Number(stock), description, image, Boolean(isNew), Boolean(isOnSale), Number(id)]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json({ message: 'Product updated' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
});

router.delete('/:id', authRequired, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [Number(id)]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json({ message: 'Product deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
});

module.exports = router;
