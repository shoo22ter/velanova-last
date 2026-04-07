<?php

function json_response($payload, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

function require_method(string $method): void
{
    if ($_SERVER['REQUEST_METHOD'] !== strtoupper($method)) {
        json_response(['error' => 'Method not allowed.'], 405);
    }
}

function get_json_body(): array
{
    $input = file_get_contents('php://input');
    if ($input === false || $input === '') {
        return [];
    }

    $data = json_decode($input, true);
    if (!is_array($data)) {
        json_response(['error' => 'Invalid JSON payload.'], 400);
    }

    return $data;
}

function request_headers(): array
{
    if (function_exists('getallheaders')) {
        return getallheaders();
    }

    $headers = [];
    foreach ($_SERVER as $key => $value) {
        if (strpos($key, 'HTTP_') === 0) {
            $name = str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($key, 5)))));
            $headers[$name] = $value;
        }
    }

    return $headers;
}

function get_bearer_token(): ?string
{
    $headers = request_headers();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

    if ($authHeader && stripos($authHeader, 'Bearer ') === 0) {
        return trim(substr($authHeader, 7));
    }

    $altHeader = $headers['X-Auth-Token'] ?? $headers['x-auth-token'] ?? '';
    if ($altHeader) {
        return trim($altHeader);
    }

    return null;
}

function create_session(PDO $pdo, int $userId): array
{
    $token = bin2hex(random_bytes(32));
    $hash = hash('sha256', $token);
    $expiresAt = (new DateTime('+7 days'))->format('Y-m-d H:i:s');

    $stmt = $pdo->prepare('INSERT INTO sessions (user_id, token_hash, expires_at, created_at) VALUES (?, ?, ?, NOW())');
    $stmt->execute([$userId, $hash, $expiresAt]);

    return ['token' => $token, 'expiresAt' => $expiresAt];
}

function current_user(PDO $pdo): ?array
{
    $token = get_bearer_token();
    if (!$token) {
        return null;
    }

    $hash = hash('sha256', $token);
    $stmt = $pdo->prepare('SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > NOW() LIMIT 1');
    $stmt->execute([$hash]);
    $user = $stmt->fetch();

    return $user ?: null;
}

function require_auth(PDO $pdo): array
{
    $user = current_user($pdo);
    if (!$user) {
        json_response(['error' => 'Unauthorized.'], 401);
    }
    return $user;
}

function require_admin(PDO $pdo): array
{
    $user = require_auth($pdo);
    if (($user['role'] ?? '') !== 'admin') {
        json_response(['error' => 'Admin access required.'], 403);
    }
    return $user;
}

function format_user(array $user): array
{
    return [
        'id' => (int) $user['id'],
        'fullName' => $user['full_name'],
        'email' => $user['email'],
        'phone' => $user['phone'] ?? '',
        'role' => $user['role'],
        'createdAt' => $user['created_at'],
    ];
}

function format_product(array $row): array
{
    return [
        'id' => (int) $row['id'],
        'name' => $row['name'],
        'category' => $row['category'],
        'price' => (float) $row['price'],
        'salePrice' => $row['sale_price'] !== null ? (float) $row['sale_price'] : '',
        'stock' => (int) $row['stock'],
        'stockAlertLevel' => (int) ($row['stock_alert_level'] ?? 5),
        'description' => $row['description'] ?? '',
        'image' => $row['image_url'] ?? '',
        'isNew' => (bool) ($row['is_new'] ?? 0),
        'isOnSale' => (bool) ($row['is_on_sale'] ?? 0),
    ];
}

function format_banner(array $row): array
{
    return [
        'id' => (int) $row['id'],
        'title' => $row['title'],
        'subtitle' => $row['subtitle'] ?? '',
        'image' => $row['image_url'] ?? '',
        'ctaLabel' => $row['cta_label'] ?? '',
        'ctaLink' => $row['cta_link'] ?? '',
        'isActive' => (bool) ($row['is_active'] ?? 0),
        'sortOrder' => (int) ($row['sort_order'] ?? 0),
    ];
}

function format_testimonial(array $row): array
{
    return [
        'id' => (int) $row['id'],
        'name' => $row['name'],
        'role' => $row['role'] ?? '',
        'quote' => $row['quote'] ?? '',
        'avatar' => $row['avatar_url'] ?? '',
        'rating' => (int) ($row['rating'] ?? 5),
        'isActive' => (bool) ($row['is_active'] ?? 0),
        'sortOrder' => (int) ($row['sort_order'] ?? 0),
    ];
}

function format_faq(array $row): array
{
    return [
        'id' => (int) $row['id'],
        'question' => $row['question'],
        'answer' => $row['answer'] ?? '',
        'isActive' => (bool) ($row['is_active'] ?? 0),
        'sortOrder' => (int) ($row['sort_order'] ?? 0),
    ];
}

function format_settings(array $row): array
{
    return [
        'supportEmail' => $row['support_email'] ?? '',
        'supportPhone' => $row['support_phone'] ?? '',
        'addressLine1' => $row['address_line1'] ?? '',
        'addressLine2' => $row['address_line2'] ?? '',
        'city' => $row['city'] ?? '',
        'region' => $row['region'] ?? '',
        'country' => $row['country'] ?? '',
        'hoursWeekday' => $row['hours_weekday'] ?? '',
        'hoursSaturday' => $row['hours_saturday'] ?? '',
        'hoursSunday' => $row['hours_sunday'] ?? '',
    ];
}

function format_order(array $order, array $items): array
{
    return [
        'id' => $order['public_id'],
        'date' => $order['created_at'],
        'customerInfo' => [
            'firstName' => $order['customer_first_name'],
            'lastName' => $order['customer_last_name'],
            'phone' => $order['customer_phone'],
            'email' => $order['customer_email'],
            'address' => $order['customer_address'],
            'city' => $order['customer_city'],
        ],
        'paymentMethod' => $order['payment_method'],
        'items' => array_map(function ($item) {
            return [
                'id' => (int) $item['product_id'],
                'name' => $item['product_name'],
                'price' => (float) $item['unit_price'],
                'quantity' => (int) $item['quantity'],
                'selectedSize' => $item['selected_size'] ?: null,
                'image' => $item['product_image'] ?? '',
            ];
        }, $items),
        'subTotal' => (float) $order['sub_total'],
        'deliveryFee' => (float) $order['delivery_fee'],
        'total' => (float) $order['total'],
        'status' => $order['status'],
    ];
}
