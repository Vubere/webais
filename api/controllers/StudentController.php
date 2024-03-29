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
  public function getHeaders()
  {
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
    if ($_SERVER['REQUEST_METHOD'] == 'GET') {
      $sql = 'SELECT d.name as department_name, d.duration, f.name as faculty_name, s.firstName, s.lastName, s.otherNames, s.level, s.password, s.phone, s.email, s.gender, s.faculty, s.department, s.id, s.dob, s.entrance_session, s.graduation_session, s.status FROM students as s INNER JOIN departments AS d ON s.department = d.id INNER JOIN faculties as f ON f.id = s.faculty WHERE 1=1';
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
            echo json_encode(array('message' => 'no student found', 'ok' => 0));
          }
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
          $year = explode('/', $entrance_session)[0];
          $graduation_year = (int) $year + (int) $duration-1;
          $graduation_year2 = (int) $year + (int) $duration ;
          $graduation_session = '' . $graduation_year . '/' . $graduation_year2;

          $stmt = $this->conn->prepare($sql);
          $stmt->bind_param("ssssssssssssss", $id, $firstname, $lastname, $othernames, $email, $phone, $password, $dob, $gender, $faculty, $department, $level, $entrance_session, $graduation_session);

          $res = $stmt->execute();
          if ($res) {

            $this->getHeaders();
            echo json_encode(array('status' => 200, 'message' => 'successful', 'ok' => 1, 'student_info' => array('studentId' => $id, 'password' => $password)));
          } else {
            $this->getHeaders();
            echo json_encode(array('status' => 400, 'message' => 'failed', 'ok' => 0, $this->conn->error));
          }
        } catch (Exception $e) {

          $this->getHeaders();
          echo json_encode(array("status" => 400, "message" => $e->getMessage(), "ok" => 0));
          //mysqli_close($this->conn);
        }
      } elseif ($method == 'PUT') {

        $put = $_POST;
        $id = $put['id'];
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
          entrance_session=?,
          graduation_session=?,
          status=?
           WHERE id = '" . $id . "'";
        $stmt = $this->conn->prepare($sql);
        $firstname = $put['firstName'];
        $lastname = $put['lastName'];
        $othernames = $put['otherNames'];
        $email = htmlspecialchars($put['email']);
        $phone = htmlspecialchars($put['phone']);
        $password = $put['password'];
        $dob = $put['dob'];
        $gender = $put['gender'];
        $faculty = $put['faculty'];
        $department = $put['department'];
        $level = $put['level'];
        $duration = $put['duration'];
        $entrance_session = $put['entrance_session'];
        $graduation_session = (string) ((int) explode('/', $entrance_session)[0] + (int) $duration) . '/' . (string) ((int) explode('/', $entrance_session)[1] + (int) $duration);
        $status = $put['status'];
        $stmt->bind_param("ssssssssssssss", $firstname, $lastname, $othernames, $email, $phone, $password, $dob, $gender, $faculty, $department, $level, $entrance_session, $graduation_session, $status);

        $res = $stmt->execute();
        if ($res) {
          $this->getHeaders();
          echo json_encode(array('message' => 'student updated', 'ok' => 1, 'status' => 'success', 'student_info' => array('studentId' => $id, 'password' => $password)));
        } else {
          $this->getHeaders();
          echo json_encode(array('message' => 'failed to update student', 'ok' => 0, 'status' => 'failed'));
        }

      } elseif ($method == 'DELETE') {
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
    } else {
      $this->getHeaders();
      echo json_encode(array('message' => 'wrong method', 'ok' => 0, 'status' => 'failed'));

    }
  }

  public function student_registered_courses()
  {
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method == 'GET') {
      $sql = 'SELECT s.department, CONCAT(s.firstName," ",s.lastName) as fullName, s.id, s.level, s.entrance_session,dc.id as course_id,  dc.code, dc.units, dc.type, c.title, c.description, dc.semester FROM students as s INNER JOIN assigned_courses as dc ON dc.departments LIKE CONCAT("%", s.department, "%") INNER JOIN courses as c ON c.id = dc.course_id INNER JOIN course_registrations as cr ON cr.department_course_id = dc.id AND cr.student_id=s.id  WHERE 1=1';
      if (isset($_GET['student_id'])) {
        $sql .= ' AND s.id="' . $_GET['student_id'] . '"';
      }
      if (isset($_GET['course_id'])) {
        $sql .= ' AND dc.id="' . $_GET['course_id'] . '"';
      }
      if (isset($_GET['session'])) {
        $sql .= ' AND cr.session="' . $_GET['session'] . '"';
      }
      if (isset($_GET['semester'])) {
        $sql .= ' AND dc.semester="' . $_GET['semester'] . '"';
      }
      try {
        $stmt = $this->conn->prepare($sql);
        $res = $stmt->execute();
        if ($res) {
          $result = $stmt->get_result();
          if ($result) {
            $data = array();
            if ($result->num_rows > 0)
              while ($row = $result->fetch_assoc()) {
                array_push($data, $row);
              }
            $this->getHeaders();
            echo json_encode(array('message' => 'successful', 'ok' => 1, 'details' => $data));
          } else {
            $this->getHeaders();
            echo json_encode(array('message' => 'no registered course found', 'ok' => 0));
          }
        }
      } catch (Exception $e) {
        $this->getHeaders();
        echo json_encode(array('message' => $e->getMessage(), 'ok' => 0, 'status' => 'failed', 'line' => $e->getLine()));
      }
    } else {
      $this->getHeaders();
      echo json_encode(array('message' => 'wrong method', 'ok' => 0, 'status' => 'failed'));
    }
  }
  public function move_students_to_next_level()
  {
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method == 'POST') {
      $post = json_decode(file_get_contents('php://input'), true);
      $session = $post['session'];
      $sql = 'SELECT * FROM students WHERE 1=1';
      if (isset($post['department'])) {
        $sql .= ' AND department="' . $post['department'] . '"';
      }
      if (isset($post['level'])) {
        $sql .= ' AND level="' . $post['level'] . '"';
      }
      try {
        $stmt = $this->conn->prepare($sql);
        $res = $stmt->execute();
        $result = $stmt->get_result();
        $students = $result->fetch_all(MYSQLI_ASSOC);

        foreach ($students as $student) {
          $duration = $student['duration'];
          $entrance_session = $student['entrance_session'];
          $graduation_session = $student['graduation_session'];
          if ($graduation_session == $entrance_session) {
            return;
          }
          $sql = 'UPDATE students SET level="' . ((int) $student['level'] + 100) . '" WHERE id="' . $student['id'] . '"';
          $stmt = $this->conn->prepare($sql);
          $res = $stmt->execute();
        }

      } catch (Exception $e) {
        $this->getHeaders();
        echo json_encode(array('message' => $e->getMessage(), 'ok' => 0, 'status' => 'failed', 'line' => $e->getLine()));
      }
    } else {
      $this->getHeaders();
      echo json_encode(array('message' => 'wrong method', 'ok' => 0, 'status' => 'failed'));
    }
  }
  public function move_to_next_level()
  {
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method == 'POST') {
      $post = $_POST;
      if (!isset($post['session'])) {
        $this->getHeaders();
        echo json_encode(array('message' => 'session is required', 'ok' => 0, 'status' => 'failed'));
        return;
      }
      $sql = 'SELECT s.id, s.firstName, s.lastName, s.email, s.phone, s.dob, s.gender, s.faculty, s.department, s.level, s.status, s.entrance_session, s.graduation_session, d.duration FROM students as s INNER JOIN departments as d ON s.department=d.id WHERE 1=1 AND (s.status = "undergraduate " OR s.status = "spill over") ';
      if (isset($post['department'])) {
        $sql .= ' AND department="' . $post['department'] . '"';
      }
      if (isset($post['level'])) {
        $sql .= ' AND level="' . $post['level'] . '"';
      }
      try {
        $stmt = $this->conn->prepare($sql);
        $res = $stmt->execute();
        $result = $stmt->get_result();
        $students = $result->fetch_all(MYSQLI_ASSOC);

        foreach ($students as $student) {

          $current_session = $post['session'];
          $entrance_session = $student['entrance_session'];
          $start_year = (int) explode('/', $entrance_session)[0];
          $current_year = (int) explode('/', $current_session)[0];
          $years_stayed = $current_year - $start_year + 1;
          $level = (int) $student['level'];
          $supposed_current_level = $years_stayed  * 100;
          $duration = $student['duration'];
          $max_year_that_student_can_stay = 100 * (int) $duration;
          if ($supposed_current_level > $max_year_that_student_can_stay) {
            $check = $this->check_if_student_is_eligible_to_graduate((string)$student['id']);
       
            if ($check['eligible']) {
              $sql = 'UPDATE students SET status="graduate" WHERE id="' . $student['id'] . '"';
              $res = $this->conn->query($sql);
              continue;
            }else{
              $sql = 'UPDATE students SET status="spill over" WHERE id="' . $student['id'] . '"';
              $res = $this->conn->query($sql);
              continue;
            }
          }
          if ($supposed_current_level != $level) {
            
            $sql = 'UPDATE students SET level="' . $supposed_current_level . '" WHERE id="' . $student['id'] . '"';
            $stmt = $this->conn->prepare($sql);
            $res = $stmt->execute();
          }
        }
        if ($res) {
          $this->getHeaders();
          echo json_encode(array('message' => 'successful', 'ok' => 1, 'data'=>$students));
        } else {
          $this->getHeaders();
          echo json_encode(array('message' => 'failed', 'ok' => 0));
        }

      } catch (Exception $e) {
        $this->getHeaders();
        echo json_encode(array('message' => $e->getMessage(), 'ok' => 0, 'status' => 'failed', 'line' => $e->getLine()));
      }
    } else {
      $this->getHeaders();
      echo json_encode(array('message' => 'wrong method', 'ok' => 0, 'status' => 'failed'));
    }
  }
  public function check_if_student_is_eligible_to_graduate(string $stu_id)
  {
    $class = 'Api\controllers\CgpaController';
    $obj = new $class();
    $res = $obj->calculate_cgpa($stu_id);
    $failed_courses = $res['failed_courses'];
    if ($failed_courses['number'] > 0) {
      $arr = ['eligible' => false, 'number_of_failed_courses' => $failed_courses['number'], 'failed_courses' => $failed_courses['courses'], 'ok' => 1, 'message' => 'elgibility status fetched successfully'];

      return $arr;
    } else {
      $arr = ['eligible' => true, 'number_of_failed_courses' => $failed_courses['number'], 'failed_courses' => $failed_courses['courses'], 'ok' => 1, 'message' => 'elgibility status fetched successfully'];
      return $arr;
    }
  }
}