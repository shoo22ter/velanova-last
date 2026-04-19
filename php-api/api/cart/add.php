<?php

require_once __DIR__ . '/../_init.php';

require_method('POST');

$user = require_auth($pdo);
$input = get_json_body();

$productId   = isset($input['productId'])   ? (int)    $input['productId']           : 0;
$name        = isset($input['name'])        ? trim((string) $input['name'])          : '';
$image       = isset($input['image'])       ? trim((string) $input['image'])         : '';
$price       = isset($input['price'])       ? (float)  $input['price']              : 0;
$quantity    = isset($input['quantity'])    ? (int)    $input['quantity']            : 1;
$selectedSize = isset($input['selectedSize']) ? trim((string) $input['selectedSize']) : null;
$cartKey     = isset($input['cartKey'])     ? substr(trim((string) $input['cartKey']), 0, 191)       : '';

if ($productId <= 0 || $name === '' || $price <= 0 || $quantity <= 0 || $cartKey === '') {
    json_response(['error' => 'Invalid cart item data.'], 422);
}

// Upsert: if item with same cart_key exists for this user, increment quantity; otherwise insert
$stmt = $pdo->prepare('SELECT id, quantity FROM cart_items WHERE user_id = ? AND cart_key = ? LIMIT 1');
$stmt->execute([$user['id'], $cartKey]);
$existing = $stmt->fetch();

if ($existing) {
    $newQty = $existing['quantity'] + $quantity;
    $upd = $pdo->prepare('UPDATE cart_items SET quantity = ?, updated_at = NOW() WHERE id = ?');
    $upd->execute([$newQty, $existing['id']]);
} else {
    $ins = $pdo->prepare('INSERT INTO cart_items (user_id, product_id, product_name, product_image, price, quantity, selected_size, cart_key, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())');
    $ins->execute([$user['id'], $productId, $name, $image, $price, $quantity, $selectedSize ?: null, $cartKey]);
}

// Return the full updated cart
$all = $pdo->prepare('SELECT * FROM cart_items WHERE user_id = ? ORDER BY id ASC');
$all->execute([$user['id']]);
$rows = $all->fetchAll();

json_response(['items' => array_map('format_cart_item', $rows)]);
