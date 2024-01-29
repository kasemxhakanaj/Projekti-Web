<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include 'db.php';

// Clear all items from the cart table in the database
$sql = "TRUNCATE TABLE cart";

if ($conn->query($sql) === TRUE) {
    $response = array('message' => 'Cart cleared successfully');
} else {
    $response = array('message' => 'Error clearing cart: ' . $conn->error);
}

$conn->close();

echo json_encode($response);
?>
