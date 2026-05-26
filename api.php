<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

$pdo = new PDO('mysql:host=127.0.0.1;dbname=stok_gudang_buku;charset=utf8mb4', 'root', '', [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]);

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true) ?: [];
$id = $_GET['id'] ?? null;

if ($method === 'GET') {
    $stmt = $pdo->query('SELECT * FROM books ORDER BY created_at DESC, id DESC');
    echo json_encode($stmt->fetchAll());
    exit;
}

if ($method === 'POST') {
    $isbn = 'APP-' . date('YmdHis') . random_int(100, 999);
    $stmt = $pdo->prepare('INSERT INTO books (isbn, title, author, category, location, shelf, stock, min_stock, supplier) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)');
    $stmt->execute([$isbn, $input['title'], $input['author'] ?? '-', $input['category'], $input['shelf'], $input['shelf'], (int) $input['stock'], $input['supplier'] ?? '-']);
    echo json_encode(['message' => 'created', 'id' => $pdo->lastInsertId()]);
    exit;
}

if ($method === 'PUT' && $id) {
    if (isset($input['delta'])) {
        $stmt = $pdo->prepare('UPDATE books SET stock = GREATEST(0, stock + ?) WHERE id = ?');
        $stmt->execute([(int) $input['delta'], $id]);
    } else {
        $stmt = $pdo->prepare('UPDATE books SET title = ?, category = ?, location = ?, shelf = ?, stock = ? WHERE id = ?');
        $stmt->execute([$input['title'], $input['category'], $input['shelf'], $input['shelf'], (int) $input['stock'], $id]);
    }
    echo json_encode(['message' => 'updated']);
    exit;
}

if ($method === 'DELETE' && $id) {
    $stmt = $pdo->prepare('DELETE FROM books WHERE id = ?');
    $stmt->execute([$id]);
    echo json_encode(['message' => 'deleted']);
    exit;
}

http_response_code(400);
echo json_encode(['message' => 'Bad request']);
