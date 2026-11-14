/*
  CONFIGURAÇÃO DA LIVRARIA
  1) WhatsApp: coloque o número com código do país + DDD, somente números.
     Exemplo fictício: 5511988887777
  2) Endereço: coloque o endereço físico completo. Não invente: deixe vazio
     enquanto a livraria não tiver um endereço para divulgar.
*/
const STORE_CONFIG = {
  whatsapp: "5511948593840",
  address: "Itaquera, São Paulo - SP"
};

const products = [
  { id: 1, name: "Bíblia Sagrada", category: "Bíblias", price: 59.90, description: "Uma companheira para a leitura diária.", cover: "wine", coverTitle: "BÍBLIA SAGRADA" },
  { id: 2, name: "O Poder da Oração", category: "Oração", price: 34.90, description: "Reflexões para fortalecer sua vida de oração.", cover: "gold", coverTitle: "O PODER DA ORAÇÃO" },
  { id: 3, name: "Imitação de Cristo", category: "Espiritualidade", price: 42.00, description: "Um clássico da espiritualidade cristã.", cover: "green", coverTitle: "IMITAÇÃO DE CRISTO" },
  { id: 4, name: "Vida dos Santos", category: "Santos", price: 49.90, description: "Histórias de fé, coragem e caridade.", cover: "rose", coverTitle: "VIDA DOS SANTOS" },
  { id: 5, name: "Salmos para Cada Dia", category: "Oração", price: 29.90, description: "Palavras bíblicas para meditar e rezar.", cover: "green", coverTitle: "SALMOS PARA CADA DIA" },
  { id: 6, name: "Conhecendo a Fé Católica", category: "Espiritualidade", price: 39.90, description: "Uma introdução aos fundamentos da fé.", cover: "gold", coverTitle: "FÉ CATÓLICA" },
  { id: 7, name: "Bíblia de Estudo", category: "Bíblias", price: 89.90, description: "Uma edição de exemplo para estudo pessoal.", cover: "wine", coverTitle: "BÍBLIA DE ESTUDO" },
  { id: 8, name: "O Santo Rosário", category: "Santos", price: 24.90, description: "Um guia simples para rezar o rosário.", cover: "rose", coverTitle: "O SANTO ROSÁRIO" }
];

const $ = (selector) => document.querySelector(selector);
const productGrid = $("#product-grid");
const searchInput = $("#search-input");
const categoryFilter = $("#category-filter");
const emptyState = $("#empty-state");
const cartPanel = $("#cart-panel");
const cartBackdrop = $("#cart-backdrop");
const cartItems = $("#cart-items");
const cartCount = $("#cart-count");
const cartTotal = $("#cart-total");
const toast = $("#toast");

let cart = loadCart();
let toastTimer;

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem("livrariaSantaFeCart") || "[]");
    if (!Array.isArray(saved)) return [];
    return saved.filter((entry) => products.some((product) => product.id === entry.id))
      .map((entry) => ({ ...products.find((product) => product.id === entry.id), quantity: Math.max(1, Number(entry.quantity) || 1) }));
  } catch (error) {
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem("livrariaSantaFeCart", JSON.stringify(cart.map(({ id, quantity }) => ({ id, quantity }))));
  } catch (error) {
    showToast("Não foi possível salvar o carrinho neste navegador.");
  }
}

function formatPrice(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function renderProducts() {
  const searchTerm = searchInput.value.trim().toLocaleLowerCase("pt-BR");
  const chosenCategory = categoryFilter.value;
  const filteredProducts = products.filter((product) => {
    const searchable = `${product.name} ${product.category} ${product.description}`.toLocaleLowerCase("pt-BR");
    const matchesSearch = searchable.includes(searchTerm);
    const matchesCategory = chosenCategory === "todos" || product.category === chosenCategory;
    return matchesSearch && matchesCategory;
  });

  productGrid.innerHTML = filteredProducts.map((product) => `
    <article class="product-card">
      <div class="cover ${product.cover}" aria-label="Capa ilustrativa de ${product.name}">
        <div class="cover-inner"><strong>${product.coverTitle}</strong><small>LIVRARIA SANTA FÉ</small></div>
      </div>
      <p class="product-category">${product.category}</p>
      <h3>${product.name}</h3>
      <p class="product-description">${product.description}</p>
      <div class="product-bottom">
        <strong class="product-price">${formatPrice(product.price)}</strong>
        <button class="add-button" type="button" data-add="${product.id}">Adicionar ao carrinho +</button>
      </div>
    </article>
  `).join("");
  emptyState.hidden = filteredProducts.length !== 0;
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;
  const existingItem = cart.find((item) => item.id === productId);
  if (existingItem) existingItem.quantity += 1;
  else cart.push({ ...product, quantity: 1 });
  saveCart();
  renderCart();
  showToast(`${product.name} foi adicionado ao carrinho.`);
}

function renderCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartCount.textContent = totalItems;
  cartTotal.textContent = formatPrice(totalPrice);

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="cart-empty">Seu carrinho está vazio. Escolha um livro para começar.</p>';
    return;
  }

  cartItems.innerHTML = cart.map((item) => `
    <div class="cart-line">
      <div>
        <strong>${item.name}</strong>
        <small>${formatPrice(item.price)} cada</small>
        <div class="quantity-controls">
          <button type="button" data-decrease="${item.id}" aria-label="Diminuir ${item.name}">−</button>
          <span>${item.quantity}</span>
          <button type="button" data-increase="${item.id}" aria-label="Aumentar ${item.name}">+</button>
        </div>
      </div>
      <button class="remove-button" type="button" data-remove="${item.id}">Remover</button>
    </div>
  `).join("");
}

function openCart() {
  cartPanel.classList.add("is-open");
  cartPanel.setAttribute("aria-hidden", "false");
  cartBackdrop.hidden = false;
  document.body.classList.add("cart-open");
  $("#close-cart").focus();
}

function closeCart() {
  cartPanel.classList.remove("is-open");
  cartPanel.setAttribute("aria-hidden", "true");
  cartBackdrop.hidden = true;
  document.body.classList.remove("cart-open");
  $("#open-cart").focus();
}

function getOrderMessage() {
  const lines = cart.map((item) => `${item.quantity}x ${item.name} — ${formatPrice(item.price * item.quantity)}`);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return `Olá! Gostaria de consultar este pedido na Livraria Santa Fé:\n\n${lines.join("\n")}\n\nTotal demonstrativo: ${formatPrice(total)}\n\nPor favor, confirme disponibilidade, valores e entrega.`;
}

function prepareOrder() {
  if (cart.length === 0) {
    showToast("Adicione pelo menos um livro antes de preparar o pedido.");
    return;
  }
  if (!/^\d{10,15}$/.test(STORE_CONFIG.whatsapp)) {
    alert("O carrinho está funcionando! Para enviar o pedido pelo WhatsApp, primeiro configure o número comercial no início do arquivo script.js. Use apenas números, com código do país e DDD.");
    return;
  }
  const url = `https://wa.me/${STORE_CONFIG.whatsapp}?text=${encodeURIComponent(getOrderMessage())}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function setupContactDetails() {
  const addressElement = $("#store-address");
  const addressNote = $("#address-note");
  const mapLink = $("#map-link");
  const whatsappLink = $("#whatsapp-link");

  if (STORE_CONFIG.address.trim()) {
    addressElement.textContent = STORE_CONFIG.address.trim();
    addressNote.textContent = "Consulte o mapa para planejar sua visita.";
    mapLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STORE_CONFIG.address.trim())}`;
    mapLink.target = "_blank";
    mapLink.rel = "noopener noreferrer";
    mapLink.setAttribute("aria-disabled", "false");
  } else {
    addressElement.textContent = "Endereço físico a informar";
    addressNote.textContent = "O endereço ainda não foi cadastrado. Não publicaremos uma localização sem confirmação.";
    mapLink.addEventListener("click", (event) => {
      event.preventDefault();
      showToast("Cadastre o endereço no início do arquivo script.js para ativar o mapa.");
    });
    mapLink.setAttribute("aria-disabled", "true");
  }

  whatsappLink.addEventListener("click", (event) => {
    event.preventDefault();
    if (!/^\d{10,15}$/.test(STORE_CONFIG.whatsapp)) {
      showToast("Cadastre o número comercial no início do arquivo script.js para ativar o WhatsApp.");
      return;
    }
    const hello = "Olá! Gostaria de saber mais sobre os livros da Livraria Santa Fé.";
    window.open(`https://wa.me/${STORE_CONFIG.whatsapp}?text=${encodeURIComponent(hello)}`, "_blank", "noopener,noreferrer");
  });
}

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(Number(button.dataset.add));
});

cartItems.addEventListener("click", (event) => {
  const increase = event.target.closest("[data-increase]");
  const decrease = event.target.closest("[data-decrease]");
  const remove = event.target.closest("[data-remove]");
  if (increase) {
    const item = cart.find((product) => product.id === Number(increase.dataset.increase));
    if (item) item.quantity += 1;
  } else if (decrease) {
    const item = cart.find((product) => product.id === Number(decrease.dataset.decrease));
    if (item) item.quantity -= 1;
    cart = cart.filter((product) => product.quantity > 0);
  } else if (remove) {
    cart = cart.filter((product) => product.id !== Number(remove.dataset.remove));
  } else {
    return;
  }
  saveCart();
  renderCart();
});

searchInput.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);
$("#open-cart").addEventListener("click", openCart);
$("#close-cart").addEventListener("click", closeCart);
cartBackdrop.addEventListener("click", closeCart);
$("#checkout-button").addEventListener("click", prepareOrder);
$("#menu-toggle").addEventListener("click", () => {
  const nav = $("#main-nav");
  const isOpen = nav.classList.toggle("is-open");
  $("#menu-toggle").setAttribute("aria-expanded", String(isOpen));
});
$("#main-nav").addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    $("#main-nav").classList.remove("is-open");
    $("#menu-toggle").setAttribute("aria-expanded", "false");
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && cartPanel.classList.contains("is-open")) closeCart();
});

$("#current-year").textContent = new Date().getFullYear();
setupContactDetails();
renderProducts();
renderCart();
