<?php
// Générer le nom du fichier avec la date du jour (format YYYY-MM-DD)
$logFile = __DIR__ . '/logs_' . date('Y-m-d') . '.txt';

// Récupérer les données JSON envoyées dans le corps de la requête
$data = file_get_contents('php://input');

// Vérifier que les données sont présentes
if ($data) {
    // Décoder les données JSON
    $decodedData = json_decode($data, true);

    // Vérifier que le champ 'log' est présent
    if (isset($decodedData['log'])) {
        $logMessage = $decodedData['log'];

        // Récupérer les informations du client
        $clientIp = $_SERVER['REMOTE_ADDR'] ?? 'IP non disponible';
        if (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $clientIp = $_SERVER['HTTP_X_FORWARDED_FOR']; // Si derrière un proxy
        }

        $referer = $_SERVER['HTTP_REFERER'] ?? 'Référent non disponible';
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'User agent non disponible';

        // Ajouter une ligne avec le message de log, la date actuelle, l'IP, le référent et l'user-agent
        $logEntry = "[" . date('Y-m-d H:i:s') . "] IP: " . $clientIp . " | Referer: " . $referer . " | User-agent: " . $userAgent . " | Log: " . htmlspecialchars($logMessage, ENT_QUOTES, 'UTF-8') . "\n";

        // Enregistrer le log dans le fichier spécifié
        if (file_put_contents($logFile, $logEntry, FILE_APPEND) === false) {
            // En cas d'erreur lors de l'écriture du fichier
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Unable to write to log file']);
            exit;
        }

        // Répondre avec un succès
        http_response_code(200);
        echo json_encode(['status' => 'success', 'message' => 'Log saved successfully']);
    } else {
        // Si le champ 'log' est manquant, envoyer une erreur
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'No log field found']);
    }
} else {
    // Si aucune donnée n'est envoyée, répondre avec une erreur
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'No data received']);
}
?>
