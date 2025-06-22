// JavaScript pour la page universitaire

// Variables pour les galeries d'images
let slideIndices = Array(10).fill(0); // Pour stocker l'index de chaque galerie

// Fonction pour ouvrir une modal de compétence
function openCompetenceModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = "block";
    setTimeout(() => {
        modal.style.opacity = "1";
    }, 10);
    document.body.style.overflow = "hidden"; // Empêcher le défilement de la page
}

// Fonction pour fermer une modal de compétence
function closeCompetenceModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.opacity = "0";
    setTimeout(() => {
        modal.style.display = "none";
        document.body.style.overflow = "auto"; // Réactiver le défilement de la page
    }, 300);
}

// Fonction pour changer de slide dans une galerie
function changeSlide(n, galleryIndex) {
    showSlide(slideIndices[galleryIndex] += n, galleryIndex);
}

// Fonction pour afficher un slide spécifique
function showSlide(n, galleryIndex) {
    const galleries = document.querySelectorAll('.gallery-slides');
    const slides = galleries[galleryIndex].querySelectorAll('.slide');
    
    if (n >= slides.length) {slideIndices[galleryIndex] = 0}
    if (n < 0) {slideIndices[galleryIndex] = slides.length - 1}
    
    galleries[galleryIndex].style.transform = `translateX(-${slideIndices[galleryIndex] * 100}%)`;
}

// Fermer les modals quand on clique en dehors
window.onclick = function(event) {
    const modals = document.querySelectorAll('.competence-modal');
    modals.forEach(modal => {
        if (event.target == modal) {
            const modalId = modal.id;
            closeCompetenceModal(modalId);
        }
    });
}

// Fermer les modals avec la touche Escape
document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        const modals = document.querySelectorAll('.competence-modal');
        modals.forEach(modal => {
            if (modal.style.display === "block") {
                const modalId = modal.id;
                closeCompetenceModal(modalId);
            }
        });
    }
});

// Initialiser les slides au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    for (let i = 0; i < slideIndices.length; i++) {
        showSlide(0, i);
    }
    
    // Animation au survol des cartes de compétences
    const competenceCards = document.querySelectorAll('.competence-card');
    competenceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.05)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});
