<?php

require_once __DIR__ . '/../_init.php';

require_method('GET');

$user = require_auth($pdo);

$stmt = $pdo->prepare('SELECT * FROM cart_items WHERE user_id = ? ORDER BY id ASC');
$stmt->execute([$user['id']]);
$rows = $stmt->fetchAll();

$items = array_map('format_cart_item', $rows);

json_response(['items' => $items]);
