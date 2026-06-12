// app.js — основная логика интернет-магазина
'use strict';

// ===== DOM references with error handling =====
function getElement(id) {
  const el = document.getElementById(id);
  if (!el) {
    console.warn(`Element with id "${id}" not found`);
  }
  return el;
}

const productsGrid = getElement('productsGrid');
const loader = getElement('loader');
const cartBadge = getElement('cartBadge');
const cartIcon = getElement('cartIcon');
const cartSection = getElement('cartSection');
const cartContent = getElement('cartContent');
const cartSummary = getElement('cartSummary');
const cartTotal = getElement('cartTotal');
const checkoutBtn = getElement('checkoutBtn');
const checkoutSection = getElement('checkoutSection');
const orderForm = getElement('orderForm');
const modalOverlay = getElement('modalOverlay');
const modalClose = getElement('modalClose');
const modalContent = getElement('modalContent');
const searchInput = getElement('searchInput');
const searchBtn = getElement('searchBtn');
const categoryFilter = getElement('categoryFilter');
const brandFilter = getElement('brandFilter');
const priceMin = getElement('priceMin');
const priceMax = getElement('priceMax');
const applyFilters = getElement('applyFilters');
const burgerBtn = getElement('burgerBtn');
const mainNav = getElement('mainNav');

// ===== State =====
let cart = [];
try {
  const savedCart = localStorage.getItem('dnsCart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    if (!Array.isArray(cart)) cart = [];
  }
} catch (e) {
  console.error('Error loading cart from localStorage:', e);
  cart = [];
}

let displayedProducts = [...productsData];
const itemsPerPage = 6;
let currentPage = 1;
let isLoading = false;
let observer = null;

// ===== Utility =====
function formatPrice(price) {
  return price.toLocaleString('ru-RU');
}

function updateCartBadge() {
  if (!cartBadge) return;
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartBadge.textContent = count;
}

function saveCart() {
  try {
    localStorage.setItem('dnsCart', JSON.stringify(cart));
  } catch (e) {
    console.error('Error saving cart to localStorage:', e);
  }
  updateCartBadge();
}

// ===== Render products =====
function renderProducts(products, append = false) {
  if (!productsGrid) return;

  if (!append) {
    productsGrid.innerHTML = '';
    currentPage = 1;
  }

  const start = append ? (currentPage - 1) * itemsPerPage : 0;
  const end = start + itemsPerPage;
  const batch = products.slice(start, end);

  if (batch.length === 0 && !append) {
    productsGrid.innerHTML = '<p class="cart-empty">Товары не найдены</p>';
    return;
  }

  batch.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.id;
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" loading="lazy">
      <div class="product-card__body">
        <h3 class="product-card__title">${product.name}</h3>
        <p class="product-card__description">${product.description}</p>
        <p class="product-card__price">${formatPrice(product.price)} ₽</p>
        <div class="product-card__actions">
          <button class="btn btn--primary add-to-cart" data-id="${product.id}">В корзину</button>
          <button class="btn btn--secondary quick-view" data-id="${product.id}">Быстрый просмотр</button>
        </div>
      </div>
    `;
    productsGrid.appendChild(card);
  });

  // Attach event listeners to new buttons
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = parseInt(this.dataset.id);
      addToCart(id);
    });
  });

  document.querySelectorAll('.quick-view').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = parseInt(this.dataset.id);
      showQuickView(id);
    });
  });

  // Setup lazy loading for new cards
  setupLazyLoading();
}

// ===== Lazy loading with Intersection Observer =====
function setupLazyLoading() {
  if (!productsGrid) return;

  if (observer) {
    observer.disconnect();
  }

  const sentinel = document.createElement('div');
  sentinel.className = 'sentinel';
  sentinel.style.height = '1px';
  productsGrid.appendChild(sentinel);

  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !isLoading) {
        const totalPages = Math.ceil(displayedProducts.length / itemsPerPage);
        if (currentPage < totalPages) {
          isLoading = true;
          if (loader) loader.style.display = 'block';
          setTimeout(() => {
            currentPage++;
            renderProducts(displayedProducts, true);
            isLoading = false;
            if (loader) loader.style.display = 'none';
          }, 300);
        }
      }
    });
  }, { threshold: 0.1 });

  observer.observe(sentinel);
}

// ===== Filter products =====
function filterProducts() {
  try {
    let filtered = [...productsData];

    const category = categoryFilter ? categoryFilter.value : 'all';
    const brand = brandFilter ? brandFilter.value : 'all';
    const minPrice = priceMin ? parseFloat(priceMin.value) || 0 : 0;
    const maxPrice = priceMax ? parseFloat(priceMax.value) || Infinity : Infinity;
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

    if (category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }
    if (brand !== 'all') {
      filtered = filtered.filter(p => p.brand === brand);
    }
    filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);
    if (searchTerm) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm));
    }

    displayedProducts = filtered;
    renderProducts(filtered);
  } catch (e) {
    console.error('Error filtering products:', e);
  }
}

// ===== Cart functions =====
function addToCart(productId) {
  try {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(item => item.id === productId);
    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    showModal(`Товар "${product.name}" добавлен в корзину`);
  } catch (e) {
    console.error('Error adding to cart:', e);
  }
}

function removeFromCart(productId) {
  try {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
  } catch (e) {
    console.error('Error removing from cart:', e);
  }
}

function updateQuantity(productId, delta) {
  try {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    saveCart();
    renderCart();
  } catch (e) {
    console.error('Error updating quantity:', e);
  }
}

function renderCart() {
  if (!cartContent || !cartSummary || !cartTotal) return;

  if (cart.length === 0) {
    cartContent.innerHTML = '<p class="cart-empty">Корзина пуста</p>';
    cartSummary.style.display = 'none';
    return;
  }

  cartSummary.style.display = 'block';
  let html = '';
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;
    html += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item__info">
          <p class="cart-item__title">${item.name}</p>
          <p class="cart-item__price">${formatPrice(item.price)} ₽</p>
        </div>
        <div class="cart-item__quantity">
          <button class="qty-minus" data-id="${item.id}">−</button>
          <span>${item.quantity}</span>
          <button class="qty-plus" data-id="${item.id}">+</button>
        </div>
        <button class="btn btn--danger remove-item" data-id="${item.id}">Удалить</button>
      </div>
    `;
  });

  cartContent.innerHTML = html;
  cartTotal.textContent = formatPrice(total);

  // Attach event listeners
  document.querySelectorAll('.qty-minus').forEach(btn => {
    btn.addEventListener('click', function() {
      updateQuantity(parseInt(this.dataset.id), -1);
    });
  });

  document.querySelectorAll('.qty-plus').forEach(btn => {
    btn.addEventListener('click', function() {
      updateQuantity(parseInt(this.dataset.id), 1);
    });
  });

  document.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', function() {
      removeFromCart(parseInt(this.dataset.id));
    });
  });
}

// ===== Quick view modal =====
function showQuickView(productId) {
  try {
    const product = productsData.find(p => p.id === productId);
    if (!product || !modalContent || !modalOverlay) return;

    modalContent.innerHTML = `
      <img src="${product.image}" alt="${product.name}" style="width:100%;max-height:300px;object-fit:cover;border-radius:8px;margin-bottom:16px;">
      <h3 style="margin-bottom:8px;">${product.name}</h3>
      <p style="margin-bottom:12px;color:#555;">${product.description}</p>
      <p style="font-size:1.3rem;font-weight:700;color:var(--primary);margin-bottom:16px;">${formatPrice(product.price)} ₽</p>
      <button class="btn btn--primary" id="quickAddToCart" data-id="${product.id}">В корзину</button>
    `;
    modalOverlay.style.display = 'flex';

    const quickAddBtn = document.getElementById('quickAddToCart');
    if (quickAddBtn) {
      quickAddBtn.addEventListener('click', function() {
        addToCart(parseInt(this.dataset.id));
        modalOverlay.style.display = 'none';
      });
    }
  } catch (e) {
    console.error('Error showing quick view:', e);
  }
}

function showModal(message) {
  if (!modalContent || !modalOverlay) return;
  modalContent.innerHTML = `<p style="font-size:1.1rem;">${message}</p>`;
  modalOverlay.style.display = 'flex';
}

// ===== Form validation =====
function validateForm() {
  try {
    const name = document.getElementById('orderName');
    const phone = document.getElementById('orderPhone');
    const address = document.getElementById('orderAddress');
    const nameError = document.getElementById('nameError');
    const phoneError = document.getElementById('phoneError');
    const addressError = document.getElementById('addressError');

    let isValid = true;

    // Reset errors
    if (nameError) nameError.textContent = '';
    if (phoneError) phoneError.textContent = '';
    if (addressError) addressError.textContent = '';

    if (!name || !phone || !address) return false;

    // Name validation
    if (name.value.trim().length < 3) {
      if (nameError) nameError.textContent = 'Введите полное ФИО (минимум 3 символа)';
      isValid = false;
    }

    // Phone validation
    const phoneRegex = /^[\+\d\s\-\(\)]{7,20}$/;
    if (!phoneRegex.test(phone.value.trim())) {
      if (phoneError) phoneError.textContent = 'Введите корректный номер телефона';
      isValid = false;
    }

    // Address validation
    if (address.value.trim().length < 10) {
      if (addressError) addressError.textContent = 'Введите полный адрес (минимум 10 символов)';
      isValid = false;
    }

    return isValid;
  } catch (e) {
    console.error('Error validating form:', e);
    return false;
  }
}

// ===== Event listeners =====
if (applyFilters) {
  applyFilters.addEventListener('click', filterProducts);
}

if (searchBtn) {
  searchBtn.addEventListener('click', filterProducts);
}

if (searchInput) {
  searchInput.addEventListener('keyup', function(e) {
    if (e.key === 'Enter') filterProducts();
  });
}

if (cartIcon) {
  cartIcon.addEventListener('click', function() {
    if (cartSection) {
      cartSection.style.display = cartSection.style.display === 'none' ? 'block' : 'none';
      renderCart();
    }
  });
}

if (checkoutBtn) {
  checkoutBtn.addEventListener('click', function() {
    if (checkoutSection) {
      checkoutSection.style.display = 'block';
      checkoutSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

if (orderForm) {
  orderForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (validateForm()) {
      showModal('Спасибо! Ваш заказ оформлен. Мы свяжемся с вами в ближайшее время.');
      cart = [];
      saveCart();
      renderCart();
      if (checkoutSection) checkoutSection.style.display = 'none';
      if (cartSection) cartSection.style.display = 'none';
    }
  });
}

if (modalOverlay) {
  modalOverlay.addEventListener('click', function(e) {
    if (e.target === modalOverlay) {
      modalOverlay.style.display = 'none';
    }
  });
}

if (modalClose) {
  modalClose.addEventListener('click', function() {
    if (modalOverlay) modalOverlay.style.display = 'none';
  });
}

if (burgerBtn && mainNav) {
  burgerBtn.addEventListener('click', function() {
    mainNav.classList.toggle('active');
  });
}

// ===== Initialization =====
function init() {
  try {
    renderProducts(productsData);
    updateCartBadge();
  } catch (e) {
    console.error('Error initializing app:', e);
  }
}

document.addEventListener('DOMContentLoaded', init);