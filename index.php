<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
use services\DB;
require './api/services/DB.php';


$conn = new DB();
var_dump($conn->dbConnect())
?>