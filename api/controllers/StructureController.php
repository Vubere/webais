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
    header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS< DELETE");
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
          $sql = "SELECT * FROM departments WHERE faculty = '" . $_GET['faculty']."'" ;
        }
        
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $res = $stmt->get_result();
        $population = $this->numberOfStudentsInDepartment();
        if ($res) {
          $data = $res->fetch_all(MYSQLI_ASSOC);
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
      $this->createDepartment();
    } elseif ($method == 'PUT') {
      $this->updateDepartment();
    } elseif ($method == 'DELETE') {
      $this->deleteDepartment();
    } else {
      $this->getHeaders();
      echo json_encode(array('status' => 'error', 'message' => 'Invalid request method'));
    }
  }

  private function createDepartment()
  {
    $this->conn;
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method == 'POST') {
      try {
        $post = json_decode(file_get_contents("php://input"), true);
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
        echo json_encode(array('status' => 'error', 'message' => $e->getMessage()));
      }
    }
  }
  private function updateDepartment()
  {
    $post = json_decode(file_get_contents('php://input'), true);
    $id = $post['id'];
    $name = $post['name'];
    $faculty = $post['faculty_id'];
    $sql = "UPDATE departments SET name = ?, faculty_id = ? WHERE id = ?";
    try {

      $stmt = $this->conn->prepare($sql);
      $stmt->bind_param('ssi', $name, $faculty, $id);
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
    $post = json_decode(file_get_contents('php://input'), true);
    $id = $post['id'];
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
      $this->createFaculty();
    } elseif ($method == 'PUT') {
      $this->updateFaculty();
    } elseif ($method == 'DELETE') {
      $this->deleteFaculty();
    } else {
      $this->getHeaders();
      echo json_encode(array('status' => 'error', 'message' => 'Invalid request method'));
    }
  }
  private function createFaculty()
  {
    $post = json_decode(file_get_contents('php://input'), true);
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
    $post = json_decode(file_get_contents('php://input'), true);
    $id = $post['id'];
    $name = $post['name'];
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
    $post = json_decode(file_get_contents('php://input'), true);
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