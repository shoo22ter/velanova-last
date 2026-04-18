<?php

require_once __DIR__ . '/../_init.php';

require_method('POST');

$user = require_auth($pdo);

$del = $pdo->prepare('DELETE FROM cart_items WHERE user_id = ?');
$del->execute([$user['id']]);

json_response(['items' => []]);
