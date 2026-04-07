<?php

require_once __DIR__ . '/../_init.php';

require_method('POST');
require_admin($pdo);

$input = get_json_body();

$id = isset($input['id']) ? (int) $input['id'] : 0;
$title = trim((string) ($input['title'] ?? ''));
$subtitle = trim((string) ($input['subtitle'] ?? ''));
$image = trim((string) ($input['image'] ?? ''));
$ctaLabel = trim((string) ($input['ctaLabel'] ?? ''));
$ctaLink = trim((string) ($input['ctaLink'] ?? ''));
$isActive = array_key_exists('isActive', $input) ? (!empty($input['isActive']) ? 1 : 0) : 1;
$sortOrder = isset($input['sortOrder']) ? (int) $input['sortOrder'] : 0;

if ($id <= 0) {
    json_response(['error' => 'Invalid banner ID.'], 422);
}

if ($title === '' || $image === '') {
    json_response(['error' => 'Title and image are required.'], 422);
}

$stmt = $pdo->prepare('UPDATE banners SET title = ?, subtitle = ?, image_url = ?, cta_label = ?, cta_link = ?, is_active = ?, sort_order = ?, updated_at = NOW() WHERE id = ?');
$stmt->execute([$title, $subtitle, $image, $ctaLabel, $ctaLink, $isActive, $sortOrder, $id]);

$bannerStmt = $pdo->prepare('SELECT * FROM banners WHERE id = ?');
$bannerStmt->execute([$id]);
$banner = $bannerStmt->fetch();

if (!$banner) {
    json_response(['error' => 'Banner not found.'], 404);
}

json_response(['banner' => format_banner($banner)]);
