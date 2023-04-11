<?php
namespace Api\controllers;


use Exception;
use services\DB;


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
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method == 'POST') {
      try {
        $post = $_POST;
        $type = '';

        if (isset($post['type'])&&$post['type'] == 'admin') {
          $type = 'administrators';
        } elseif (isset($post['type']) &&$post['type'] == 'student') {
          $type = 'students';
        } elseif (isset($post['type']) &&$post['type'] == 'lecturer') {
          $type = 'lecturers';
        } else {
          $this->getHeaders();
          echo json_encode(
            array(
              'authenticated' => false,
              'ok' => 0,
              'message' => 'Invalid user type'
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
              return;
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