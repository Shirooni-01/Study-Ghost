<?php
// ---------- PRODUCTION SAFE ----------
error_reporting(0);
ini_set('display_errors', 0);

session_start();
require "db.php";

header("Content-Type: application/json");

// ---------- AUTH CHECK ----------
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "unauthorized"]);
    exit;
}

$user_id = $_SESSION['user_id'];
$action  = $_POST['action'] ?? $_GET['action'] ?? '';

/* ==========================
   ADD EXPENSE
========================== */
if ($action === "add") {

    // 🔥 MATCHES YOUR JS EXACTLY
    $name   = $_POST['name'] ?? '';
    $type   = $_POST['type'] ?? '';
    $amount = $_POST['amount'] ?? 0;
    $date   = $_POST['date'] ?? '';

    if ($name === '' || $type === '' || $amount <= 0 || $date === '') {
        echo json_encode(["error" => "missing_fields"]);
        exit;
    }

    $sql = "INSERT INTO expenses 
            (user_id, item_name, item_type, amount, expense_date)
            VALUES (?, ?, ?, ?, ?)";

    $stmt = mysqli_prepare($conn, $sql);
    if (!$stmt) {
        echo json_encode(["error" => "sql_prepare_failed"]);
        exit;
    }

    mysqli_stmt_bind_param(
        $stmt,
        "issds",
        $user_id,
        $name,
        $type,
        $amount,
        $date
    );

    if (!mysqli_stmt_execute($stmt)) {
        echo json_encode([
            "error" => "insert_failed",
            "sql_error" => mysqli_error($conn)
        ]);
        exit;
    }

    echo json_encode(["status" => "added"]);
    exit;
}

/* ==========================
   FETCH EXPENSES
========================== */
if ($action === "fetch") {

    $sql = "SELECT id, item_name, item_type, amount, expense_date
            FROM expenses
            WHERE user_id = ?
            ORDER BY expense_date DESC, id DESC";

    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "i", $user_id);
    mysqli_stmt_execute($stmt);

    $res = mysqli_stmt_get_result($stmt);
    $data = [];

    while ($row = mysqli_fetch_assoc($res)) {
        $data[] = $row;
    }

    echo json_encode($data);
    exit;
}

/* ==========================
   FALLBACK
========================== */
echo json_encode(["error" => "invalid_action"]);
exit;
