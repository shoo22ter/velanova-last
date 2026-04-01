<?php

require_once __DIR__ . '/../_init.php';

require_method('POST');

$user = require_auth($pdo);
$input = get_json_body();

$fullName = trim((string) ($input['fullName'] ?? $user['full_name']));
$email = trim(strtolower((string) ($input['email'] ?? $user['email'])));
$phone = trim((string) ($input['phone'] ?? ($user['phone'] ?? '')));

if ($fullName === '' || $email === '') {
    json_response(['error' => 'Full name and email are required.'], 422);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(['error' => 'Invalid email address.'], 422);
}

if ($email !== $user['email']) {
    $exists = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
    $exists->execute([$email]);
    if ($exists->fetch()) {
        json_response(['error' => 'Email already in use.'], 409);
    }
}

$stmt = $pdo->prepare('UPDATE users SET full_name = ?, email = ?, phone = ?, updated_at = NOW() WHERE id = ?');
$stmt->execute([$fullName, $email, $phone, $user['id']]);

$userStmt = $pdo->prepare('SELECT * FROM users WHERE id = ?');
$userStmt->execute([$user['id']]);
$updated = $userStmt->fetch();

json_response(['user' => format_user($updated)]);
