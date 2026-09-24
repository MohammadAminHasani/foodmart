const searchInput = document.getElementById("search-Input");
const categoryFilter = document.getElementById("category-filter");
const productCards = document.querySelectorAll(".card-Section, .ux-Box");

// ====================
// Product Search + Category Filter
// ====================

function applyFilters() {
  const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : "";
  const selectedCategory = categoryFilter ? categoryFilter.value.toLowerCase() : "";

  productCards.forEach((card) => {
    const nameElement = card.querySelector("strong");
    const categoryElement = card.querySelector("span");

    const productName = nameElement ? nameElement.textContent.trim().toLowerCase() : "";
    const category = categoryElement ? categoryElement.textContent.trim().toLowerCase() : "";

    const matchesSearch = !searchTerm || productName.includes(searchTerm);
    const matchesCategory = !selectedCategory || category.includes(selectedCategory);

    card.style.display = matchesSearch && matchesCategory ? "" : "none";
  });
}

if (searchInput) {
  searchInput.addEventListener("input", applyFilters);
}

if (categoryFilter) {
  categoryFilter.addEventListener("change", applyFilters);
}

// ====================
// Quantity Controls
// ====================

const minusButtons = document.querySelectorAll(".minus");
const plusButtons = document.querySelectorAll(".plus");

minusButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const input = button.nextElementSibling;

    if (input && Number(input.value) > 1) {
      input.value = Number(input.value) - 1;
    }
  });
});

plusButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const input = button.previousElementSibling;

    if (input) {
      input.value = Number(input.value) + 1;
    }
  });
});

// ====================
// Shopping Cart
// ====================

const cartButtons = document.querySelectorAll(".add-to-cart");
const cartCountElement = document.getElementById("cart-count");
const cartTotalElement = document.getElementById("cart-total");
const cartButton = document.getElementById("cart-button");
const cartPanel = document.getElementById("cart-panel");
const cartBackdrop = document.getElementById("cart-backdrop");
const closeCart = document.getElementById("close-cart");
const cartItems = document.getElementById("cart-items");
const checkoutButton = document.getElementById("checkout-button");

function openCart() {
  if (cartPanel) cartPanel.classList.add("open");
  if (cartBackdrop) cartBackdrop.classList.add("open");
}

function closeCartPanel() {
  if (cartPanel) cartPanel.classList.remove("open");
  if (cartBackdrop) cartBackdrop.classList.remove("open");
}


let cart = [];


function getProductFromCard(card) {
  const nameElement = card.querySelector("strong");
  const name = nameElement ? nameElement.textContent.trim() : "Item";

  
  const priceElement = card.querySelector(".price-Box b") || card.querySelector(":scope > b");
  const priceText = priceElement ? priceElement.textContent : "0";
  const price = parseFloat(priceText.replace(/[^0-9.]/g, "")) || 0;

  const imageElement = card.querySelector(".card-Item img") || card.querySelector("img");
  const image = imageElement ? imageElement.getAttribute("src") : "";

  const qtyInput = card.querySelector(".quantity-Box input");
  const qty = qtyInput ? Math.max(1, Number(qtyInput.value) || 1) : 1;

  return { name, price, image, qty };
}

function renderCart() {
  if (!cartItems) return;

  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="cart-empty">
        <span class="cart-empty-icon">🛒</span>
        <p>Your cart is empty.</p>
      </div>
    `;
    updateCartSummary();
    return;
  }

  cart.forEach((item, index) => {
    const row = document.createElement("div");
    row.classList.add("cart-item");
    row.innerHTML = `
      <div class="cart-item-image">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-item-info">
        <strong>${item.name}</strong>
        <span>Qty: ${item.qty} &nbsp;&bull;&nbsp; <b>${(item.qty * item.price).toFixed(2)} DA</b></span>
      </div>
      <button class="remove-item" data-index="${index}" aria-label="Remove ${item.name}">&times;</button>
    `;
    cartItems.appendChild(row);
  });

  updateCartSummary();
}

function updateCartSummary() {
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  if (cartCountElement) {
    cartCountElement.textContent = totalCount;
  }

  if (cartTotalElement) {
    cartTotalElement.textContent = totalPrice.toFixed(2);
  }

  if (checkoutButton) {
    checkoutButton.disabled = cart.length === 0;
  }
}

// Open cart (click again to close)
if (cartButton && cartPanel) {
  cartButton.addEventListener("click", () => {
    if (cartPanel.classList.contains("open")) {
      closeCartPanel();
    } else {
      openCart();
    }
  });
}

// Close cart
if (closeCart && cartPanel) {
  closeCart.addEventListener("click", closeCartPanel);
}

// Close cart when clicking the dimmed backdrop
if (cartBackdrop) {
  cartBackdrop.addEventListener("click", closeCartPanel);
}

// Add product to cart
cartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".card-Section, .ux-Box");
    if (!card) return;

    const product = getProductFromCard(card);
    const existingItem = cart.find((item) => item.name === product.name);

    if (existingItem) {
      existingItem.qty += product.qty;
    } else {
      cart.push(product);
    }

    renderCart();
    openCart();
  });
});

if (cartItems) {
  cartItems.addEventListener("click", (event) => {
    const removeButton = event.target.closest(".remove-item");
    if (!removeButton) return;

    const index = Number(removeButton.dataset.index);
    cart.splice(index, 1);
    renderCart();
  });
}

if (checkoutButton) {
  checkoutButton.addEventListener("click", () => {
    if (cart.length === 0) return;

    cart = [];

    if (cartItems) {
      cartItems.innerHTML = `
        <div class="cart-empty">
          <span class="cart-empty-icon">🎉</span>
          <p>Order placed! Thanks for shopping with Foodmart.</p>
        </div>
      `;
    }

    updateCartSummary();
  });
}