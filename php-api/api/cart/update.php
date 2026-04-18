<?php

require_once __DIR__ . '/../_init.php';

require_method('POST');

$user  = require_auth($pdo);
$input = get_json_body();

$cartKey  = isset($input['cartKey'])  ? trim((string) $input['cartKey']) : '';
$quantity = isset($input['quantity']) ? (int) $input['quantity']         : 0;

if ($cartKey === '') {
    json_response(['error' => 'cartKey is required.'], 422);
}

if ($quantity <= 0) {
    // Treat as remove
    $del = $pdo->prepare('DELETE FROM cart_items WHERE user_id = ? AND cart_key = ?');
    $del->execute([$user['id'], $cartKey]);
} else {
    $upd = $pdo->prepare('UPDATE cart_items SET quantity = ?, updated_at = NOW() WHERE user_id = ? AND cart_key = ?');
    $upd->execute([$quantity, $user['id'], $cartKey]);
}

$all = $pdo->prepare('SELECT * FROM cart_items WHERE user_id = ? ORDER BY id ASC');
$all->execute([$user['id']]);
$rows = $all->fetchAll();

json_response(['items' => array_map('format_cart_item', $rows)]);
