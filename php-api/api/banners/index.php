<?php

require_once __DIR__ . '/../_init.php';

require_method('GET');

$stmt = $pdo->query('SELECT * FROM banners ORDER BY sort_order ASC, created_at DESC');
$rows = $stmt->fetchAll();

$banners = array_map('format_banner', $rows);

json_response(['banners' => $banners]);
