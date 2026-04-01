<?php

require_once __DIR__ . '/../_init.php';

require_method('POST');

$input = get_json_body();
$fullName = trim((string) ($input['fullName'] ?? ''));
$email = trim(strtolower((string) ($input['email'] ?? '')));
$password = (string) ($input['password'] ?? '');

if ($fullName === '' || $email === '' || $password === '') {
    json_response(['error' => 'Full name, email, and password are required.'], 422);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(['error' => 'Invalid email address.'], 422);
}

$exists = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
$exists->execute([$email]);
if ($exists->fetch()) {
    json_response(['error' => 'Email already registered.'], 409);
}

$hash = password_hash($password, PASSWORD_DEFAULT);
$stmt = $pdo->prepare('INSERT INTO users (full_name, email, password_hash, phone, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())');
$stmt->execute([$fullName, $email, $hash, '', 'customer']);

$userId = (int) $pdo->lastInsertId();
$userStmt = $pdo->prepare('SELECT * FROM users WHERE id = ?');
$userStmt->execute([$userId]);
$user = $userStmt->fetch();

$session = create_session($pdo, $userId);

json_response([
    'user' => format_user($user),
    'token' => $session['token'],
    'expiresAt' => $session['expiresAt'],
]);
