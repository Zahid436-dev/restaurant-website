-- Création de la base de données
CREATE DATABASE IF NOT EXISTS restaurant_db;
USE restaurant_db;

-- Table des catégories de menu
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des plats du menu
CREATE TABLE menu_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(500),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Table des réservations
CREATE TABLE reservations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    date DATE NOT NULL,
    time TIME NOT NULL,
    guests INT NOT NULL,
    special_requests TEXT,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des messages de contact
CREATE TABLE contact_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertion des données de démonstration
INSERT INTO categories (name) VALUES
('Entrées'),
('Plats Principaux'),
('Desserts'),
('Boissons');

INSERT INTO menu_items (category_id, name, description, price) VALUES
(1, 'Tartare de Saumon', 'Saumon frais, avocat, citron vert et zestes', 14.00),
(1, 'Velouté de Potimarron', 'Crème de noisette, graines de courge', 9.00),
(1, 'Escargots de Bourgogne', 'Beurre persillé, ail, chapelure', 12.00),
(2, 'Magret de Canard', 'Sauce au miel et épices, pommes grenailles', 24.00),
(2, 'Filet de Bar', 'Risotto crémeux aux asperges, beurre blanc', 27.00),
(2, 'Côte de Boeuf (500g)', 'Frites maison, sauce béarnaise', 32.00),
(2, 'Risotto aux Champignons', 'Parmesan, truffe noire', 19.00),
(3, 'Fondant au Chocolat', 'Cœur coulant, glace vanille', 8.00),
(3, 'Tarte Tatin', 'Pommes caramélisées, crème fraîche', 9.00),
(3, 'Profiteroles', 'Choux, glace vanille, sauce chocolat', 10.00),
(4, 'Vin Rouge', 'Bordeaux, 75cl', 38.00),
(4, 'Champagne', 'Brut impérial, coupe', 12.00),
(4, 'Cocktail Signature', 'Gin, basilic, citron vert', 11.00);