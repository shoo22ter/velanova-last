<?php

require_once __DIR__ . '/../_init.php';

require_method('POST');

require_admin($pdo);

$input = get_json_body();
$id = isset($input['id']) ? (int) $input['id'] : (isset($_GET['id']) ? (int) $_GET['id'] : 0);

if ($id <= 0) {
    json_response(['error' => 'Product id is required.'], 422);
}

$currentStmt = $pdo->prepare('SELECT * FROM products WHERE id = ?');
$currentStmt->execute([$id]);
$current = $currentStmt->fetch();
if (!$current) {
    json_response(['error' => 'Product not found.'], 404);
}

$name = trim((string) ($input['name'] ?? $current['name']));
$category = trim((string) ($input['category'] ?? $current['category']));
$description = trim((string) ($input['description'] ?? $current['description']));
$image = trim((string) ($input['image'] ?? $current['image_url']));
$price = isset($input['price']) ? (float) $input['price'] : (float) $current['price'];
$salePrice = array_key_exists('salePrice', $input) ? $input['salePrice'] : $current['sale_price'];
$stock = isset($input['stock']) ? (int) $input['stock'] : (int) $current['stock'];
$stockAlertLevel = isset($input['stockAlertLevel']) ? (int) $input['stockAlertLevel'] : (int) ($current['stock_alert_level'] ?? 5);
$isNew = array_key_exists('isNew', $input) ? (!empty($input['isNew']) ? 1 : 0) : (int) $current['is_new'];
$isOnSale = array_key_exists('isOnSale', $input) ? (!empty($input['isOnSale']) ? 1 : 0) : (int) $current['is_on_sale'];

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

$stmt = $pdo->prepare('UPDATE products SET name = ?, category = ?, price = ?, sale_price = ?, stock = ?, stock_alert_level = ?, description = ?, image_url = ?, is_new = ?, is_on_sale = ?, updated_at = NOW() WHERE id = ?');
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
    $id,
]);

$productStmt = $pdo->prepare('SELECT * FROM products WHERE id = ?');
$productStmt->execute([$id]);
$product = $productStmt->fetch();

json_response(['product' => format_product($product)]);
