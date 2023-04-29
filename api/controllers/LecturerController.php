<?php
namespace Api\controllers;

use Exception;
use services\DB;
use services\CS;

class LecturerController
{
  public $conn = null;
  public $generatedId = null;
  public function __construct()
  {
    /* create connection */
    $this->conn = (new DB())->dbConnect();
    $this->generatedId = (new CS())->generateId('lecturer');
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


  public function lecturer()
  {

    $this->conn;
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method == 'GET') {
      $sql = 'SELECT * FROM lecturers WHERE 1 = 1 ';
      if (isset($_GET['id'])) {
        $id = $_GET['id'];
        $sql .= " AND id = '$id'";
      }

      if (isset($_GET['discipline'])) {
        $discipline = $_GET['discipline'];
        $sql .= " AND discipline = '$discipline'";
      }
      if (isset($_GET['degree'])) {
        $degree = $_GET['degree'];
        $sql .= " AND degree = '$degree'";
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
            $this->getHeaders();
            echo json_encode(array('status' => 'success', 'lecturer' => $data));
          } else {
            $this->getHeaders();
            echo json_encode(array('message' => 'no lecturer found'));
          }
        } else {
          $this->getHeaders();
          echo json_encode(array('message' => 'no lecturer found'));
        }

      } catch (Exception $e) {
        $this->getHeaders();
        echo json_encode(array('message' => $e->getMessage()));
      }
    } elseif ($method == 'POST') {
      $method = $_POST['method'];
      if ($method == 'POST') {
        try {
          $post = $_POST;
          $sql = "INSERT INTO lecturers (
          id,
          firstName,
          lastName,
          othernames,
          email,
          password,
          phone,
          dob,
          gender,
          discipline,
          degreeAcquired,
          assigned_courses
        ) VALUES
      (?,?,?,?,?,?,?,?,?,?,?,?)";

          $id = $this->generatedId;
          $firstname = $post['firstName'];
          $lastname = $post['lastName'];
          $othernames = $post['otherNames'];
          $email = htmlspecialchars($post['email']);
          $phone = htmlspecialchars($post['phone']);
          $password = 'lect123';
          $dob = $post['dob'];
          $gender = $post['gender'];
          $discipline = $post['discipline'];
          $degreeAcquired = $post['degreeAcquired'];
          $assigned_courses = json_encode([]);

          $stmt = $this->conn->prepare($sql);
          $stmt->bind_param("ssssssssssss", $id, $firstname, $lastname, $othernames, $email, $password, $phone, $dob, $gender, $discipline, $degreeAcquired, $assigned_courses);


          $res = $stmt->execute();
          if ($res) {
            $this->getHeaders();
            echo json_encode(array('status' => 200, 'message' => 'successful', 'ok' => 1, 'lecturer_info' => array('lecturerId' => $id, 'password' => $password)));
          } else {
            $this->getHeaders();

            echo json_encode(array('status' => 400, 'message' => 'failed', 'ok' => 0));
          }
        } catch (Exception $e) {
          $this->getHeaders();

          echo json_encode(array("status" => 400, "message" => $e->getMessage(), "ok" => 0));

        }

      } elseif ($method == 'PUT') {

        $post = $_POST;
        $id = $post['id'];
        $sql = "UPDATE lecturers SET
          firstName=?,
          lastName=?,
          othernames=?,
          email=?,
          phone=?,
          password=?,
          dob=?,
          gender=?,
          discipline=?,
          degreeAcquired=?
        WHERE id = '$id'";

        $firstname = $post['firstName'];
        $lastname = $post['lastName'];
        $othernames = $post['otherNames'];
        $email = htmlspecialchars($post['email']);
        $phone = htmlspecialchars($post['phone']);
        $password = $post['password'];
        $dob = $post['dob'];
        $gender = $post['gender'];
        $discipline = $post['discipline'];
        $degreeAcquired = $post['degreeAcquired'];
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ssssssssss", $firstname, $lastname, $othernames, $email, $phone, $password, $dob, $gender, $discipline, $degreeAcquired);

        $res = $stmt->execute();
        if ($res) {
          $this->getHeaders();
          echo json_encode(array('status' => 200, 'message' => 'successful', 'ok' => 1, 'lecturer_info' => array('lecturerId' => $id, 'password' => $password)));
        } else {
          $this->getHeaders();
          echo json_encode(array('status' => 400, 'message' => 'failed', 'ok' => 0));
        }
      } elseif ($method == 'DELETE') {
        try {
          $post = $_POST;
          $id = $post['id'];
          $sql = "DELETE FROM lecturers WHERE id = '$id'";
          $res = $this->conn->prepare($sql);
          $res->execute();
          if ($res) {
            $this->getHeaders();
            echo json_encode(array('status' => 200, 'message' => 'successful', 'ok' => 1));
          } else {
            $this->getHeaders();
            echo json_encode(array('status' => 400, 'message' => 'failed', 'ok' => 0));
          }
        } catch (Exception $e) {
          $this->getHeaders();
          echo json_encode(array('status' => 400, 'message' => $e->getMessage(), 'ok' => 0));
        }
      } else {
        $this->getHeaders();
        echo json_encode(array('message' => 'wrong method', 'ok' => 0, 'status' => 'failed'));
      }
    } else {
      $this->getHeaders();
      echo json_encode(array('message' => 'wrong method', 'ok' => 0, 'status' => 'failed'));
    }
  }
}