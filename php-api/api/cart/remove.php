<?php

require_once __DIR__ . '/../_init.php';

require_method('POST');

$user  = require_auth($pdo);
$input = get_json_body();

$cartKey = isset($input['cartKey']) ? trim((string) $input['cartKey']) : '';

if ($cartKey === '') {
    json_response(['error' => 'cartKey is required.'], 422);
}

$del = $pdo->prepare('DELETE FROM cart_items WHERE user_id = ? AND cart_key = ?');
$del->execute([$user['id'], $cartKey]);

$all = $pdo->prepare('SELECT * FROM cart_items WHERE user_id = ? ORDER BY id ASC');
$all->execute([$user['id']]);
$rows = $all->fetchAll();

json_response(['items' => array_map('format_cart_item', $rows)]);
