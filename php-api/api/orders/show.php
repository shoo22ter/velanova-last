<?php

require_once __DIR__ . '/../_init.php';

require_method('GET');

$user = require_auth($pdo);
$publicId = isset($_GET['id']) ? trim((string) $_GET['id']) : '';

if ($publicId === '') {
    json_response(['error' => 'Order id is required.'], 422);
}

$stmt = $pdo->prepare('SELECT * FROM orders WHERE public_id = ? LIMIT 1');
$stmt->execute([$publicId]);
$order = $stmt->fetch();

if (!$order) {
    json_response(['error' => 'Order not found.'], 404);
}

if (($user['role'] ?? '') !== 'admin' && (int) $order['user_id'] !== (int) $user['id']) {
    json_response(['error' => 'Access denied.'], 403);
}

$itemStmt = $pdo->prepare('SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC');
$itemStmt->execute([$order['id']]);
$items = $itemStmt->fetchAll();

json_response(['order' => format_order($order, $items)]);
