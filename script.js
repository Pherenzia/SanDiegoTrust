// Mobile Navigation Toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Contact Form Handling with Web3Forms
const contactForm = document.getElementById('contactForm');
const formResult = document.getElementById('formResult');

contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Basic validation
    if (!data.name || !data.email || !data.service || !data.message) {
        showFormResult('Please fill in all required fields.', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showFormResult('Please enter a valid email address.', 'error');
        return;
    }
    
    // Add Web3Forms access key
    formData.append("access_key", "673a0aa3-a0bb-4cf4-b823-0179724e1364");
    
    // Update UI
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    showFormResult('Sending message...', 'sending');
    
    try {
        // Submit to Web3Forms
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            showFormResult('Thank you! Your message has been sent successfully. We will get back to you soon.', 'success');
            this.reset();
        } else {
            console.log("Error", result);
            showFormResult(result.message || 'An error occurred. Please try again.', 'error');
        }
    } catch (error) {
        console.error("Form submission error:", error);
        showFormResult('An error occurred. Please try again.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
});

// Function to show form result
function showFormResult(message, type) {
    formResult.textContent = message;
    formResult.className = `form-result show ${type}`;
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            formResult.classList.remove('show');
        }, 5000);
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Simple Hero Carousel
document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.carousel-slide');
    if (!slides || slides.length === 0) return;

    let current = 0;
    slides[current].classList.add('active');

    const showSlide = (index) => {
        slides.forEach((s, i) => s.classList.toggle('active', i === index));
    };

    let interval = setInterval(() => {
        current = (current + 1) % slides.length;
        showSlide(current);
    }, 5000);

    // Pause on hover over hero-image
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        heroImage.addEventListener('mouseenter', () => clearInterval(interval));
        heroImage.addEventListener('mouseleave', () => {
            interval = setInterval(() => {
                current = (current + 1) % slides.length;
                showSlide(current);
            }, 5000);
        });
    }

    // Trigger hero text animation on page load
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero-content, .hero-title, .hero-subtitle, .hero-buttons, .hero-card');
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                
                // Add floating animation to hero card after rise-up completes
                if (element.classList.contains('hero-card')) {
                    setTimeout(() => {
                        element.classList.add('animation-complete');
                    }, 1200); // Wait for rise-up animation to complete
                }
            }, index * 200);
        });
    }, 100);
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .stat');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + (element.textContent.includes('+') ? '+' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + (element.textContent.includes('+') ? '+' : '');
        }
    }, 16);
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat h3');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.textContent);
                animateCounter(stat, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Observe stats section
const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Form field focus effects
document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(field => {
    field.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    field.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.classList.remove('focused');
        }
    });
});

// Add loading state to buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        if (this.type === 'submit') return; // Skip form submit buttons
        
        // Add ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .form-group.focused input,
    .form-group.focused select,
    .form-group.focused textarea {
        border-color: #2563eb;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }
`;
document.head.appendChild(style);

// Lazy loading for images (if any are added later)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(() => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Testimonials Carousel
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.testimonials-carousel');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.carousel-btn-prev');
    const nextBtn = document.querySelector('.carousel-btn-next');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    if (!carousel || !cards || cards.length === 0) return;
    
    let currentIndex = 0;
    let autoPlayInterval;
    let cardsPerView = getCardsPerView();
    
    // Get number of cards to show based on screen size
    function getCardsPerView() {
        if (window.innerWidth <= 480) return 1;
        if (window.innerWidth <= 768) return 2;
        return 3;
    }
    
    // Calculate total slides needed
    function getTotalSlides() {
        return Math.max(1, cards.length - cardsPerView + 1);
    }
    
    // Create dots based on total slides
    function createDots() {
        dotsContainer.innerHTML = '';
        const totalSlides = getTotalSlides();
        
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    // Show slide function
    function showSlide(index) {
        const totalSlides = getTotalSlides();
        currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
        
        // Get actual card dimensions using getBoundingClientRect for accuracy
        const firstCard = cards[0];
        const cardRect = firstCard.getBoundingClientRect();
        const carouselRect = carousel.getBoundingClientRect();
        
        // Calculate gap from computed style
        const computedStyle = window.getComputedStyle(carousel);
        const gap = parseFloat(computedStyle.gap) || 24;
        
        // Use actual card width from the DOM
        const cardWidth = cardRect.width;
        const moveDistance = (cardWidth + gap) * currentIndex;
        
        // Move the carousel
        carousel.style.transform = `translateX(-${moveDistance}px)`;
        
        // Update dots
        const dots = document.querySelectorAll('.carousel-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }
    
    // Go to specific slide
    function goToSlide(index) {
        showSlide(index);
        resetAutoPlay();
    }
    
    // Next slide
    function nextSlide() {
        const totalSlides = getTotalSlides();
        const next = currentIndex >= totalSlides - 1 ? 0 : currentIndex + 1;
        showSlide(next);
    }
    
    // Previous slide
    function prevSlide() {
        const totalSlides = getTotalSlides();
        const prev = currentIndex <= 0 ? totalSlides - 1 : currentIndex - 1;
        showSlide(prev);
    }
    
    // Auto play
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }
    
    // Event listeners
    if (prevBtn) prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
    });
    
    if (nextBtn) nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
    });
    
    // Pause on hover
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
    
    // Touch support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoPlay();
    });
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoPlay();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            nextSlide();
        }
        if (touchEndX > touchStartX + swipeThreshold) {
            prevSlide();
        }
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoPlay();
        }
        if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoPlay();
        }
    });
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newCardsPerView = getCardsPerView();
            if (newCardsPerView !== cardsPerView) {
                cardsPerView = newCardsPerView;
                createDots();
                showSlide(0);
            } else {
                showSlide(currentIndex);
            }
        }, 250);
    });
    
    // Initialize - wait for layout to be calculated
    setTimeout(() => {
        createDots();
        showSlide(0);
        startAutoPlay();
    }, 100);
});