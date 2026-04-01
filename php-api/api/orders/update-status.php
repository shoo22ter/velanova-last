<?php

require_once __DIR__ . '/../_init.php';

require_method('POST');

require_admin($pdo);

$input = get_json_body();
$publicId = trim((string) ($input['id'] ?? ''));
$status = trim((string) ($input['status'] ?? ''));

$allowed = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
if ($publicId === '' || $status === '') {
    json_response(['error' => 'Order id and status are required.'], 422);
}

if (!in_array($status, $allowed, true)) {
    json_response(['error' => 'Invalid order status.'], 422);
}

$stmt = $pdo->prepare('UPDATE orders SET status = ?, updated_at = NOW() WHERE public_id = ?');
$stmt->execute([$status, $publicId]);

$orderStmt = $pdo->prepare('SELECT * FROM orders WHERE public_id = ? LIMIT 1');
$orderStmt->execute([$publicId]);
$order = $orderStmt->fetch();
if (!$order) {
    json_response(['error' => 'Order not found.'], 404);
}

$itemStmt = $pdo->prepare('SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC');
$itemStmt->execute([$order['id']]);
$items = $itemStmt->fetchAll();

json_response(['order' => format_order($order, $items)]);
