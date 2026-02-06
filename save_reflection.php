<?php
require "../auth/auth_check.php";   // ensures user / guest session
require "../db.php";

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$text = trim($data["text"] ?? "");
$response = trim($data["response"] ?? "");
$user_id = $_SESSION["user_id"] ?? null;

if (!$user_id || $text === "" || $response === "") {
    echo json_encode(["success" => false, "error" => "Invalid data"]);
    exit;
}

$stmt = $conn->prepare(
    "INSERT INTO reflections (user_id, text, ai_response)
     VALUES (?, ?, ?)"
);

$stmt->bind_param("iss", $user_id, $text, $response);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => "DB insert failed"]);
}
