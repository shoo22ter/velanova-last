-- ============================================================
--  Velanova – Cart Items Table Migration
--  Run this manually in your MySQL client (e.g. phpMyAdmin,
--  MySQL Workbench, or the CLI: mysql -u root -p velanova_db < cart_migration.sql)
-- ============================================================

USE velanova_db;

-- Create the cart_items table
-- Each row represents one product variant in a specific user's cart.
-- cart_key is a composite string like "productId__selectedSize" that
-- uniquely identifies a line in the cart for a given user.

CREATE TABLE IF NOT EXISTS cart_items (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT            NOT NULL,
  product_id    INT            NOT NULL,
  product_name  VARCHAR(200)   NOT NULL,
  product_image LONGTEXT,
  price         DECIMAL(10,2)  NOT NULL,
  quantity      INT            NOT NULL DEFAULT 1,
  selected_size VARCHAR(40)    DEFAULT NULL,
  cart_key      VARCHAR(191)   NOT NULL,
  created_at    TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Enforce one cart_key per user (upsert logic depends on this)
  UNIQUE KEY unique_cart_key_user (user_id, cart_key),

  INDEX idx_cart_user (user_id),

  CONSTRAINT fk_cart_items_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
