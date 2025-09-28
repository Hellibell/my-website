<?php
header('Content-Type: application/json');

$targetDir = __DIR__ . "/uploads/";

if (!is_dir($targetDir)) {
    mkdir($targetDir, 0777, true);
}

if (!isset($_FILES['file'])) {
    http_response_code(400);
    echo json_encode(["error" => "No file"]);
    exit;
}

$file = $_FILES['file'];
$name = basename($file['name']);

$ext = pathinfo($name, PATHINFO_EXTENSION);
$base = pathinfo($name, PATHINFO_FILENAME);
$filename = preg_replace("/[^A-Za-z0-9_-]/", "_", $base) . "_" . time() . "." . $ext;

$targetFile = $targetDir . $filename;

if (move_uploaded_file($file['tmp_name'], $targetFile)) {
    $url = "https://3a1tr.online/cdn/uploads/" . $filename;
    echo json_encode(["url" => $url]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Upload failed"]);
}
