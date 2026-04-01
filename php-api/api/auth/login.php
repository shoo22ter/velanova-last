<?php

require_once __DIR__ . '/../_init.php';

require_method('POST');

$input = get_json_body();
$email = trim(strtolower((string) ($input['email'] ?? '')));
$password = (string) ($input['password'] ?? '');

if ($email === '' || $password === '') {
    json_response(['error' => 'Email and password are required.'], 422);
}

$stmt = $pdo->prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    json_response(['error' => 'Invalid email or password.'], 401);
}

$session = create_session($pdo, (int) $user['id']);

json_response([
    'user' => format_user($user),
    'token' => $session['token'],
    'expiresAt' => $session['expiresAt'],
]);
