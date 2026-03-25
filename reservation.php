<?php
require_once 'config.php';

// Vérifier la méthode HTTP
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Récupérer et valider les données
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    $data = $_POST;
}

// Validation des champs requis
$required_fields = ['name', 'email', 'date', 'time', 'guests'];
foreach ($required_fields as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => "Le champ $field est requis"]);
        exit;
    }
}

// Validation de l'email
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email invalide']);
    exit;
}

// Validation de la date
$today = date('Y-m-d');
if ($data['date'] < $today) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'La date ne peut pas être dans le passé']);
    exit;
}

$conn = getConnection();

try {
    // Vérifier si la table est déjà réservée pour cette date et heure
    $check_query = "SELECT COUNT(*) as count FROM reservations 
                    WHERE date = ? AND time = ? AND status != 'cancelled'";
    $stmt = $conn->prepare($check_query);
    $stmt->bind_param("ss", $data['date'], $data['time']);
    $stmt->execute();
    $result = $stmt->get_result();
    $count = $result->fetch_assoc()['count'];
    $stmt->close();
    
    // Limite de 10 réservations par créneau
    if ($count >= 10) {
        http_response_code(409);
        echo json_encode(['success' => false, 'message' => 'Désolé, ce créneau est complet']);
        exit;
    }
    
    // Insérer la réservation
    $query = "INSERT INTO reservations (name, email, phone, date, time, guests, special_requests) 
              VALUES (?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($query);
    
    // Correction: Utilisation de isset() au lieu de l'opérateur ??
    $phone = isset($data['phone']) ? $data['phone'] : null;
    $special_requests = isset($data['special_requests']) ? $data['special_requests'] : null;
    
    $stmt->bind_param("sssssis", 
        $data['name'], 
        $data['email'], 
        $phone, 
        $data['date'], 
        $data['time'], 
        $data['guests'], 
        $special_requests
    );
    
    if ($stmt->execute()) {
        $reservation_id = $stmt->insert_id;
        
        // Ici vous pouvez ajouter l'envoi d'email de confirmation
        // mail($data['email'], "Confirmation de réservation", "Votre réservation a été confirmée");
        
        echo json_encode([
            'success' => true,
            'message' => 'Réservation confirmée avec succès !',
            'reservation_id' => $reservation_id
        ]);
    } else {
        throw new Exception("Erreur lors de l'enregistrement");
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} finally {
    if (isset($stmt)) $stmt->close();
    $conn->close();
}
?>