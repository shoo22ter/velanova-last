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

CREATE TABLE IF NOT EXISTS banners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  subtitle VARCHAR(180) DEFAULT '',
  image_url TEXT NOT NULL,
  cta_label VARCHAR(80) DEFAULT '',
  cta_link VARCHAR(255) DEFAULT '',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  role VARCHAR(120) DEFAULT '',
  quote TEXT NOT NULL,
  avatar_url TEXT,
  rating INT NOT NULL DEFAULT 5,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS faqs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question VARCHAR(255) NOT NULL,
  answer TEXT NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_settings (
  id INT PRIMARY KEY,
  support_email VARCHAR(190) DEFAULT '',
  support_phone VARCHAR(40) DEFAULT '',
  address_line1 VARCHAR(190) DEFAULT '',
  address_line2 VARCHAR(190) DEFAULT '',
  city VARCHAR(80) DEFAULT '',
  region VARCHAR(80) DEFAULT '',
  country VARCHAR(80) DEFAULT '',
  hours_weekday VARCHAR(120) DEFAULT '',
  hours_saturday VARCHAR(120) DEFAULT '',
  hours_sunday VARCHAR(120) DEFAULT '',
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

-- Optional starter banners
INSERT INTO banners (title, subtitle, image_url, cta_label, cta_link, is_active, sort_order)
VALUES
('Discover Your Radiant Skin', 'Premium Care for Your Body & Hair', 'https://images.unsplash.com/photo-1615397323136-23bca4621eb3?auto=format&fit=crop&w=1600&q=80', 'Shop collection', '/shop', 1, 1),
('The Velvet Collection', 'Embrace the Luxury of Nature', 'https://images.unsplash.com/photo-1556229010-aa3f7ff66b24?auto=format&fit=crop&w=1600&q=80', 'Discover Velanova', '/about', 1, 2)
ON DUPLICATE KEY UPDATE title = title;

-- Optional starter testimonials
INSERT INTO testimonials (name, role, quote, avatar_url, rating, is_active, sort_order)
VALUES
('Lea Haddad', 'Skincare Enthusiast', 'My skin feels brighter and more hydrated within a week. The textures feel truly premium.', 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=300&q=80', 5, 1, 1),
('Rami Saad', 'Salon Owner', 'Velanova has become our top recommendation. The formulas feel luxurious yet gentle.', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80', 5, 1, 2),
('Maya Youssef', 'Beauty Editor', 'Elegant packaging, excellent results, and a brand story that feels authentic.', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80', 5, 1, 3)
ON DUPLICATE KEY UPDATE name = name;

-- Optional starter FAQs
INSERT INTO faqs (question, answer, is_active, sort_order)
VALUES
('Are the products suitable for sensitive skin?', 'Yes. Our formulas are designed to be gentle and are suitable for most sensitive skin types.', 1, 1),
('Do you test on animals?', 'Never. Velanova is cruelty-free and does not test on animals.', 1, 2),
('How long does shipping take?', 'Orders typically ship within 1-3 business days. Delivery times vary by location.', 1, 3)
ON DUPLICATE KEY UPDATE question = question;

-- Default site settings
INSERT INTO site_settings (id, support_email, support_phone, address_line1, city, country, hours_weekday, hours_saturday, hours_sunday)
VALUES (1, 'support@velanova.com', '81541606', 'Beirut, Lebanon', 'Beirut', 'Middle East', 'Monday - Friday: 9:00 AM - 6:00 PM', 'Saturday: 10:00 AM - 4:00 PM', 'Sunday: Closed')
ON DUPLICATE KEY UPDATE id = id;

-- Optional starter products
INSERT INTO products (name, category, price, sale_price, stock, stock_alert_level, description, image_url, is_new, is_on_sale)
VALUES
('Golden Glow Serum', 'Skin', 39.99, 34.99, 50, 5, 'Brightening serum for daily use.', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80', 1, 1),
('Silk Body Lotion', 'Body', 24.50, NULL, 80, 5, 'Hydrating lotion for smooth skin.', 'https://images.unsplash.com/photo-1608248593842-8804c7eb3cc3?auto=format&fit=crop&w=600&q=80', 0, 0),
('Botanical Hair Oil', 'Hair', 29.00, 25.00, 40, 5, 'Nourishing scalp and hair oil.', 'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=600&q=80', 1, 1)
ON DUPLICATE KEY UPDATE name = name;
