<?php
namespace Api\controllers;

use services\DB;
use Exception;


class SessionController
{
  public $conn = null;

  public function __construct()
  {
    $this->conn = (new DB)->dbConnect();
  }
  public function getHeaders()
  {
    //allow request from any origin
    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Headers: *');
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS,DELETE");
    header('Content-Type: application/json charset-UTF-8');
  }
  public function session()
  {
    $this->conn;
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method == 'GET') {
      try {

        $sql = "SELECT * FROM session WHERE 1=1";
        if (isset($_GET['session'])) {
          $session = $_GET['session'];
          $sql .= " AND session = '$session'";
        }
        if (isset($_GET['current'])) {
          $current = $_GET['current'];
          $sql .= " AND current = 1";
        }
        $result = $this->conn->query($sql);
        if ($result->num_rows > 0) {

          echo json_encode(['message' => 'Session found', 'ok' => 1, 'data' => $result->fetch_all(MYSQLI_ASSOC)]);
        } else {
          echo json_encode(['message' => 'No session found']);
        }
      } catch (Exception $e) {
        echo json_encode(['message' => 'Error occured', 'error' => $e->getMessage()]);
      }
    } elseif ($method == 'POST') {
      $post = $_POST;
      $session = $post['session'];
      $current_semester = $post['semester'];

      $first_semester_start = $post['first_semester_start'];
      $first_semester_end = $post['first_semester_end'];
      $second_semester_start = $post['second_semester_start'];
      $second_semester_end = $post['second_semester_end'];
      $current = 1;
      /* turn previously current semester to 0 */

      $sql = "INSERT INTO session (session, first_semester_start, first_semester_end, second_semester_start, second_semester_end, current) VALUES ('$session', '$first_semester_start', '$first_semester_end', '$second_semester_start', '$second_semester_end', '$current')";
      try {
        $result = $this->conn->query($sql);
        if ($result) {
          $sql = "UPDATE session SET current = 0 WHERE current = 1";
          $this->conn->query($sql);
          $sql = "UPDATE session SET current = 1 WHERE session = '$session'";
          $this->conn->query($sql);
          $this->getHeaders();
          echo json_encode(['message' => 'Session created successfully', 'ok' => 1]);
        } else {
          throw new Exception('Error creating session');
        }
      } catch (Exception $e) {
        $this->getHeaders();
        echo json_encode(['message' => 'Error occured', 'error' => $e->getMessage(), 'ok' => 0]);
      }
    } elseif ($method == 'PUT') {
      $post = json_decode(file_get_contents('php://input'), true);
      $session = $post['session'];

      $first_semester_start = $post['first_semester_start'];
      $first_semester_end = $post['first_semester_end'];
      $second_semester_start = $post['second_semester_start'];
      $second_semester_end = $post['second_semester_end'];
      $current = 1;
      $sql = 'UPDATE session SET   first_semester_start = "' . $first_semester_start . '", first_semester_end = "' . $first_semester_end . '", second_semester_start = "' . $second_semester_start . '", second_semester_end = "' . $second_semester_end . '", current = "' . $current . '" WHERE session = "' . $session . '"';
      try {
        $result = $this->conn->query($sql);
        if ($result) {
          echo json_encode(['message' => 'Session updated successfully', 'ok' => 1, 'post' => $post]);
        } else {
          throw new Exception('Error updating session');
        }
      } catch (Exception $e) {
        echo json_encode(['message' => $e->getMessage(), 'ok' => 0]);
      }
    } else {
      echo json_encode(['message' => 'Method not allowed', 'ok' => 0]);
    }
  }

}

?>