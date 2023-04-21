<?php
namespace Api\controllers;

use Exception;
use services\DB;

class EventsController
{
  public $conn = null;
  public function __construct()
  {
    $this->conn = (new DB())->dbConnect();
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



  private function checkIfCourseExist($course_code)
  {
    $sql = "SELECT * FROM department_courses WHERE code = '$course_code'";
    $res = $this->conn->query($sql);
    if ($res) {
      $rows = $res->fetch_assoc();
      if ($rows && isset($rows['id'])) {
        return $rows['id'];
      } else {
        return false;
      }
    } else {
      throw new Exception("Error Processing Request", 1);
    }
  }
  public function create_lecture()
  {
    $this->conn;
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method == 'POST') {
      try {
        $post = $_POST;
     
        $sql = "INSERT INTO lectures(
          time,
          day,
          duration,
          course_id,
          lecturer_id,
          venue
        ) VALUES (
          ?,?,?,?,?,?
        )";
        $time = $post['time'];
        $day = $post['day'];
        $duration = $post['duration'];
        $course_id = (int)$post['course_id'];
        $lecturer_id = $post['lecturer_id'];
        $venue = $post['venue'];
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param(
          "ssssss",
          $time,
          $day,
          $duration,
          $course_id,
          $lecturer_id,
          $venue
        );

        $res = $stmt->execute();
        if ($res) {

          $this->getHeaders();
          echo json_encode(array('status' => 'success', 'ok' => 1, 'id' => $stmt->insert_id));
        } else {
          throw new Exception("Error Processing Request", 1);
        }
        $stmt->close();
      } catch (Exception $e) {
        $this->getHeaders();
        echo json_encode(array('status' => $e->getMessage(), 'ok' => 0));
      }
    } else {
      $this->getHeaders();
      echo json_encode(array('status' => 'error'));
    }
  }
  
  public function lectures()
  {
    $this->conn;
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method == 'GET') {
      try {
        $sql = "SELECT lectures.id,lectures.time, lectures.day, lectures.duration, lectures.lecturer_id, lectures.venue, courses.title, department_courses.code, department_courses.id AS course_id, CONCAT(lecturers.firstName, ' ', lecturers.lastName) AS lecturer_name, lecturers.discipline  FROM lectures INNER JOIN department_courses ON lectures.course_id = department_courses.id INNER JOIN courses ON courses.id = department_courses.course_id INNER JOIN lecturers ON lectures.lecturer_id = lecturers.id";

        if(isset($_GET['id'])){
          $sql .= " WHERE lectures.id = '".$_GET['id']."'";
        }
        if(isset($_GET['lecturer_id'])){
          $sql .= " WHERE lectures.lecturer_id LIKE '".$_GET['lecturer_id']."'";
        }
        $res = $this->conn->query($sql);
        if (!$res) {
          throw new Exception("Error Processing Request", 1);
        }
        $this->getHeaders();
        $data = array();
        while ($row = $res->fetch_assoc()) {
          $data[] = $row;
        }
        echo json_encode(array('lectures' => $data, 'status' => 'success ', 'ok' => 1));
      } catch (Exception $e) {
        $this->getHeaders();
        echo json_encode(array('status' => $e->getMessage()));
      }
    } elseif ($method == 'PUT') {
      $put = json_decode(file_get_contents('php://input'), true);
      $sql = "UPDATE lectures SET time=?,day=?,duration=?,course_id=?,lecturer_id=?,venue=? WHERE id='" . $put['id']."'";
      $time = $put['time'];
      $day = $put['day'];
      $duration = $put['duration'];
 
      $course_id = $put['course_id'];
      $stmt = $this->conn->prepare($sql);
      $lecturer_id = $put['lecturer_id'];
      $venue = $put['venue'];
      $stmt->bind_param("ssssss", $time, $day, $duration, $course_id, $lecturer_id, $venue);


      $res = $stmt->execute();
      if (!$res) {
        throw new Exception("Error Processing Request", 1);
      }
      $this->getHeaders();
      echo json_encode(array('status' => 'success', 'ok' => 1));
    }elseif($method=="DELETE"){
      try{
        $delete = $_POST;
        $sql = "DELETE FROM lectures WHERE id = '".$delete['id']."'";
        $res = $this->conn->query($sql);
        if(!$res){
          throw new Exception("Error Processing Request", 1);
        }
        $this->getHeaders();
        echo json_encode(array('status' => 'success', 'ok' => 1));
      }catch(Exception $e){
        $this->getHeaders();
        echo json_encode(array('status' => $e->getMessage(), 'ok' => 0));
      }
    } else {
      $this->getHeaders();
      echo json_encode(array('status' => 'Method not allowed', 'ok' => 0));
    }
  }
  public function create_exam()
  {
    $this->conn;
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method == 'POST') {
      try {
        $post = $_POST;
       
        $sql = "INSERT INTO examinations(
          time,
          date,
          duration,
          course_id,
          lecturer_id,
          venue
        ) VALUES (
          ?,?,?,?,?,?
        )";
        $time = $post['time'];
        $date = $post['date'];
        $duration = $post['duration'];
        $course_id = $post['course_id'];
        $lecturer_id = $post['lecturer_id'];
        $venue = $post['venue'];
        
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param(
          "ssssss",
          $time,
          $date,
          $duration,
          $course_id,
          $lecturer_id,
          $venue
        );

        $res = $stmt->execute();
        if ($res) {

          $this->getHeaders();
          echo json_encode(array('status' => 'success', 'ok' => 1, 'id' => $stmt->insert_id));
        } else {
          throw new Exception("Error Processing Request", 1);
        }
        $stmt->close();
      } catch (Exception $e) {
        $this->getHeaders();
        echo json_encode(array('status' => $e->getMessage(), 'ok' => 0));
      }
    } else {
      $this->getHeaders();
      echo json_encode(array('status' => 'error'));
    }
  }
  private function get_course_code($id)
  {
    $sql = "SELECT code FROM department_courses WHERE id='" . $id . "'";
    $res = $this->conn->query($sql);
    if (!$res) {
      throw new Exception("Error Processing Request", 1);
    }
    $row = $res->fetch_assoc();
    return $row['code'];
  }
  public function examinations()
  {
    $this->conn;
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method == 'GET') {
      try {

        $sql = "SELECT e.time, e.date, e.duration, e.id, e.venue, c.title, dc.id AS course_id, dc.code, l.discipline, CONCAT(l.firstName,' ', l.lastName) as lecturer_name, l.id as lecturer_id FROM examinations as e INNER JOIN department_courses as dc ON e.course_id = dc.id INNER JOIN courses as c ON c.id = dc.course_id INNER JOIN lecturers as l ON e.lecturer_id = l.id";

        if (isset($_GET['id'])) {
          $sql .= " WHERE e.id='" . $_GET['id'] . "'";
        }
        if (isset($_GET['course_id'])) {
          $sql .= " WHERE e.course_id='" . $_GET['course_id'] . "'";
        }
        if (isset($_GET['lecturer_id'])) {
          $sql .= " WHERE e.lecturer_id='" . $_GET['lecturer_id'] . "'";
        }
        $res = $this->conn->query($sql);
        if (!$res) {
          throw new Exception("Error Processing Request", 1);
        }
        $data = array();
        while($row = $res->fetch_assoc()){
          $data[] = $row; 
        }
        $this->getHeaders();
        echo json_encode(array('exams' => $data, 'status' => 200, 'ok' => 1));
      } catch (Exception $e) {
        $this->getHeaders();
        echo json_encode(array('status' => $e->getMessage()));
      }
    } elseif ($method == 'PUT') {
      $put = json_decode(file_get_contents('php://input'), true);
      if(!isset($put['id'])){
        throw new Exception("Error Processing Request", 1);
      }

      $sql = "UPDATE examinations SET time=?,date=?,duration=?,course_id=?,lecturer_id=?,venue=? WHERE id='" . $put['id'] . "'";
      $time = $put['time'];
      $date = $put['date'];
      $duration = $put['duration'];
      $course_id = $put['course_id'];

      $lecturer_id = $put['lecturer_id'];
      $venue = $put['venue'];
      $stmt = $this->conn->prepare($sql);
      $stmt->bind_param("sssiss", $time, $date, $duration, $course_id, $lecturer_id, $venue);
      $res = $stmt->execute();
      if (!$res) {
        throw new Exception("Error Processing Request", 1);
      }
      $this->getHeaders();
      echo json_encode(array('status' => 'success', 'ok' => 1));
    }elseif($method=='DELETE'){

    } else {
      $this->getHeaders();
      echo json_encode(array('status' => 'Method not allowed', 'ok' => 0));
    }
  }
  public function get_lecturer_assigned_course_exams(){
    $method = $_SERVER['REQUEST_METHOD'];
    if($method=='GET'){
      try{
        $sql = "SELECT e.time, e.date, e.duration, e.id, e.venue, c.title, dc.id AS course_id, dc.code, l.discipline, CONCAT(l.firstName,' ', l.lastName) as lecturer_name, l.id as lecturer_id FROM examinations as e INNER JOIN department_courses as dc ON e.course_id = dc.id INNER JOIN courses as c ON c.id = dc.course_id INNER JOIN lecturers as l ON e.lecturer_id = l.id";
        if(isset($_GET['lecturer_id'])){
          $sql .= " WHERE dc.assigned_lecturers LIKE '%".$_GET['lecturer_id']."%'";
        }
        $res = $this->conn->query($sql);
        if(!$res){
          throw new Exception("Error Processing Request", 1);
        }
        $data = array();
        while($row = $res->fetch_assoc()){
          $data[] = $row; 
        }
        $this->getHeaders();
        echo json_encode(array('exams' => $data, 'status' => 200, 'ok' => 1));
      }catch(Exception $e){
        $this->getHeaders();
        echo json_encode(array('status' => $e->getMessage()));
      }

    }else{
      $this->getHeaders();
      echo json_encode(array('status' => 'Method not allowed', 'ok' => 0));
    }

  }
  public function announcements()
  {
    $this->conn;
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method == 'GET') {
      try {
        $sql = "SELECT * FROM annoucements";
        if (isset($_GET['id'])) {
          $sql .= " WHERE id='" . $_GET['id'] . "'";
        }
        $res = $this->conn->query($sql);
        if (!$res) {
          throw new Exception("Error Processing Request", 1);
        }
        $this->getHeaders();
        $data = array();
        while ($row = $res->fetch_assoc()) {
          $data[] = $row;
        }

        $this->getHeaders();
        echo json_encode(array('annoucements' => $data, 'status' => 'success', 'ok' => 1));
      } catch (Exception $e) {
        $this->getHeaders();
        echo json_encode(array('status' => $e->getMessage()));
      }
    } elseif ($method == 'PUT') {
      $put = json_decode(file_get_contents('php://input'), true);
      $type = $put['type'];
      $title = $put['title'];
      $content = $put['content'];
      $target = $put['targets'];
      $time = $put['time'];
      $date = $put['date'];
      $sql = "UPDATE annoucements SET type=?, title=?,content=?, target=?, time=?, date=? WHERE id='" . $put['id'] . "'";
      $stmt = $this->conn->prepare($sql);
      $stmt->bind_param("ssssss", $type, $title, $content, $target, $time, $date);
      
      $res = $stmt->execute();
      if (!$res) {
        throw new Exception("Error Processing Request", 1);
      }
      $this->getHeaders();
      echo json_encode(array('status' => 'success', 'ok' => 1));
    } elseif ($method == 'POST') {
      try {
        $post = $_POST;
        $sql = "INSERT INTO annoucements(
          type,
          title,
          content,
          target,
          time,
          date
        ) VALUES (
          ?,?,?,?,?,?
        )";
        $type = $post['type'];
        $title = $post['title'];
        $content = $post['content'];
        $target = $post['targets'];
        $time = $post['time'];
        $date = $post['date'];
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param(
          "ssssss",
          $type,
          $title,
          $content,
          $target,
          $time,
          $date
        );
     
        $res = $stmt->execute();
        if ($res) {
          $this->getHeaders();
          echo json_encode(array('status' => 'success', 'ok' => 1, 'id' => $stmt->insert_id));
        } else {
          throw new Exception("Error Processing Request", 1);
        }
        $stmt->close();
      } catch (Exception $e) {
        $this->getHeaders();
        echo json_encode(array('status' => $e->getMessage(), 'ok' => 0));
      }
    } elseif ($method == 'DELETE') {
      $delete = $_POST;
      $sql = "DELETE FROM annoucements WHERE id='" . $delete['id'] . "'";
      $res = $this->conn->query($sql);
      if (!$res) {
        throw new Exception("Error Processing Request", 1);
      }
      $this->getHeaders();
      echo json_encode(array('status' => 'success', 'ok' => 1));
    } else {
      $this->getHeaders();
      echo json_encode(array('status' => 'Method not allowed', 'ok' => 0));
    }
  }
  public function get_student_lectures()
  {

    $this->conn;
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method == 'GET') {
      try {

        $student_id = $_GET['student_id'];
        $session = $_GET['session'];
        $semester = $_GET['semester'];

        $sql = "SELECT lectures.id,lectures.time, lectures.day, lectures.duration, lectures.lecturer_id, lectures.venue, courses.title, department_courses.code, department_courses.id as course_id, CONCAT(lecturers.firstName, ' ', lecturers.lastName,' ', lecturers.degreeAcquired) AS lecturer_name FROM lectures INNER JOIN department_courses ON lectures.course_id = department_courses.id INNER JOIN courses ON department_courses.course_id = courses.id INNER JOIN lecturers ON lectures.lecturer_id = lecturers.id
         WHERE department_courses.id
      IN
      (SELECT department_course_id FROM course_registrations WHERE student_id = '$student_id' AND session = '$session' AND semester = '$semester')";
        $stmt = $this->conn->prepare($sql);
        $res = $stmt->execute();
        if (!$res) {
          throw new Exception("Error Processing Request", 1);
        } else {
          $res = $stmt->get_result();
          $data = array();
          while ($row = $res->fetch_assoc()) {
            $data[] = $row;
          }
          $this->getHeaders();
          echo json_encode(array('lectures' => $data, 'status' => 'success', 'ok' => 1));
        }
      } catch (Exception $e) {
        $this->getHeaders();
        echo json_encode(array('status' => $e->getMessage(), 'ok' => 0));
      }

    } else {
      $this->getHeaders();
      echo json_encode(array('status' => 'Method not allowed', 'ok' => 0));
    }
  }
}

?>