<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include 'db.php';

// Get data from the POST request
$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'];

// Delete the item from the cart table in the database
$sql = "DELETE FROM cart WHERE id = '$id'";

if ($conn->query($sql) === TRUE) {
    $response = array('message' => 'Item deleted from cart successfully');
} else {
    $response = array('message' => 'Error deleting item from cart: ' . $conn->error);
}

$conn->close();

echo json_encode($response);
?>
