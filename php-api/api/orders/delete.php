<?php

require_once __DIR__ . '/../_init.php';

require_method('POST');

require_admin($pdo);

$input = get_json_body();
$publicId = trim((string) ($input['id'] ?? ''));

if ($publicId === '') {
    json_response(['error' => 'Order id is required.'], 422);
}

$stmt = $pdo->prepare('DELETE FROM orders WHERE public_id = ?');
$stmt->execute([$publicId]);

json_response(['success' => true]);
