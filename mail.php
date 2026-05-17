<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
    exit;
}

$data    = json_decode(file_get_contents("php://input"), true);

$name    = htmlspecialchars($data['name'] ?? '');
$email   = filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL);
$company = htmlspecialchars($data['company'] ?? 'Not provided');
$services = htmlspecialchars($data['services'] ?? 'None selected');
$message = htmlspecialchars($data['message'] ?? '');

if (!$name || !$email || !$message) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email']);
    exit;
}

$admin_email = "workwithpromopartners@gmail.com";
$headers     = "From: workwithpromopartners@gmail.com\r\n";
$headers    .= "Reply-To: $email\r\n";
$headers    .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Email 1 — Admin notification
$admin_subject = "New Enquiry from $name — PromoPartners";
$admin_body    = "You have a new enquiry from the website.\n\n";
$admin_body   .= "Name:     $name\n";
$admin_body   .= "Email:    $email\n";
$admin_body   .= "Company:  $company\n";
$admin_body   .= "Services: $services\n\n";
$admin_body   .= "Message:\n$message\n";

// Email 2 — User confirmation
$user_subject = "We received your message — PromoPartners";
$user_body    = "Hi $name,\n\n";
$user_body   .= "Thank you for reaching out to PromoPartners.\n";
$user_body   .= "We have received your enquiry and will get\n";
$user_body   .= "back to you within 24 hours.\n\n";
$user_body   .= "— Team PromoPartners\n";
$user_body   .= "workwithpromopartners@gmail.com\n";

$admin_sent = mail($admin_email, $admin_subject, $admin_body, $headers);
$user_sent  = mail($email, $user_subject, $user_body, $headers);

if ($admin_sent) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Mail sending failed']);
}
?>
