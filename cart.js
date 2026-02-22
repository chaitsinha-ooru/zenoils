// 🛒 Zen Oils - Cart & Logic System
let cart = JSON.parse(localStorage.getItem('zenoils_cart')) || [];

function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'inline-block' : 'none';
    }
}

function addToCart(name, price, image, quantity = 1) {
    // Price comes in as "₹1,000" or similar, convert to number
    const numericPrice = typeof price === 'number' ? price : parseInt(price.replace(/[^0-9]/g, ''));

    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            name,
            price: numericPrice,
            image,
            quantity: quantity
        });
    }

    saveCart();
    updateCartBadge();

    // Show a small notification
    showToast(`${name} ${quantity > 1 ? `(${quantity}) ` : ''}added to cart`);
}

function saveCart() {
    localStorage.setItem('zenoils_cart', JSON.stringify(cart));
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'cart-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500);
        }, 2000);
    }, 100);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();

    // Attach listeners to "Add to Cart" and "Buy Now" buttons
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.add-to-cart, .add-to-cart-btn, .product-ctas button');
        if (!btn) return;

        e.stopPropagation();
        e.preventDefault();

        const card = btn.closest('.product-card, .product-info-panel, .related-card');
        if (!card) return;

        let name, price, img;

        if (card.classList.contains('product-card') || card.classList.contains('related-card')) {
            name = card.querySelector('.product-name').textContent;
            price = card.querySelector('.product-price').textContent;
            img = card.querySelector('img').src;
        } else {
            // Product detail page
            name = card.querySelector('.product-title').textContent.replace(/<br>/g, ' ').replace(/<[^>]*>?/gm, '').trim();
            price = card.querySelector('.price-main').textContent;
            img = document.querySelector('.product-main-visual img')?.src || '';
        }

        const isBuyNow = btn.textContent.toLowerCase().includes('buy now');

        // On detail pages, we might have a quantity selector
        const qtyEl = document.getElementById('qty');
        const quantity = qtyEl ? parseInt(qtyEl.textContent) : 1;

        addToCart(name, price, img, quantity);

        if (isBuyNow) {
            window.location.href = 'cart.html?checkout=true';
        }
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');

    if (mobileMenuBtn && mobileMenuOverlay) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        const closeMenu = () => {
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMenu);

        // Close when clicking a link
        mobileMenuOverlay.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }
});
