document.addEventListener('DOMContentLoaded', function () {
  
  let cartItems = [];

  // Add event listener for "Add to Cart" buttons
  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', addToCart);
  });

  
  function addToCart(event) {
    console.log('Add to Cart button clicked!');
    const productId = event.target.getAttribute('data-product-id');
    const productName = event.target.getAttribute('data-product-name');
    const productPrice = parseFloat(event.target.getAttribute('data-product-price'));

   
    cartItems.push({ id: productId, name: productName, price: productPrice });

    // Store the updated cartItems array in localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    
    showNotification(`${productName} added to cart!`, 3000);

    // Refresh the cart display
    displayCartItems();
  }

  // Check if there are cart items stored in localStorage
  const storedCartItems = localStorage.getItem('cartItems');
  if (storedCartItems) {
    // Parse the stored items and update the cartItems array
    cartItems = JSON.parse(storedCartItems);
  }

  // Get the element where cart items will be displayed
  const cartItemsContainer = document.getElementById('cart-items');

  function displayCartItems() {
    // Check if the cartItemsContainer exists
    if (!cartItemsContainer) {
      console.error('.');
      return;
    }

    // Clear the existing content
    cartItemsContainer.innerHTML = '';

    // Check if the cartItems array is not empty (indicating items are added to the cart)
    if (cartItems.length > 0) {
      // Iterate through the cartItems array and display each product
      cartItems.forEach((product, index) => {
        const productElement = document.createElement('div');
        productElement.classList.add('product-item');
        productElement.innerHTML = `
        <div class="product-info">
          <p>Product: ${product.name}</p>
          <p>Price: $${product.price.toFixed(2)}</p>
        </div>
        <button class="delete-btn" data-index="${index}">Delete</button>
      `;
        cartItemsContainer.appendChild(productElement);
      });

      // Calculate and display the total price
      const totalPrice = cartItems.reduce((total, product) => total + product.price, 0);
      const totalPriceElement = document.createElement('div');
      totalPriceElement.id = 'total-price-container';
      totalPriceElement.innerHTML = `
      <p id="total-price-label">Total Price:</p>
      <p id="total-price-value">$${totalPrice.toFixed(2)}</p>
    `;
      cartItemsContainer.appendChild(totalPriceElement);

      // Add event listeners for delete buttons
      document.querySelectorAll('.delete-btn').forEach(deleteButton => {
        deleteButton.addEventListener('click', deleteCartItem);
      });
    }
  }

  // Function to handle delete button click
  function deleteCartItem(event) {
    const index = parseInt(event.target.getAttribute('data-index'));
    // Remove the item from the cartItems array
    cartItems.splice(index, 1);
    // Update localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    // Refresh the cart display
    displayCartItems();
  }

  // Add event listener for the "Clear Cart" button
  const clearCartBtn = document.getElementById('clear-cart-btn');
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', function () {
      // Clear the localStorage
      localStorage.removeItem('cartItems');
   
      showNotification(`Card Cleared!`, 3000);
      // Remove the cart items from the displayed container
      cartItemsContainer.innerHTML = '';
    });
  }

  // Display cart items when the page loads
  displayCartItems();
});

function showNotification(message, duration) {
  const notificationContainer = document.getElementById('notification-container');
  const notificationMessage = document.getElementById('notification-message');

  // Display the message
  notificationMessage.textContent = message;

  // Show the notification container
  notificationContainer.classList.remove('hidden');

  setTimeout(function () {
    // Hide the notification container
    notificationContainer.classList.add('hidden');
  }, duration);
}