<?php

require_once __DIR__ . '/../_init.php';

require_method('GET');

$stmt = $pdo->query('SELECT * FROM products ORDER BY created_at DESC');
$rows = $stmt->fetchAll();

$products = array_map('format_product', $rows);

json_response(['products' => $products]);
