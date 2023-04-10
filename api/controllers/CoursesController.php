<?php
namespace Api\controllers;

error_reporting(E_ALL);
ini_set('display_errors', '1');


use Exception;
use services\DB;

class CoursesController
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
  private function compareLecturers($id)
  {
    $sql = "SELECT lecturers FROM courses WHERE id = '" . $id . "'";
    $res = $this->conn->query($sql);
    if ($res) {
      $row = $res->fetch_assoc();
      $lecturers = json_decode($row['lecturers']);
      return $lecturers;
    }
  }
  public function create_course($post = null)
  {
    $this->conn;
    $method = $_SERVER['REQUEST_METHOD'];



    if ($method == 'POST') {
      try {
        $post = json_decode(file_get_contents("php://input"), true);

        $sql = "INSERT INTO courses(
        code,
        title,
        unit,
        description,
        semester,
        departments,
        faculties,
        level,
        lecturers
      ) VALUES (
        ?,?,?,?,?,?,?,?,?
      )";
        $stmt = $this->conn->prepare($sql);
        $code = $post['code'];
        $title = $post['title'];
        $unit = $post['unit'];
        $description = $post['description'];
        $semester = $post['semester'];
        $departments = json_encode($post['departments']);
        $faculties = json_encode($post['faculties']);
        $level = $post['level'];
        $lecturers = json_encode($post['lecturers']);
        $stmt->bind_param("sssssssss", $code, $title, $unit, $description, $semester, $departments, $faculties, $level, $lecturers);

        $res = $stmt->execute();


        foreach ($post['lecturers'] as $val) {
          if (isset($val)) {

            $sql = "SELECT assigned_courses  FROM lecturers WHERE id = '" . $val['id'] . "'";
            $res = $this->conn->query($sql);
            if ($res) {
              $row = $res->fetch_assoc();
              if (isset($row['assigned_courses'])) {
                $assigned_courses = json_decode($row['assigned_courses']);
                $assigned_courses[] = $stmt->insert_id;
                $stmt = $this->conn->prepare($sql);
                $sql2 = "UPDATE lecturers SET assigned_courses = ? WHERE id = '" . $val['id'] . "'";
                $stmt = $this->conn->prepare($sql2);
                $stmt->bind_param("s", $assigned_courses);
                $assigned_courses = json_encode($assigned_courses);
                $res = $stmt->execute();
              }
            }
          }
        }
        if ($res) {

          $this->getHeaders();
          echo json_encode(array('status' => 200, 'message' => 'successful', 'ok' => 1));
        } else {
          $this->getHeaders();
          echo json_encode(array('status' => 400, 'message' => 'failed', 'ok' => 0));
        }
      } catch (Exception $e) {
        $this->getHeaders();
        echo json_encode(array("status" => 400, "message" => $e->getMessage(), "ok" => 0));
      }
    } else {
      $this->getHeaders();
      echo json_encode(array('status' => 400, 'message' => 'Wrong method, use POST', 'ok' => 0));
    }
  }

  public function courses($post = null)
  {
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method == 'GET') {
      try {
        $sql = "SELECT * FROM courses";
        if (isset($_GET['id'])) {
          $sql .= " WHERE id = '" . $_GET['id'] . "'";
        } elseif (isset($_GET['limit']) && isset($_GET['offset'])) {
          $sql .= " LIMIT " . $_GET['limit'] . " OFFSET " . $_GET['offset'];
        }
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();

        $res = $stmt->get_result();
        if ($res) {
          $data = array();
          while ($row = $res->fetch_assoc()) {
            $row['departments'] = json_decode($row['departments']);
            $row['faculties'] = json_decode($row['faculties']);
            $row['lecturers'] = json_decode($row['lecturers']);
            $data[] = $row;
          }
          $this->getHeaders();
          echo json_encode(array('status' => 200, 'message' => 'successful', 'ok' => 1, 'data' => $data));
        } else {
          $this->getHeaders();
          echo json_encode(array('status' => 400, 'message' => 'failed', 'ok' => 0));
        }
      } catch (Exception $e) {
        $this->getHeaders();
        echo json_encode(array("status" => 400, "message" => $e->getMessage(), "ok" => 0));
      }
    } elseif ($method == 'PUT') {
      try {
        $put = json_decode(file_get_contents("php://input"), true);
        $postedLecturers = $put['lecturers'];
        $id = $put['id'];
        $lecturers = $this->compareLecturers($put['id']);
        foreach ($lecturers as $val) {
          if (!in_array($val, $postedLecturers)) {
            $sql = "SELECT assigned_courses  FROM lecturers WHERE id = '" . $val->id . "'";
            $res = $this->conn->query($sql);
            if ($res) {
              $row = $res->fetch_assoc();
              $assigned_courses = json_decode($row['assigned_courses']);
              $key = array_search($put['id'], $assigned_courses);
              unset($assigned_courses[$key]);
              $stmt = $this->conn->prepare($sql);
              $sql2 = "UPDATE lecturers SET assigned_courses = ? WHERE id = '" . $val->id . "'";
              $stmt = $this->conn->prepare($sql2);
              $stmt->bind_param("s", $assigned_courses);
              $assigned_courses = json_encode($assigned_courses);
              $res = $stmt->execute();
            }
          }
        }
        $id = $put['id'];
        $sql = "UPDATE courses SET
        code = ?,
        title = ?,
        unit = ?,
        description = ?,
        semester = ?,
        departments = ?,
        faculties = ?,
        level = ?,
        lecturers = ?
        WHERE id = '" . $id . "'";
        $stmt = $this->conn->prepare($sql);
        $code = $put['code'];
        $title = $put['title'];
        $unit = $put['unit'];
        $description = $put['description'];
        $semester = $put['semester'];
        $departments = json_encode($put['departments']);
        $faculties = json_encode($put['faculties']);
        $level = $put['level'];
        $lecturers = json_encode($put['lecturers']);
        $stmt->bind_param("sssssssss", $code, $title, $unit, $description, $semester, $departments, $faculties, $level, $lecturers);

        $res = $stmt->execute();
        foreach ($put['lecturers'] as $val) {
          if (isset($val)) {

            $sql = "SELECT assigned_courses  FROM lecturers WHERE id = '" . $val['id'] . "'";
            $res = $this->conn->query($sql);
            if ($res) {
              $row = $res->fetch_assoc();
              $assigned_courses = json_decode($row['assigned_courses']);
              $assigned_courses[] = $put['id'];
              $stmt = $this->conn->prepare($sql);
              $sql2 = "UPDATE lecturers SET assigned_courses = ? WHERE id = '" . $val['id'] . "'";
              $stmt = $this->conn->prepare($sql2);
              $stmt->bind_param("s", $assigned_courses);
              $assigned_courses = json_encode($assigned_courses);
              $res = $stmt->execute();
            }
          }
        }
        if ($res) {
          $this->getHeaders();
          echo json_encode(array('status' => 200, 'message' => 'successful', 'ok' => 1));
        } else {
          $this->getHeaders();
          echo json_encode(array('status' => 400, 'message' => 'failed', 'ok' => 0));
        }
      } catch (Exception $e) {
        $this->getHeaders();
        echo json_encode(array("status" => 400, "message" => $e->getMessage(), "ok" => 0));
      }
    }elseif($method=='DELETE'){
      try {
        $del = json_decode(file_get_contents("php://input"), true);
        $sql = "DELETE FROM courses WHERE id = '" . $del['id'] . "'";
        $res = $this->conn->query($sql);
        if ($res) {
          $this->getHeaders();
          echo json_encode(array('status' => 200, 'message' => 'successful', 'ok' => 1));
        } else {
          $this->getHeaders();
          echo json_encode(array('status' => 503, 'message' => 'failed', 'ok' => 0));
        }
      } catch (Exception $e) {
        $this->getHeaders();
        echo json_encode(array("status" => 503, "message" => $e->getMessage(), "ok" => 0));
      }
    } else {
      $this->getHeaders();
      echo json_encode(array('status' => 400, 'message' => 'Wrong method, use GET', 'ok' => 0));
    }
  }
  public function registered_course()
  {
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method == 'GET') {
      try {
        $semester = $_GET['semester'];
        $session = $_GET['session'];

        $sql = "SELECT * FROM courses WHERE id IN (SELECT course_id FROM course_registrations WHERE student_id = '" . $_GET['student_id'] . "' AND semester = '" . $semester . "' AND session = '" . $session . "')";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $res = $stmt->get_result();
        if ($res) {
          $data = array();

          while ($row = $res->fetch_assoc()) {
            $row['departments'] = json_decode($row['departments']);
            $row['faculties'] = json_decode($row['faculties']);
            $row['lecturers'] = json_decode($row['lecturers']);
            $data[] = $row;
          }
          $this->getHeaders();
          echo json_encode(array('status' => 200, 'message' => 'successful', 'ok' => 1, 'data' => $data, 'count' => count($data)));
        } else {
          $this->getHeaders();
          echo json_encode(array('status' => 400, 'message' => 'failed', 'ok' => 0));
        }
      } catch (Exception $e) {
        $this->getHeaders();
        echo json_encode(array("status" => 400, "message" => $e->getMessage(), "ok" => 0));
      }
    } else {
      $this->getHeaders();
      echo json_encode(array('status' => 400, 'message' => 'Wrong method, use GET', 'ok' => 0));
    }
  }
  public function available_course()
  {
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method == 'GET') {
      $data = $_GET;
      try {
        $level = $_GET['level'];
        $semester = $_GET['semester'];
        $department = $_GET['department'];
        $faculty = $_GET['faculty'];
        $session = $_GET['session'];

        $sql = "SELECT * FROM courses WHERE level='" . $level . "' AND semester='" . $semester . "' AND (departments LIKE '%" . $department . "%' OR departments LIKE '%general%') AND (faculties LIKE '%" . $faculty . "%' OR faculties LIKE '%general%') AND courses.id NOT IN (SELECT course_id FROM course_registrations WHERE student_id = '" . $_GET['student_id'] . "' AND semester = '" . $semester . "' AND session = '" . $session . "')";


        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $res = $stmt->get_result();
        if ($res) {
          $data = array();
          while ($row = $res->fetch_assoc()) {
            $row['departments'] = json_decode($row['departments']);
            $row['faculties'] = json_decode($row['faculties']);
            $row['lecturers'] = json_decode($row['lecturers']);
            $data[] = $row;
          }
          $this->getHeaders();
          echo json_encode(array('status' => 200, 'message' => 'successful', 'ok' => 1, 'data' => $data));
        } else {
          $this->getHeaders();
          echo json_encode(array('status' => 400, 'message' => 'failed', 'ok' => 0));
        }
      } catch (Exception $e) {
        $this->getHeaders();
        echo json_encode(array("status" => 400, "message" => $e->getMessage(), "ok" => 0, "data" => $data));
      }
    } else {
      $this->getHeaders();
      echo json_encode(array('status' => 400, 'message' => 'Wrong method, use GET', 'ok' => 0));
    }
  }

  public function course_registration()
  {
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method == 'POST') {
      $post = json_decode(file_get_contents('php://input'));
      $sql = "SELECT * FROM course_registrations WHERE student_id = '" . $post->student_id . "' AND course_id = '" . $post->course_id . "' AND semester = '" . $post->semester . "' AND session = '" . $post->session . "'";
      $res = $this->conn->query($sql);
      if ($res) {
        $row = $res->fetch_assoc();
        if ($row) {
          $this->getHeaders();
          echo json_encode(array('status' => 400, 'message' => 'You have already registered for this course', 'ok' => 0));
        } else {
          $this->insert_student_into_result_table($post);
          $sql = "INSERT INTO course_registrations (student_id, course_id, semester, session) VALUES ('" . $post->student_id . "', '" . $post->course_id . "', '" . $post->semester . "', '" . $post->session . "')";
          $res = $this->conn->query($sql);
          if ($res) {
            $this->getHeaders();
            echo json_encode(array('status' => 200, 'message' => 'successful', 'ok' => 1));
          } else {
            $this->getHeaders();
            echo json_encode(array('status' => 400, 'message' => 'failed', 'ok' => 0));
          }
        }
      } else {
        $this->getHeaders();
        echo json_encode(array('status' => 400, 'message' => 'failed', 'ok' => 0));
      }
    } elseif ($method == 'GET') {
      $sql = "SELECT * FROM course_registrations WHERE 1 = 1";
      if (isset($_GET['student_id'])) {
        $sql .= " AND student_id = '" . $_GET['student_id'] . "'";
      }
      if (isset($_GET['course_id'])) {
        $sql .= " AND course_id = '" . $_GET['course_id'] . "'";
      }
      $res = $this->conn->query($sql);
      if ($res) {
        $data = array();
        while ($row = $res->fetch_assoc()) {
          $data[] = $row;
        }
        $this->getHeaders();
        echo json_encode(array('status' => 200, 'message' => 'successful', 'ok' => 1, 'data' => $data));
      } else {
        $this->getHeaders();
        echo json_encode(array('status' => 400, 'message' => 'failed', 'ok' => 0));
      }
    } elseif ($method == 'DELETE') {
      $delete = json_decode(file_get_contents('php://input'));
      $this->remove_student_from_result_table($delete);
      $sql = "DELETE FROM course_registrations WHERE student_id = '" . $delete->student_id . "' AND course_id = '" . $delete->course_id . "' AND semester = '" . $delete->semester . "' AND session = '" . $delete->session . "'";
      $res = $this->conn->query($sql);
      if ($res) {
        $this->getHeaders();
        echo json_encode(array('status' => 200, 'message' => 'successful', 'ok' => 1));
      } else {
        $this->getHeaders();
        echo json_encode(array('status' => 400, 'message' => 'failed', 'ok' => 0));
      }
    } else {
      $this->getHeaders();
      echo json_encode(array('status' => 400, 'message' => 'wrong method', 'ok' => 0));
    }
  }

  private function insert_student_into_result_table($post = null)
  {
    if ($post != null) {
      $session = $post->session;
      $semester = $post->semester;
      $course_id = $post->course_id;
      $student_id = $post->student_id;
      $session_start = explode('/', $session)[0];
      $session_end = explode('/', $session)[1];

      $table_name = 'results_' . $session_start . '_' . $session_end . '_' . $semester . '_' . $course_id;


      $sql = 'SELECT * FROM ' . $table_name . ' WHERE student_id="' . $student_id . '"';

      $res = $this->conn->query($sql);

      if ($res->num_rows == 0) {
        $sql = 'INSERT INTO ' . $table_name . '(student_id,session, exam, ca, attendance, grade, remark) VALUES ("' . $student_id . '","' . $session . '",0,0,0,"","")';
        $stmt = $this->conn->prepare($sql);
        $res = $stmt->execute();

        if ($res) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  private function remove_student_from_result_table($post = null)
  {
    if ($post) {
      $session = $post->session;
      $semester = $post->semester;
      $course_id = $post->course_id;
      $student_id = $post->student_id;
      $session_start = explode('/', $session)[0];
      $session_end = explode('/', $session)[1];

      $table_name = 'results_' . $session_start . '_' . $session_end . '_' . $semester . '_' . $course_id;


      $sql = 'SELECT * FROM ' . $table_name . ' WHERE student_id="' . $student_id . '"';

      $res = $this->conn->query($sql);

      if ($res->num_rows != 0) {
        $sql = 'DELETE FROM ' . $table_name . ' WHERE student_id="' . $student_id . '"';
        $stmt = $this->conn->prepare($sql);
        $res = $stmt->execute();

        if ($res) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  /* toggles grading_open for course */
  public function grading()
  {
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method == 'POST') {
      $post = json_decode(file_get_contents('php://input'));

      $session = $post->session;
      $bool = $post->bool;
      if ($post->all == true) {
        $sql = 'UPDATE course_gradings SET grading_open = "' . $bool . '" WHERE session = "' . $session . '"';
        $stmt = $this->conn->prepare($sql);
        $res = $stmt->execute();

        if ($res) {
          $this->getHeaders();
          echo json_encode(array('status' => 200, 'message' => 'successful', 'ok' => 1));
        } else {
          $this->getHeaders();
          echo json_encode(array('status' => 400, 'message' => 'failed', 'ok' => 0));
        }
      } else {
        $course_id = $post->course_id;
        $sql = 'UPDATE course_gradings SET grading_open = "' . $bool . '" WHERE course_id = "' . $course_id . '" AND session = "' . $session . '"';
        $stmt = $this->conn->prepare($sql);
        $res = $stmt->execute();


        if ($res) {
          $this->getHeaders();
          echo json_encode(array('status' => 200, 'message' => 'successful', 'ok' => 1));
        } else {
          $this->getHeaders();
          echo json_encode(array('status' => 400, 'message' => 'failed', 'ok' => 0));
        }
      }
    } elseif($method=='GET'){
      try{
        $session = $_GET['session'];
        $course_id = $_GET['id'];
        
        $sql = 'SELECT table_name, grading_open, registration_open FROM course_gradings WHERE course_id="'.$course_id.'" AND session="'.$session.'"';
         

        $stmt = $this->conn->prepare($sql);

        $res = $stmt->execute();
        if($res){
        
          if($stmt->num_rows==0){
            $res = $stmt->get_result();
            $this->getHeaders();
            echo json_encode(['data'=>$res->fetch_assoc(),'status'=>200]);
          }else{
          
            $this->getHeaders();
            echo json_encode([
              'status'=>200,
              'message'=>'no result',
              'data'=>[]
            ]);
          }
        }else{
          $this->getHeaders();
          echo json_encode([
            'status'=>503,
            'message'=>'failed to fetch'
          ]);
        }

        
      }catch(Exception $e){
        $this->getHeaders();
        echo $e->getMessage();
      }
    } else {
      $this->getHeaders();
      echo json_encode(array('status' => 400, 'message' => 'wrong method', 'ok' => 0));
    }
  }
  /* toggles registration open for courses */
  public function registration()
  {
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method == 'POST') {
      $post = json_decode(file_get_contents('php://input'));
      $session = $post->session;
      $bool = $post->bool;

      if ($post->all == true) {
        $sql = 'UPDATE course_gradings SET registration_open = "' . $bool . '" WHERE session = "' . $session . '"';
        $stmt = $this->conn->prepare($sql);
        $res = $stmt->execute();
        if ($res) {
          $this->getHeaders();
          echo json_encode(array('status' => 200, 'message' => 'successful', 'ok' => 1));
        } else {
          $this->getHeaders();
          echo json_encode(array('status' => 400, 'message' => 'failed', 'ok' => 0));
        }
      } else {
        $course_id = $post->course_id;
        $sql = 'UPDATE course_gradings SET registration_open = "' . $bool . '" WHERE course_id = "' . $course_id . '" AND session = "' . $session . '"';
        $stmt = $this->conn->prepare($sql);
        $res = $stmt->execute();

        if ($res) {
          $this->getHeaders();
          echo json_encode(array('status' => 200, 'message' => 'successful', 'ok' => 1));
        } else {
          $this->getHeaders();
          echo json_encode(array('status' => 400, 'message' => 'result table may not have been created', 'ok' => 0));
        }
      }
    } else {
      $this->getHeaders();
      echo json_encode(array('status' => 400, 'message' => 'wrong method', 'ok' => 0));
    }
  }

  /* creates a grading table for all courses */
  private function create_table_for_all_courses($post = null)
  {

    if ($post) {

      try {
        $sql = "SELECT * FROM courses";
        $res = $this->conn->query($sql);
        $semester = $post->semester;
        $session = $post->session;
        $res2 = null;
        if ($res) {
          while ($row = $res->fetch_assoc()) {

            $course_id = $row['id'];
            $line = __LINE__;
            $session_start = explode('/', $session)[0];
            $session_end = explode('/', $session)[1];
            $table_name = 'results_' . $session_start . '_' . $session_end . '_' . $semester . '_' . $course_id;
            $sql = "CREATE TABLE IF NOT EXISTS " . $table_name . " (id INT(11) NOT NULL AUTO_INCREMENT, student_id VARCHAR(255) NOT NULL, session VARCHAR(255) NOT NULL, ca INT(11) NOT NULL, exam INT(11) NOT NULL, attendance INT(11) NOT NULL, grade VARCHAR(255) NOT NULL, remark VARCHAR(255) NOT NULL, PRIMARY KEY (id))";

            $res2 = $this->conn->query($sql);

            $this->saveCourseGradingTableName($table_name, $course_id, $session);
          }
          if ($res) {
            $this->getHeaders();
            echo json_encode(array('status' => 200, 'message' => 'successful', 'ok' => 1));
          } else {
            $this->getHeaders();

            echo json_encode(array('status' => 400, 'message' => 'failed', 'line' => $line, 'ok' => 0));
          }
        } else {
          $this->getHeaders();

          echo json_encode(array('status' => 400, 'message' => 'wrong failed', 'ok' => 0));
        }
      } catch (Exception $e) {
        $this->getHeaders();

        echo json_encode(array('status' => 400, 'message' => $e->getMessage(), 'ok' => 0, 'line' => $line));
      }
    } else {
      $this->getHeaders();
      $line = __LINE__;
      echo json_encode(array('status' => 400, 'message' => 'failed', 'line' => $line, 'ok' => 0));
    }
  }

  /* create a table for single courses */
  private function create_table_for_single_course($post = null)
  {
    if ($post) {
      try {

        $course_id = $post->course_id;
        $session = $post->session;
        $semester = $post->semester;
        $session_start = explode('/', $session)[0];
        $session_end = explode('/', $session)[1];
        $table_name = 'results_' . $session_start . '_' . $session_end . '_' . $semester . '_' . $course_id;
        $sql = "CREATE TABLE IF NOT EXISTS " . $table_name . "(id INT(11) NOT NULL AUTO_INCREMENT, student_id VARCHAR(255) NOT NULL, session VARCHAR(255) NOT NULL, semester VARCHAR(255) NOT NULL, ca INT(11) NOT NULL, exam INT(11) NOT NULL, attendance INT(11) NOT NULL, grade VARCHAR(255) NOT NULL, remark VARCHAR(255) NOT NULL, PRIMARY KEY (id))";
        $saved = $this->saveCourseGradingTableName($table_name, $course_id, $session);
        if ($saved) {
          $res = $this->conn->query($sql);
          if ($res) {
            $this->getHeaders();
            echo json_encode(array('status' => 200, 'message' => 'successful', 'ok' => 1));
          } else {
            throw new Exception("Error Processing Request", 1);
          }
        } else {
          throw new Exception("Error Processing Request", 1);
        }
      } catch (Exception $e) {
        $this->getHeaders();
        echo json_encode(array("status" => 400, "message" => $e->getMessage(), "ok" => 0));
      }
    } else {
      $this->getHeaders();
      echo json_encode(array('status' => 400, 'message' => 'failed', 'ok' => 0));
    }
  }

  /* adds the table name and registration_open and grading open  */
  private function saveCourseGradingTableName($name, $course_id, $session)
  {
    $checkIfGradingTableExist = "SELECT * FROM course_gradings WHERE table_name = '" . $name . "'";
    $res = $this->conn->query($checkIfGradingTableExist);
    if ($res) {
      $row = $res->fetch_assoc();
      if ($row) {
        return true;
      }
    }
    $sql = "INSERT INTO course_gradings (table_name, course_id, session, grading_open, registration_open) VALUES ('" . $name . "', '" . $course_id . "', '" . $session . "', 'false', 'false')";
    $res = $this->conn->query($sql);
    if ($res) {
      return true;
    } else {
      return false;
    }
  }

  /* handles and routes table creation for course result table*/
  public function session_result()
  {
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method == 'POST') {

      $post = json_decode(file_get_contents('php://input'));
      if ($post->all == 'true') {
        $this->create_table_for_all_courses($post);
      } else {
        $sql = "SELECT * FROM course_gradings WHERE course_id = '" . $post->course_id . "' AND session = '" . $post->session . "'";
        $res = $this->conn->query($sql);
        if ($res) {
          $row = $res->fetch_assoc();
          if ($row) {
            $this->getHeaders();
            echo json_encode(array('status' => 400, 'message' => 'You have already created grading table for this course', 'ok' => 0));
          } else {
            $this->create_table_for_single_course($post);
          }
        } else {
          $this->getHeaders();
          $line = __LINE__;
          echo json_encode(array('status' => 400, 'message' => 'failed', 'line' => $line, 'ok' => 0));
        }
      }
    } elseif ($method == 'GET') {
      $sql = "SELECT * FROM course_gradings WHERE course_id = '" . $_GET['course_id'] . "' AND session = '" . $_GET['session'] . "'";
      $res = $this->conn->query($sql);
      if ($res) {
        $data = array();
        while ($row = $res->fetch_assoc()) {
          $data[] = $row;
        }
        $this->getHeaders();
        echo json_encode(array('status' => 200, 'message' => 'successful', 'ok' => 1, 'data' => $data));
      } else {
        $this->getHeaders();
        echo json_encode(array('status' => 400, 'message' => 'failed', 'ok' => 0));
      }
    } else {
      $this->getHeaders();
      echo json_encode(array('status' => 400, 'message' => 'failed', 'ok' => 0));
    }
  }

  public function get_students_for_course()
  {
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method == 'GET') {
      $sql = "SELECT cr.course_id, cr.id, cr.session, cr.semester, s.id, CONCAT(s.firstName,' ',s.lastName) AS name, s.department, s.faculty FROM course_registrations as cr INNER JOIN students as s ON cr.student_id = s.id WHERE course_id = '" . $_GET['course_id'] . "' AND session = '" . $_GET['session'] . "'";
      $res = $this->conn->query($sql);
      if ($res) {
        $data = array();
        while ($row = $res->fetch_assoc()) {
          $data[] = $row;
        }
        $this->getHeaders();
        echo json_encode(array('status' => 200, 'message' => 'successful', 'ok' => 1, 'data' => $data));
      } else {
        $this->getHeaders();
        echo json_encode(array('status' => 400, 'message' => 'failed', 'ok' => 0));
      }
    } else {
      $this->getHeaders();
      echo json_encode(array('status' => 400, 'message' => 'failed', 'ok' => 0));
    }
  }
 
}