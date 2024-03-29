<?php

namespace Api\controllers;

use Exception;
use services\DB;



class CgpaController
{
  public $conn = null;
  public $highest_grade = 5;
  public $lowest_grade = 0;
  public $grade_point = [
    'A' => 5,
    'B' => 4,
    'C' => 3,
    'D' => 2,
    'E' => 1,
    'F' => 0
  ];


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
  public function calculate_cgpa(string $student_id)
  {
    $sql = "SELECT * FROM course_registrations where student_id = ?";
    $stmt = $this->conn->prepare($sql);
    $stmt->bind_param('s', $student_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $total_units = 0;
    $total_grade_points = 0;
    $failed_courses = ['number' => 0, 'courses' => []];
    $courses = [];
    $unmarked_courses = ['number' => 0, 'courses' => []];
    while ($row = $result->fetch_assoc()) {

      $course_id = $row['department_course_id'];
      $session = $row['session'];
      $semester = $row['semester'];
      $sess = explode('/', $session);
      $result_table_name = $sess[0] . '_' . $sess[1] . '_' . $semester . '_' . $course_id;
      $table_name = 'results_' . $result_table_name;

      if (!$this->check_if_result_table_exist($table_name)) {
        continue;
      }

      $sql = "SELECT dc.id, dc.departments, dc.type, dc.code, dc.units, dc.semester, dc.assigned_lecturers, dc.course_id, c.title, c.description,cr.session FROM assigned_courses as dc INNER JOIN courses as c ON dc.course_id = c.id INNER JOIN course_registrations as cr ON cr.department_course_id = dc.id AND cr.student_id = '".$student_id."' AND cr.session = '".$session."' WHERE dc.id = ?";
      $stmt = $this->conn->prepare($sql);
      $stmt->bind_param('s', $course_id);
      $stmt->execute();
      $dc_result = $stmt->get_result();
      $course = $dc_result->fetch_assoc();
      $course_unit = isset($course['units']) ? $course['units'] : 0;
      $total_units += $course_unit;
      $sql = "SELECT * FROM $table_name where student_id = ?";
      $stmt = $this->conn->prepare($sql);
      $stmt->bind_param('s', $student_id);
      $stmt->execute();
      $tn_result = $stmt->get_result();
      $grade_res = $tn_result->fetch_assoc();
      $grade = $grade_res['grade'];
      if ($grade == 'F') {
        $here = $this->check_if_passed_failed_course($course_id, $student_id);
        if($here){
          $course['grade'] = $grade;
          $course['grade_point'] = $this->grade_point[$grade];
          $courses[] = $course;
          $total_grade_points += $course_unit * $this->grade_point[$grade];
          continue;
        }
        $failed_courses['number'] += 1;
        $failed_courses['courses'][] = $course;
      }
      if (!isset($this->grade_point[$grade])) {
        $unmarked_courses['number'] += 1;
        $unmarked_courses['courses'][] = $course;
        $grade_point = $this->grade_point['F'];
        $total_grade_points += $course_unit * $grade_point;
        continue;
      }
      $grade_point = $this->grade_point[$grade];
      $total_grade_points += $course_unit * $grade_point;
    }
    if ($total_units == 0) {
      return [
        'cgpa' => 0,
        'failed_courses' => $failed_courses,
        'total_units' => $total_units,
        'total_grade_points' => $total_grade_points,
        'courses' => $courses,
        'unmarked_courses' => $unmarked_courses
      ];
    }
    $cgpa = $total_grade_points / $total_units;
    return [
      'cgpa' => $cgpa,
      'failed_courses' => $failed_courses,
      'total_units' => $total_units,
      'total_grade_points' => $total_grade_points,
      'courses' => $courses,
      'unmarked_courses' => $unmarked_courses
    ];
  }
  private function check_if_result_table_exist($table_name)
  {
    $sql = "SHOW TABLES LIKE '$table_name'";
    $stmt = $this->conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->get_result();
    return $result->num_rows > 0;
  }

  private function check_if_failed_course_was_rewritten($id, $student_id) {
    $sql = "SELECT * FROM course_registrations where student_id = ? AND department_course_id = ?";
    $stmt = $this->conn->prepare($sql);
    $stmt->bind_param('ss', $student_id, $id);
    $stmt->execute();
    $result = $stmt->get_result();
    if($result->num_rows>1){
      $data = [];
      while($row = $result->fetch_assoc()){
        $data[] = $row;
      }
      return $data;
    }else{
      return false;
    }
  }


  private function check_if_passed_failed_course($id, $student_id){
    $s = $this->check_if_failed_course_was_rewritten($id, $student_id);
    if($s){
      foreach($s as $r){
        $session = $r['session'];
        $semester = $r['semester'];
        $sess = explode('/', $session);
        $result_table_name = $sess[0] . '_' . $sess[1] . '_' . $semester . '_' . $id;
        $table_name = 'results_' . $result_table_name;
        if (!$this->check_if_result_table_exist($table_name)) {
          continue;
        }
        $sql = "SELECT * FROM $table_name where student_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param('s', $student_id);
        $stmt->execute();
        $tn_result = $stmt->get_result();
        $grade_res = $tn_result->fetch_assoc();
        $grade = $grade_res['grade'];
        if($grade != 'F'){
          return $grade_res;
        }
      }
      return false;
    }else{
      return false;
    }

  }
  public function student_performance()
  {
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method == 'GET') {
      try {
        if (!isset($_GET['student_id'])) {
          throw new Exception('Student id is required');
        }
        $cgpa = $this->calculate_cgpa($_GET['student_id']);

        $this->getHeaders();
        echo json_encode(['performance' => $cgpa, 'ok' => 1]);
      } catch (Exception $e) {
        $this->getHeaders();
        echo json_encode(['error' => $e->getMessage(), 'ok' => 0]);
      }
    } else {
      $this->getHeaders();
      echo json_encode(['error' => 'Method not allowed', 'ok' => 0]);
    }
  }
}


/* 
department&level&id&compulsory in assigned courses

department_course_id&student_id in course_registrations


*/