<?php
namespace Api\controllers;

use Exception;
use services\DB;


class GradingController
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
  public function Attendance()
  {
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method == 'POST') {

    } elseif ($method == 'GET') {
      $sql = "SELECT * FROM attendance";
      $res = $this->conn->query($sql);
      if ($res) {
        $this->getHeaders();
        $rows = $res->fetch_all(MYSQLI_ASSOC);
        echo json_encode($rows);
      }
    } elseif ($method == 'PUT') {

    }
  }
  public function grades()
  {
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method == 'GET') {

      $course_id = $_GET['course_id'];
      $session = $_GET['session'];

      $line = __LINE__;
      try {

        $sql = 'SELECT table_name, grading_open FROM course_gradings WHERE department_course_id=' . $course_id . ' AND session="' . $session . '"';
        $stmt = $this->conn->query($sql);

        if ($stmt) {
          $row = $stmt->fetch_all();

          if (count($row) > 0) {
            $row = $row[0];
            $table_name = $row[0];
            $sql = 'SELECT ' . $table_name . '.id,' . $table_name . '.student_id,' . $table_name . '.attendance, ' . $table_name . '.ca, ' . $table_name . '.exam,' . $table_name . '.grade, ' . $table_name . '.remark, students.firstName, students.lastName FROM ' . $table_name . ' INNER JOIN students On ' . $table_name . '.student_id=students.id';


            if (isset($_GET['student_id'])) {
              $sql .= ' WHERE student_id="' . $_GET['student_id'] . '"';
            }
            $stmt = $this->conn->prepare($sql);
            $res = $stmt->execute();
            if ($res) {
              $this->getHeaders();

              $res = $stmt->get_result();
              $data = [];
              while ($row2 = $res->fetch_assoc()) {
                $data[] = $row2;
              }
              echo json_encode([
                'result' => array('info' => $data, 'open' => $row[1]),
                'fetch' => 'success'
              ]);
            } else {
              $this->getHeaders();
              $line = __LINE__;
              echo json_encode([
                'status' => 400,
                'line' => $line,
                'message' => 'failed'
              ]);
            }
          } else {
            $this->getHeaders();
            $line = __LINE__;

            echo json_encode([
              'status' => 400,
              'line' => $line,
              'row' => $row,
              'message' => 'no rows found'
            ]);
          }
        } else {
          $this->getHeaders();
          $line = __LINE__;

          echo json_encode([
            'status' => 400,
            'line' => $line,
            'message' => 'failed'
          ]);
        }
      } catch (Exception $e) {
        $this->getHeaders();
        echo json_encode([
          'message' => $e->getMessage(),
          'line' => $e->getLine(),
          'status' => 400,
          'data_sent' => $_GET,
          'ok' => 0
        ]);
      }

    } elseif ($_SERVER['REQUEST_METHOD'] == 'POST') {
      $post = $_POST;

      $student_id = $post['student_id'];
      $course_id = $post['course_id'];
      $session = $post['session'];
      $ca = $post['ca'];
      $exam = $post['exam'];
      $attendance = $post['attendance'];
      $grade = $post['grade'];
      try {

        $sql = 'SELECT table_name FROM course_gradings WHERE department_course_id="' . $course_id . '" AND session="' . $session . '"';

        $stmt = $this->conn->prepare($sql);

        $res = $stmt->execute();

        if ($res) {
          $res = $stmt->get_result();
          $result = $res->fetch_assoc();

          $table_name = $result['table_name'];


          $sql = "UPDATE " . $table_name .
            " SET ca='" . $ca . "', exam='" . $exam . "', attendance='" . $attendance . "', grade='" . $grade . "' WHERE student_id='" . $student_id . "'";

          $stmt = $this->conn->prepare($sql);
          $res = $stmt->execute();
          if ($res) {
            $res = $stmt->get_result();

            echo json_encode(
              array(
                'status' => 200,
                'message' => 'success'
              )
            );
          } else {
            echo json_encode([
              'status' => 501,
              'message' => 'failed to process'
            ]);

          }

        } else {

          $this->getHeaders();
          echo json_encode([
            'status' => 501,
            'message' => 'failed to process'
          ]);
        }
      } catch (Exception $e) {
        echo json_encode([
          'status' => 503,
          'message' => $e->getMessage()
        ]);
      }
    } else {
      $this->getHeaders();
      echo json_encode([
        'status' => 400,
        'message' => 'wrong method. Use GET instead'
      ]);
    }
  }

}