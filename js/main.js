// CareFuse Main JavaScript

// Global variables
let isLoading = true;
let currentSection = 'hero';

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Initialize website functionality
function initializeWebsite() {
    // Hide loading screen after content loads
    setTimeout(() => {
        hideLoadingScreen();
    }, 2000);
    
    // Initialize components
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeTooltips();
    initializeROICalculator();
    initializeModals();
    initializeTabs();
    initializeAccordions();
    initializeDropdowns();
    
    // Add smooth scrolling to all anchor links
    initializeSmoothScrolling();
    
    console.log('CareFuse website initialized successfully');
}

// Loading Screen Functions
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            isLoading = false;
        }, 500);
    }
}

// Navigation Functions
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active nav link
        updateActiveNavLink();
    });
    
    // Mobile menu toggle (if needed)
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-links');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
    
    currentSection = current;
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll Effects and Animations
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.stat-card, .problem-card, .feature-card, .evidence-panel, .platform-feature, .compliance-card, .timeline-item, .reference-item');
    
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

function initializeAnimations() {
    // Counter animation for stats
    const counters = document.querySelectorAll('.stat-number, .metric-value, .result-value');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = element.textContent.replace(/[^0-9.]/g, '');
    const targetNumber = parseFloat(target);
    
    if (isNaN(targetNumber)) return;
    
    const duration = 2000;
    const startTime = performance.now();
    const startValue = 0;
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentValue = startValue + (targetNumber - startValue) * easeOutQuart(progress);
        
        // Format the number based on original format
        if (element.textContent.includes('%')) {
            element.textContent = Math.round(currentValue) + '%';
        } else if (element.textContent.includes('$')) {
            element.textContent = '$' + formatNumber(Math.round(currentValue));
        } else if (element.textContent.includes('k')) {
            element.textContent = '≈ $' + Math.round(currentValue) + 'k';
        } else {
            element.textContent = Math.round(currentValue);
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Tooltip Functions
function initializeTooltips() {
    const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
    
    tooltipTriggers.forEach(trigger => {
        trigger.addEventListener('mouseenter', showTooltip);
        trigger.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const tooltipId = e.target.getAttribute('data-tooltip');
    const tooltip = document.getElementById(tooltipId);
    
    if (tooltip) {
        const rect = e.target.getBoundingClientRect();
        
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.bottom + 10 + 'px';
        tooltip.classList.add('show');
    }
}

function hideTooltip(e) {
    const tooltipId = e.target.getAttribute('data-tooltip');
    const tooltip = document.getElementById(tooltipId);
    
    if (tooltip) {
        tooltip.classList.remove('show');
    }
}

// Modal Functions
function initializeModals() {
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const modalCloses = document.querySelectorAll('.modal-close, .modal-overlay');
    
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', openModal);
    });
    
    modalCloses.forEach(close => {
        close.addEventListener('click', closeModal);
    });
    
    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function openModal(e) {
    e.preventDefault();
    const modalId = e.target.getAttribute('data-modal');
    const modal = document.getElementById(modalId);
    
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(e) {
    if (e && e.target.classList.contains('modal-content')) return;
    
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
        modal.classList.remove('show');
    });
    
    document.body.style.overflow = '';
}

// Tab Functions
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', switchTab);
    });
}

function switchTab(e) {
    const tabId = e.target.getAttribute('data-tab');
    const tabGroup = e.target.closest('.tabs');
    
    if (!tabGroup) return;
    
    // Remove active class from all tabs and contents
    const allTabButtons = tabGroup.querySelectorAll('.tab-button');
    const allTabContents = tabGroup.parentElement.querySelectorAll('.tab-content');
    
    allTabButtons.forEach(btn => btn.classList.remove('active'));
    allTabContents.forEach(content => content.classList.remove('active'));
    
    // Add active class to clicked tab and corresponding content
    e.target.classList.add('active');
    const targetContent = document.getElementById(tabId);
    if (targetContent) {
        targetContent.classList.add('active');
    }
}

// Accordion Functions
function initializeAccordions() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', toggleAccordion);
    });
}

function toggleAccordion(e) {
    const accordionItem = e.target.closest('.accordion-item');
    const isActive = accordionItem.classList.contains('active');
    
    // Close all accordion items in the same accordion
    const accordion = accordionItem.closest('.accordion');
    const allItems = accordion.querySelectorAll('.accordion-item');
    
    allItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
        accordionItem.classList.add('active');
    }
}

// Dropdown Functions
function initializeDropdowns() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', toggleDropdown);
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            closeAllDropdowns();
        }
    });
}

function toggleDropdown(e) {
    e.preventDefault();
    const dropdown = e.target.closest('.dropdown');
    const isActive = dropdown.classList.contains('active');
    
    closeAllDropdowns();
    
    if (!isActive) {
        dropdown.classList.add('active');
    }
}

function closeAllDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.classList.remove('active');
    });
}

// Demo and Contact Functions
function openDemo() {
    // In a real implementation, this would open a calendar booking widget
    // For now, we'll show an alert
    alert('Demo booking functionality would be integrated here. This would typically open a calendar widget like Calendly or similar booking system.');
    
    // Track the demo request
    trackEvent('demo_requested', {
        source: 'website',
        page: currentSection
    });
}

function downloadSample() {
    // In a real implementation, this would trigger a download
    alert('Sample authorization packet download would be triggered here. This would typically download a PDF file showing a sample CareFuse authorization report.');
    
    // Track the download
    trackEvent('sample_downloaded', {
        source: 'website',
        page: currentSection
    });
}

function downloadROI() {
    // Get current calculator values
    const monthlyVolume = document.getElementById('monthly-volume').value;
    const approvalRate = document.getElementById('approval-rate').value;
    const lowBenefit = document.getElementById('low-benefit').value;
    const episodeCost = document.getElementById('episode-cost').value;
    
    // In a real implementation, this would generate and download a PDF
    alert(`ROI Report would be generated with these parameters:
    
Monthly Volume: ${monthlyVolume}
Approval Rate: ${approvalRate}%
Low Benefit %: ${lowBenefit}%
Episode Cost: $${formatNumber(episodeCost)}

This would typically generate a detailed PDF report with projections and analysis.`);
    
    // Track the download
    trackEvent('roi_report_downloaded', {
        monthly_volume: monthlyVolume,
        approval_rate: approvalRate,
        low_benefit: lowBenefit,
        episode_cost: episodeCost
    });
}

function exportCSV() {
    // In a real implementation, this would export calculator data to CSV
    alert('CSV export functionality would be implemented here, allowing users to download their ROI calculations in spreadsheet format.');
    
    trackEvent('csv_exported', {
        source: 'roi_calculator'
    });
}

// Analytics and Tracking
function trackEvent(eventName, parameters = {}) {
    // In a real implementation, this would send data to analytics platforms
    console.log('Event tracked:', eventName, parameters);
    
    // Example: Google Analytics 4
    // gtag('event', eventName, parameters);
    
    // Example: Custom analytics
    // analytics.track(eventName, parameters);
}

// Form Handling
function handleFormSubmission(formElement, callback) {
    formElement.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(formElement);
        const data = Object.fromEntries(formData.entries());
        
        // Validate form data
        if (validateFormData(data)) {
            // Show loading state
            showFormLoading(formElement);
            
            // Simulate API call
            setTimeout(() => {
                hideFormLoading(formElement);
                if (callback) callback(data);
            }, 1500);
        }
    });
}

function validateFormData(data) {
    // Basic validation - extend as needed
    for (const [key, value] of Object.entries(data)) {
        if (!value.trim()) {
            showFormError(`${key} is required`);
            return false;
        }
    }
    return true;
}

function showFormError(message) {
    // Show error message to user
    alert('Form Error: ' + message);
}

function showFormLoading(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Processing...';
    }
}

function hideFormLoading(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit';
    }
}

// Search Functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');
    
    if (searchInput && searchResults) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim();
            
            if (query.length > 2) {
                searchTimeout = setTimeout(() => {
                    performSearch(query, searchResults);
                }, 300);
            } else {
                searchResults.style.display = 'none';
            }
        });
        
        // Hide results when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.search-box')) {
                searchResults.style.display = 'none';
            }
        });
    }
}

function performSearch(query, resultsContainer) {
    // In a real implementation, this would search through content or make API calls
    const mockResults = [
        { title: 'Prior Authorization Process', url: '#platform' },
        { title: 'Clinical Evidence', url: '#evidence' },
        { title: 'ROI Calculator', url: '#impact' },
        { title: 'FHIR Integration', url: '#platform' }
    ].filter(item => item.title.toLowerCase().includes(query.toLowerCase()));
    
    displaySearchResults(mockResults, resultsContainer);
}

function displaySearchResults(results, container) {
    if (results.length === 0) {
        container.innerHTML = '<div class="search-result-item">No results found</div>';
    } else {
        container.innerHTML = results.map(result => 
            `<div class="search-result-item" onclick="navigateToResult('${result.url}')">
                ${result.title}
            </div>`
        ).join('');
    }
    
    container.style.display = 'block';
}

function navigateToResult(url) {
    const element = document.querySelector(url);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Hide search results
    const searchResults = document.querySelector('.search-results');
    if (searchResults) {
        searchResults.style.display = 'none';
    }
}

// Utility Functions
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function getScrollPercentage() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    return (scrollTop / scrollHeight) * 100;
}

function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Performance Monitoring
function measurePerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            
            console.log('Performance Metrics:', {
                domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
                totalLoadTime: perfData.loadEventEnd - perfData.fetchStart
            });
        });
    }
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        error: e.error
    });
    
    // In production, send error to logging service
    // logError(e);
});

// Initialize performance monitoring
measurePerformance();

// Export functions for global access
window.CareFuse = {
    openDemo,
    downloadSample,
    downloadROI,
    exportCSV,
    trackEvent,
    navigateToResult
};

