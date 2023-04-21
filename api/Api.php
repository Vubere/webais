<?php
namespace Api;

use Exception;
use services\CS;

$dbPath = __DIR__ . '/services/DB.php';
$csPath = __DIR__ . '/services/CS.php';
require($dbPath);
require($csPath);
require('./controllers/LecturerController.php');
require('./controllers/AdminController.php');
require('./controllers/StudentController.php');
require('./controllers/CoursesController.php');
require('./controllers/EventsController.php');
require('./controllers/StructureController.php');
require('./controllers/SessionController.php');
require('./controllers/GradingController.php');
require('./controllers/AuthController.php');
require('./controllers/FeeController.php');
require('./controllers/ChatController.php');
require('./controllers/CgpaController.php');


class Api{
  public static function routing($current_link, $urls){
    
    try{
      forEach($urls as $index=>$url){
        if($index!= $current_link){
          continue;
        }
        
        //getting controller and method
        $routeElement = explode('@', $url[0]);
        $className = $routeElement[0];
        $function = $routeElement[1];
        
        //check if controller is present
        if(!file_exists("controllers/".$className.".php")){
          die ("Controller not found");
        }
       
        $class = "Api\controllers\\$className";
        $object  = new $class();
        
        CS::getHeaders();
        $object->$function();
      }

      
    }catch(Exception $e){
      header("Access-Control-Allow-Origin: *");
      header('Access-Control-Allow-Headers: *');
      header("Access-Control-Allow-Credentials: true");
      header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");
      header('Content-Type: application/json charset-UTF-8');
      echo json_encode(array('status'=>$e->getMessage()));
    }
  }
}