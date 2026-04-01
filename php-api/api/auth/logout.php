<?php

require_once __DIR__ . '/../_init.php';

require_method('POST');

$token = get_bearer_token();
if (!$token) {
    json_response(['error' => 'Missing token.'], 401);
}

$hash = hash('sha256', $token);
$stmt = $pdo->prepare('DELETE FROM sessions WHERE token_hash = ?');
$stmt->execute([$hash]);

json_response(['success' => true]);
