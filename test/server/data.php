<?php
    header('Access-Control-Allow-Origin:*');
    header('Access-Control-Allow-Credentials:true');
    header('Content-Type:application/json; charset=utf-8');
    $_POST = json_decode(file_get_contents("php://input"), true);
    if(isset($_GET['code'])) {
        header($_SERVER["SERVER_PROTOCOL"]. ' ' .$_GET['code']);
        exit;
    }
    if(isset($_GET['data'])) {
        echo 'get' . $_GET['data'];exit;
    }
    if(isset($_POST['data'])) {
        echo 'post' . $_POST['data'];exit;
    }
    echo 'cool';exit;
?>
