<?php

require_once __DIR__ . '/../_init.php';

require_method('POST');
require_admin($pdo);

$input = get_json_body();

$id = isset($input['id']) ? (int) $input['id'] : 0;
$question = trim((string) ($input['question'] ?? ''));
$answer = trim((string) ($input['answer'] ?? ''));
$isActive = array_key_exists('isActive', $input) ? (!empty($input['isActive']) ? 1 : 0) : 1;
$sortOrder = isset($input['sortOrder']) ? (int) $input['sortOrder'] : 0;

if ($id <= 0) {
    json_response(['error' => 'Invalid FAQ ID.'], 422);
}

if ($question === '' || $answer === '') {
    json_response(['error' => 'Question and answer are required.'], 422);
}

$stmt = $pdo->prepare('UPDATE faqs SET question = ?, answer = ?, is_active = ?, sort_order = ?, updated_at = NOW() WHERE id = ?');
$stmt->execute([$question, $answer, $isActive, $sortOrder, $id]);

$faqStmt = $pdo->prepare('SELECT * FROM faqs WHERE id = ?');
$faqStmt->execute([$id]);
$faq = $faqStmt->fetch();

if (!$faq) {
    json_response(['error' => 'FAQ not found.'], 404);
}

json_response(['faq' => format_faq($faq)]);
