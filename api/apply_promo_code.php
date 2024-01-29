<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include 'db.php';

// Get data from the POST request
$data = json_decode(file_get_contents("php://input"), true);

$promoCode = isset($data['promoCode']) ? $data['promoCode'] : null;

// Query the promo_codes table to retrieve the discount percentage
$sql = "SELECT discount_percentage FROM promo_codes WHERE promoCode = '$promoCode'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $discountPercentage = $row['discount_percentage'];

    // Retrieve the current cart items
    $sqlCart = "SELECT * FROM cart";
    $resultCart = $conn->query($sqlCart);

    if ($resultCart->num_rows > 0) {
        $cartItems = array();
        while ($rowCart = $resultCart->fetch_assoc()) {
            $cartItems[] = $rowCart;
        }

        // Update the cart items with the discounted total
        foreach ($cartItems as &$item) {
            $item['discounted_price'] = $item['product_price'] - ($item['product_price'] * ($discountPercentage / 100));

            // Update the cart table in the database with the discounted price
            $productId = $item['id'];
            $discountedPrice = $item['discounted_price'];
            $updateSql = "UPDATE cart SET product_price = '$discountedPrice' WHERE id = '$productId'";
            if ($conn->query($updateSql) !== TRUE) {
                // Handle the error
                $response = array('message' => 'Error updating cart: ' . $conn->error);
                error_log('Error updating cart: ' . $conn->error);
           
            }
        }

        $response = array('message' => 'Promo code applied successfully', 'cartItems' => $cartItems, 'discountedPrice' => $discountedPrice);
        echo json_encode($response);
        exit(); // Exit early after sending the response
    } else {
        $response = array('message' => 'Error applying promo code: Cart is empty');
    }
} else {
    $response = array('message' => 'Invalid promo code');
}

$conn->close();

echo json_encode($response);
?>
