<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include 'db.php';

// Get data from the POST request
$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'];
$name = $data['name'];
$price = $data['price'];

// Add the item to the cart table in the database
$sql = "INSERT INTO cart (id, product_name, product_price, quantity) VALUES ('$id', '$name', '$price', 1)
        ON DUPLICATE KEY UPDATE quantity = quantity + 1";

if ($conn->query($sql) === TRUE) {
    $response = array('message' => 'Item added to cart successfully');
} else {
    $response = array('error' => 'Error adding item to cart: ' . $conn->error);
}

$conn->close();

echo json_encode($response);
?>
