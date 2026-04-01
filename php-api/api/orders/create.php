<?php

require_once __DIR__ . '/../_init.php';

require_method('POST');

$user = require_auth($pdo);
$input = get_json_body();

$customer = $input['customerInfo'] ?? [];
$items = $input['items'] ?? [];
$paymentMethod = trim((string) ($input['paymentMethod'] ?? 'Cash on Delivery'));
$deliveryFee = isset($input['deliveryFee']) ? (float) $input['deliveryFee'] : 0;
$publicId = trim((string) ($input['id'] ?? ''));

$firstName = trim((string) ($customer['firstName'] ?? ''));
$lastName = trim((string) ($customer['lastName'] ?? ''));
$phone = trim((string) ($customer['phone'] ?? ''));
$address = trim((string) ($customer['address'] ?? ''));
$city = trim((string) ($customer['city'] ?? ''));
$email = trim((string) ($customer['email'] ?? ''));

if ($firstName === '' || $lastName === '' || $phone === '' || $address === '' || $city === '') {
    json_response(['error' => 'Customer name, phone, address, and city are required.'], 422);
}

if (!is_array($items) || count($items) === 0) {
    json_response(['error' => 'Order items are required.'], 422);
}

if ($publicId === '') {
    $publicId = 'VLV-' . date('Ymd') . '-' . strtoupper(bin2hex(random_bytes(3)));
}

$subTotal = 0.0;
$sanitizedItems = [];
foreach ($items as $item) {
    $name = trim((string) ($item['name'] ?? ''));
    $price = isset($item['price']) ? (float) $item['price'] : 0;
    $quantity = isset($item['quantity']) ? (int) $item['quantity'] : 0;
    $productId = isset($item['id']) ? (int) $item['id'] : 0;
    $selectedSize = isset($item['selectedSize']) ? trim((string) $item['selectedSize']) : null;
    $image = isset($item['image']) ? trim((string) $item['image']) : '';

    if ($name === '' || $price <= 0 || $quantity <= 0) {
        json_response(['error' => 'Invalid order items.'], 422);
    }

    $lineTotal = $price * $quantity;
    $subTotal += $lineTotal;

    $sanitizedItems[] = [
        'product_id' => $productId,
        'product_name' => $name,
        'unit_price' => $price,
        'quantity' => $quantity,
        'selected_size' => $selectedSize,
        'product_image' => $image,
    ];
}

$total = $subTotal + $deliveryFee;

$pdo->beginTransaction();

$stmt = $pdo->prepare('INSERT INTO orders (public_id, user_id, status, payment_method, sub_total, delivery_fee, total, customer_first_name, customer_last_name, customer_email, customer_phone, customer_address, customer_city, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())');
$stmt->execute([
    $publicId,
    $user['id'],
    'Pending',
    $paymentMethod,
    $subTotal,
    $deliveryFee,
    $total,
    $firstName,
    $lastName,
    $email,
    $phone,
    $address,
    $city,
]);

$orderId = (int) $pdo->lastInsertId();

$itemStmt = $pdo->prepare('INSERT INTO order_items (order_id, product_id, product_name, product_image, quantity, unit_price, selected_size) VALUES (?, ?, ?, ?, ?, ?, ?)');
foreach ($sanitizedItems as $item) {
    $itemStmt->execute([
        $orderId,
        $item['product_id'],
        $item['product_name'],
        $item['product_image'],
        $item['quantity'],
        $item['unit_price'],
        $item['selected_size'],
    ]);
}

$pdo->commit();

$orderStmt = $pdo->prepare('SELECT * FROM orders WHERE id = ?');
$orderStmt->execute([$orderId]);
$orderRow = $orderStmt->fetch();

json_response([
    'order' => format_order($orderRow, $sanitizedItems),
], 201);
