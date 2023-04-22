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
  public function courses()
  {
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method == 'GET') {
      try {
        $sql = "SELECT * FROM courses WHERE 1=1";
        if (isset($_GET['id'])) {
          $sql .= " AND id = '" . $_GET['id'] . "'";
        }
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $res = $stmt->get_result();
        if ($res) {
          $departments_assigned = [];
          $data = [];
          while ($row = $res->fetch_assoc()) {
            $data[] = $row;
          }
          foreach ($data as $row) {
            $sql = "SELECT * FROM department_courses where course_id=" . $row['id'] . "";
            $res = $this->conn->query($sql);

            if (!$res) {
              throw new Exception('Something went wrong');
            }
            if ($res->num_rows > 0) {
              while ($row = $res->fetch_assoc()) {
                $departments_assigned[] = $row;
              }
            }
          }
          $this->getHeaders();
          echo json_encode(array('status' => 200, 'message' => 'successful', 'ok' => 1, 'data' => $data, 'assigned' => $departments_assigned));
        } else {
          $this->getHeaders();
          echo json_encode(array('status' => 503, 'message' => 'failed to fetch data', 'ok' => 0));
        }
      } catch (Exception $e) {
        $this->getHeaders();
        echo json_encode(array('status' => 503, 'message' => $e->getMessage(), 'line' => $e->getLine(), 'ok' => 0));
      }
    } elseif ($method == 'POST') {
      $method = $_POST['method'];
      if ($method == 'POST') {


        try {
          $post = $_POST;
          $sql = "INSERT INTO courses(
          title,
          description
      ) VALUES(?,?)";
          $stmt = $this->conn->prepare($sql);
          $stmt->bind_param('ss', $post['title'], $post['description']);
          $res = $stmt->execute();

          if ($res) {
            $id = $this->conn->insert_id;
            $this->getHeaders();
            echo json_encode(array('status' => 200, 'message' => 'successful', 'ok' => 1, 'id' => $id));
          } else {
            $this->getHeaders();
            echo json_encode(array('status' => 503, 'message' => 'failed to post course', 'ok' => 0));
          }

        } catch (Exception $e) {
          $this->getHeaders();
          echo json_encode(array('status' => 503, 'message' => 'failed', 'ok' => 0));
        }
      } elseif ($method == 'PUT') {
        try {
          $post = $_POST;
          $sql = "UPDATE courses SET
          title = ?,
          description = ?
        WHERE id = ?";
          $stmt = $this->conn->prepare($sql);
          $stmt->bind_param('sss', $post['title'], $post['description'], $post['id']);
          $res = $stmt->execute();

          if ($res) {
            $this->getHeaders();
            echo json_encode(array('status' => 200, 'message' => 'successful', 'ok' => 1));
          } else {
            $this->getHeaders();
            echo json_encode(array('status' => 503, 'message' => 'failed to update data', 'ok' => 0, 'data' => $post));
          }
        } catch (Exception $e) {
          $this->getHeaders();
          echo json_encode(array('status' => 503, 'message' => $e->getMessage(), 'ok' => 0));
        }
      } elseif ($method == 'DELETE') {
        try {
          $post = $_POST;
          $sql = "DELETE FROM courses WHERE id = ?";
          $stmt = $this->conn->prepare($sql);
          $stmt->bind_param('s', $post['id']);
          $res = $stmt->execute();


          if ($res) {
            $this->getHeaders();
            echo json_encode(array('status' => 200, 'message' => 'successful', 'ok' => 1));
          } else {
            $this->getHeaders();
            echo json_encode(array('status' => 503, 'message' => 'failed to delete data', 'ok' => 0, 'data' => $post));
          }
        } catch (Exception $e) {
          $this->getHeaders();
          echo json_encode(array('status' => 503, 'message' => $e->getMessage(), 'ok' => 0));
        }
      } else {
        $this->getHeaders();
        echo json_encode(array('status' => 401, 'message' => 'invalid method', 'ok' => 0));
      }
    } else {
      $this->getHeaders();
      echo json_encode(array('status' => 401, 'message' => 'invalid method', 'ok' => 0));
    }
  }
  public function assign_course_to_departments()
  {
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method == "GET") {
      try {
        $sql = "SELECT c.title, c.description, dc.id, dc.course_id, dc.departments, dc.units, dc.semester, dc.session, dc.level, dc.assigned_lecturers, dc.type, dc.code, cg.grading_open, cg.registration_open FROM department_courses AS dc INNER JOIN course_gradings as cg ON dc.id = cg.department_course_id AND dc.session = cg.session INNER JOIN courses AS c ON c.id=dc.course_id WHERE 1=1";
        if (isset($_GET['id'])) {
          $sql .= " AND dc.id = '" . $_GET['id'] . "'";
        }
        if (isset($_GET['course_id'])) {
          $sql .= " AND dc.course_id = '" . $_GET['course_id'] . "'";
        }
        if (isset($_GET['department_id'])) {
          $sql .= ' AND dc.departments LIKE "%' . $_GET['department_id'] . '%"';
        }
        if (isset($_GET['session'])) {
          $sql .= ' AND dc.session ="' . $_GET['session'] . '"';
        }
        if (isset($_GET['semester'])) {
          $sql .= ' AND dc.semester ="' . $_GET['semester'] . '"';
        }
        if (isset($_GET['lecturer_id'])) {
          $sql .= ' AND dc.assigned_lecturers LIKE "%' . $_GET['lecturer_id'] . '%"';
        }
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $res = $stmt->get_result();
        if ($res) {
          $data = array();
          while ($row = $res->fetch_assoc()) {
            $row['departments'] = json_decode($row['departments']);
            $row['assigned_lecturers'] = json_decode($row['assigned_lecturers']);
            $data[] = $row;
          }
          $this->getHeaders();
          echo json_encode(array('status' => 200, 'message' => 'successful', 'ok' => 1, 'data' => $data));
        } else {
          $this->getHeaders();
          echo json_encode(array('status' => 503, 'message' => 'failed to fetch data', 'ok' => 0, 'data' => $_GET));
        }
      } catch (Exception $e) {
        $this->getHeaders();
        echo json_encode(array('status' => 503, 'message' => $e->getMessage(), 'ok' => 0));
      }
    } elseif ($method == "POST") {
      $method = $_POST['method'];
      if ($method == 'POST') {
        try {
          $post = $_POST;
          $sql = "INSERT INTO department_courses(
          departments,
          type,
          code,
          level,
          units,
          assigned_lecturers,
          semester,
          session,
          course_id
        ) VALUES(?,?,?,?,?,?,?,?,?)";
          $level = (int) $post['level'];
          $course_id = (int) $post['course_id'];
          $semester = (int) $post['semester'];
          $units = (int) $post['units'];
          $stmt = $this->conn->prepare($sql);
          $stmt->bind_param('sssssssss', $post['departments'], $post['type'], $post['code'], $level, $units, $post['assigned_lecturers'], $semester, $post['session'], $course_id);
          $res = $stmt->execute();

          if ($res) {
            $params = $post;
            $params['course_id'] = $this->conn->insert_id;
            $req = $this->create_table_for_single_course($params);
            $this->getHeaders();
            echo json_encode(array('status' => 200, 'message' => 'successful', 'ok' => 1, 'result' => $req));
          } else {
            $this->getHeaders();
            echo json_encode(array('status' => 503, 'message' => 'failed to assign course to departments', 'ok' => 0, 'post' => $post));
          }
        } catch (Exception $e) {
          $this->getHeaders();
          echo json_encode(array('status' => 503, 'message' => $e->getMessage(), 'ok' => 0));
        }
      } elseif ($method == "PUT") {
        try {
          $post = $_POST;
          $sql = "UPDATE department_courses SET
          departments = ?,
          type = ?,
          code = ?,
          level = ?,
          assigned_lecturers = ?,
          semester = ?,
          session = ?
        WHERE id = ?";
          $department = json_encode($post['departments']);
          $lecturers = json_encode($post['assigned_lecturers']);
          $stmt = $this->conn->prepare($sql);
          $stmt->bind_param('ssssssss', $department, $post['type'], $post['code'], $post['level'], $lecturers, $post['semester'], $post['session'], $post['id']);
          $res = $stmt->execute();



          if ($res) {
            $this->getHeaders();
            echo json_encode(array('status' => 200, 'message' => 'successful', 'ok' => 1));
          } else {
            $this->getHeaders();
            echo json_encode(array('status' => 503, 'message' => 'failed to update data', 'ok' => 0));
          }
        } catch (Exception $e) {
          $this->getHeaders();
          echo json_encode(array('status' => 503, 'message' => 'failed to update data', 'ok' => 0));
        }
      } elseif ($method == "DELETE") {
        try {
          $post = $_POST;
          $sql = "DELETE FROM department_courses WHERE id = ?";
          $stmt = $this->conn->prepare($sql);
          $stmt->bind_param('s', $post['id']);
          $res = $stmt->execute();

          if ($res) {
            $this->getHeaders();
            echo json_encode(array('status' => 200, 'message' => 'successful', 'ok' => 1));
          } else {
            $this->getHeaders();
            echo json_encode(array('status' => 503, 'message' => 'failed to delete data', 'ok' => 0));
          }
        } catch (Exception $e) {
          $this->getHeaders();
          echo json_encode(array('status' => 503, 'message' => 'failed to delete data', 'ok' => 0));
        }
      } else {
        $this->getHeaders();
        echo json_encode(array('status' => 401, 'message' => 'invalid method', 'ok' => 0));
      }
    } else {
      $this->getHeaders();
      echo json_encode(array('status' => 401, 'message' => 'invalid method', 'ok' => 0));
    }
  }


  public function registered_course()
  {
    $method = $_SERVER['REQUEST_METHOD'];
  }

  public function available_course()
  {
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method == 'GET') {

      $get = $_GET;
      if (!isset($get['student_id']) && !isset($get['department_id']) && !isset($get['session']) && !isset($get['semester'])) {
        $this->getHeaders();
        echo json_encode(array('status' => 401, 'message' => 'invalid request, student an d course id missing', 'ok' => 0));
        return;
      }
      $sql = "SELECT dc.id, dc.departments, dc.type, dc.code, dc.semester, dc.session, dc.level, dc.assigned_lecturers, dc.course_id, c.title, c.description, dc.units FROM department_courses AS dc INNER JOIN courses AS c ON dc.course_id = c.id WHERE 1=1 AND dc.session = '" . $get['session'] . "' AND dc.semester = '" . $get['semester'] . "' AND dc.departments LIKE '%" . $get['department_id'] . "%'";

      if (isset($get['id'])) {
        $sql .= " AND dc.id = '" . $get['id'] . "'";
      }
      $stmt = $this->conn->prepare($sql);
      $stmt->execute();
      $res = $stmt->get_result();
      if ($res) {
        $data = array();
        while ($row = $res->fetch_assoc()) {
          $row['departments'] = json_decode($row['departments']);
          $row['assigned_lecturers'] = json_decode($row['assigned_lecturers']);
          $data[] = $row;
        }
        $this->getHeaders();
        echo json_encode(array('status' => 200, 'message' => 'successful', 'ok' => 1, 'data' => $data, 'post' => $get));
      } else {
        $this->getHeaders();
        echo json_encode(array('status' => 503, 'message' => 'failed to fetch data', 'ok' => 0));
      }
    } else {
      $this->getHeaders();
      echo json_encode(array('status' => 401, 'message' => 'invalid method', 'ok' => 0));

    }

  }
  public function course_registration()
  {
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method == 'GET') {
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
    }
    if ($method == 'POST') {
      $method = $_POST['method'];
      if ($method == 'POST') {
        $post = $_POST;
        $sql = "SELECT * FROM course_registrations WHERE student_id = '" . $post['student_id'] . "' AND department_course_id = '" . $post['course_id'] . "' AND semester = '" . $post['semester'] . "' AND session = '" . $post['session'] . "'";
        $res = $this->conn->query($sql);
        if ($res) {
          $row = $res->fetch_assoc();
          if ($row) {
            $this->getHeaders();
            echo json_encode(array('status' => 400, 'message' => 'You have already registered for this course', 'ok' => 0));
          } else {
            $this->insert_student_into_result_table($post);
            $sql = "INSERT INTO course_registrations (student_id, department_course_id, semester, session) VALUES ('" . $post['student_id'] . "', '" . $post['course_id'] . "', '" . $post['semester'] . "', '" . $post['session'] . "')";
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
      } elseif ($method == 'DELETE') {
        $delete = $_POST;
        $this->remove_student_from_result_table($delete);
        $sql = "DELETE FROM course_registrations WHERE student_id = '" . $delete['student_id'] . "' AND department_course_id = '" . $delete['course_id'] . "' AND semester = '" . $delete['semester'] . "' AND session = '" . $delete['session'] . "'";
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
    } else {
      $this->getHeaders();
      echo json_encode(array('status' => 400, 'message' => 'wrong method', 'ok' => 0));
    }
  }

  private function insert_student_into_result_table($post = null)
  {
    if ($post != null) {
      $session = $post['session'];
      $semester = $post['semester'];
      $course_id = $post['course_id'];
      $student_id = $post['student_id'];
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
      $session = $post['session'];
      $semester = $post['semester'];
      $course_id = $post['course_id'];
      $student_id = $post['student_id'];
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
      $post = $_POST;
      $session = $post['session'];
      $bool = $post['bool'];
      if ($post['all'] == 'true') {
        $bool = (int) $bool;
        $sql = 'UPDATE course_gradings SET grading_open = "' . $bool . '" WHERE session = "' . $session . '"';
        $res = $this->conn->query($sql);

        if ($res) {
          $this->getHeaders();
          echo json_encode(array('status' => 200, 'message' => 'successful', 'ok' => 1));
        } else {
          $this->getHeaders();
          echo json_encode(array('status' => 400, 'message' => 'failed', 'ok' => 0));
        }
      } else {
        $course_id = $post['course_id'];
        $bool = (int) $bool;
        $sql = 'UPDATE course_gradings SET grading_open = "' . $bool . '" WHERE department_course_id = "' . $course_id . '" AND session = "' . $session . '"';
        $stmt = $this->conn->prepare($sql);
        $res = $stmt->execute();

        if ($res) {
          $this->getHeaders();
          echo json_encode(array('status' => 200, 'message' => 'successful', 'ok' => 1, $post));
        } else {
          $this->getHeaders();
          echo json_encode(array('status' => 400, 'message' => 'failed', 'ok' => 0));
        }
      }
    } elseif ($method == 'GET') {
      try {
        $session = $_GET['session'];
        $course_id = $_GET['id'];

        $sql = 'SELECT table_name, grading_open, registration_open FROM course_gradings WHERE department_course_id="' . $course_id . '" AND session="' . $session . '"';


        $stmt = $this->conn->prepare($sql);

        $res = $stmt->execute();
        if ($res) {

          if ($stmt->num_rows == 0) {
            $res = $stmt->get_result();
            $this->getHeaders();
            echo json_encode(['data' => $res->fetch_assoc(), 'status' => 200]);
          } else {

            $this->getHeaders();
            echo json_encode([
              'status' => 200,
              'message' => 'no result',
              'data' => []
            ]);
          }
        } else {
          $this->getHeaders();
          echo json_encode([
            'status' => 503,
            'message' => 'failed to fetch'
          ]);
        }


      } catch (Exception $e) {
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
      $post = $_POST;
      $session = $post['session'];
      $bool = $post['bool'];

      if ($post['all'] == 'true') {
        $bool = $bool == 'true' ? '1' : '0';
        $sql = 'UPDATE course_gradings SET registration_open = "' . $bool . '" WHERE session = "' . $session . '"';
        $stmt = $this->conn->prepare($sql);
        $res = $stmt->execute();
        if ($res) {
          $this->getHeaders();
          echo json_encode(array('status' => 200, 'message' => 'successful', 'ok' => 1, $post));
        } else {
          $this->getHeaders();
          echo json_encode(array('status' => 400, 'message' => 'failed', 'ok' => 0));
        }
      } else {
        $course_id = $post['course_id'];
        $sql = 'UPDATE course_gradings SET registration_open = "' . $bool . '" WHERE department_course_id = "' . $course_id . '" AND session = "' . $session . '"';
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
  public function unregister_course()
  {
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method == 'POST') {
      try {
        $post = $_POST;
        $session = $post['session'];
        $course_id = $post['course_id'];
        $student_id = $post['student_id'];
        $sql = 'DELETE FROM course_registrations WHERE department_course_id = "' . $course_id . '" AND session = "' . $session . '" AND student_id = "' . $student_id . '" AND semester = "' . $post['semester'] . '"';
        $stmt = $this->conn->prepare($sql);
        $res = $stmt->execute();

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
      echo json_encode(array('status' => 400, 'message' => 'wrong method', 'ok' => 0));
    }
  }

  /* creates a grading table for all courses */
  private function create_table_for_all_courses($post = null)
  {
    if ($post) {
      try {
        $sql = "SELECT * FROM department_courses WHERE session = '" . $post['session'] . "' AND semester = '" . $post['semester'] . "'";
        $res = $this->conn->query($sql);
        $semester = $post['semester'];
        $session = $post['session'];
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
        $course_id = $post['course_id'];
        $session = $post['session'];
        $semester = $post['semester'];
        $session_start = explode('/', $session)[0];
        $session_end = explode('/', $session)[1];
        $table_name = 'results_' . $session_start . '_' . $session_end . '_' . $semester . '_' . $course_id;
        $sql = "CREATE TABLE IF NOT EXISTS " . $table_name . "(id INT(11) NOT NULL AUTO_INCREMENT, student_id VARCHAR(255) NOT NULL, session VARCHAR(255) NOT NULL, semester VARCHAR(255) NOT NULL, ca INT(11) NOT NULL, exam INT(11) NOT NULL, attendance INT(11) NOT NULL, grade VARCHAR(255) NOT NULL, remark VARCHAR(255) NOT NULL, PRIMARY KEY (id))";
        $res = $this->conn->query($sql);
        if (!$res) {
          return false;
        }
        $saved = $this->saveCourseGradingTableName($table_name, $course_id, $session);
        if ($saved) {
          return true;
        } else {
          return false;
        }
      } catch (Exception $e) {
        return $e->getMessage();
      }
    } else {
      return false;
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
    $sql = "INSERT INTO course_gradings (table_name, department_course_id, session, grading_open, registration_open) VALUES ('" . $name . "', '" . $course_id . "', '" . $session . "', 'false', 'false')";
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

      $post = $_POST;
      if ($post['all'] == 'true') {
        $this->create_table_for_all_courses($post);
      } else {
        $sql = "SELECT * FROM course_gradings WHERE departments_course_id = '" . $post['course_id'] . "' AND session = '" . $post['session'] . "'";
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
      $sql = "SELECT * FROM course_gradings WHERE departments_course_id = '" . $_GET['course_id'] . "' AND session = '" . $_GET['session'] . "'";
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
      $sql = "SELECT cr.department_course_id as course_id, cr.id, cr.session, cr.semester, s.id, CONCAT(s.firstName,' ',s.lastName) AS name, s.department, s.faculty FROM course_registrations as cr INNER JOIN students as s ON cr.student_id = s.id WHERE cr.department_course_id = '" . $_GET['course_id'] . "' AND cr.session = '" . $_GET['session'] . "'";
      $res = $this->conn->query($sql);
      if ($res) {
        $data = array();
        while ($row = $res->fetch_assoc()) {
          $data[] = $row;
        }
        $this->getHeaders();
        echo json_encode(array('status' => 200, 'message' => 'successful', 'ok' => 1, 'data' => $data, $_GET));
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