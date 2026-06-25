<?php
/* RouteWise Guyana - Feedback Form Handler
   CSE 2201 Group Project 2026
   Gets POST data from feedback.html, validates it, writes to submissions.txt
   Then redirects back with ?submitted=1 or ?error=.. which main.js reads */

//Tutorial 10: session_start() has to be the very first thing
session_start();

// ANTI-SPAM CHECK USING SESSION

//if they submitted less than 30 seconds ago, block it
if(isset($_SESSION['last_submission_time'])){
    $seconds_since = time() - $_SESSION['last_submission_time'];

    if($seconds_since < 30){
        header('Location: feedback.html?error=spam');
        exit();
        }
}

$_SESSION['last_submission_time'] = time();

//this page only makes sense as a POST target - redirect anything else away
if($_SERVER['REQUEST_METHOD'] != 'POST'){
    header('Location: feedback.html');
    exit;
}

//strip tags first then trim then escape - the order matters
//https://www.w3schools.com/php/php_form_validation.asp
function clean($v){
    return strip_tags(trim($v ?? ''));
}

$name     = clean($_POST['name']);
$email    = clean($_POST['email']);
$cat      = clean($_POST['category']);
$route    = clean($_POST['route']);
$dt       = clean($_POST['datetime']);
$plate    = clean($_POST['plate']);
$desc     = clean($_POST['description']);

//only category and description are required, everything else is optional
if(empty($cat) || empty($desc)){
    header('Location: feedback.html?error=missing_fields');
    exit;
}

$ts    = date('Y-m-d H:i:s');
$entry = "──────── ⋆⋅☆⋅⋆ ────────\n";
$entry .= "Submitted:   $ts\n";
$entry .= "Name:        $name\n";
$entry .= "Email:       $email\n";
$entry .= "Category:    $cat\n";
$entry .= "Route:       $route\n";
$entry .= "Date/Time:   $dt\n";
$entry .= "Plate:       $plate\n";
$entry .= "Description: $desc\n\n";


//FILE_APPEND adds to the file instead of overwriting it
//LOCK_EX locks the file so two submissions at the exact same time dont corrupt it
//https://www.php.net/manual/en/function.file-put-contents.php
file_put_contents(__DIR__ . '/submissions.txt', $entry, FILE_APPEND | LOCK_EX);



// TUTORIAL 10: SETTING A COOKIE
//remember the name for 30 days so it autofills next time they visit
//86400 = seconds in one day
if( ! empty($name)){
    setcookie("reporterName", $name, time() + (86400 * 30), "/");
}

header('Location: feedback.html?submitted=1');
exit;
?>