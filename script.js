import products from "./products.js";

const cartContainer = document.getElementById("cart-container");
const productsContainer = document.getElementById("products-container");
const dessertCards = document.getElementById("dessert-card-container");
const cartBtn = document.getElementById("cart-btn");
const clearCartBtn = document.getElementById("clear-cart-btn");
const totalNumberOfItems = document.getElementById("total-items");
const cartSubTotal = document.getElementById("subtotal");
const cartTaxes = document.getElementById("taxes");
const cartTotal = document.getElementById("total");
const showHideCartSpan = document.getElementById("show-hide-cart");

let isCartShowing = false;

products.forEach(({ name, id, price, category }) => {
  dessertCards.innerHTML += `
    <div class="dessert-card">
      <h2>${name}</h2>
      <p class="dessert-price">$${price}</p>
      <p class="product-category">Category: ${category}</p>
      <button id="${id}" class="btn add-to-cart-btn">Add to cart</button>
    </div>
  `;
});

class ShoppingCart {
  constructor() {
    this.items = [];
    this.total = 0;
    this.taxRate = 8.25;
  }

  addItem(id, products) {
    const product = products.find((item) => item.id === id);
    const { name, price } = product;

    this.items.push(product);

    const totalCountPerProduct = {};
    this.items.forEach((dessert) => {
      totalCountPerProduct[dessert.id] =
        (totalCountPerProduct[dessert.id] || 0) + 1;
    });

    const currentProductCount = totalCountPerProduct[product.id];
    const currentProductCountSpan = document.getElementById(
      `product-count-for-id${product.id}`
    );

    currentProductCount > 1
      ? (currentProductCountSpan.textContent = `${currentProductCount}x`)
      : (productsContainer.innerHTML += `
          <div class="product" id="dessert${id}">
            <p>
              <span class="product-count" id="product-count-for-id${id}"></span>
              ${name}
            </p>
            <p>$${price}</p>
          </div>
        `);
  }

  getCounts() {
    return this.items.length;
  }

  calculateTaxes(amount) {
    return parseFloat((amount * (this.taxRate / 100)).toFixed(2));
  }

  calculateTotal() {
    const subTotal = this.items.reduce((total, item) => total + item.price, 0);
    const tax = this.calculateTaxes(subTotal);
    this.total = subTotal + tax;

    cartSubTotal.textContent = `$${subTotal.toFixed(2)}`;
    cartTaxes.textContent = `$${tax.toFixed(2)}`;
    cartTotal.textContent = `$${this.total.toFixed(2)}`;

    return this.total;
  }

  clearCart() {
    if (!this.items.length) return;

    const isCartCleared = confirm(
      "Are you sure you want to clear all items from your shopping cart?"
    );
    if (!isCartCleared) return;

    this.items = [];
    this.total = 0;

    productsContainer.innerHTML = "";
    totalNumberOfItems.textContent = this.getCounts();
    this.calculateTotal();
  }
}

const cart = new ShoppingCart();
const addToCartBtns = document.getElementsByClassName("add-to-cart-btn");

[...addToCartBtns].forEach((btn) => {
  btn.addEventListener("click", (event) => {
    cart.addItem(Number(event.target.id), products);
    totalNumberOfItems.textContent = cart.getCounts();
    cart.calculateTotal();
  });
});

cartBtn.addEventListener("click", () => {
  isCartShowing = !isCartShowing;
  showHideCartSpan.textContent = isCartShowing ? "Hide" : "Show";
  cartContainer.style.display = isCartShowing ? "block" : "none";
});

clearCartBtn.addEventListener("click", () => {
  cart.clearCart();
});
// clearCartBtn.addEventListener("click", cart.clearCart.bind(cart));
