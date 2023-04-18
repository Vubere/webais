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
          level,
          entrance_session,
          graduation_session
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

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
        $duration = $post['duration'];
        $entrance_session = $post['entrance_session'];
        $year = explode('/',$entrance_session)[0];
        $graduation_year = (int)$year + (int)$duration;
        $graduation_year2 = (int)$year + (int)$duration +1;
        $graduation_session = ''.$graduation_year.'/'.$graduation_year2;

        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ssssssssssssss", $id, $firstname, $lastname, $othernames, $email, $phone, $password, $dob, $gender, $faculty, $department, $level,  $entrance_session, $graduation_session);

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
      $sql = 'SELECT d.name as department_name, d.duration, f.name as faculty_name, s.firstName, s.lastName, s.otherNames, s.level, s.password, s.phone, s.email, s.gender, s.faculty, s.department, s.id, s.dob, s.entrance_session, s.graduation_session FROM students as s INNER JOIN departments AS d ON s.department = d.id INNER JOIN faculties as f ON f.id = s.faculty WHERE 1=1';
      if (isset($_GET['id'])) {
        $sql .= ' AND s.id="' . $_GET['id'] . '"';
      }
      if (isset($_GET['email'])) {
        $sql .= ' AND s.email="' . $_GET['email'] . '"';
      }
      if (isset($_GET['firstName'])) {
        $sql .= ' AND s.firstName="' . $_GET['firstName'] . '"';
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
            echo json_encode(array('message' => 'successful', 'ok' => 1, 'students' => $data));
          } else {
            $this->getHeaders();
            echo json_encode(array('message' => 'no student found', 'ok'=>0));
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
          level=?,
          duration=?,
          entrance_session=?,
          graduation_session=?
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
      $duration = $post['duration'];
      $entrance_session = $post['entrance_session'];
      $graduation_session = (string)((int)explode($entrance_session, '/')[0] + (int)$duration) . '/' . (string)((int)explode($entrance_session, '/')[1] + (int)$duration);
      $stmt->bind_param("ssssssssssssss", $firstname, $lastname, $othernames, $email, $phone, $password, $dob, $gender, $faculty, $department, $level, $entrance_session, $graduation_session, $id);
     
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

  public function student_registered_courses(){
    $method = $_SERVER['REQUEST_METHOD'];
    if($method=='GET'){
      $sql = 'SELECT s.department, CONCAT(s.firstName," ",s.lastName) as fullName, s.id, s.level, s.entrance_session,  dc.code, dc.units, dc.type, c.title, c.description FROM students as s INNER JOIN department_courses as dc ON dc.departments LIKE CONCAT("%", s.department, "%") INNER JOIN courses as c  ON c.id = dc.course_id INNER JOIN course_registrations as cr ON cr.department_course_id = dc.id AND cr.student_id=s.id  WHERE 1=1';
      if(isset($_GET['student_id'])){
        $sql .= ' AND s.id="'.$_GET['student_id'].'"';
      }
      if(isset($_GET['course_id'])){
        $sql .= ' AND dc.id="'.$_GET['course_id'].'"';
      }
      if(isset($_GET['session'])){
        $sql .= ' AND dc.session="'.$_GET['session'].'"';
      }
      if(isset($_GET['semester'])){
        $sql .= ' AND dc.semester="'.$_GET['semester'].'"';
      }
      try{
        $stmt = $this->conn->prepare($sql);
        $res = $stmt->execute();
        if ($res) {
          $result = $stmt->get_result();
          if ($result) {
            $data = array();
            if($result->num_rows > 0)
            while ($row = $result->fetch_assoc()) {
              array_push($data, $row);
            }
            $this->getHeaders();
            echo json_encode(array('message' => 'successful', 'ok' => 1, 'details' => $data));
          } else {
            $this->getHeaders();
            echo json_encode(array('message' => 'no registered course found', 'ok'=>0));
          }
        }
      }catch(Exception $e){
        $this->getHeaders();
        echo json_encode(array('message' => $e->getMessage(), 'ok' => 0, 'status' => 'failed', 'line'=>$e->getLine()));
      }
    }else{
      $this->getHeaders();
      echo json_encode(array('message' => 'wrong method', 'ok' => 0, 'status' => 'failed'));
    }
  }
}