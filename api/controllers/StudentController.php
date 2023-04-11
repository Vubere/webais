<?php
namespace Api\controllers;

use Exception;
use services\DB;
use services\CS;

class StudentController
{
  public $conn = null;
  public $generatedId = null;
  public function __construct()
  {
    $this->conn = (new DB())->dbConnect();
    $this->generatedId = (new CS())->generateId('student');
  }
  public function getHeaders(){
    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Headers: *');
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS, DELETE");
    header('Content-Type: application/json charset-UTF-8');
  }
  public function student()
  {
    $this->conn;
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method == 'POST') {
      try {
        $post = $_POST;

        $sql = "INSERT INTO students (
          id,
          firstName,
          lastName,
          othernames,
          email,
          phone,
          password,
          dob,
          gender,
          faculty,
          department,
          level
        ) VALUES
      (?,?,?,?,?,?,?,?,?,?,?,?)";

        $id = $this->generatedId;
        $firstname = $post['firstName'];
        $lastname = $post['lastName'];
        $othernames = $post['otherNames'];
        $email = htmlspecialchars($post['email']);
        $phone = htmlspecialchars($post['phone']);
        $password = 'stu123';
        $dob = $post['dob'];
        $gender = $post['gender'];
        $faculty = $post['faculty'];
        $department = $post['department'];
        $level = $post['level'];

        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ssssssssssss", $id, $firstname, $lastname, $othernames, $email, $phone, $password, $dob, $gender, $faculty, $department, $level);

        $res = $stmt->execute();
        if ($res) {

          $this->getHeaders();
          echo json_encode(array('status' => 200, 'message' => 'successful', 'ok' => 1, 'student_info' => array('studentId' => $id, 'password' => $password)));
        } else {
          $this->getHeaders();
          echo json_encode(array('status' => 400, 'message' => 'failed', 'ok' => 0));
        }
      } catch (Exception $e) {

        $this->getHeaders();
        echo json_encode(array("status" => 400, "message" => $e->getMessage(), "ok" => 0));
        //mysqli_close($this->conn);
      }
    } elseif ($_SERVER['REQUEST_METHOD'] == 'GET') {
      $sql = 'SELECT * FROM students WHERE 1 = 1';
      if (isset($_GET['id'])) {
        $sql .= ' AND id="' . $_GET['id'] . '"';
      }
      if (isset($_GET['email'])) {
        $sql .= ' AND email="' . $_GET['email'] . '"';
      }
      if (isset($_GET['firstName'])) {
        $sql .= ' AND firstName="' . $_GET['firstName'] . '"';
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
            echo json_encode($data);
          } else {
            $this->getHeaders();
            echo json_encode(array('message' => 'no student found'));
          }
        }

      } catch (Exception $e) {
        $this->getHeaders();
        echo json_encode(array('message' => $e->getMessage()));
      }
    } elseif ($_SERVER['REQUEST_METHOD'] == 'PUT') {

      $post = $_POST;
      $id = $post['id'];
      $sql = "UPDATE students SET 
          firstName=?,
          lastName=?,
          othernames=?,
          email=?,
          phone=?,
          password=?,
          dob=?,
          gender=?,
          faculty=?,
          department=?,
          level=?
           WHERE id = '" . $id . "'";
      $stmt = $this->conn->prepare($sql);
      $firstname = $post['firstName'];
      $lastname = $post['lastName'];
      $othernames = $post['otherNames'];
      $email = htmlspecialchars($post['email']);
      $phone = htmlspecialchars($post['phone']);
      $password = $post['password'];
      $dob = $post['dob'];
      $gender = $post['gender'];
      $faculty = $post['faculty'];
      $department = $post['department'];
      $level = $post['level'];
      $stmt->bind_param("sssssssssss", $firstname, $lastname, $othernames, $email, $phone, $password, $dob, $gender, $faculty, $department, $level);
      $res = $stmt->execute();
      if ($res) {
        $this->getHeaders();
        echo json_encode(array('message' => 'student updated', 'ok' => 1, 'status' => 'success', 'student_info' => array('studentId' => $id, 'password' => $password)));
      } else {
        $this->getHeaders();
        echo json_encode(array('message' => 'failed to update student', 'ok' => 0, 'status' => 'failed'));
      }

    } elseif ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
      try {

        $post = $_POST;
        $id = $post['id'];
        $sql = "DELETE FROM students WHERE id = '" . $id . "'";
        $res = $this->conn->query($sql);
        if ($res) {
          $this->getHeaders();
          echo json_encode(array('message' => 'student deleted', 'ok' => 1, 'status' => 'success'));
        } else {
          $this->getHeaders();
          throw new Exception('failed to delete student');
        }
      } catch (Exception $e) {
        $this->getHeaders();
        echo json_encode(array('message' => $e->getMessage()));
      }
    } else {
      $this->getHeaders();
      echo json_encode(array('message' => 'wrong method', 'ok' => 0, 'status' => 'failed'));

    }
  }
}