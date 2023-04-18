<?php
namespace services;

use services\DB;


class CS {


  public $conn = null;

  public function __construct()
  {
    /* create connectio */
    $this->conn = (new DB())->dbConnect();
  }

  public static function getHeaders()
  {
    //allow request from any origin
    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Headers: *');
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS,DELETE");
    header('Content-Type: application/json charset-UTF-8');
  }
  public function generateId($type)
  {
    if ($type == 'student') {
      $sql = "SELECT * FROM students ORDER BY id DESC LIMIT 1";
      $result = $this->conn->query($sql);
      if ($result && $result->num_rows > 0) {
        $row = mysqli_fetch_assoc($result);
        $id = $row['id'];
        $id = explode('-', $id);
        $id = $id[1];
        $id = (int) $id;
        $id = $id + 1;
        $id = 'STU-' . $id;
        return $id;
      } else {
        return 'STU-1';
      }
    } elseif ($type == 'admin') {
      $sql = "SELECT * FROM administrators ORDER BY id DESC LIMIT 1";
      $result = $this->conn->query($sql);
      if ($result && $result->num_rows > 0) {
        $row = mysqli_fetch_assoc($result);
        $id = $row['id'];
        $id = explode('-', $id);
        $id = $id[1];
        $id = (int) $id;
        $id = $id + 1;
        $id = 'ADMIN-' . $id;
        return $id;
      } else {
        return 'ADMIN-1';
      }
    } elseif ($type == 'lecturer') {
      $sql = "SELECT * FROM lecturers ORDER BY id DESC LIMIT 1";
      $result = $this->conn->query($sql);
      if ($result && $result->num_rows > 0) {
        $row = mysqli_fetch_assoc($result);
        $id = $row['id'];
        $id = explode('-', $id);
        $id = $id[1];
        $id = (int) $id;
        $id = $id + 1;
        $id = 'LECT-' . $id;
        return $id;
      } else {
        return 'LECT-1';
      }
    }
  }

}