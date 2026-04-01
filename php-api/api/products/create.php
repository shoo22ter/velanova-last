<?php

require_once __DIR__ . '/../_init.php';

require_method('POST');

require_admin($pdo);

$input = get_json_body();

$name = trim((string) ($input['name'] ?? ''));
$category = trim((string) ($input['category'] ?? ''));
$description = trim((string) ($input['description'] ?? ''));
$image = trim((string) ($input['image'] ?? ''));
$price = isset($input['price']) ? (float) $input['price'] : 0;
$salePrice = $input['salePrice'] ?? null;
$stock = isset($input['stock']) ? (int) $input['stock'] : 0;
$stockAlertLevel = isset($input['stockAlertLevel']) ? (int) $input['stockAlertLevel'] : 5;
$isNew = !empty($input['isNew']) ? 1 : 0;
$isOnSale = !empty($input['isOnSale']) ? 1 : 0;

if ($name === '' || $category === '' || $description === '' || $image === '') {
    json_response(['error' => 'Name, category, description, and image are required.'], 422);
}

if ($price <= 0) {
    json_response(['error' => 'Price must be greater than zero.'], 422);
}

$saleValue = null;
if ($salePrice !== null && $salePrice !== '') {
    $saleValue = (float) $salePrice;
    if ($saleValue >= $price) {
        json_response(['error' => 'Sale price must be less than price.'], 422);
    }
}

$stmt = $pdo->prepare('INSERT INTO products (name, category, price, sale_price, stock, stock_alert_level, description, image_url, is_new, is_on_sale, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())');
$stmt->execute([
    $name,
    $category,
    $price,
    $saleValue,
    $stock,
    $stockAlertLevel,
    $description,
    $image,
    $isNew,
    $isOnSale,
]);

$productId = (int) $pdo->lastInsertId();
$productStmt = $pdo->prepare('SELECT * FROM products WHERE id = ?');
$productStmt->execute([$productId]);
$product = $productStmt->fetch();

json_response(['product' => format_product($product)], 201);
