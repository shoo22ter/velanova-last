<?php

require_once __DIR__ . '/../_init.php';

require_method('GET');

$stmt = $pdo->query('SELECT * FROM faqs ORDER BY sort_order ASC, created_at DESC');
$rows = $stmt->fetchAll();

$faqs = array_map('format_faq', $rows);

json_response(['faqs' => $faqs]);
