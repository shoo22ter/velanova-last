<?php
// Sync a batch of localStorage cart items into the DB cart on login.
// Items with existing cart_key are quantity-merged; new items are inserted.

require_once __DIR__ . '/../_init.php';

require_method('POST');

$user  = require_auth($pdo);
$input = get_json_body();

$items = $input['items'] ?? [];

if (!is_array($items) || count($items) === 0) {
    // Nothing to merge – just return current DB cart
    $all = $pdo->prepare('SELECT * FROM cart_items WHERE user_id = ? ORDER BY id ASC');
    $all->execute([$user['id']]);
    json_response(['items' => array_map('format_cart_item', $all->fetchAll())]);
}

foreach ($items as $item) {
    $productId    = isset($item['id'])           ? (int)    $item['id']                     : 0;
    $name         = isset($item['name'])         ? trim((string) $item['name'])              : '';
    $image        = isset($item['image'])        ? trim((string) $item['image'])             : '';
    $price        = isset($item['price'])        ? (float)  $item['price']                  : 0;
    $quantity     = isset($item['quantity'])     ? (int)    $item['quantity']                : 1;
    $selectedSize = isset($item['selectedSize']) ? trim((string) $item['selectedSize'])      : null;
    $cartKey      = isset($item['cartKey'])      ? trim((string) $item['cartKey'])           : '';

    if ($productId <= 0 || $name === '' || $price <= 0 || $quantity <= 0 || $cartKey === '') {
        continue; // Skip invalid items
    }

    $check = $pdo->prepare('SELECT id, quantity FROM cart_items WHERE user_id = ? AND cart_key = ? LIMIT 1');
    $check->execute([$user['id'], $cartKey]);
    $existing = $check->fetch();

    if ($existing) {
        $newQty = $existing['quantity'] + $quantity;
        $upd = $pdo->prepare('UPDATE cart_items SET quantity = ?, updated_at = NOW() WHERE id = ?');
        $upd->execute([$newQty, $existing['id']]);
    } else {
        $ins = $pdo->prepare('INSERT INTO cart_items (user_id, product_id, product_name, product_image, price, quantity, selected_size, cart_key, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())');
        $ins->execute([$user['id'], $productId, $name, $image, $price, $quantity, $selectedSize ?: null, $cartKey]);
    }
}

$all = $pdo->prepare('SELECT * FROM cart_items WHERE user_id = ? ORDER BY id ASC');
$all->execute([$user['id']]);

json_response(['items' => array_map('format_cart_item', $all->fetchAll())]);
