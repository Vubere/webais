<?php


namespace Api\controllers;


use Exception;
use services\DB;
use services\CS;



class ChatController
{
  public $db;

  public function __construct()
  {
    $this->db = (new DB())->dbConnect();

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

  private function check_if_chat_exists($user_id, $receiver_id)
  {
    $sql = 'SELECT * FROM participants A, participants B WHERE A.user_id = ? AND B.user_id = ? AND A.chat_id = B.chat_id';
    $stmt = $this->db->prepare($sql);
    $stmt->bind_param('ss', $user_id, $receiver_id);
    $stmt->execute();
    $chat = $stmt->get_result();
    return $chat->num_rows > 0 ? $chat->fetch_assoc()['chat_id'] : false;
  }
  private function initialize_chat($user_id, $receiver_id)
  {
    $chat_id = $this->check_if_chat_exists($user_id, $receiver_id);
    if ($chat_id) {
      return $chat_id;
    }
    $sql = 'INSERT INTO chat (created_at) VALUES (NOW())';
    $stmt = $this->db->prepare($sql);
    $stmt->execute();
    $chat_id = $this->db->insert_id;


    $sql = 'INSERT INTO participants (chat_id, user_id) VALUES (?, ?)';
    $stmt = $this->db->prepare($sql);
    $stmt->bind_param('ss', $chat_id, $user_id);
    $stmt->execute();
    $stmt->bind_param('ss', $chat_id, $receiver_id);
    $stmt->execute();
    return $chat_id;

  }
  public function send_message()
  {
    $method = $_SERVER['REQUEST_METHOD'];
    $server_url = 'http://localhost/webais/api/controllers';
    if ($method == 'POST') {
      try {
        $file_location = null;
        $bool = false;
        if (isset($_FILES['image'])) {
          $image = $_FILES['image'];
          $file_location = '/uploads/' . $image['name'];
          $server_url .= $file_location;
          $bool = move_uploaded_file($image['tmp_name'], __DIR__ . $file_location);
          if (!$bool) {
            throw new Exception('Error sending image');
          }
        }




        $receiver_id = $_POST['receiver_id'];
        $user_id = $_POST['user_id'];
        $chat_id = $this->initialize_chat($user_id, $receiver_id);
        $message = $_POST['message'];

        $image = $bool ? $server_url : null;


        $sql = 'INSERT INTO messages (chat_id, user_id, message,  image) VALUES (?, ?, ?, ?)';
        $stmt = $this->db->prepare($sql);
        $stmt->bind_param('ssss', $chat_id, $user_id, $message, $image);
        $stmt->execute();
        $this->getHeaders();
        echo json_encode(['message' => 'Message sent successfully', 'status' => 200, 'ok' => 1]);
      } catch (Exception $e) {
        $this->getHeaders();
        echo json_encode(['message' => $e->getMessage(), 'status' => 500, 'ok' => 0]);
      }
    } else {
      $this->getHeaders();
      echo json_encode(['message' => 'Method not allowed', 'status' => 405, 'ok' => 0]);
      exit;
    }
  }

  private function user_type_from_id(string $user_id): string
  {
    $type = strtolower($user_id[0]) == 's' ? 'students' : 'lecturers';
    return $type;
  }
  public function messages()
  {
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method == 'GET') {
      try {
        if (!isset($_GET['user_id']) || !isset($_GET['receiver_id'])) {
          throw new Exception('failed to set user id and receiver id');
        }
        $user_id = $_GET['user_id'];
        $receiver_id = $_GET['receiver_id'];
        $chat_id = $this->initialize_chat($user_id, $receiver_id);
        $sql = 'SELECT * FROM messages WHERE chat_id = ? ORDER BY time_sent ASC';
        $stmt = $this->db->prepare($sql);
        $stmt->bind_param('s', $chat_id);
        $stmt->execute();
        $messages = $stmt->get_result();

        /* strip slash from image url */
        $data = [];
        while ($row = $messages->fetch_assoc()) {

          /* update seen status */
          if ($row['user_id'] == $receiver_id && $row['seen'] == 0) {
            $sql = 'UPDATE messages SET seen = 1 WHERE chat_id = ? AND user_id = ?';
            $stmt = $this->db->prepare($sql);
            $stmt->bind_param('ss', $chat_id, $receiver_id);
            $stmt->execute();
          }
          /* get user name */
          $type = $this->user_type_from_id($row['user_id']);
          $sql = "SELECT CONCAT(firstName, ' ', lastName ) AS full_name FROM $type WHERE id = ?";
          $stmt = $this->db->prepare($sql);
          $stmt->bind_param('s', $row['user_id']);
          $stmt->execute();
          $user = $stmt->get_result()->fetch_assoc();
          $row['full_name'] = $user['full_name'];

          $data[] = $row;
        }

        $this->getHeaders();
        echo json_encode(['messages' => $data, 'status' => 200, 'ok' => 1, 'message' => 'Messages fetched successfully']);
      } catch (Exception $e) {
        $this->getHeaders();
        echo json_encode(['message' => $e->getMessage(), 'status' => 500, 'ok' => 0]);
      }
    } elseif ($method == 'DELETE') {
      /* delete single message */
      try {
        $message_id = $_GET['message_id'];
        $sql = 'DELETE FROM messages WHERE id = ?';
        $stmt = $this->db->prepare($sql);
        $stmt->bind_param('s', $message_id);
        $stmt->execute();
        $this->getHeaders();
        echo json_encode(['message' => 'Message deleted successfully', 'status' => 200, 'ok' => 1]);
      } catch (Exception $e) {
        $this->getHeaders();
        echo json_encode(['message' => $e->getMessage(), 'status' => 500, 'ok' => 0]);
      }
    } else {
      $this->getHeaders();
      echo json_encode(['message' => 'Method not allowed', 'status' => 405, 'ok' => 0]);
      exit;
    }
  }

  public function get_unread_messages()
  {
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method == 'GET') {
      try {
        $user_id = $_GET['user_id'];
        $sql = 'SELECT * FROM participants WHERE user_id =?';
        $stmt = $this->db->prepare($sql);
        $stmt->bind_param('s', $user_id);
        $stmt->execute();
        $chats = $stmt->get_result();

        $data = [];
        while ($row = $chats->fetch_assoc()) {
          $chat_id = $row['chat_id'];
          $sql = 'SELECT * FROM messages WHERE chat_id = ? AND user_id != ? AND seen = 0';
          $stmt = $this->db->prepare($sql);
          $stmt->bind_param('ss', $chat_id, $user_id);
          $stmt->execute();
          $messages = $stmt->get_result();
          $count = $messages->num_rows;
          if ($count > 0) {
            $data[] = ['chat_id' => $chat_id, 'count' => $count];
          }
        }
        $this->getHeaders();
        echo json_encode(['messages' => $data, 'status' => 200, 'ok' => 1, 'message' => 'Messages fetched successfully']);
      } catch (Exception $e) {
        $this->getHeaders();
        echo json_encode(['message' => $e->getMessage(), 'status' => 500, 'ok' => 0]);
      }
    } else {
      $this->getHeaders();
      echo json_encode(['message' => 'Method not allowed', 'status' => 405, 'ok' => 0]);
      exit;
    }
  }
  public function retrieve_messages()
  {
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method == 'GET') {
      try {
        $user_id = $_GET['user_id'];
        $sql = 'SELECT * FROM participants WHERE user_id =?';
        $stmt = $this->db->prepare($sql);
        $stmt->bind_param('s', $user_id);
        $stmt->execute();
        $chats = $stmt->get_result();

        $data = [];
        while ($row = $chats->fetch_assoc()) {
          $chat_id = $row['chat_id'];
          $sql = 'SELECT * FROM participants WHERE chat_id = ? AND user_id != ?';
          $stmt = $this->db->prepare($sql);
          $stmt->bind_param('ss', $chat_id, $user_id);
          $stmt->execute();
          $user = $stmt->get_result()->fetch_assoc();
          $user_id = $user['user_id'];
          $user_type = strtolower($user_id[0]) == 's' ? 'students' : 'lecturers';
          $sql = 'SELECT * FROM ' . $user_type . ' WHERE id = ?';
          $stmt = $this->db->prepare($sql);
          $stmt->bind_param('s', $user_id);
          $stmt->execute();
          $user = $stmt->get_result()->fetch_assoc();
          /* get last message */
          $sql = 'SELECT * FROM messages WHERE chat_id = ? ORDER BY time_sent DESC LIMIT 1';
          $stmt = $this->db->prepare($sql);
          $stmt->bind_param('s', $chat_id);
          $stmt->execute();
          $message = $stmt->get_result()->fetch_assoc();

          if (!$user || !$message)
            continue;
          $temp = [];
          $temp['full_name'] = $user['firstName'] . ' ' . $user['lastName'];
          $temp['contact_id'] = $user['id'];
          if ($user_type == 'students') {
            $temp['department'] = $user['department'];
          } else {
            $temp['discipline'] = $user['discipline'];
            $temp['degreeAcquired'] = $user['degreeAcquired'];
          }
          $temp = array_merge($temp, $message ?? []);

          $data[] = $temp;
        }
        $this->getHeaders();
        echo json_encode(['chats' => $data, 'status' => 200, 'ok' => 1, 'message' => 'Chats fetched successfully']);
      } catch (Exception $e) {
        $this->getHeaders();
        echo json_encode(['message' => $e->getMessage(), 'status' => 500, 'ok' => 0]);
      }
    } else {
      $this->getHeaders();
      echo json_encode(['message' => 'Method not allowed', 'status' => 405, 'ok' => 0]);
      exit;
    }
  }
}