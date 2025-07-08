document.addEventListener('DOMContentLoaded', () => {
    console.log("JavaScript file loaded and DOM fully parsed.");

    const animatedItems = document.querySelectorAll('.animated-item');

    if (!animatedItems.length) {
        console.log("No elements with class 'animated-item' found.");
        return;
    }

    const observerOptions = {
        root: null, // relative to document viewport
        rootMargin: '0px',
        threshold: 0.1 // trigger when 10% of the item is visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Unobserve the item after it has become visible to save resources
                // observer.unobserve(entry.target);
            } else {
                // Optional: Remove 'is-visible' class if you want animations to replay when scrolling out and back in
                // entry.target.classList.remove('is-visible');
            }
        });
    };

    const intersectionObserver = new IntersectionObserver(observerCallback, observerOptions);
    animatedItems.forEach(item => intersectionObserver.observe(item));

    // Navigation link highlighting logic
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('header nav ul li a');

    const navObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 // When 50% of the section is visible
    };

    const navObserverCallback = (entries, observer) => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const correspondingNavLink = document.querySelector(`header nav ul li a[href="#${id}"]`);

            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                navLinks.forEach(link => link.classList.remove('active-link'));
                if (correspondingNavLink) {
                    correspondingNavLink.classList.add('active-link');
                }
            } else {
                // Optional: remove active class if scrolling out and no other section is "active"
                // This might need more complex logic if multiple sections can be partially visible
                // For now, it only adds, relying on the next intersecting section to remove from others.
            }
        });
    };

    if (sections.length > 0 && navLinks.length > 0) {
        const navigationObserver = new IntersectionObserver(navObserverCallback, navObserverOptions);
        sections.forEach(section => navigationObserver.observe(section));
    } else {
        console.log("Sections or navigation links for active highlighting not found.");
    }


    // Portfolio Filter Logic
    const filterButtons = document.querySelectorAll('.portfolio-filter .filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-grid .portfolio-item');

    if (filterButtons.length && portfolioItems.length) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Manage active button state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');

                portfolioItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    if (filterValue === 'all' || filterValue === itemCategory) {
                        item.classList.remove('hide');
                        // Optional: Re-trigger animation if items are re-shown
                        // item.classList.remove('is-visible'); // remove to allow re-animation
                        // void item.offsetWidth; // trigger reflow
                        // if (intersectionObserver) { // Check if item is in view to animate
                        //     const rect = item.getBoundingClientRect();
                        //     if (rect.top < window.innerHeight && rect.bottom >=0) {
                        //          item.classList.add('is-visible');
                        //     }
                        // } else {
                        //      item.classList.add('is-visible'); // Fallback if not using IntersectionObserver for this
                        // }
                    } else {
                        item.classList.add('hide');
                        item.classList.remove('is-visible'); // Hide it and remove visibility for animation
                    }
                });
            });
        });
    } else {
        console.log("Portfolio filter buttons or items not found.");
    }

    // Testimonios Slider Logic
    const slides = document.querySelectorAll('.testimonio-slide');
    const nextButton = document.querySelector('.slider-controls .next');
    const prevButton = document.querySelector('.slider-controls .prev');
    let currentSlide = 0;

    if (slides.length > 0 && nextButton && prevButton) {
        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.remove('active');
                if (i === index) {
                    slide.classList.add('active');
                }
            });
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        }

        nextButton.addEventListener('click', nextSlide);
        prevButton.addEventListener('click', prevSlide);

        // Initialize slider
        showSlide(currentSlide);
    } else {
        console.log("Testimonial slider elements not found.");
    }

    // "Volver Arriba" Button Logic
    const volverArribaBtn = document.getElementById('volver-arriba');

    if (volverArribaBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { // Show button after scrolling 300px
                volverArribaBtn.style.display = 'flex'; // Make it visible
                setTimeout(() => volverArribaBtn.classList.add('show'), 10); // Add class for animation
            } else {
                volverArribaBtn.classList.remove('show');
                // Optional: delay hiding to allow animation out
                setTimeout(() => {
                    if (!volverArribaBtn.classList.contains('show')) { // check if it wasn't re-shown quickly
                         volverArribaBtn.style.display = 'none';
                    }
                }, 300); // Should match transition duration
            }
        });

        volverArribaBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default anchor behavior
            // Smooth scroll to top can be handled by html { scroll-behavior: smooth; }
            // Or implement a JS smooth scroll if more control is needed:
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    } else {
        console.log("'Volver Arriba' button not found.");
    }

    // Scroll Progress Bar Logic
    const progressBar = document.getElementById('scroll-progress-bar');

    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (scrollTop / scrollHeight) * 100;

            progressBar.style.width = scrolled + '%';
        });
    } else {
        console.log("Scroll progress bar element not found.");
    }

});
