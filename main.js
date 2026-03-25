// Menu mobile toggle
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-links');

if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Navigation smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === "#" || targetId === "") return;
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        }
    });
});

// Chargement du menu depuis PHP
async function loadMenu() {
    const menuContainer = document.getElementById('menu-content');
    const loadingDiv = document.getElementById('menu-loading');
    
    if (!menuContainer) return;
    
    try {
        const response = await fetch('php/get_menu.php');
        const data = await response.json();
        
        if (data.success) {
            displayMenu(data.data);
            loadingDiv.style.display = 'none';
            menuContainer.style.display = 'block';
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        loadingDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> Erreur lors du chargement du menu';
        console.error('Error:', error);
    }
}

function displayMenu(categories) {
    const menuContainer = document.getElementById('menu-content');
    menuContainer.innerHTML = '';
    
    categories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'menu-category';
        
        categoryDiv.innerHTML = `
            <div class="category-header">${category.category_name}</div>
            <div class="menu-items">
                ${category.items.map(item => `
                    <div class="menu-item">
                        <div class="item-info">
                            <h3>${escapeHtml(item.name)}</h3>
                            <p>${escapeHtml(item.description)}</p>
                        </div>
                        <div class="item-price">${item.price} €</div>
                    </div>
                `).join('')}
            </div>
        `;
        
        menuContainer.appendChild(categoryDiv);
    });
}

// Gestion des réservations
const reservationForm = document.getElementById('reservationForm');
if (reservationForm) {
    // Définir la date minimale
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
    
    reservationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            guests: document.getElementById('guests').value,
            special_requests: document.getElementById('special_requests')?.value || ''
        };
        
        // Validation simple
        if (!formData.name || !formData.email || !formData.date || !formData.time) {
            showMessage('Veuillez remplir tous les champs obligatoires', 'error');
            return;
        }
        
        const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showMessage('Email invalide', 'error');
            return;
        }
        
        try {
            const response = await fetch('php/reservation.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (data.success) {
                showModal();
                reservationForm.reset();
                showMessage(data.message, 'success');
            } else {
                showMessage(data.message, 'error');
            }
        } catch (error) {
            showMessage('Erreur de connexion au serveur', 'error');
            console.error('Error:', error);
        }
    });
}

// Gestion du formulaire de contact
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('contact_name').value.trim(),
            email: document.getElementById('contact_email').value.trim(),
            phone: document.getElementById('contact_phone').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            message: document.getElementById('message').value.trim()
        };
        
        if (!formData.name || !formData.email || !formData.message) {
            showContactMessage('Veuillez remplir tous les champs obligatoires', 'error');
            return;
        }
        
        const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showContactMessage('Email invalide', 'error');
            return;
        }
        
        try {
            const response = await fetch('php/contact.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (data.success) {
                showModal();
                contactForm.reset();
                showContactMessage(data.message, 'success');
            } else {
                showContactMessage(data.message, 'error');
            }
        } catch (error) {
            showContactMessage('Erreur de connexion au serveur', 'error');
            console.error('Error:', error);
        }
    });
}

// Fonctions utilitaires
function showMessage(message, type) {
    const messageDiv = document.getElementById('formMessage');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = `message-area ${type}`;
        setTimeout(() => {
            messageDiv.textContent = '';
            messageDiv.className = 'message-area';
        }, 5000);
    }
}

function showContactMessage(message, type) {
    const messageDiv = document.getElementById('contactMessage');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = `message-area ${type}`;
        setTimeout(() => {
            messageDiv.textContent = '';
            messageDiv.className = 'message-area';
        }, 5000);
    }
}

function showModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Fermer le modal en cliquant à l'extérieur
window.onclick = function(event) {
    const modal = document.getElementById('successModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

// Charger le menu si on est sur la page menu
if (document.getElementById('menu-content')) {
    loadMenu();
}