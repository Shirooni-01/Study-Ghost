<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header("Content-Type: application/json");
// =========================
// STUDYGHOST AI BACKEND
// Phase 2.2 — Contextual AI
// =========================

header("Content-Type: application/json");

$GROQ_API_KEY = "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";

if (!$GROQ_API_KEY) {
    echo json_encode(["error" => "Groq API key missing"]);
    exit;
}

$raw = file_get_contents("php://input");
$input = json_decode($raw, true);

$mode = $input["mode"] ?? "insights";
$tasks = $input["tasks"] ?? [];
$expenses = $input["expenses"] ?? [];

/* -------------------------
   BUILD CONTEXT PROMPT
-------------------------- */
$context = "You are an AI assistant inside a productivity app called StudyGhost.\n";
$context .= "Analyze the user's data and give short, helpful insights.\n\n";

$context .= "TASKS:\n";
if (count($tasks) === 0) {
    $context .= "- No tasks added.\n";
} else {
    foreach ($tasks as $t) {
        $status = $t["done"] ? "Completed" : "Pending";
        $context .= "- {$t["text"]} ({$status})\n";
    }
}

$context .= "\nEXPENSES:\n";
if (count($expenses) === 0) {
    $context .= "- No expenses recorded.\n";
} else {
    foreach ($expenses as $e) {
        $context .= "- {$e["item_name"]}, ₹{$e["amount"]}, {$e["item_type"]}\n";
    }
}

/* -------------------------
   MODE-BASED PROMPT
-------------------------- */
if ($mode === "insights") {
    $userPrompt = "Give 3 short insights about productivity and spending.";
} elseif ($mode === "suggestions") {
    $userPrompt = "Give 3 actionable suggestions for tomorrow.";
} else {
    $userPrompt = "Give helpful feedback.";
}

$payload = [
    "model" => "llama-3.1-8b-instant",
    "messages" => [
        ["role" => "system", "content" => $context],
        ["role" => "user", "content" => $userPrompt]
    ]
];

$url = "https://api.groq.com/openai/v1/chat/completions";

$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        "Content-Type: application/json",
        "Authorization: Bearer " . $GROQ_API_KEY
    ],
    CURLOPT_POSTFIELDS => json_encode($payload)
]);

$response = curl_exec($ch);
$http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$result = json_decode($response, true);

if ($http !== 200) {
    echo json_encode([
        "error" => "AI error",
        "status" => $http,
        "raw" => $result
    ]);
    exit;
}

echo json_encode([
    "reply" => $result["choices"][0]["message"]["content"]
]);


