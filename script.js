let loginType = 'customer';
let cart = [];

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    const el = document.getElementById(pageId);
    if (el) el.classList.add('active');
}

function setLoginType(type, ev) {
    loginType = type;
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    if (ev && ev.currentTarget) ev.currentTarget.classList.add('active');
}

function handleLogin(event) {
    event.preventDefault();
    if (loginType === 'seller') {
        showPage('seller');
    } else {
        showPage('customer');
    }
}

function openModal(modalType) {
    const el = document.getElementById(modalType + 'Modal');
    if (el) el.classList.add('active');
}

function closeModal(modalType) {
    const el = document.getElementById(modalType + 'Modal');
    if (el) el.classList.remove('active');
}

function addProduct(event) {
    event.preventDefault();
    alert('Produto adicionado com sucesso!');
    closeModal('addProduct');
}

function addToCart(name, price, ev) {
    cart.push({ name, price });
    updateCartUI();
    if (!ev) return;
    const btn = ev.currentTarget || ev.target;
    if (!btn) return;
    const originalText = btn.textContent;
    btn.textContent = '✓ Adicionado!';
    btn.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
    }, 1500);
}

function updateCartUI() {
    const badge = document.getElementById('cartCount');
    if (badge) {
        badge.textContent = cart.length;
        badge.style.animation = 'none';
        setTimeout(() => badge.style.animation = '', 10);
    }

    const cartItemsDiv = document.getElementById('cartItems');
    if (!cartItemsDiv) return;
    cartItemsDiv.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
        total += item.price;
        const itemHtml = document.createElement('div');
        itemHtml.style.cssText = 'padding: 1.5rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1); display: flex; justify-content: space-between; align-items: center; background: rgba(255, 255, 255, 0.03); border-radius: 15px; margin-bottom: 1rem;';
        itemHtml.innerHTML = `
            <div>
                <h4 style="margin-bottom: 0.5rem; color: white;">${item.name}</h4>
                <p style="background: linear-gradient(135deg, var(--primary-orange), #ff8c42); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-weight: bold; font-size: 1.2rem;">R$ ${item.price.toFixed(2)}</p>
            </div>
            <button data-index="${index}" style="background: linear-gradient(135deg, #e74c3c, #c0392b); color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; font-weight: 600; transition: all 0.3s;">Remover</button>
        `;
        const removeBtn = itemHtml.querySelector('button');
        removeBtn.addEventListener('click', () => removeFromCart(index));
        cartItemsDiv.appendChild(itemHtml);
    });
    const totalEl = document.getElementById('cartTotal');
    if (totalEl) totalEl.textContent = `R$ ${total.toFixed(2)}`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// Category filter animation
document.addEventListener('DOMContentLoaded', () => {
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Make sure buttons that were using inline onclick still work
    document.querySelectorAll('[data-show-page]').forEach(el => {
        el.addEventListener('click', (e) => { e.preventDefault(); showPage(el.getAttribute('data-show-page')); });
    });

    document.querySelectorAll('[data-open-modal]').forEach(el => {
        el.addEventListener('click', (e) => { e.preventDefault(); openModal(el.getAttribute('data-open-modal')); });
    });

    document.querySelectorAll('[data-close-modal]').forEach(el => {
        el.addEventListener('click', (e) => { e.preventDefault(); closeModal(el.getAttribute('data-close-modal')); });
    });

    // Tab buttons for login type
    document.querySelectorAll('[data-login-type]').forEach(el => {
        el.addEventListener('click', (e) => {
            const type = el.getAttribute('data-login-type');
            setLoginType(type, e);
        });
    });

    // Attach add to cart handlers for existing buttons
    document.querySelectorAll('[data-add-to-cart]').forEach(el => {
        const name = el.getAttribute('data-name');
        const price = parseFloat(el.getAttribute('data-price')) || 0;
        el.addEventListener('click', (e) => addToCart(name, price, e));
    });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList && e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});
