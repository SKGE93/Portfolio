/**
 * Script principal pour le portfolio de Séraphin Eyala
 * Ce script gère les interactions et animations du site
 */

// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function() {
    
    // Gestion de la barre de navigation
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');
    
    // Fonction pour gérer le changement d'apparence de la navbar au défilement
    function handleScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Gestion du bouton retour en haut
        const backToTop = document.querySelector('.back-to-top');
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
        
        // Animation des éléments au défilement
        const fadeElements = document.querySelectorAll('.fade-in');
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (elementTop < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
    }
    
    // Écouteur d'événement pour le défilement
    window.addEventListener('scroll', handleScroll);
    
    // Appel initial pour configurer l'état correct
    handleScroll();
    
    // Gestion du menu mobile
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navbarMenu.classList.toggle('active');
        });
    }
    
    // Fermer le menu mobile lors du clic sur un lien
    const navLinks = document.querySelectorAll('.navbar-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            navbarMenu.classList.remove('active');
        });
    });
    
    // Gestion du bouton retour en haut
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Effet de zoom sur les images des cartes
    const cardImages = document.querySelectorAll('.card-image');
    cardImages.forEach(image => {
        image.addEventListener('mouseenter', function() {
            this.querySelector('img').style.transform = 'scale(1.1)';
        });
        
        image.addEventListener('mouseleave', function() {
            this.querySelector('img').style.transform = 'scale(1)';
        });
    });
    
    // Animation des titres de section au survol
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        title.addEventListener('mouseenter', function() {
            const line = this.querySelector('h2::after');
            if (line) {
                line.style.width = '120px';
            }
        });
        
        title.addEventListener('mouseleave', function() {
            const line = this.querySelector('h2::after');
            if (line) {
                line.style.width = '80px';
            }
        });
    });
    
    // Gestion des liens de navigation actifs
    function setActiveNavLink() {
        const currentLocation = window.location.pathname;
        const navLinks = document.querySelectorAll('.navbar-link');
        
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            
            // Vérifier si le chemin du lien correspond à la page actuelle
            if (currentLocation.includes(linkPath) && linkPath !== '../index.html' && linkPath !== 'index.html') {
                link.classList.add('active');
            } else if ((currentLocation.endsWith('/') || currentLocation.endsWith('index.html')) && 
                      (linkPath === 'index.html' || linkPath === '../index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // Appel initial pour configurer les liens actifs
    setActiveNavLink();
    
    // Animation des liens du pied de page
    const footerLinks = document.querySelectorAll('.footer-links a');
    footerLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.paddingLeft = '10px';
            this.style.color = '#fff';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.paddingLeft = '0';
            this.style.color = '#ccc';
        });
    });
    
    // Animation des boutons d'appel à l'action
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
    
    // Animation des cartes de projet
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px)';
            this.style.boxShadow = '0 15px 40px rgba(0,0,0,0.2)';
            
            // Animer la ligne sous le titre
            const titleLine = this.querySelector('.project-title::after');
            if (titleLine) {
                titleLine.style.width = '100%';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
            
            // Réinitialiser la ligne sous le titre
            const titleLine = this.querySelector('.project-title::after');
            if (titleLine) {
                titleLine.style.width = '0';
            }
        });
    });
});
