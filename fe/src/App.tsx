import { useState, lazy, Suspense, createContext } from 'react'
import { Route, Routes } from 'react-router'
import { BrowserRouter } from 'react-router-dom'

/* contant */
import * as routes from '../../fe/src/constants/routes'
import { getDashboardLinks } from '../../fe/src/constants/routes'


/* images */
import admin from "./assets/admin.png"
import student from "./assets/student.png"
import lecturer from "./assets/lecturer.png"

/* components */
import NotFound from './pages/NotFound'
import LandingLayout from '../../fe/src/layouts/LandingPageLayout'
import Login from './pages/Login'
import DashboardLayout from '../../fe/src/layouts/DashboardLayout'


export const base:string = import.meta.env.VITE_API

console.log(base)

/* lazy imported components */
const LandingPage = lazy(() => import('./pages/LandingPage'))

/* admin components */
const AdminDashboard = lazy(() => import('./pages/adminPages/Dashboard'))
const UserManagement = lazy(() => import('./pages/adminPages/UsersManagement'))
const CourseManagement = lazy(() => import('./pages/adminPages/CourseManagement'))
const ExaminationManagement = lazy(() => import('./pages/adminPages/ExaminationManagement'))
const LectureManagement = lazy(() => import('./pages/adminPages/LectureManagement'))
const FeeManagement = lazy(() => import('./pages/adminPages/FeesManagement'))



const CreateAdmin = lazy(() => import('./pages/adminPages/Creating/CreateAdmin'))
const CreateStudent = lazy(() => import('./pages/adminPages/Creating/CreateStudent'))
const CreateLecturer = lazy(() => import('./pages/adminPages/Creating/CreateLecturer'))
const CreateCourse = lazy(() => import('./pages/adminPages/Creating/CreateCourse'));
const CreateLectures = lazy(() => import('./pages/adminPages/Creating/CreateLectures'));
const CreateExam = lazy(() => import('./pages/adminPages/Creating/CreateExam'));
const CreateFaculty = lazy(() => import('./pages/adminPages/Creating/CreateFaculty'));
const CreateAnnouncements = lazy(() => import('./pages/adminPages/Creating/CreateAnnoucements'));
const CreateFee = lazy(() => import('./pages/adminPages/Creating/CreateFee'));
const AssignCoursesToDepartments = lazy(() => import('./pages/adminPages/Creating/AssignCourseToDepartments'));
const AssignUnitsToDepartment = lazy(() => import('./pages/adminPages/Creating/AssignUnitsToDepartment'));


const ViewAdmin = lazy(() => import('./pages/adminPages/Viewing/ViewAdmin'))
const ViewStudents = lazy(() => import('./pages/adminPages/Viewing/ViewStudents'))
const ViewLecturers = lazy(() => import('./pages/adminPages/Viewing/ViewLecturer'))
const ViewCourses = lazy(() => import('./pages/adminPages/Viewing/ViewCourses'))
const ViewLectures = lazy(() => import('./pages/adminPages/Viewing/ViewLectures'))
const ViewExams = lazy(() => import('./pages/adminPages/Viewing/ViewExams'))
const ViewFaculties = lazy(() => import('./pages/adminPages/Viewing/ViewFaculties'))
const ViewAnnouncements = lazy(() => import('./pages/adminPages/Viewing/ViewAnnouncements'))
const ViewSingleAnnouncement = lazy(() => import('./pages/adminPages/Viewing/ViewSingleAnnouncement'))
const ViewSingleCourse = lazy(()=>import('./pages/adminPages/Viewing/ViewSingleCourse'))
const ViewFeePayments = lazy(()=>import('./pages/adminPages/Viewing/ViewFeePayments'))
const ViewAssignedCourses = lazy(()=>import('./pages/adminPages/Viewing/ViewAssignedCourses'))
const ViewSingleAssignedCourse = lazy(()=>import('./pages/adminPages/Viewing/ViewSingleAssignedCourse'))
const DepartmentUnitLoads = lazy(()=>import('./pages/adminPages/Viewing/DepartmentUnitLoads'))

const UpdateAdmin = lazy(() => import('./pages/adminPages/Updating/UpdateAdmin'));
const UpdateStudent = lazy(() => import('./pages/adminPages/Updating/UpdateStudent'));
const UpdateLecturer = lazy(() => import('./pages/adminPages/Updating/UpdateLecturer'));
const UpdateCourse = lazy(() => import('./pages/adminPages/Updating/UpdateCourse'));
const UpdateLecture = lazy(() => import('./pages/adminPages/Updating/UpdateLectures'));
const UpdateExam = lazy(() => import('./pages/adminPages/Updating/UpdateExam'));
const UpdateFaculty = lazy(() => import('./pages/adminPages/Updating/UpdateFaculty'));
const UpdateDepartment = lazy(() => import('./pages/adminPages/Updating/UpdateDepartment'));
const UpdateFee = lazy(() => import('./pages/adminPages/Updating/UpdateFee'));
const PersonalInfoAdmin = lazy(() => import('./pages/adminPages/Updating/PersonalInfo'));
const UpdateAssignedCourse = lazy(()=>import('./pages/adminPages/Updating/UpdateAssignedCourse'))
const EditUnitLoad = lazy(()=>import('./pages/adminPages/Updating/EditDepartmentUnitLoad'))


const Session = lazy(()=>import('./pages/adminPages/Session'));


/* lecturer pages */

const LrViewLectures = lazy(() => import('./pages/LecturerPages/Viewing/ViewLectures'));
const LrViewSingleLecture = lazy(() => import('./pages/LecturerPages/Viewing/ViewSingleLecture'));
const LrViewCourses = lazy(()=> import('./pages/LecturerPages/Viewing/ViewCourses'))
const LrViewSingleCourse = lazy(()=>import('./pages/LecturerPages/Viewing/ViewSingleCourse'))
const LrResultSheet = lazy(()=>import('./pages/LecturerPages/Updating/ResultSheet'))
const LrAnnouncement = lazy(()=>import('./pages/LecturerPages/Viewing/Announcements'))
const LrPersonalInfo = lazy(()=>import('./pages/LecturerPages/Updating/PersonalInfo'))
const LrDashboard = lazy(()=>import('./pages/LecturerPages/Dashboard'))

/* Student Pages */
const StAvailableCourses = lazy(() => import('./pages/StudentPages/AvailableCourses'));
const StRegisteredCourses = lazy(() => import('./pages/StudentPages/RegisteredCourses'));
const StViewCourse = lazy(() => import('./pages/StudentPages/ViewCourse'));
const StLectures = lazy(() => import('./pages/StudentPages/Lectures'));
const StExaminations = lazy(()=>import('./pages/StudentPages/Examinations'));
const StGrades = lazy(()=>import('./pages/StudentPages/Grades'));
const StPersonalInfo = lazy(()=>import('./pages/StudentPages/PersonalInformation'));
const StAnnouncements = lazy(()=>import('./pages/StudentPages/Announcements'));
const StSingleAnnouncement = lazy(()=>import('./pages/StudentPages/SingleAnnouncement'));
const StDashboard = lazy(()=>import('./pages/StudentPages/Dashboard'));
const StFeePayment = lazy(()=>import('./pages/StudentPages/FeePayment'));
const StGenerateInvoice = lazy(()=>import('./pages/StudentPages/GenerateInvoice'));
const StConfirmPayment = lazy(()=>import('./pages/StudentPages/ConfirmPayment'));
const StPayments = lazy(()=>import('./pages/StudentPages/Payments'));
const StGenerateReceipt = lazy(()=>import('./pages/StudentPages/GenerateReceipt'));

const Chat = lazy(()=>import('./pages/Chat'));
const Messages = lazy(()=>import('./pages/Messages'));


/* user context */
export const UserContext = createContext<any>({})

function App() {
  const [user, setUser] = useState<any>({})

  return (
    <div className="App max-w-[1640px] m-auto">
      <UserContext.Provider value={{ user, setUser }}>

        <Suspense fallback={<div>Loading...</div>}>
          <BrowserRouter>
            <Routes>

              {/* landing page and login pages */}
              <Route path='/' element={<LandingLayout />}>
                <Route index element={<LandingPage />} />
                <Route path={routes.admin_login} element={<Login title='admin' src={admin} />} />
                <Route path={routes.student_login} element={<Login title='student' src={student} />} />
                <Route path={routes.lecturer_login} element={<Login title='lecturer' src={lecturer} />} />
              </Route>


              {/* dashboard pages */}
              {/* ADMIN */}
              <Route path={routes.dashboard + '-' + routes.admin} element={<DashboardLayout title='admin' DashboardLinks={getDashboardLinks('admin')} />}>
                <Route index element={<AdminDashboard/>} />

                <Route path={routes.users_management} element={<UserManagement />} />
                <Route path={routes.examination_management} element={<ExaminationManagement />} />
                <Route path = {routes.lecture_management} element={<LectureManagement/>}/>
                <Route path={routes.course_management} element={<CourseManagement />} />
                <Route path={routes.fee_management} element={<FeeManagement />} />

                {/* create */}

                <Route path={'create-admin'} element={<CreateAdmin />} />
                <Route path={'create-student'} element={<CreateStudent />} />
                <Route path={'create-lecturer'} element={<CreateLecturer />} />
                <Route path= {'create-fee'} element={<CreateFee/>}/>
                <Route path={'create-course'} element={<CreateCourse />} />
                <Route path={routes.create_lectures} element={<CreateLectures />} />
                <Route path={routes.create_exam} element={<CreateExam />} />
                <Route path={routes.create_faculty} element={<CreateFaculty />} />
                <Route path={routes.create_announcement} element={<CreateAnnouncements />} />
                <Route path={'assign_course/:id'} element={<AssignCoursesToDepartments/>}/>
                <Route path={'assign_units'} element={<AssignUnitsToDepartment/>}/>


                {/* view */}
                <Route path={routes.view_admin} element={<ViewAdmin />} />
                <Route path={routes.view_students} element={<ViewStudents />} />
                <Route path={routes.view_lecturer} element={<ViewLecturers />} />
                <Route path={routes.view_course} element={<ViewCourses />} />
                <Route path={routes.view_course+'/:id'} element={<ViewSingleCourse/>}/>
                <Route path={routes.view_lectures} element={<ViewLectures />} />
                <Route path={routes.view_exam} element={<ViewExams />} />
                <Route path={routes.view_announcement} element={<ViewAnnouncements />} />
                <Route path={`${routes.view_announcement}/:id`} element={<ViewSingleAnnouncement />} />
                <Route path={routes.view_faculty} element={<ViewFaculties />} />
                <Route path={routes.fee_payments} element={<ViewFeePayments/>}/>
                <Route path={routes.assigned_courses} element={<ViewAssignedCourses/>}/>
                <Route path={routes.assigned_courses+'/:id'} element={<ViewSingleAssignedCourse/>}/>
                <Route path={routes.unit_distribution} element={<DepartmentUnitLoads/>}/>
                
                {/* update */}
                <Route path={`${routes.update_admin}/:id`} element={<UpdateAdmin />} />
                <Route path={`${routes.update_student}/:id`} element={<UpdateStudent />} />
                <Route path={`${routes.update_lecturer}/:id`} element={<UpdateLecturer />} />
                <Route path={`${routes.update_course}/:id`} element={<UpdateCourse />} />
                <Route path={`${routes.update_lectures}/:id`} element={<UpdateLecture />} />
                <Route path={`${routes.update_exams}/:id`} element={<UpdateExam />} />
                <Route path={`${routes.update_faculty}/:id`} element={<UpdateFaculty />} />
                <Route path={`${routes.update_department}/:id`} element={<UpdateDepartment />} />
                <Route path={`${routes.personal_info}`} element={<PersonalInfoAdmin />} />
                <Route path={'update-fee/:id'} element={<UpdateFee/>}/>
                <Route path = {'update-assigned-course/:id'} element={<UpdateAssignedCourse/>}/>
                <Route path= {'edit-unit-load/:id'} element={<EditUnitLoad/>}/>

                {/* others */}
                <Route path={`${routes.session}`} element={<Session/>}/>
                <Route path="*" element={<NotFound />} />
              </Route>
              {/* lecturer */}
              <Route path={routes.dashboard + '-' + routes.lecturer} element={<DashboardLayout title='lecturer' DashboardLinks={getDashboardLinks('lecturer')} />}>
                <Route index element={<LrDashboard/>} />
                <Route path={routes.view_lectures} element={<LrViewLectures />} />
                <Route path={routes.view_courses} element={<LrViewCourses />} />
                <Route path={`${routes.view_lectures}/:id`} element={<LrViewSingleLecture />} />
                <Route path={`${routes.view_courses}/:id`} element={<LrViewSingleCourse />} />
                <Route path={`${routes.result_sheet}/:id`} element={<LrResultSheet />} />
                <Route path={routes.announcements} element={<LrAnnouncement/>}/>
                <Route path={routes.update_personal_info} element={<LrPersonalInfo/>}/>
                <Route path={routes.messages}
                element={<Messages/>}/>
                <Route path={'chat/:id'} element={<Chat />} />


                <Route path="*" element={<NotFound />} />
              </Route>

              {/* student */}

              <Route path={routes.dashboard + '-' + routes.student} element={<DashboardLayout title='student' DashboardLinks={getDashboardLinks('student')} />}>
                <Route index element={<StDashboard/>} />
                <Route path={'available_courses'} element={<StAvailableCourses />} />
                <Route path={'registered_courses'}
                element={<StRegisteredCourses/>}/>
                <Route path={`${routes.view_course}/:id`} element={<StViewCourse/>}/>
                <Route path={`${routes.lectures}`} element={<StLectures/>}/>
                <Route path={`${routes.examinations}`} element={<StExaminations/>}/>
                <Route path={routes.grades} element={<StGrades/>}/>
                <Route path={routes.personal_info} element={<StPersonalInfo/>}/>
                <Route path={routes.announcements} element={<StAnnouncements/>}/>
                <Route path={`announcement/:id`} element={<StSingleAnnouncement/>}/>
                <Route path={routes.fee_payments} element={<StFeePayment/>}/>
                <Route path={routes.generate_invoice+'/:id'} element={<StGenerateInvoice/>}/>
                <Route path={routes.confirm_payment+'/:id'} element={<StConfirmPayment/>}/>
                <Route path={routes.view_payments} element={<StPayments/>}/>
                <Route path = {routes.receipt+'/:id'} element={<StGenerateReceipt/>}/>
                

                <Route path={'chat/:id'} element={<Chat/>}/>
                <Route path={routes.messages} element={<Messages/>}/>
                <Route path={routes.view_announcements} element={<div>view announcements</div>} />
                <Route path={routes.view_courses} element={<div>view courses</div>} />
                <Route path={routes.view_lectures} element={<div>view lectures</div>} />
               
                <Route path="*" element={<NotFound />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </Suspense>
      </UserContext.Provider>
    </div>
  )
}

export default App




/* 
webais

#Administrator
  admin
    functions:
      - create admins
      - create lecturer
      - create student
      - create lectures
      - view admins
      - view and update student
      - assign lectures to lecturer
      - create courses
      - view and assign courses to lecturer
      - view and update courses
      - create faculty/departments
      - create announcement
      - open results for grading
#Lecturer
  lecturer
    functions:
      - give attendance
      - grade students
      - view students
      - view courses
      - view lectures
      - view announcements
      - view schedule
      - view results for course handled
      - update personal info
      - update password
      
#Student
  student
     functions: 
      - view attendance
      - view grades
      - view announcements
      - view courses
      - view lectures
      - view results
      - view schedule
      - update personal info
      - update password
*/
