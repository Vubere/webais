import { useContext, useState, useEffect } from "react";

import { UserContext } from "../../App";
import { SessionContext } from "../../layouts/DashboardLayout";

import { Course } from "./AvailableCourses";

export default function Grades() {
  const [courses, setCourses] = useState<Course[] | []>([]);
  const { user } = useContext(UserContext)
  const Session = useContext(SessionContext)
  const [session, setSession] = useState({
    semester: '',
    session: ''
  })
  const [loading, setLoading] = useState(true)
  const [exams, setExams] = useState<any[]>([])

  useEffect(() => {

    if (Session && user) {
      const userSes = session.session == '' ? Session.session.session : session.session
      const userSem = session.semester == '' ? Session.session.semester : session.semester

      fetch('http://localhost/webais/api/registered_courses?student_id=' + user.id + '&semester=' + userSem + '&session=' + userSes)
        .then(res => res.json())
        .then(res => {

          if (res.status == 200) {
            setCourses(res.data)
          }
        }).catch(err => {
          console.log(err)
        })
    }
  }, [Session, user])



  return (
    <div>
      <h3 className="font-[600] text-[#347836] text-[28px] text-center leading-[40px]">Grades</h3>
      <table className="shadow-lg bg-white border-separate max-w-[100vw] overflow-auto mx-auto">
        <thead>
          <tr >
            <th className="bg-[#34783644]  border text-left px-4 py-2">Course Title</th>
            <th className="bg-[#34783644] border text-left px-4 py-2">Course Code</th>
            <th className="bg-[#34783644] border text-left px-4 py-2">Attendance</th>
            <th className="bg-[#34783644] border text-left px-4 py-2">Continious Assessment</th>
            <th className="bg-[#34783644] border text-left px-4 py-2">Exam</th>
            <th className="bg-[#34783644] border text-left px-4 py-2">Grade</th>
          </tr>
        </thead>
        <tbody>
          {
            courses.map((course) => <GradeRow key={course.id} course={course} session= {Session?.session.session} student_id={user.id}/>)
          }
        </tbody>
      </table>
    </div>
  )
}


const GradeRow = ({ course, session, student_id }: { course: Course, session:string|undefined, student_id:string|undefined}) => {
  const [grade, setGrade] = useState<grade>()

  useEffect(()=>{
    if(session&&student_id){
      fetch(`http://localhost/webais/api/grades?student_id=${student_id}&course_id=${course.id}&session=${session}`)
      .then(res=>res.json())
      .then(data=>setGrade(data.result.info))
      .catch(err=>console.log(err))
    }
  }, [course.id, session, student_id])

  

  return (
    <tr>
      <td className="border px-4 py-2">{course.title}</td>
      <td className="border px-4 py-2">{course.code}</td>
      <td className="border px-4 py-2">{grade?.attendance||'-'}</td>
      <td className="border px-4 py-2">{grade?.ca||'-'}</td>
      <td className="border px-4 py-2">{grade?.exam||'-'}</td>
      <td className="border px-4 py-2">{grade?.grade||'-'}</td>
    </tr>
  )
}


export type grade = {
  id: string|number,
  session: string,
  ca: string|number,
  exam: string|number,
  attendance: string|number,
  grade: string
}