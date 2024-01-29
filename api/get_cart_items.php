<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

include 'db.php';

// Fetch cart items from the database
$sql = "SELECT id, product_name, quantity, product_price FROM cart";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $cartItems = array();
    while ($row = $result->fetch_assoc()) {
        $cartItems[] = $row;
    }

    // Calculate total price
    $totalPrice = array_sum(array_column($cartItems, 'product_price'));

    $response = array('cartItems' => $cartItems, 'totalPrice' => $totalPrice);
} else {
    $response = array('cartItems' => array(), 'totalPrice' => 0);
}

$conn->close();

echo json_encode($response);
?>
