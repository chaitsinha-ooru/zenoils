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

function addToCart(name, price, image) {
    // Price comes in as "₹1,000" or similar, convert to number
    const numericPrice = parseInt(price.replace(/[^0-9]/g, ''));

    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price: numericPrice,
            image,
            quantity: 1
        });
    }

    saveCart();
    updateCartBadge();

    // Show a small notification
    showToast(`${name} added to cart`);
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

    // Attach listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart, .add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card click
            e.preventDefault();

            const card = btn.closest('.product-card, .product-info-panel, .related-card');
            let name, price, img;

            if (card.classList.contains('product-card') || card.classList.contains('related-card')) {
                name = card.querySelector('.product-name').textContent;
                price = card.querySelector('.product-price').textContent;
                img = card.querySelector('img').src;
            } else {
                // Product detail page
                name = card.querySelector('.product-title').textContent.replace('<br>', '').replace('<em>', '').replace('</em>', '');
                price = card.querySelector('.price-main').textContent;
                img = document.querySelector('.product-main-visual img')?.src || '';
            }

            addToCart(name, price, img);
        });
    });
});
