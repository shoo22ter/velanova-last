<?php

require_once __DIR__ . '/../_init.php';

require_method('GET');

$stmt = $pdo->query('SELECT * FROM testimonials ORDER BY sort_order ASC, created_at DESC');
$rows = $stmt->fetchAll();

$testimonials = array_map('format_testimonial', $rows);

json_response(['testimonials' => $testimonials]);
