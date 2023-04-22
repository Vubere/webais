<?php
namespace Api\controllers;

use Exception;
use services\DB;


class StructureController
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
  public function departments()
  {
    $this->conn;
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method == 'GET') {
      try {
        $sql = "SELECT * FROM departments";
        if (isset($_GET['id'])) {
          $sql = "SELECT * FROM departments WHERE id = " . $_GET['id'];
        }
        if (isset($_GET['faculty'])) {
          $sql = "SELECT * FROM departments WHERE faculty_id = '" . $_GET['faculty'] . "'";
        }

        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $res = $stmt->get_result();
        $population = $this->numberOfStudentsInDepartment();
        if ($res) {
          $data = [];
          while ($row = $res->fetch_assoc()) {
            $data[] = $row;
          }
          $response = [
            'status' => 'success',
            'data' => array('data' => $data, 'population' => $population)
          ];
          $this->getHeaders();
          echo json_encode($response);
        } else {
          $response = [
            'status' => 'error',
            'message' => 'No data found'
          ];
          $this->getHeaders();
          echo json_encode($response);
        }
      } catch (Exception $e) {
        $response = [
          'status' => 'error',
          'message' => $e->getMessage()
        ];
        $this->getHeaders();
        echo json_encode($response);
      }
    } elseif ($method == 'POST') {
      $method = $_POST['method'];
      if ($method == 'POST') {
        $this->createDepartment();
      } elseif ($method == 'PUT') {
        $this->updateDepartment();
      } elseif ($method == 'DELETE') {
        $this->deleteDepartment();
      } else {
        $this->getHeaders();
        echo json_encode(array('status' => 'error', 'message' => 'Invalid request method'));
      }
    } else {
      $this->getHeaders();
      echo json_encode(array('status' => 'error', 'message' => 'Invalid request method'));
    }
  }
  public function assign_unit_load_to_department()
  {
    $this->conn;
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method == 'GET') {
      try {
        $sql = "SELECT dul.id, dul.min_units, dul.max_units, dul.semester, dul.session, dul.level, d.name as department_name, d.faculty_id, d.id as department_id FROM department_units_distribution as dul INNER JOIN departments as d ON d.id = dul.department_id WHERE 1=1";
        if (isset($_GET['id'])) {
          $sql .= " AND dul.id = " . $_GET['id'];
        }
        if (isset($_GET['department_id'])) {
          $sql .= " AND d.id = " . $_GET['department_id'];
        }
        if (isset($_GET['session'])) {
          $sql .= " AND dul.session='" . $_GET['session'] . "'";
        }
        if (isset($_GET['semester'])) {
          $sql .= " AND dul.semester = " . $_GET['semester'];
        }
        if (isset($_GET['level'])) {
          $sql .= " AND dul.level = " . $_GET['level'];
        }
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $res = $stmt->get_result();
        if ($res) {
          $data = [];
          while ($row = $res->fetch_assoc()) {
            $data[] = $row;
          }
          $this->getHeaders();
          echo json_encode(['data' => $data, 'status' => 'success', 'ok' => 1]);
        } else {
          throw new Exception('No data found');
        }
      } catch (Exception $e) {
        $this->getHeaders();
        echo json_encode(array('status' => 'error', 'message' => $e->getMessage(), 'ok' => 0));
      }
    } elseif ($method == 'POST') {
      $post = $_POST;
      $method = $post['method'];
      if ($method == 'POST') {
        try {
          $department_id = $post['department_id'];
          $min_units = $post['min_units'];
          $max_units = $post['max_units'];
          $level = $post['level'];
          $semester = htmlspecialchars($post['semester']);
          $session = htmlspecialchars($post['session']);
          $sql = "INSERT INTO department_units_distribution(
        department_id,
        min_units,
        max_units,
        level,
        semester,
        session
      ) VALUES (
        ?,?,?,?,?,?
      )";
          $stmt = $this->conn->prepare($sql);
          $stmt->bind_param(
            "iiiiis",
            $department_id,
            $min_units,
            $max_units,
            $level,
            $semester,
            $session
          );
          $res = $stmt->execute();
          if ($res) {
            $this->getHeaders();
            echo json_encode(array('status' => 'success', 'ok' => 1, $session));
          } else {
            $this->getHeaders();
            echo json_encode(array('status' => 'error', 'ok' => 0, 'message' => 'Error occured while saving data'));
          }
        } catch (Exception $e) {
          $this->getHeaders();
          echo json_encode(array('status' => 'error', 'message' => $e->getMessage(), 'ok' => 0));
        }
      } elseif ($method == 'PUT') {
        $post = $_POST;
        try {
          $id = $post['id'];
          $min_units = $post['min_units'];
          $max_units = $post['max_units'];
          $level = $post['level'];
          $semester = $post['semester'];
          $session = htmlspecialchars($post['session']);
          $sql = "UPDATE department_units_distribution SET min_units = ?, max_units = ?, level = ?, semester = ?, session = ? WHERE id = ?";
          $stmt = $this->conn->prepare($sql);
          $stmt->bind_param(
            "iiiiss",
            $min_units,
            $max_units,
            $level,
            $semester,
            $session,
            $id
          );
          $res = $stmt->execute();
          if ($res) {
            $this->getHeaders();
            echo json_encode(array('status' => 'success', 'ok' => 1, $session));
          } else {
            $this->getHeaders();
            echo json_encode(array('status' => 'error', 'ok' => 0));
          }
        } catch (Exception $e) {
          $this->getHeaders();
          echo json_encode(array('status' => 'error', 'message' => $e->getMessage(), 'ok' => 0));
        }
      } elseif ($method == 'DELETE') {
        $post = $_POST;
        try {
          $id = $post['id'];
          $sql = "DELETE FROM department_units_distribution WHERE id = ?";
          $stmt = $this->conn->prepare($sql);
          $stmt->bind_param(
            "i",
            $id
          );
          $res = $stmt->execute();
          if ($res) {
            $this->getHeaders();
            echo json_encode(array('status' => 'success', 'ok' => 1));
          } else {
            $this->getHeaders();
            echo json_encode(array('status' => 'error', 'ok' => 0));
          }
        } catch (Exception $e) {
          $this->getHeaders();
          echo json_encode(array('status' => 'error', 'message' => $e->getMessage(), 'ok' => 0));
        }
      } else {
        $this->getHeaders();
        echo json_encode(array('status' => 'error', 'message' => 'Invalid request method', 'ok' => 0));
      }
    } else {
      $this->getHeaders();
      echo json_encode(array('status' => 'error', 'message' => 'Invalid request method', 'ok' => 0));
    }
  }


  private function createDepartment()
  {
    $this->conn;
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method == 'POST') {
      try {
        $post = $_POST;
        $sql = "INSERT INTO departments(
          name,
          faculty_id
        ) VALUES (
          ?,?
        )";
        $stmt = $this->conn->prepare($sql);
        $name = $post['name'];
        $faculty = $post['faculty_id'];
        $stmt->bind_param(
          "ss",
          $name,
          $faculty
        );

        $res = $stmt->execute();
        if ($res) {
          $this->getHeaders();
          echo json_encode(array('status' => 'success'));
        } else {
          $this->getHeaders();
          echo json_encode(array('status' => 'error'));
        }
      } catch (Exception $e) {
        $this->getHeaders();
        echo json_encode(array('status' => 'error', 'message' => $e->getMessage(), 'ok' => 0));
      }
    }
  }
  private function updateDepartment()
  {
    $post = $_POST;
    $id = $post['id'];
    $name = $post['name'];
    $faculty = $post['faculty_id'];
    $duration = $post['duration'];
    $sql = "UPDATE departments SET name = ?, duration=?, faculty_id = ? WHERE id = ?";
    try {

      $stmt = $this->conn->prepare($sql);
      $stmt->bind_param('sisi', $name, $duration, $faculty, $id);
      $res = $stmt->execute();
      if ($res) {
        $this->getHeaders();
        echo json_encode(array('status' => 'success'));
      } else {
        $this->getHeaders();
        echo json_encode(array('status' => 'error'));
      }
    } catch (Exception $e) {
      $this->getHeaders();
      echo json_encode(array('status' => 'error', 'message' => $e->getMessage()));
    }
  }
  private function deleteDepartment()
  {
    $delete = $_POST;
    $id = $delete['id'];
    $sql = "DELETE FROM departments WHERE id = ?";
    try {
      $stmt = $this->conn->prepare($sql);
      $stmt->bind_param('i', $id);
      $res = $stmt->execute();
      if ($res) {
        $this->getHeaders();
        echo json_encode(array('status' => 'success'));
      } else {
        $this->getHeaders();
        echo json_encode(array('status' => 'error'));
      }
    } catch (Exception $e) {
      $this->getHeaders();
      echo json_encode(array('status' => 'error', 'message' => $e->getMessage()));
    }
  }
  private function numberOfStudentsInDepartment($id = null)
  {
    try {
      $sql = "SELECT departments.name, COUNT(students.id) AS number_of_students FROM departments LEFT JOIN students ON departments.id = students.department GROUP BY departments.id";
      if ($id) {
        $sql = "SELECT departments.name, COUNT(students.id) AS number_of_students FROM departments LEFT JOIN students ON departments.name = students.department WHERE departments.id = $id GROUP BY departments.id";
      }
      $stmt = $this->conn->prepare($sql);
      $stmt->execute();
      $res = $stmt->get_result();
      $data = $res->fetch_all(MYSQLI_ASSOC);
      if ($data) {
        return $data;
      } else {
        return [];
      }
    } catch (Exception $e) {
      return null;
    }
  }

  public function faculties()
  {
    $this->conn;
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method == 'GET') {
      try {
        $sql = "SELECT * FROM faculties";
        $id = null;
        if (isset($_GET['id'])) {
          $id = $_GET['id'];
          $sql = "SELECT * FROM faculties WHERE id = $id";
        }
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $res = $stmt->get_result();
        $data = $res->fetch_all(MYSQLI_ASSOC);
        $population = $this->numberOfStudentsInFaculty($id);
        if ($data) {
          $response = [
            'status' => 'success',
            'data' => array('data' => $data, 'population' => $population)
          ];
          $this->getHeaders();
          echo json_encode($response);
        } else {
          $response = [
            'status' => 'error',
            'data' => array('data' => $data, 'population' => 0)
          ];
          $this->getHeaders();
          echo json_encode($response);
        }
      } catch (Exception $e) {
        $response = [
          'status' => 'error',
          'message' => $e->getMessage()
        ];
        $this->getHeaders();
        echo json_encode($response);
      }
    } elseif ($method == 'POST') {
      $method = $_POST['method'];
      if ($method == 'POST') {
        $this->createFaculty();
      } elseif ($method == 'PUT') {
        $this->updateFaculty();
      } elseif ($method == 'DELETE') {
        $this->deleteFaculty();
      } else {
        $this->getHeaders();
        echo json_encode(array('status' => 'error', 'message' => 'Invalid request method'));
      }
    } else {
      $this->getHeaders();
      echo json_encode(array('status' => 'error', 'message' => 'Invalid request method'));
    }
  }
  private function createFaculty()
  {
    $post = $_POST;
    $name = $post['name'];

    $sql = "INSERT INTO faculties (name) VALUES (?)";
    try {
      $stmt = $this->conn->prepare($sql);
      $stmt->bind_param('s', $name);
      $res = $stmt->execute();

      if ($res) {
        $response = array(
          'status' => 'success',
          'message' => 'Faculty created successfully',
          'id' => $stmt->insert_id
        );
        $this->getHeaders();
        echo json_encode($response);
      } else {
        $response = [
          'status' => 'error',
          'message' => 'Faculty not created'
        ];
        $this->getHeaders();
        echo json_encode($response);
      }

    } catch (Exception $e) {
      $this->getHeaders();
      echo json_encode(array('status' => 'error', 'message' => $e->getMessage()));
    }
  }
  private function updateFaculty()
  {
    $put = $_POST;
    $id = $put['id'];
    $name = $put['name'];
    $sql = "UPDATE faculties SET name = ? WHERE id = ?";
    $stmt = $this->conn->prepare($sql);
    $stmt->bind_param('si', $name, $id);
    $stmt->execute();
    $res = $stmt->get_result();
    if ($res) {
      $response = [
        'status' => 'success',
        'message' => 'Faculty updated successfully'
      ];
      $this->getHeaders();
      echo json_encode($response);
    } else {
      $response = [
        'status' => 'error',
        'message' => 'Faculty not updated'
      ];
      $this->getHeaders();
      echo json_encode($response);
    }
  }
  private function deleteFaculty()
  {
    $post = $_POST;
    $id = $post['id'];
    $sql = "DELETE FROM faculties WHERE id = ?";
    $stmt = $this->conn->prepare($sql);
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $res = $stmt->get_result();
    if ($res) {
      $response = [
        'status' => 'success',
        'message' => 'Faculty deleted successfully'
      ];
      $this->getHeaders();
      echo json_encode($response);
    } else {
      $response = [
        'status' => 'error',
        'message' => 'Faculty not deleted'
      ];
      $this->getHeaders();
      echo json_encode($response);
    }

  }

  private function numberOfStudentsInFaculty($id = null)
  {

    try {
      $sql = "SELECT faculties.name, COUNT(students.id) AS number_of_students FROM faculties LEFT JOIN students ON faculties.name = students.faculty GROUP BY faculties.id";
      if ($id) {
        $sql = "SELECT faculties.name, COUNT(students.id) AS number_of_students FROM faculties LEFT JOIN students ON faculties.name = students.faculty WHERE faculties.id = $id GROUP BY faculties.id";
      }
      $stmt = $this->conn->prepare($sql);
      $stmt->execute();
      $res = $stmt->get_result();
      $data = $res->fetch_all(MYSQLI_ASSOC);
      if ($data) {
        return $data;
      } else {
        return [];
      }
    } catch (Exception $e) {
      return null;
    }
  }
}
?>