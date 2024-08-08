document.addEventListener("DOMContentLoaded", () => {
  fetch("products.json")
    .then((response) => response.json())
    .then((products) => {
      displayProducts(products);
    })
    .catch((error) => console.error("Error fetching the products:", error));

  // Load cart from localStorage
  loadCart();

  // Add event listener to cart button
  const cartButton = document.getElementById("cart-button");
  cartButton.addEventListener("click", () => {
    toggleCartDetails();
  });

  // Add event listener to close cart button
  const closeCartButton = document.getElementById("close-cart");
  closeCartButton.addEventListener("click", () => {
    toggleCartDetails();
  });
});

let cart = [];

function loadCart() {
  const storedCart = localStorage.getItem("cart");
  if (storedCart) {
    cart = JSON.parse(storedCart);
    updateCartDetails();
  }
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function displayProducts(products) {
    const productOfTheWeekContainer = document.querySelector(".highlighted-product");
    const weeklySpecialItemsContainer = document.querySelector(".product-grid");

    // Display Product of the Week product with isProductOfTheWeek = true
    const productOfTheWeek = products.find(product => product.isProductOfTheWeek);

    if (productOfTheWeek) {
        const originalPrice = productOfTheWeek.price;
        const discountedPrice = (originalPrice * 0.6).toFixed(2); // 40% discount

        productOfTheWeekContainer.innerHTML = `
            <div class="item-left">
                <img src="../media/${productOfTheWeek.image}" alt="${productOfTheWeek.name}">
            </div>
            <div class="item-right">
                <h3>${productOfTheWeek.name}</h3>
                <p>${productOfTheWeek.description}</p>
                <p class="price">
                    <span class="original-price">$${originalPrice.toFixed(2)}</span>
                    <span class="discounted-price">$${discountedPrice}</span>
                </p>
                <button class="buy-button" onclick="addToCart(${productOfTheWeek.id})">Add to Cart</button>
            </div>
        `;
    }

    const productsToDisplay = products.filter(product => !product.isProductOfTheWeek);

    // Display other products
    productsToDisplay.forEach(product => {
        const productItem = document.createElement("div");
        productItem.classList.add("product-item");
        productItem.innerHTML = `
            <img src="../media/${product.image}" alt="${product.name}">
            <div class="product-text">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p class="price">$${product.price.toFixed(2)}</p>
                <button class="buy-button" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
        weeklySpecialItemsContainer.appendChild(productItem);
    });
}


function addToCart(productId) {
  fetch("products.json")
    .then((response) => response.json())
    .then((products) => {
      const product = products.find((p) => p.id === productId);
      if (product) {
        const existingProduct = cart.find((item) => item.id === productId);
        if (existingProduct) {
          existingProduct.quantity += 1;
        } else {
          product.quantity = 1;
          cart.push(product);
        }
        showCartPopup();
        updateCartDetails();
        toggleCartDetails(true); // Open cart details
        saveCart();
      }
    })
    .catch((error) => console.error("Error fetching the product:", error));
}

function showCartPopup() {
  const cartPopup = document.getElementById("cart-popup");
  cartPopup.classList.remove("hidden");
  cartPopup.style.display = "block";
  setTimeout(() => {
    cartPopup.classList.add("hidden");
    cartPopup.style.display = "none";
  }, 2000);
}

function toggleCartDetails(forceOpen = false) {
  const cartDetails = document.getElementById("cart-details");
  if (forceOpen) {
    cartDetails.classList.add("show");
  } else {
    cartDetails.classList.toggle("show");
  }
}

function updateCartDetails() {
  const cartItemsContainer = document.querySelector(".cart-items");
  const cartTotalElement = document.getElementById("cart-total");
  const cartTaxElement = document.getElementById("cart-tax");
  const cartTotalTaxElement = document.getElementById("cart-total-tax");
  cartItemsContainer.innerHTML = "";

  let total = 0;
  cart.forEach((item) => {
    total += item.price * item.quantity;
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.innerHTML = `
            <p>${item.name}</p>
            <div class="quantity-controls">
                <button onclick="changeQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity(${item.id}, 1)">+</button>
            </div>
            <p>$${(item.price * item.quantity).toFixed(2)}</p>
                            <button class="remove-button" onclick="removeFromCart(${
                              item.id
                            })">✖</button>

        `;
    cartItemsContainer.appendChild(cartItem);
  });

  const tax = total * 0.1; // 10% tax
  const totalWithTax = total + tax;

  cartTotalElement.textContent = total.toFixed(2);
  cartTaxElement.textContent = tax.toFixed(2);
  cartTotalTaxElement.textContent = totalWithTax.toFixed(2);
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  updateCartDetails();
  saveCart();
}

function changeQuantity(productId, change) {
  const product = cart.find((item) => item.id === productId);
  if (product) {
    product.quantity += change;
    if (product.quantity <= 0) {
      cart = cart.filter((item) => item.id !== productId);
    }
    updateCartDetails();
    saveCart();
  }
}
