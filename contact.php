<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    $data = $_POST;
}

// Validation
if (empty($data['name']) || empty($data['email']) || empty($data['message'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Tous les champs sont requis']);
    exit;
}

if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email invalide']);
    exit;
}

$conn = getConnection();

try {
    $query = "INSERT INTO contact_messages (name, email, phone, subject, message) 
              VALUES (?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($query);
    
    // Correction: Utilisation de isset() au lieu de l'opérateur ??
    $phone = isset($data['phone']) ? $data['phone'] : null;
    $subject = isset($data['subject']) ? $data['subject'] : null;
    
    $stmt->bind_param("sssss", 
        $data['name'], 
        $data['email'], 
        $phone, 
        $subject, 
        $data['message']
    );
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Message envoyé avec succès ! Nous vous répondrons rapidement.'
        ]);
    } else {
        throw new Exception("Erreur lors de l'envoi");
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} finally {
    if (isset($stmt)) $stmt->close();
    $conn->close();
}
?>