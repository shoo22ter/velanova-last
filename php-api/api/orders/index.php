<?php

require_once __DIR__ . '/../_init.php';

require_method('GET');

$user = require_auth($pdo);

if (($user['role'] ?? '') === 'admin') {
    $stmt = $pdo->query('SELECT * FROM orders ORDER BY created_at DESC');
    $orders = $stmt->fetchAll();
} else {
    $stmt = $pdo->prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC');
    $stmt->execute([$user['id']]);
    $orders = $stmt->fetchAll();
}

if (!$orders) {
    json_response(['orders' => []]);
}

$orderIds = array_map(fn($order) => (int) $order['id'], $orders);
$placeholders = implode(',', array_fill(0, count($orderIds), '?'));
$itemStmt = $pdo->prepare("SELECT * FROM order_items WHERE order_id IN ({$placeholders}) ORDER BY id ASC");
$itemStmt->execute($orderIds);
$items = $itemStmt->fetchAll();

$itemsByOrder = [];
foreach ($items as $item) {
    $itemsByOrder[$item['order_id']][] = $item;
}

$formatted = array_map(function ($order) use ($itemsByOrder) {
    $orderItems = $itemsByOrder[$order['id']] ?? [];
    return format_order($order, $orderItems);
}, $orders);

json_response(['orders' => $formatted]);
