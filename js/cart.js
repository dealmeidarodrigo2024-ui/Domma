// ============================================================
// CARRINHO — persistido em localStorage, compartilhado entre páginas
// ============================================================

const CART_KEY = "domma_cart";

function formatMoney(value) {
  return STORE_CONFIG.moeda + " " + value.toFixed(2).replace(".", ",");
}

function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function addToCart(product, qty) {
  qty = qty || 1;
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id: product.id,
      nome: product.nome,
      preco: product.precoPromo || product.preco,
      imagem: product.imagem,
      material: product.material,
      qty: qty
    });
  }
  saveCart(cart);
}

function removeFromCart(id) {
  const cart = getCart().filter(item => item.id !== id);
  saveCart(cart);
}

function updateQty(id, qty) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty = Math.max(1, qty);
    saveCart(cart);
  }
}

function clearCart() {
  saveCart([]);
}

function cartTotalItems() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function cartSubtotal() {
  return getCart().reduce((sum, item) => sum + item.preco * item.qty, 0);
}

function cartShipping() {
  const subtotal = cartSubtotal();
  if (STORE_CONFIG.freteGratisAcimaDe && subtotal >= STORE_CONFIG.freteGratisAcimaDe) return 0;
  return STORE_CONFIG.freteFixo;
}

function cartTotal() {
  return cartSubtotal() + cartShipping();
}

function updateCartCount() {
  document.querySelectorAll("[data-cart-count]").forEach(el => {
    el.textContent = cartTotalItems();
  });
}

function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove("show"), 2400);
}

document.addEventListener("DOMContentLoaded", updateCartCount);
