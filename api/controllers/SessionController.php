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
        $this->set_session_as_current_if_current_time_is_inbetween_semesters();
        

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
      $method = $_POST['method'];
      if ($method == 'POST') {
        $post = $_POST;
        $session = $post['session'];

        $first_semester_start = $post['first_semester_start'];
        $first_semester_end = $post['first_semester_end'];
        $second_semester_start = $post['second_semester_start'];
        $second_semester_end = $post['second_semester_end'];
        if($this->check_if_sessions_intersects($post)){
          $this->getHeaders();
          echo json_encode(['message' => 'Session intersects with another session', 'ok' => 0]);
          return;
        }

        $sql = "INSERT INTO session (session, first_semester_start, first_semester_end, second_semester_start, second_semester_end, current) VALUES ('$session', '$first_semester_start', '$first_semester_end', '$second_semester_start', '$second_semester_end', 0)";
        try {
          $result = $this->conn->query($sql);
          if ($result) {
            $this->set_session_as_current_if_current_time_is_inbetween_semesters();
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
        $post = $_POST;
        $session = $post['session'];

        $first_semester_start = $post['first_semester_start'];
        $first_semester_end = $post['first_semester_end'];
        $second_semester_start = $post['second_semester_start'];
        $second_semester_end = $post['second_semester_end'];
        $sql = 'UPDATE session SET   first_semester_start = "' . $first_semester_start . '", first_semester_end = "' . $first_semester_end . '", second_semester_start = "' . $second_semester_start . '", second_semester_end = "' . $second_semester_end . '" WHERE session = "' . $session . '"';
        try {
          $result = $this->conn->query($sql);
          $this->set_session_as_current_if_current_time_is_inbetween_semesters();
          if ($result) {
            echo json_encode(['message' => 'Session updated successfully', 'ok' => 1, 'post' => $post]);
          } else {
            throw new Exception('Error updating session');
          }
        } catch (Exception $e) {
          echo json_encode(['message' => $e->getMessage(), 'ok' => 0]);
        }
      }
    } else {
      echo json_encode(['message' => 'Method not allowed', 'ok' => 0]);
    }
  }
  private function check_if_sessions_intersects($post){
    $sql = "SELECT * FROM session WHERE 1=1";
    $result = $this->conn->query($sql);
    if ($result->num_rows > 0) {
      $sessions = $result->fetch_all(MYSQLI_ASSOC);
     
      $first_semester_start = $post['first_semester_start'];
      $second_semester_end = $post['second_semester_end'];

      foreach ($sessions as $session) {
        $first_semester_start_ = $session['first_semester_start'];
        $second_semester_end_ = $session['second_semester_end'];
        if ($first_semester_start >= $first_semester_start_ && $first_semester_start <= $second_semester_end_) {
          return true;
        }
        if ($second_semester_end >= $first_semester_start_ && $second_semester_end <= $second_semester_end_) {
          return true;
        }
      }
      return false;

    } else {
      return false;
    }
  }
  private function set_session_as_current_if_current_time_is_inbetween_semesters(){
    $sql = "SELECT * FROM session WHERE 1=1";
    $result = $this->conn->query($sql);
    if ($result->num_rows > 0) {
      $sessions = $result->fetch_all(MYSQLI_ASSOC);
      
      $unix_time = time();

      foreach ($sessions as $session) {
        $first_semester_start_ = $session['first_semester_start'];
        $second_semester_end_ = $session['second_semester_end'];
        if ($unix_time >= $first_semester_start_ && $unix_time <= $second_semester_end_) {
          return $this->update_current_session($session['session']);
        }
      }
      return false;

    } else {
      return false;
    }
  }
  private function update_current_session($session){

    $sql = "UPDATE session SET current = 1 WHERE session='$session'";
    $sql2 = "UPDATE session SET current = 0 WHERE session!='$session'";
    $result = $this->conn->query($sql);
    $result2 = $this->conn->query($sql2);
    if($result){
      return true;
    }else{
      return false;
    }
  }
}

?>