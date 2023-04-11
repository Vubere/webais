<?php
namespace Api\controllers;

use services\DB;
use Exception;


class SessionController
{
  public $conn = null;

  public function __construct()
  {
    $this->conn = (new DB)->dbConnect();
  }
  public function getHeaders()
  {
    //allow request from any origin
    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Headers: *');
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS,DELETE");
    header('Content-Type: application/json charset-UTF-8');
  }
  public function session()
  {
    $this->conn;
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method == 'GET') {
      try {
        $sql = "SELECT * FROM session";
        if($_GET['current']){
          $sql.=" WHERE current=1";
        }
        $res = $this->conn->query($sql);
        if (!$res) {
          throw new Exception("Error Processing Request", 1);
        }
        $this->getHeaders();
        echo json_encode(array('status' => 'success', 'ok' => 1, 'data' => $res->fetch_all(MYSQLI_ASSOC)));
      } catch (Exception $e) {
        $this->getHeaders();
        echo json_encode(array('status' => $e->getMessage(), 'ok' => 0));
      }
    } elseif ($method == 'POST') {
      try {
        $post = $_POST;
        $endPrevSessions = "UPDATE session SET current = '0' WHERE current = '1'";
        $stmt = $this->conn->query($endPrevSessions);
        
        if ($stmt) {
          $sql = "INSERT INTO session(   
          session,
          semester,
          current
        ) VALUES (
          ?,?,?
        )";
          $session = $post['session'];
          $semester = $post['semester'];
          $current = '1';
          $stmt = $this->conn->prepare($sql);
          $stmt->bind_param(
            "sss",
            $session,
            $semester,
            $current
          );

          $res = $stmt->execute();
          if ($res) {
            $this->getHeaders();
            echo json_encode(array('status' => 'success', 'ok' => 1, 'id' => $stmt->insert_id));
            $stmt->close();

          } else {
            throw new Exception("Error Processing Request", 1);
          }
        } else {
          throw new Exception("Error Processing Request", 1);
        }
      } catch (Exception $e) {
        $this->getHeaders();
        echo json_encode(array('status' => $e->getMessage(), 'ok' => 0));
      }
    }else{
      $this->getHeaders();
      echo json_encode(array('status' => 'Method not allowed', 'ok' => 0));
    }
  }

}

?>