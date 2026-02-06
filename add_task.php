<?php
error_reporting(0);
ini_set('display_errors', 0);

session_start();
require "db.php";

header("Content-Type: application/json");

if (!isset($_SESSION["user_id"])) {
    echo json_encode(["error" => "unauthorized"]);
    exit;
}

$user_id = $_SESSION["user_id"];
$action  = $_POST["action"] ?? $_GET["action"] ?? "";

/* ======================
   ADD TASK
====================== */
if ($action === "add") {

    $task = trim($_POST["task"] ?? "");
    if ($task === "") {
        echo json_encode(["error" => "empty_task"]);
        exit;
    }

    $stmt = $conn->prepare(
        "INSERT INTO task_tb (user_id, task_name, is_done)
         VALUES (?, ?, 0)"
    );
    $stmt->bind_param("is", $user_id, $task);
    $stmt->execute();

    echo json_encode(["status" => "added"]);
    exit;
}

/* ======================
   FETCH TASKS
====================== */
if ($action === "fetch") {

    $stmt = $conn->prepare(
        "SELECT id, task_name, is_done
         FROM task_tb
         WHERE user_id = ?
         ORDER BY id DESC"
    );
    $stmt->bind_param("i", $user_id);
    $stmt->execute();

    $res = $stmt->get_result();
    $tasks = [];

    while ($row = $res->fetch_assoc()) {
        $tasks[] = [
            "id"   => $row["id"],
            "text" => $row["task_name"],
            "done" => (bool)$row["is_done"]
        ];
    }

    echo json_encode($tasks);
    exit;
}

/* ======================
   TOGGLE COMPLETE
====================== */
if ($action === "toggle") {

    $id = (int)($_POST["id"] ?? 0);

    $stmt = $conn->prepare(
        "UPDATE task_tb
         SET is_done = NOT is_done
         WHERE id = ? AND user_id = ?"
    );
    $stmt->bind_param("ii", $id, $user_id);
    $stmt->execute();

    echo json_encode(["status" => "toggled"]);
    exit;
}

/* ======================
   FALLBACK
====================== */
echo json_encode(["error" => "invalid_action"]);
exit;
