document.addEventListener('DOMContentLoaded', () => {
    fetch('products.json')
        .then(response => response.json())
        .then(products => {
            displayProducts(products);
        })
        .catch(error => console.error('Error fetching the products:', error));

    // Add event listener to cart button
    const cartButton = document.getElementById('cart-button');
    cartButton.addEventListener('click', () => {
        toggleCartDetails();
    });

    // Add event listener to close cart button
    const closeCartButton = document.getElementById('close-cart');
    closeCartButton.addEventListener('click', () => {
        toggleCartDetails();
    });
});

let cart = [];

function displayProducts(products) {
    const productOfTheWeekContainer = document.querySelector('.highlighted-product');
    const weeklySpecialItemsContainer = document.querySelector('.product-grid');

    // Display Product of the Week (first product in the array)
    const productOfTheWeek = products[0];
    productOfTheWeekContainer.innerHTML = `
        <div class="item-left">
            <img src="media/${productOfTheWeek.image}" alt="${productOfTheWeek.name}">
        </div>
        <div class="item-right">
            <h3>${productOfTheWeek.name}</h3>
            <p>${productOfTheWeek.description}</p>
            <p class="price">$${productOfTheWeek.price.toFixed(2)}</p>
            <button class="buy-button" onclick="addToCart(${productOfTheWeek.id})">Add to Cart</button>
        </div>
    `;

    const productsToDisplay = products.slice(1); // Exclude the first product

    // Display Other products
    productsToDisplay.forEach(product => {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
        productItem.innerHTML = `
            <img src="media/${product.image}" alt="${product.name}">
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
    fetch('products.json')
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id === productId);
            if (product) {
                const existingProduct = cart.find(item => item.id === productId);
                if (existingProduct) {
                    existingProduct.quantity += 1;
                } else {
                    product.quantity = 1;
                    cart.push(product);
                }
                showCartPopup();
                updateCartDetails();
                toggleCartDetails(true); // Open cart details
            }
        })
        .catch(error => console.error('Error fetching the product:', error));
}

function showCartPopup() {
    const cartPopup = document.getElementById('cart-popup');
    cartPopup.classList.remove('hidden');
    cartPopup.style.display = 'block';
    setTimeout(() => {
        cartPopup.classList.add('hidden');
        cartPopup.style.display = 'none';
    }, 2000);
}

function toggleCartDetails(forceOpen = false) {
    const cartDetails = document.getElementById('cart-details');
    if (forceOpen) {
        cartDetails.classList.add('show');
    } else {
        cartDetails.classList.toggle('show');
    }
}

function updateCartDetails() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    cartItemsContainer.innerHTML = '';

    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <p>${item.name}</p>
            <div class="quantity-controls">
                <button onclick="changeQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity(${item.id}, 1)">+</button>
            </div>
            <p>$${(item.price * item.quantity).toFixed(2)}</p>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    cartTotalElement.textContent = total.toFixed(2);
}

function changeQuantity(productId, change) {
    const product = cart.find(item => item.id === productId);
    if (product) {
        product.quantity += change;
        if (product.quantity <= 0) {
            cart = cart.filter(item => item.id !== productId);
        }
        updateCartDetails();
    }
}
