<?php

require_once __DIR__ . '/../_init.php';

require_method('GET');

$stmt = $pdo->prepare('SELECT * FROM site_settings WHERE id = 1');
$stmt->execute();
$row = $stmt->fetch();

$settings = $row ? format_settings($row) : format_settings([]);

json_response(['settings' => $settings]);
