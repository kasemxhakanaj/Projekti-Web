document.addEventListener('DOMContentLoaded', function () {

  let cartItems = [];

  
  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', addToCart);
  });


  const promoCodeBtn = document.getElementById('apply-promo-code-btn');
  if (promoCodeBtn) {
      promoCodeBtn.addEventListener('click', promptForPromoCode);
  }
  
 
  const clearCartBtn = document.getElementById('clear-cart-btn');
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', clearCart);
  }

/*----------------------------------------------------------------------------------------*/

  function addToCart(event) {
    console.log('Add to Cart button clicked!');
    const productId = event.target.getAttribute('data-product-id');
    const productName = event.target.getAttribute('data-product-name');
    const productPrice = parseFloat(event.target.getAttribute('data-product-price'));

    // Make HTTP request to add the item to the cart
    fetch('http://localhost/Projekti Web/api/add_to_cart.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: productId, name: productName, price: productPrice }),
    })
    .then(response => response.json())
    .then(data => {
        showNotification(data.message, 3000);
        displayCartItems();
    })
    .catch(error => {
        console.error('Error:', error);
    });
  }

  /*------------------------------------------------------------------------*/

function deleteCartItem(event) {
  const index = parseInt(event.target.getAttribute('data-index'));

  // Check if the index is valid
  if (!isNaN(index) && index >= 0 && index < cartItems.length) {
    const deletedItem = cartItems[index];

    
    fetch('http://localhost/Projekti Web/api/delete_cart_item.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: deletedItem.id }), 
    })
      .then(response => response.json())
      .then(data => {
        showNotification(data.message, 3000);

        // Remove the item from the cartItems array
        cartItems.splice(index, 1);

        // Refresh the cart display
        displayCartItems();
      })
      .catch(error => {
        console.error('Error:', error);
      });
  } else {
    console.error('Invalid index for deleteCartItem');
  }
}

document.querySelectorAll('.delete-btn').forEach(deleteButton => {
  deleteButton.addEventListener('click', deleteCartItem);
});


/*-------------------------------------------------------------------------*/

function promptForPromoCode() {
  const promoCode = prompt('Please enter your promo code:');
  if (promoCode) {
    applyPromoCode(promoCode);
  } else {
    console.log('User canceled the promo code input.');
  }
}


function applyPromoCode(promoCode) {
  // Make HTTP request to apply promo code
  fetch('http://localhost/Projekti Web/api/apply_promo_code.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ promoCode: promoCode }),
  })
    .then(response => response.json())
    .then(data => {
      showNotification(data.message, 3000);

      // If promo code is applied successfully, refresh the cart display
      if (data.discountedPrice !== undefined) {
        displayCartItems();
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

/*-------------------------------------------------------------------------------*/

  function clearCart() {
    // Make HTTP request to clear the cart
    fetch('http://localhost/Projekti Web/api/clear_cart.php')
    .then(response => response.json())
    .then(data => {
        showNotification(data.message, 3000);
        displayCartItems();
    })
    .catch(error => {
        console.error('Error:', error);
    });
  }

 /*--------------------------------------------------------------------------------*/

function displayCartItems() {
  // Make HTTP request to get the cart items
  fetch('http://localhost/Projekti Web/api/get_cart_items.php')
    .then(response => response.json())
    .then(data => {
      // Update cartItems array
      cartItems = data.cartItems;

      // Check if the cartItemsContainer exists
      const cartItemsContainer = document.getElementById('cart-items');
      if (!cartItemsContainer) {
        console.error('.');
        return;
      }

      // Clear the existing content
      cartItemsContainer.innerHTML = '';

      // Check if the cartItems array is not empty
      if (cartItems.length > 0) {
        // Create a map to store grouped items based on product ID and name
        const groupedItems = new Map();

        // Iterate through the cartItems array and group items
       // Initialize an index variable outside the loop
let currentIndex = 0;

cartItems.forEach(product => {
  const key = `${product.product_id}_${product.product_name}`;

  if (groupedItems.has(key)) {
    // If the product is already in the map, increment the quantity
    groupedItems.get(key).quantity++;
  } else {
    // If the product is not in the map, add it with quantity 1
    groupedItems.set(key, { ...product, quantity: 1 });
  }
});

// Iterate through grouped items and display each product
groupedItems.forEach((product) => {
  const productElement = document.createElement('div');
  productElement.classList.add('product-item');
  productElement.innerHTML = `
    <div class="product-info">
      <p>Product: ${product.product_name}  X${product.quantity}</p>
      <p>Price: $${(product.product_price * product.quantity).toFixed(2)}</p>
    </div>
    <div class="product-actions">
      <button class="delete-btn" data-index="${currentIndex}">Delete</button>
    </div>
  `;
  cartItemsContainer.appendChild(productElement);

  // Increment the index for the next iteration
  currentIndex++;
});


        // Calculate and display the total price
        const totalPriceElement = document.createElement('div');
        totalPriceElement.id = 'total-price-container';
        totalPriceElement.innerHTML = `
          <p id="total-price-label">Total Price:</p>
          <p id="total-price-value">$${data.totalPrice.toFixed(2)}</p>
        `;
        cartItemsContainer.appendChild(totalPriceElement);

        // Add event listeners for delete buttons
        document.querySelectorAll('.delete-btn').forEach(deleteButton => {
          deleteButton.addEventListener('click', deleteCartItem);
        });
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

/*------------------------------------------------------------------------------------------*/

  // Function to show notifications
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

  // Display cart items when the page loads
  displayCartItems();
});
