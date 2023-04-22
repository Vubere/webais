<?php
namespace Api\controllers;

use Exception;
use services\DB;
use services\CS;

class AdminController{
  public $conn = null;
  public $generatedId = null;

  public function __construct()
  {
    /* create connectio */
    $this->conn = (new DB())->dbConnect();
    $this->generatedId = (new CS())->generateId('admin');
  }

  public function getHeaders()
  {
    //allow request from any origin
    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Headers: *');
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS, DELETE");
    header('Content-Type: application/json charset-UTF-8');
  }
  
  public function admin()
  {
    if ($_SERVER['REQUEST_METHOD'] == 'GET') {
      $sql = 'SELECT * FROM administrators';
      if (isset($_GET['id'])) {
        $id = $_GET['id'];
        $sql = "SELECT * FROM administrators WHERE id = '$id'";
      }
      if (isset($_GET['email'])) {
        $email = $_GET['email'];
        $sql = "SELECT * FROM administrators WHERE email = '$email'";
      }
      try {
        $res = $this->conn->prepare($sql);
        $adminTable = $res->execute();
        if ($adminTable) {
          $result = $res->get_result();
          if ($result->num_rows > 0) {
            $data = array();
            while ($row = $result->fetch_assoc()) {
              array_push($data, $row);
            }
            
            if (isset($_GET['id']) || isset($_GET['email'])) {
              $this->getHeaders();
              echo json_encode(array('admin' => $data[0]));
            } else {
              $this->getHeaders();
              echo json_encode(array($data));
            }
          } else {
            
            $this->getHeaders();
            echo json_encode(array('message' => 'no admin found'));
          }
        } else {
          
          $this->getHeaders();
          echo json_encode(array('message' => 'failed to fetch admin'));
        }
      } catch (Exception $e) {
        
        $this->getHeaders();
        echo json_encode(array('message' => $e->getMessage()));
      }
    } elseif ($_SERVER['REQUEST_METHOD'] == 'PUT') {
    
      $post = json_decode(file_get_contents('php://input'), true);

      $id = $post['id'];
      $sql = "UPDATE administrators SET 
          firstName=?,
          lastName=?,
          othernames=?,
          email=?,
          phone=?,
          password=?,
          dob=?,
          gender=?
        WHERE id = '$id'";

      $firstname = $post['firstName'];
      $lastname = $post['lastName'];
      $othernames = $post['otherNames'];
      $email = htmlspecialchars($post['email']);
      $phone = htmlspecialchars($post['phone']);
      $password = $post['password'];
      $dob = $post['dob'];
      $gender = $post['gender'];
      $stmt = $this->conn->prepare($sql);
      $stmt->bind_param("ssssssss", $firstname, $lastname, $othernames, $email, $phone, $password, $dob, $gender);

      $res = $stmt->execute();
      if ($res) {
        
        $this->getHeaders();
        echo json_encode(array('status' => 200, 'message' => 'successful', 'ok' => 1, 'admin_info' => array('adminId' => $post['id'], 'password' => $post['password'])));
      } else {
        $this->getHeaders();
        echo json_encode(array('status' => 400, 'message' => 'failed', 'ok' => 0));
      }
    } elseif ($_SERVER['REQUEST_METHOD']=="POST") {
       try {
        $post = $_POST;

        $sql = "INSERT INTO administrators (
          id,
          firstName,
          lastName,
          othernames,
          email,
          phone,
          password,
          dob,
          gender
        ) VALUES
      (?,?,?,?,?,?,?,?,?)";

        $stmt = $this->conn->prepare($sql);
        $id = $this->generatedId;
        $firstname = $post['firstName'];
        $lastname = $post['lastName'];
        $othernames = $post['otherNames'];
        $email = htmlspecialchars($post['email']);
        $phone = htmlspecialchars($post['phone']);
        $password = 'admin123';
        $dob = $post['dob'];
        $gender = $post['gender'];
        $stmt->bind_param("sssssssss", $id, $firstname, $lastname, $othernames, $email, $phone, $password, $dob, $gender);
        $res = $stmt->execute();
        if ($res) {
          $this->getHeaders();

          echo json_encode(array('status' => 200, 'message' => 'successful', 'ok' => 1, 'admin_info' => array('admin_id' => $id, 'admin_password' => $password)));
        } else {
          $this->getHeaders();
          echo json_encode(array('status' => 400, 'message' => 'failed', 'ok' => 0));

        }
      } catch (Exception $e) {
      
        $this->getHeaders();
        echo json_encode(array("status" => 400, "message" => $e->getMessage(), "ok" => 0));
        //mysqli_close($this->conn);
      }
    }elseif($_SERVER['REQUEST_METHOD']=='DELETE'){
      try{
        $post = json_decode(file_get_contents('php://input'), true);
        $id = $post['id'];
        $sql = "DELETE FROM administrators WHERE id = '$id'";
        $res = $this->conn->prepare($sql);
        $res->execute();
        if($res){
          $this->getHeaders();
          echo json_encode(array('status' => 200, 'message' => 'successful', 'ok' => 1));
        }else{
          $this->getHeaders();
          echo json_encode(array('status' => 400, 'message' => 'failed', 'ok' => 0));
        }
      }catch(Exception $e){
        $this->getHeaders();
        echo json_encode(array('status' => 400, 'message' => $e->getMessage(), 'ok' => 0));
      }
    } else {
      $this->getHeaders();
      echo json_encode(array('message' => 'wrong method'));
    }
  }
}
