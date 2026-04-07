<?php

require_once __DIR__ . '/../_init.php';

require_method('POST');
require_admin($pdo);

$input = get_json_body();

$name = trim((string) ($input['name'] ?? ''));
$role = trim((string) ($input['role'] ?? ''));
$quote = trim((string) ($input['quote'] ?? ''));
$avatar = trim((string) ($input['avatar'] ?? ''));
$rating = isset($input['rating']) ? (int) $input['rating'] : 5;
$isActive = array_key_exists('isActive', $input) ? (!empty($input['isActive']) ? 1 : 0) : 1;
$sortOrder = isset($input['sortOrder']) ? (int) $input['sortOrder'] : 0;

if ($name === '' || $quote === '') {
    json_response(['error' => 'Name and quote are required.'], 422);
}

if ($rating < 1 || $rating > 5) {
    json_response(['error' => 'Rating must be between 1 and 5.'], 422);
}

$stmt = $pdo->prepare('INSERT INTO testimonials (name, role, quote, avatar_url, rating, is_active, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())');
$stmt->execute([$name, $role, $quote, $avatar, $rating, $isActive, $sortOrder]);

$testimonialId = (int) $pdo->lastInsertId();
$testimonialStmt = $pdo->prepare('SELECT * FROM testimonials WHERE id = ?');
$testimonialStmt->execute([$testimonialId]);
$testimonial = $testimonialStmt->fetch();

json_response(['testimonial' => format_testimonial($testimonial)], 201);
