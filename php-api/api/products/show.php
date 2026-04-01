<?php

require_once __DIR__ . '/../_init.php';

require_method('GET');

$id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
if ($id <= 0) {
    json_response(['error' => 'Product id is required.'], 422);
}

$stmt = $pdo->prepare('SELECT * FROM products WHERE id = ?');
$stmt->execute([$id]);
$row = $stmt->fetch();

if (!$row) {
    json_response(['error' => 'Product not found.'], 404);
}

json_response(['product' => format_product($row)]);
