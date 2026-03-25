<?php
require_once 'config.php';

$conn = getConnection();

try {
    // Récupérer toutes les catégories avec leurs plats
    $query = "SELECT c.id as category_id, c.name as category_name, 
              m.id, m.name, m.description, m.price, m.is_available
              FROM categories c
              LEFT JOIN menu_items m ON c.id = m.category_id
              WHERE m.is_available = 1
              ORDER BY c.id, m.id";
    
    $result = $conn->query($query);
    
    $menu = [];
    while ($row = $result->fetch_assoc()) {
        $category_id = $row['category_id'];
        
        if (!isset($menu[$category_id])) {
            $menu[$category_id] = [
                'category_id' => $category_id,
                'category_name' => $row['category_name'],
                'items' => []
            ];
        }
        
        if ($row['id']) {
            $menu[$category_id]['items'][] = [
                'id' => $row['id'],
                'name' => $row['name'],
                'description' => $row['description'],
                'price' => number_format($row['price'], 2),
                'is_available' => (bool)$row['is_available']
            ];
        }
    }
    
    echo json_encode([
        'success' => true,
        'data' => array_values($menu)
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching menu: ' . $e->getMessage()
    ]);
} finally {
    $conn->close();
}
?>