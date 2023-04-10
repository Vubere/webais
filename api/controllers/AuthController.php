<?php
namespace Api\controllers;

error_reporting(E_ALL);
ini_set('display_errors', '1');


use Exception;
use services\DB;
use services\CS;


class AuthController
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

  public function authenticate()
  {

    $this->conn;
    $method = $_SERVER['REQUEST_METHOD'];

    

    if ($method == 'POST') {
      try {
        $post = json_decode(file_get_contents("php://input"), true);
        $type = '';

        if ($post['type'] == 'admin') {
          $type = 'administrators';
        } elseif ($post['type'] == 'student') {
          $type = 'students';
        } elseif ($post['type'] == 'lecturer') {
          $type = 'lecturers';
        } else {
          $this->getHeaders();
          echo json_encode(
            array(
              'authenticated' => false,
              'ok' => 0,
              'message' => 'Invalid type'
            )
          );
          return;
        }
        $password = $post['password'];
        $sql = "SELECT * FROM " . $type . " WHERE id = ? ";
        $stmt = $this->conn->prepare($sql);
        $Id = $post['id'];
        $stmt->bind_param('s', $Id);
        $res = $stmt->execute();
        if ($res) {
          $result = $stmt->get_result();
          if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            if ($user['password'] == $password) {
              $this->getHeaders();
              echo json_encode(
                array(
                  'authenticated' => true,
                  'ok' => 1,
                  'user' => $user
                )
              );
            } else {
              $this->getHeaders();
              echo json_encode(
                array(
                  'authenticated' => false,
                  'ok' => 0,
                  'message' => 'invalid password'
                )
              );
            }
          } else {
            $this->getHeaders();
            echo json_encode(
              array(
                'authenticated' => false,
                'ok' => 0,
                'message' => 'user not found'
              )
            );
          }
        } else {
          $this->getHeaders();
          echo json_encode(
            array(
              'authenticated' => false,
              'ok' => 0,
              'message' => 'failed to access database'
            )
          );
        }

      } catch (Exception $e) {
        $this->getHeaders();
        echo json_encode(
          array(
            'authenticated' => false,
            'status' => 'failed',
            'message' => $e->getMessage()
          )
        );
      }

    } else {
      $this->getHeaders();
      echo json_encode(
        array(
          'authenticated' => false,
          'status' => 405,
          'message' => 'wrong method'
        )
      );
    }
  }

}