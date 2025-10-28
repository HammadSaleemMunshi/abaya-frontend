// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

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

// Product Filter Functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        productCards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease-in';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Add to Cart Functionality
const addToCartButtons = document.querySelectorAll('.btn-cart');
let cartCount = 0;

addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Add visual feedback
        const originalText = button.textContent;
        button.textContent = 'Added!';
        button.style.background = '#27ae60';
        
        // Increment cart count
        cartCount++;
        
        // Show notification
        showNotification('Item added to cart!');
        
        // Reset button after 2 seconds
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '#2c3e50';
        }, 2000);
    });
});

// Quick View Functionality
const quickViewButtons = document.querySelectorAll('.quick-view');
quickViewButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const productCard = button.closest('.product-card');
        const productData = {
            id: productCard.getAttribute('data-product-id'),
            name: productCard.getAttribute('data-product-name'),
            description: productCard.getAttribute('data-product-description'),
            price: productCard.getAttribute('data-product-price'),
            originalPrice: productCard.getAttribute('data-product-original-price'),
            image: productCard.getAttribute('data-product-image'),
            stock: parseInt(productCard.getAttribute('data-product-stock'))
        };
        
        showQuickViewModal(productData);
    });
});

// Quick View Modal
function showQuickViewModal(productData) {
    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    
    // Generate size options
    const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
    const sizeOptions = sizes.map(size => {
        const isAvailable = Math.random() > 0.3; // Random availability for demo
        return `<button class="size-option ${!isAvailable ? 'unavailable' : ''}" 
                        data-size="${size}" 
                        ${!isAvailable ? 'disabled' : ''}>
                    ${size}
                </button>`;
    }).join('');
    
    // Generate stock message
    const stockMessage = productData.stock <= 5 ? 
        `Only ${productData.stock} left in stock!` : 
        `${productData.stock} items available`;
    
    const stockClass = productData.stock <= 5 ? 'low-stock' : '';
    
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                
                <div class="modal-image-section">
                    <img src="${productData.image}" alt="${productData.name}" class="modal-image">
                </div>
                
                <div class="modal-info-section">
                    <div>
                        <h2 class="modal-product-title">${productData.name}</h2>
                        <p class="modal-product-description">${productData.description}</p>
                        
                        <div class="modal-price-section">
                            <span class="modal-current-price">Rs. ${parseInt(productData.price).toLocaleString()}</span>
                            <span class="modal-original-price">Rs. ${parseInt(productData.originalPrice).toLocaleString()}</span>
                        </div>
                        
                        <div class="modal-sizes-section">
                            <h3 class="modal-sizes-title">Size</h3>
                            <div class="modal-sizes">
                                ${sizeOptions}
                            </div>
                        </div>
                        
                        <div class="modal-quantity-section">
                            <h3 class="modal-quantity-title">Quantity</h3>
                            <div class="quantity-selector">
                                <button class="quantity-btn" id="quantity-decrease">-</button>
                                <span class="quantity-display" id="quantity-display">1</span>
                                <button class="quantity-btn" id="quantity-increase">+</button>
                            </div>
                        </div>
                        
                        <div class="modal-stock-info ${stockClass}">
                            <i class="fas fa-info-circle"></i> ${stockMessage}
                        </div>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="modal-btn modal-btn-primary" id="add-to-cart">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                        <button class="modal-btn modal-btn-secondary" id="shop-now">
                            <i class="fas fa-eye"></i> Shop Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Initialize modal state
    let selectedSize = null;
    let quantity = 1;
    
    // Get modal elements
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    const sizeOptions_el = modal.querySelectorAll('.size-option');
    const quantityDisplay = modal.querySelector('#quantity-display');
    const quantityDecrease = modal.querySelector('#quantity-decrease');
    const quantityIncrease = modal.querySelector('#quantity-increase');
    const addToCartBtn = modal.querySelector('#add-to-cart');
    const shopNowBtn = modal.querySelector('#shop-now');
    
    // Size selection functionality
    sizeOptions_el.forEach(option => {
        option.addEventListener('click', () => {
            if (option.classList.contains('unavailable')) return;
            
            // Remove selected class from all options
            sizeOptions_el.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            option.classList.add('selected');
            selectedSize = option.getAttribute('data-size');
        });
    });
    
    // Quantity functionality
    quantityDecrease.addEventListener('click', () => {
        if (quantity > 1) {
            quantity--;
            quantityDisplay.textContent = quantity;
            updateQuantityButtons();
        }
    });
    
    quantityIncrease.addEventListener('click', () => {
        if (quantity < productData.stock) {
            quantity++;
            quantityDisplay.textContent = quantity;
            updateQuantityButtons();
        }
    });
    
    function updateQuantityButtons() {
        quantityDecrease.disabled = quantity <= 1;
        quantityIncrease.disabled = quantity >= productData.stock;
    }
    
    // Add to cart functionality
    addToCartBtn.addEventListener('click', () => {
        if (!selectedSize) {
            showNotification('Please select a size first!', 'warning');
            return;
        }
        
        // Add to cart logic
        const cartItem = {
            id: productData.id,
            name: productData.name,
            price: parseInt(productData.price),
            size: selectedSize,
            quantity: quantity,
            image: productData.image
        };
        
        cart.addItem(cartItem);
        showNotification(`${productData.name} (Size: ${selectedSize}) added to cart!`, 'success');
        closeModal();
    });
    
    // Shop now functionality
    shopNowBtn.addEventListener('click', () => {
        closeModal();
        // Scroll to products section
        document.querySelector('#products').scrollIntoView({ 
            behavior: 'smooth' 
        });
    });
    
    // Close modal functionality
    function closeModal() {
        modal.classList.remove('active');
        setTimeout(() => {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
        }, 300);
    }
    
    closeBtn.addEventListener('click', closeModal);
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
    
    // Show modal with animation
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    // Initialize quantity buttons state
    updateQuantityButtons();
}

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Set icon based on type
    let icon = '';
    let bgColor = '#27ae60';
    
    switch(type) {
        case 'success':
            icon = '<i class="fas fa-check-circle"></i>';
            bgColor = '#27ae60';
            break;
        case 'warning':
            icon = '<i class="fas fa-exclamation-triangle"></i>';
            bgColor = '#f39c12';
            break;
        case 'error':
            icon = '<i class="fas fa-times-circle"></i>';
            bgColor = '#e74c3c';
            break;
        case 'info':
            icon = '<i class="fas fa-info-circle"></i>';
            bgColor = '#3498db';
            break;
    }
    
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${icon}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        max-width: 350px;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar Background Change on Scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Intersection Observer for Animations
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
    const animatedElements = document.querySelectorAll('.product-card, .feature-item, .testimonial-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Form Validation (for future forms)
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#e74c3c';
            isValid = false;
        } else {
            input.style.borderColor = '#27ae60';
        }
    });
    
    return isValid;
}

// Search Functionality (for future implementation)
function searchProducts(query) {
    const products = document.querySelectorAll('.product-card');
    const searchTerm = query.toLowerCase();
    
    products.forEach(product => {
        const title = product.querySelector('.product-title').textContent.toLowerCase();
        const description = product.querySelector('.product-description').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Cart Management (basic implementation)
class Cart {
    constructor() {
        this.items = [];
        this.loadFromStorage();
    }
    
    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({...product, quantity: 1});
        }
        this.saveToStorage();
        this.updateCartUI();
    }
    
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveToStorage();
        this.updateCartUI();
    }
    
    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    saveToStorage() {
        localStorage.setItem('noore_cart', JSON.stringify(this.items));
    }
    
    loadFromStorage() {
        const stored = localStorage.getItem('noore_cart');
        if (stored) {
            this.items = JSON.parse(stored);
        }
    }
    
    updateCartUI() {
        // Update cart count in navigation
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = this.items.length;
        }
    }
}

// Initialize cart
const cart = new Cart();

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: scale(0.9);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-icon {
        font-size: 1.2rem;
    }
    
    .notification-message {
        flex: 1;
    }
`;
document.head.appendChild(style);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('نورے (NOORe) website loaded successfully!');
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});
