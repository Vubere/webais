<?php
require 'Api.php';
use Api\Api;



//getting current url
$current_link = $_SERVER['REQUEST_URI'];

//handling query string
if (str_contains($current_link, '?')) {
  $current_link = explode('?', $current_link)[0];
}

//routes
$urls = [
  /* creation and authenications */
  /* admin controller*/
  '/webais/api/admins' => ['AdminController@admin'],
  /* student controller*/
  '/webais/api/students' => ['StudentController@student'],
  /* create lecturer */
  '/webais/api/lecturers' => ['LecturerController@lecturer'],
  /* create courses */
  '/webais/api/create_course' => ['CoursesController@courses'],
  /* create lectures */
  '/webais/api/create_lecture' => ['EventsController@create_lecture'],
  /* create examinations */
  '/webais/api/create_exam' => ['EventsController@create_exam'],
  /* create faculty */
  '/webais/api/faculty' => ['StructureController@faculties'],
  /* create department */
  '/webais/api/department' => ['StructureController@departments'],
  /* authenticate user*/
  '/webais/api/authenticate' => ['AuthController@authenticate'],

  /* fetching  and updating*/

  /* fetch courses */
  '/webais/api/courses' => ['CoursesController@courses'],
  '/webais/api/course_students' => ['CoursesController@get_students_for_course'],
  /* fetch lectures */
  '/webais/api/lectures' => ['EventsController@lectures'],
  /* fetch examinations */
  '/webais/api/exam' => ['EventsController@examinations'],

  /* annoucemnts*/
  '/webais/api/announcements' => ['EventsController@announcements'],

  /* session */
  '/webais/api/session' => ['SessionController@session'],

  /* result  */
  /*create result table for course  */
  '/webais/api/session_result' => ['CoursesController@session_result'],
  /* toggles registeration for a course */
  '/webais/api/registration' =>
  ['CoursesController@registration'],
  /*  toggles grading for a course*/
  '/webais/api/grading' =>
  ['CoursesController@grading'],

  /* courses */
  '/webais/api/assign_course'=> ['CoursesController@assign_course_to_departments'],
  '/webais/api/available_course' =>
  ['CoursesController@available_course'],

  '/webais/api/registered_courses' =>
  ['CoursesController@registered_course'],

  '/webais/api/course_registration' =>
  ['CoursesController@course_registration'],
  '/webais/api/student_lectures' =>
  ['EventsController@get_student_lectures'],
  '/webais/api/grades' =>
  ['GradingController@grades'],
  '/webais/api/assign_unit_load' =>
  ['StructureController@assign_unit_load_to_department'],
  '/webais/api/student_registered_courses' =>
  ['StudentController@student_registered_courses'],

  /* Fee handling */
  '/webais/api/fee' =>
  ['FeeController@fee'],
  '/webais/api/payments' =>
  ['FeeController@payments'],
  '/webais/api/invoice' =>
  ['FeeController@invoice'],
  '/webais/api/student_payments' =>
  ['FeeController@student_payments'],

  /* chat */
  '/webais/api/send_message' =>
  ['ChatController@send_message'],
  '/webais/api/messages' =>
  ['ChatController@messages'],
  '/webais/api/retrieve_messages' =>
  ['ChatController@retrieve_messages'],
  '/webais/api/unread_messages' =>
  ['ChatController@get_unread_messages'],

];

//check if routes available
if (!isset($urls[$current_link])) {
  
  header('HTTP/1.0 404 not found');
}
/* api */
Api::routing($current_link, $urls);