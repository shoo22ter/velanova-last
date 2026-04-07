<?php

require_once __DIR__ . '/../_init.php';

require_method('POST');
require_admin($pdo);

$input = get_json_body();

$supportEmail = trim((string) ($input['supportEmail'] ?? ''));
$supportPhone = trim((string) ($input['supportPhone'] ?? ''));
$addressLine1 = trim((string) ($input['addressLine1'] ?? ''));
$addressLine2 = trim((string) ($input['addressLine2'] ?? ''));
$city = trim((string) ($input['city'] ?? ''));
$region = trim((string) ($input['region'] ?? ''));
$country = trim((string) ($input['country'] ?? ''));
$hoursWeekday = trim((string) ($input['hoursWeekday'] ?? ''));
$hoursSaturday = trim((string) ($input['hoursSaturday'] ?? ''));
$hoursSunday = trim((string) ($input['hoursSunday'] ?? ''));

$stmt = $pdo->prepare(
    'INSERT INTO site_settings (id, support_email, support_phone, address_line1, address_line2, city, region, country, hours_weekday, hours_saturday, hours_sunday)
     VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE support_email = VALUES(support_email),
        support_phone = VALUES(support_phone),
        address_line1 = VALUES(address_line1),
        address_line2 = VALUES(address_line2),
        city = VALUES(city),
        region = VALUES(region),
        country = VALUES(country),
        hours_weekday = VALUES(hours_weekday),
        hours_saturday = VALUES(hours_saturday),
        hours_sunday = VALUES(hours_sunday)'
);
$stmt->execute([
    $supportEmail,
    $supportPhone,
    $addressLine1,
    $addressLine2,
    $city,
    $region,
    $country,
    $hoursWeekday,
    $hoursSaturday,
    $hoursSunday,
]);

$rowStmt = $pdo->prepare('SELECT * FROM site_settings WHERE id = 1');
$rowStmt->execute();
$row = $rowStmt->fetch();

json_response(['settings' => format_settings($row ?: [])]);
