document.addEventListener('DOMContentLoaded', () => {
    
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // Change icon
            const icon = mobileMenuToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('ph-list');
                icon.classList.add('ph-x');
            } else {
                icon.classList.remove('ph-x');
                icon.classList.add('ph-list');
            }
        });

        // Close menu when clicking a link
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('i');
                icon.classList.remove('ph-x');
                icon.classList.add('ph-list');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('i');
                icon.classList.remove('ph-x');
                icon.classList.add('ph-list');
            }
        });
    }

    // Reveal animations on scroll
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(reveal => {
        revealObserver.observe(reveal);
    });

    // Counter animation
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateValue(entry.target, 0, target, 2000);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 1 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.innerHTML = end + '+';
            }
        };
        window.requestAnimationFrame(step);
    }

    // Smooth scroll for nav links (only for internal links)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = 80;
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = target.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Hero Carousel
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    const slideInterval = 2000;
    let timer;

    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[n].classList.add('active');
        dots[n].classList.add('active');
        currentSlide = n;
    }

    function nextSlide() {
        let n = (currentSlide + 1) % slides.length;
        showSlide(n);
    }

    function startTimer() {
        timer = setInterval(nextSlide, slideInterval);
    }

    function stopTimer() {
        clearInterval(timer);
    }

    if (slides.length > 0) {
        startTimer();

        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', stopTimer);
            carouselContainer.addEventListener('mouseleave', startTimer);
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                // Timer is already handled by hover/leave if applicable
                // but let's reset it anyway for click interaction
                stopTimer();
                startTimer();
            });
        });
    }
    // Services Carousel
    const servicesCarousel = document.querySelector('.services-carousel');
    const prevBtn = document.querySelector('.carousel-nav.prev');
    const nextBtn = document.querySelector('.carousel-nav.next');
    const pagination = document.querySelector('.carousel-pagination');

    if (servicesCarousel) {
        const cards = servicesCarousel.querySelectorAll('.service-card');
        const cardCount = cards.length;
        
        // Create pagination dots
        for (let i = 0; i < cardCount; i++) {
            const dot = document.createElement('span');
            dot.classList.add('pagination-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                const scrollAmount = cards[i].offsetLeft - servicesCarousel.offsetLeft;
                servicesCarousel.scrollTo({
                    left: scrollAmount - 20, // Adjust for padding
                    behavior: 'smooth'
                });
            });
            pagination.appendChild(dot);
        }

        const dots = document.querySelectorAll('.pagination-dot');

        const updateDots = () => {
            const scrollLeft = servicesCarousel.scrollLeft;
            const containerWidth = servicesCarousel.offsetWidth;
            const cardWidth = cards[0].offsetWidth + 24; // Width + gap
            
            let activeIndex = Math.round(scrollLeft / cardWidth);
            activeIndex = Math.max(0, Math.min(activeIndex, cardCount - 1));

            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === activeIndex);
            });
        };

        // Autoscroll logic
        let autoscrollTimer;
        const startAutoscroll = () => {
            autoscrollTimer = setInterval(() => {
                const isAtEnd = servicesCarousel.scrollLeft + servicesCarousel.offsetWidth >= servicesCarousel.scrollWidth - 10;
                if (isAtEnd) {
                    servicesCarousel.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    servicesCarousel.scrollBy({ left: servicesCarousel.offsetWidth, behavior: 'smooth' });
                }
            }, 5000); // 5 seconds between slides for better readability
        };

        const stopAutoscroll = () => clearInterval(autoscrollTimer);

        servicesCarousel.addEventListener('mouseenter', stopAutoscroll);
        servicesCarousel.addEventListener('mouseleave', startAutoscroll);
        
        // Initial start
        startAutoscroll();

        prevBtn.addEventListener('click', () => {
            stopAutoscroll();
            servicesCarousel.scrollBy({
                left: -(servicesCarousel.offsetWidth),
                behavior: 'smooth'
            });
            startAutoscroll();
        });

        nextBtn.addEventListener('click', () => {
            stopAutoscroll();
            servicesCarousel.scrollBy({
                left: servicesCarousel.offsetWidth,
                behavior: 'smooth'
            });
            startAutoscroll();
        });

        // Initial check for dots
        updateDots();
    }
});
