<?php

require_once __DIR__ . '/../_init.php';

require_method('POST');

require_admin($pdo);

$defaults = [
    [
        'name' => 'Golden Glow Serum',
        'category' => 'Skin',
        'price' => 39.99,
        'sale_price' => 34.99,
        'stock' => 50,
        'stock_alert_level' => 5,
        'description' => 'Brightening serum for daily use.',
        'image_url' => 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
        'is_new' => 1,
        'is_on_sale' => 1,
    ],
    [
        'name' => 'Silk Body Lotion',
        'category' => 'Body',
        'price' => 24.5,
        'sale_price' => null,
        'stock' => 80,
        'stock_alert_level' => 5,
        'description' => 'Hydrating lotion for smooth skin.',
        'image_url' => 'https://images.unsplash.com/photo-1608248593842-8804c7eb3cc3?auto=format&fit=crop&w=600&q=80',
        'is_new' => 0,
        'is_on_sale' => 0,
    ],
    [
        'name' => 'Botanical Hair Oil',
        'category' => 'Hair',
        'price' => 29.0,
        'sale_price' => 25.0,
        'stock' => 40,
        'stock_alert_level' => 5,
        'description' => 'Nourishing scalp and hair oil.',
        'image_url' => 'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=600&q=80',
        'is_new' => 1,
        'is_on_sale' => 1,
    ],
];

$pdo->beginTransaction();
$pdo->exec('DELETE FROM products');

$insert = $pdo->prepare('INSERT INTO products (name, category, price, sale_price, stock, stock_alert_level, description, image_url, is_new, is_on_sale, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())');

foreach ($defaults as $product) {
    $insert->execute([
        $product['name'],
        $product['category'],
        $product['price'],
        $product['sale_price'],
        $product['stock'],
        $product['stock_alert_level'],
        $product['description'],
        $product['image_url'],
        $product['is_new'],
        $product['is_on_sale'],
    ]);
}

$pdo->commit();

$stmt = $pdo->query('SELECT * FROM products ORDER BY created_at DESC');
$rows = $stmt->fetchAll();
$products = array_map('format_product', $rows);

json_response(['products' => $products]);
