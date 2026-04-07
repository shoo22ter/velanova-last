<?php

require_once __DIR__ . '/../_init.php';

require_method('POST');
require_admin($pdo);

$input = get_json_body();
$id = isset($input['id']) ? (int) $input['id'] : 0;

if ($id <= 0) {
    json_response(['error' => 'Invalid FAQ ID.'], 422);
}

$stmt = $pdo->prepare('DELETE FROM faqs WHERE id = ?');
$stmt->execute([$id]);

json_response(['success' => true]);
