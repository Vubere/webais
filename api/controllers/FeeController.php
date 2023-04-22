<?php
namespace Api\controllers;

error_reporting(E_ALL);
ini_set('display_errors', '1');


use Exception;
use services\DB;


class FeeController
{

  public $conn = null;

  public function __construct()
  {
    /* create connectio */
    $this->conn = (new DB())->dbConnect();
  }

  public function __destruct()
  {
    /* close connection */
    $this->conn->close();
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

  public function fee()
  {
    $this->conn;
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method == 'GET') {
      try {
        $this->getHeaders();
        $sql = "SELECT * FROM fees WHERE 1=1";
        if (isset($_GET['id'])) {
          $id = $_GET['id'];
          $sql .= " AND id = $id";
        }
        if (isset($_GET['department_id'])) {
          $department_id = $_GET['department_id'];
          $sql .= " AND department_id = $department_id";
        }
        if (isset($_GET['session'])) {
          $session = $_GET['session'];
          $sql .= " AND session = $session";
        }
        if (isset($_GET['level'])) {
          $level = $_GET['level'];
          $sql .= " AND level = $level";
        }
        if (isset($_GET['semester'])) {
          $semester = $_GET['semester'];
          $sql .= " AND semester = $semester";
        }
        if (isset($_GET['fee_status'])) {
          $fee_status = $_GET['fee_status'];
          $sql .= " AND fee_status = $fee_status";
        }
        if (isset($_GET['student_id'])) {
          $student_id = $_GET['student_id'];
          $sql = "SELECT * FROM fees WHERE id NOT IN (SELECT fee_id FROM fees_paid WHERE student_id = '$student_id')";
        }

        $result = $this->conn->query($sql);
        $data = array();
        if ($result->num_rows > 0) {
          while ($row = $result->fetch_assoc()) {
            $data[] = $row;
          }
          $this->getHeaders();
          echo json_encode(['ok' => 1, 'data' => $data]);
        } else {
          $this->getHeaders();
          echo json_encode(array('ok' => 0, 'message' => 'No data found'));
        }
      } catch (Exception $e) {
        echo json_encode(array('message' => $e->getMessage()));
      }
    } elseif ($method == 'POST') {
      $method = $_POST['method'];
      if ($method == 'POST') {
        try {
          $post = $_POST;
          $sql = "INSERT INTO fees (name, amount, department_id, session, level, semester, fee_status) VALUES (?, ?, ?, ?, ?, ?, ?)";
          $name = $post['name'];
          $amount = $post['amount'];
          $department_id = $post['department'];
          $session = $post['session'];

          $level = $post['level'];
          $semester = $post['semester'];
          $fee_status = $post['status'];


          $stmt = $this->conn->prepare($sql);
          $stmt->bind_param('siisiis', $name, $amount, $department_id, $session, $level, $semester, $fee_status);
          $res = $stmt->execute();

          if ($res) {
            $this->getHeaders();
            echo json_encode(array('ok' => 1, 'message' => 'Fee created successfully'));
          } else {
            $this->getHeaders();
            echo json_encode(array('ok' => 0, 'message' => 'Fee creation failed'));
          }
        } catch (Exception $e) {
          $this->getHeaders();
          echo json_encode(array('message' => $e->getMessage()));
        }
      } elseif ($method == 'PUT') {
        try {
          $post = $_POST;
          $sql = "UPDATE fees SET name = ?, amount = ?, department_id = ?, session = ?, level = ?, semester = ?, fee_status = ?, updated_at = ? WHERE id = ?";
          $name = $post['name'];
          $amount = $post['amount'];
          $department_id = $post['department'];
          $session = $post['session'];
          $level = $post['level'];
          $semester = $post['semester'];
          $fee_status = $post['status'];
          $updated_at = date('Y-m-d H:i:s');
          $id = $post['id'];

          $stmt = $this->conn->prepare($sql);
          $stmt->bind_param('siisiisii', $name, $amount, $department_id, $session, $level, $semester, $fee_status, $updated_at, $id);
          $res = $stmt->execute();

          if ($res) {
            $this->getHeaders();
            echo json_encode(array('ok' => 1, 'message' => 'Fee updated successfully'));
          } else {
            $this->getHeaders();
            echo json_encode(array('ok' => 0, 'message' => 'Fee update failed'));
          }
        } catch (Exception $e) {
          $this->getHeaders();
          echo json_encode(array('message' => $e->getMessage()));
        }
      } elseif ($method == 'DELETE') {
        try {
          $post = $_POST;

          $sql = "DELETE FROM fees WHERE id = ?";

          $id = $post['id'];

          $stmt = $this->conn->prepare($sql);
          $stmt->bind_param('i', $id);
          $res = $stmt->execute();

          if ($res) {
            $this->getHeaders();
            echo json_encode(array('ok' => 1, 'message' => 'Fee deleted successfully'));
          } else {
            $this->getHeaders();
            echo json_encode(array('ok' => 0, 'message' => 'Fee delete failed'));
          }
        } catch (Exception $e) {
          $this->getHeaders();
          echo json_encode(array('message' => $e->getMessage()));
        }
      } else {
        $this->getHeaders();
        echo json_encode(array('message' => 'Invalid request'));
      }
    } else {
      $this->getHeaders();
      echo json_encode(array('message' => 'Invalid request'));
    }
  }
  public function payments()
  {
    $this->conn;
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method == 'GET') {
      try {
        $this->getHeaders();
        $sql = "SELECT * FROM fees_paid WHERE 1=1";
        if (isset($_GET['id'])) {
          $id = $_GET['id'];
          $sql .= " AND id = $id";
        }
        if (isset($_GET['student_id'])) {
          $student_id = $_GET['student_id'];
          $sql .= " AND student_id = $student_id";
        }
        if (isset($_GET['fee_id'])) {
          $fee_id = $_GET['fee_id'];
          $sql .= " AND fee_id = $fee_id";
        }
        if (isset($_GET['invoice_no'])) {
          $invoice_no = $_GET['invoice_no'];
          $sql .= " AND invoice_no = $invoice_no";
        }
        $result = $this->conn->query($sql);
        $data = array();
        if ($result->num_rows > 0) {
          while ($row = $result->fetch_assoc()) {
            $data[] = $row;
          }
          $this->getHeaders();
          echo json_encode($data);
        } else {
          $this->getHeaders();
          echo json_encode(array('message' => 'No data found'));
        }
      } catch (Exception $e) {
        echo json_encode(array('message' => $e->getMessage()));
      }
    } elseif ($method == 'POST') {
      try {
        $post = $_POST;
        $sql = "INSERT INTO fees_paid (student_id, fee_id, receipt_number, confirmation_number, invoice_no, date) VALUES (?, ?, ?, ?, ?,?)";
        if (!isset($post['student_id']) || !isset($post['fee_id']) || !isset($post['receipt_number']) || !isset($post['confirmation_number']) || !isset($post['invoice_no'])) {
          $this->getHeaders();
          echo json_encode(array('ok' => 0, 'message' => 'request is missing some parameters'));
          return;
        }
        $student_id = $post['student_id'];
        $fee_id = $post['fee_id'];
        $receipt_number = $post['receipt_number'];
        $confirmation_number = $post['confirmation_number'];
        $invoice_no = $post['invoice_no'];

        if ($this->check_if_payment_exist($student_id, $fee_id, $invoice_no)) {
          $this->getHeaders();
          echo json_encode(array('ok' => 0, 'message' => 'Payment already exist'));
          return;
        }
        if (strlen((string) $confirmation_number) < 21) {
          $this->getHeaders();
          echo json_encode(array('ok' => 0, 'message' => 'Invalid confirmation number'));
          return;
        }
        if (strlen((string) $receipt_number) < 13) {
          $this->getHeaders();
          echo json_encode(array('ok' => 0, 'message' => 'Invalid invoice number'));
          return;
        }
        $time = time();
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param('sssssi', $student_id, $fee_id, $receipt_number, $confirmation_number, $invoice_no, $time);
        $res = $stmt->execute();

        if ($res) {
          $this->change_invoice_status($invoice_no, $student_id, $fee_id);
          $this->getHeaders();
          echo json_encode(array('ok' => 1, 'message' => 'Fee paid successfully', 'sent_info' => $post));
        } else {
          $this->getHeaders();
          echo json_encode(array('ok' => 0, 'message' => 'Fee payment failed'));
        }
      } catch (Exception $e) {
        $this->getHeaders();
        echo json_encode(array('message' => $e->getMessage()));
      }
    } else {
      $this->getHeaders();
      echo json_encode(array('message' => 'Invalid request'));
    }
  }
  public function student_payments()
  {
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method == 'GET') {
      try {
        $sql = "SELECT f.name, f.session, f.level, f.semester, f.amount, fp.id, fp.receipt_number, fp.confirmation_number, fp.invoice_no, fp.student_id, CONCAT(s.firstName,' ', lastName) as fullName, s.department, s.faculty, d.name as department, fac.name as faculty, fp.date FROM fees AS f INNER JOIN fees_paid AS fp ON f.id=fp.fee_id INNER JOIN students AS s ON s.id = fp.student_id INNER JOIN departments as d ON d.id = s.department INNER JOIN faculties as fac ON fac.id = s.faculty WHERE 1=1";
        if (isset($_GET['student_id'])) {
          $student_id = $_GET['student_id'];
          $sql .= " AND fp.student_id = $student_id";
        }
        if (isset($_GET['fee_id'])) {
          $fee_id = $_GET['fee_id'];
          $sql .= " AND fp.fee_id = $fee_id";
        }
        if (isset($_GET['invoice_no'])) {
          $invoice_no = $_GET['invoice_no'];
          $sql .= " AND fp.invoice_no = $invoice_no";
        }
        $result = $this->conn->query($sql);
        $data = array();
        if ($result->num_rows > 0) {
          while ($row = $result->fetch_assoc()) {
            $data[] = $row;
          }
          $this->getHeaders();
          echo json_encode(['ok' => 1, 'data' => $data]);
        } else {
          $this->getHeaders();
          echo json_encode(array('message' => 'No data found', 'ok' => 0));
        }
      } catch (Exception $e) {
        $this->getHeaders();
        echo json_encode(array('message' => $e->getMessage(), 'ok' => 0));
      }
    } else {
      $this->getHeaders();
      echo json_encode(array('message' => 'Invalid request method', 'ok' => 0));
    }
  }
  private function check_if_payment_exist($student_id, $fee_id, $invoice_no)
  {
    $sql = "SELECT * FROM fees_paid WHERE student_id = ? AND fee_id = ? AND invoice_no = ?";
    $stmt = $this->conn->prepare($sql);
    $stmt->bind_param('iis', $student_id, $fee_id, $invoice_no);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
      return true;
    } else {
      return false;
    }
  }

  private function change_invoice_status($invoice_no, $student_id, $fee_id)
  {
    $sql = "UPDATE invoices SET status = 'settled' WHERE invoice_no = ? AND student_id = ? AND fee_id = ?";
    $stmt = $this->conn->prepare($sql);
    $stmt->bind_param('sii', $invoice_no, $student_id, $fee_id);
    $stmt->execute();

  }
  public function invoice()
  {
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method == "GET") {
      try {
        $sql = "SELECT i.id, i.invoice_no, i.status, i.date,i.fee_id, f.name, f.session, f.level, f.semester, f.fee_status, f.amount, f.level FROM invoices AS i INNER JOIN FEES as f ON f.id=i.fee_id WHERE 1=1";
        if (isset($_GET['student_id'])) {
          $sql .= " AND i.student_id = '" . $_GET['student_id'] . "'";
        }
        if (isset($_GET['fee_id'])) {
          $sql .= " AND i.fee_id = '" . $_GET['fee_id'] . "'";
        }
        if (isset($_GET['status'])) {
          $sql .= " AND i.status = " . $_GET['status'] . "";
        }

        $stmt = $this->conn->prepare($sql);

        $res = $stmt->execute();
        if (!$res) {
          throw new Exception("Error Processing Request", 1);
        }
        $result = $stmt->get_result();
        $data = array();
        if ($result->num_rows > 0) {
          while ($row = $result->fetch_assoc()) {
            $data[] = $row;
          }
          $this->getHeaders();
          echo json_encode(array('data' => $data, 'ok' => 1));
        } else {
          $this->getHeaders();
          echo json_encode(array('message' => 'No data found', 'ok' => 0));
        }
      } catch (Exception $e) {
        $this->getHeaders();
        echo json_encode(array('message' => $e->getMessage()));
      }
    } elseif ($method == 'POST') {
      try {
        $post = $_POST;
        $sql = "INSERT INTO invoices (student_id, fee_id, invoice_no, status, date) VALUES (?, ?, ?, ?, ?)";
        $student_id = $post['student_id'];
        $fee_id = $post['fee_id'];
        $invoice_no = $post['invoice_no'];
        $status = $post['status'];
        $date = $post['date'];

        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param('sisss', $student_id, $fee_id, $invoice_no, $status, $date);
        $res = $stmt->execute();

        if ($res) {
          $this->getHeaders();
          echo json_encode(array('ok' => 1, 'message' => 'Invoice created successfully'));
        } else {
          $this->getHeaders();
          echo json_encode(array('ok' => 0, 'message' => 'Invoice creation failed'));
        }
      } catch (Exception $e) {
        $this->getHeaders();
        echo json_encode(array('message' => $e->getMessage()));
      }
    }
  }
}