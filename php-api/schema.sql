CREATE DATABASE IF NOT EXISTS velanova_db;
USE velanova_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(40) DEFAULT '',
  role ENUM('admin', 'customer') NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token_hash CHAR(64) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL,
  INDEX idx_sessions_token (token_hash),
  INDEX idx_sessions_user (user_id),
  CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2) NULL,
  stock INT NOT NULL DEFAULT 0,
  stock_alert_level INT NOT NULL DEFAULT 5,
  description TEXT,
  image_url TEXT,
  is_new TINYINT(1) NOT NULL DEFAULT 0,
  is_on_sale TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  public_id VARCHAR(50) NOT NULL UNIQUE,
  user_id INT NOT NULL,
  status ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled') NOT NULL DEFAULT 'Pending',
  payment_method VARCHAR(80) NOT NULL,
  sub_total DECIMAL(10,2) NOT NULL DEFAULT 0,
  delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  customer_first_name VARCHAR(80) NOT NULL,
  customer_last_name VARCHAR(80) NOT NULL,
  customer_email VARCHAR(190) DEFAULT '',
  customer_phone VARCHAR(40) NOT NULL,
  customer_address TEXT NOT NULL,
  customer_city VARCHAR(80) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_orders_user (user_id),
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  product_name VARCHAR(200) NOT NULL,
  product_image TEXT,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  selected_size VARCHAR(40) DEFAULT NULL,
  INDEX idx_order_items_order (order_id),
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Seed admin user (email: admin@velanova.local, password: Admin123!)
INSERT INTO users (full_name, email, password_hash, phone, role)
VALUES ('Velanova Admin', 'admin@velanova.local', '$2y$10$GTsH5a15CJPAalAiUzhYuOcECRIZCsq4Z6z0/cA0GxuMfBnzLr9L2', '', 'admin')
ON DUPLICATE KEY UPDATE email = email;

-- Optional starter products
INSERT INTO products (name, category, price, sale_price, stock, stock_alert_level, description, image_url, is_new, is_on_sale)
VALUES
('Golden Glow Serum', 'Skin', 39.99, 34.99, 50, 5, 'Brightening serum for daily use.', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80', 1, 1),
('Silk Body Lotion', 'Body', 24.50, NULL, 80, 5, 'Hydrating lotion for smooth skin.', 'https://images.unsplash.com/photo-1608248593842-8804c7eb3cc3?auto=format&fit=crop&w=600&q=80', 0, 0),
('Botanical Hair Oil', 'Hair', 29.00, 25.00, 40, 5, 'Nourishing scalp and hair oil.', 'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=600&q=80', 1, 1)
ON DUPLICATE KEY UPDATE name = name;
