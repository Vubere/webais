export const base = "/";
export const dashboard = "/dashboard";

/* admin */
export const admin = "admin";
export const admin_login = "/admin-login";

/* create */
export const create_admin = dashboard + "-" + admin + "/create-admin";
export const create_lectures = dashboard + "-" + admin + "/create-lectures";
export const create_student = dashboard + "-" + admin + "/create-student";
export const create_course = dashboard + "-" + admin + "/create-course";
export const create_faculty = dashboard + "-" + admin + "/create-faculty";
export const create_class = "create-class";
export const create_announcement = "create-announcement";
export const create_exam = dashboard + "-" + admin + "/create-exam";
export const create_fee = dashboard + "-" + admin + "/create-fee";

/* update*/
export const update_admin = "update-admin";
export const update_student = "update-student";
export const update_lecturer = "update-lecturer";
export const update_course = "update-course";
export const update_lectures = "update-lecture";
export const update_exams = "update-exams";
export const update_faculty = "update-faculty";
export const update_department = "update-department";
export const personal_info = "personal-info";

/* view  */
export const view_lecturer = dashboard + "-" + admin + "/view-lecturer";
export const view_lectures = "view-lectures";
export const view_course = "view-course";
export const view_faculty = "view-faculty";
export const view_admin = dashboard + "-" + admin + "/view-admin";
export const view_class = "view-class";
export const view_exam = "view-exam";
export const view_announcement = "view-announcement";

export const session = 'session'
//export const profile = 'profile'
export const update_info = "update-personal-info";

/* student */
export const student = "student";
export const view_student = "view-student";
export const student_login = "/student_login";
export const grades = "grades";
export const examinations = 'examination'

/* lecturer */
export const lecturer = "lecturer";
export const create_lecturer = dashboard + "-" + admin + "/create-lecturer";
export const lecturer_login = "/lecturer_login";
export const give_attendance = "give-attendance";
export const view_attendance = "view-attendance";
export const view_result = "view-result";
export const view_result_for_grading = "view-result-for-grading";
export const grade_result = "grade-result";
export const grade_students = "grade-students";
export const view_students = "view-students";
export const view_students_for_grading = "view-students-for-grading";
export const view_courses = "view-courses";
export const view_courses_for_grading = "view-courses-for-grading";
//export const view_lectures = 'view-lectures'
export const view_results_for_course_handled =
  "view-results-for-course-handled";
export const lectures = "lectures";
export const view_announcements = "view-announcements";
export const update_personal_info = "update-personal-info";
export const update_password = "update-password";
export const profile = "profile";
export const announcements = "announcements";

export const result_sheet = 'result_sheet'

export const users_management = "users-management";
export const course_management = "course-management";
export const examination_management = "examination-management";
export const lecture_management = "lecture-management";
export const fee_management = "fee-management";
export const fee_payments = "fee-payments";
export const generate_invoice = "generate-invoice";
export const confirm_payment = "confirm-payment";
export const view_payments = 'view-payments'
export const messages = 'messages'
export const receipt = 'receipt'
export const assigned_courses = 'assigned-courses'
export const update_assigned_course = 'update-assigned-course'
export const view_assigned_courses = 'view-assigned-courses'
export const assign_units = dashboard + "-" + admin + "/assign_units";
export const unit_distribution = dashboard + "-" + admin + "/unit_distribution";
export const edit_unit_load = dashboard + "-" + admin + "/edit-unit-load";

const adminDashboardLinks = [
  {
    name: "Users Management",
    path: users_management,
    icon: "",
  },
  {
    name: "Course Management",
    path: course_management,
    icon: "fas fa-user-plus",
  },
  {
    name: "Lecture Management",
    path: lecture_management,
    icon: "fas fa-user-plus",
  },

  {
    name: "Examination Management",
    path: examination_management,
    icon: "fas fa-user-plus",
  },
  {
    name: "Fees Management",
    path: fee_management,
    icon: "fas fa-user-plus",
  },
  {
    name: "Faculties",
    path: view_faculty,
    icon: "fas fa-users",
  },
  {
    name: "Announcements",
    path: view_announcement,
    icon: "fas fa-users",
  },
  {
    name: 'Session',
    path: session,
    icon: ''
  },
  {
    name: "Personal Info",
    path: personal_info,
    icon: "fas fa-user-plus",
  },
];

const studentDashboardLinks = [
  {
    name: "Available Courses",
    path: "available_courses",
    icon: "",
  },
  {
    name: "Registered Courses",
    path: "registered_courses",
    icon: "",
  },

  {
    name: "Lectures",
    path: lectures,
    icon: "fas fa-user-plus",
  },
  {
    name: "Examinations",
    path: examinations,
    icon: "fas fa-user-plus",
  },
  {
    name: "Grades",
    path: grades,
    icon: "",
  },
  {
    name: "Announcements",
    path: announcements,
    icon: "fas fa-user-plus",
  },
  {
    name: "Messages",
    path: messages,
    icon: "fas fa-users",
  },
  {
    name: "Fee Payments",
    path: fee_payments,
    icon: "",
  },
  {
    name: "Personal Information",
    path: personal_info,
    icon: "fas fa-user-plus",
  },
];

const lecturerDashboardLinks = [
  {
    name: "View Lectures",
    path: view_lectures,
    icon: "fas fa-users",
  },
  {
    name: "View Courses",
    path: view_courses,
    icon: "fas fa-users",
  },

  {
    name: "View Announcements",
    path: announcements,
    icon: "fas fa-users",
  },
  {
    name: "Messages",
    path: messages,
    icon: "fas fa-users",
  },
  {
    name: "Personal Info",
    path: update_personal_info,
    icon: "fas fa-users",
  },
];

export const getDashboardLinks = (role: string) => {
  switch (role) {
    case "admin":
      return adminDashboardLinks;
    case "student":
      return studentDashboardLinks;
    case "lecturer":
      return lecturerDashboardLinks;
    default:
      return [];
  }
};
