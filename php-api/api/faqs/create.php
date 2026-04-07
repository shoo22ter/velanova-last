<?php

require_once __DIR__ . '/../_init.php';

require_method('POST');
require_admin($pdo);

$input = get_json_body();

$question = trim((string) ($input['question'] ?? ''));
$answer = trim((string) ($input['answer'] ?? ''));
$isActive = array_key_exists('isActive', $input) ? (!empty($input['isActive']) ? 1 : 0) : 1;
$sortOrder = isset($input['sortOrder']) ? (int) $input['sortOrder'] : 0;

if ($question === '' || $answer === '') {
    json_response(['error' => 'Question and answer are required.'], 422);
}

$stmt = $pdo->prepare('INSERT INTO faqs (question, answer, is_active, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())');
$stmt->execute([$question, $answer, $isActive, $sortOrder]);

$faqId = (int) $pdo->lastInsertId();
$faqStmt = $pdo->prepare('SELECT * FROM faqs WHERE id = ?');
$faqStmt->execute([$faqId]);
$faq = $faqStmt->fetch();

json_response(['faq' => format_faq($faq)], 201);
