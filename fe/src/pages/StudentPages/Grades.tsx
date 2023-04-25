import { useContext, useState, useEffect } from "react";

import { base, UserContext } from "../../App";
import { SessionContext } from "../../layouts/DashboardLayout";

import { Course } from "./AvailableCourses";

export default function Grades() {
  const [courses, setCourses] = useState<Course[]>([]);
  const { user } = useContext(UserContext)
  const Session = useContext(SessionContext)
  const [session, setSession] = useState<{
    session: string,
    current_semester: string|number
  }>({
    session: '',
    current_semester: ''
  })
  const [loading, setLoading] = useState(true)
  const [exams, setExams] = useState<any[]>([])


  useEffect(()=>{
    if(Session?.session?.session){
      setSession({
        session: Session?.session?.session,
        current_semester: Session?.session?.current_semester
      })
    }

  },[Session?.session?.session])

  useEffect(() => {

    if (session.session&& session.current_semester && user) {


      fetch(base + '/student_registered_courses?student_id=' + user.id + '&semester=' + session.current_semester + '&session=' + session.session)
        .then(res => res.json())
        .then(res => {
          if (res.ok == 1) {
            setCourses(res.details)
          } else {
            throw new Error('failed to fetch courses')
          }
        }).catch(err => {
          console.log(err)
        })
    }
  }, [session.session, session.current_semester])

  const year = new Date().getFullYear()

  return (
    <div className="p-2 h-[90vh] overflow-y-auto w-full pb-20">
      <h3 className="font-[600] text-[#347836] text-[28px] text-center leading-[40px]">Grades</h3>
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <label htmlFor="session">Session</label>
          <select name="session" value={session.session} id="session" className="border border-[#347836] rounded-md p-2" onChange={e => setSession({...session, session: e.target.value})}>
            <option value="">Select Session</option>
            <option value={year + '/' + (year + 1)}>{year + '/' + (year + 1)}</option>
            <option value={(year - 1) + '/' + year}>{(year - 1) + '/' + year}</option>
            <option value={(year - 2) + '/' + (year - 1)}>{(year - 2) + '/' + (year - 1)}</option>
            <option value={(year - 3) + '/' + (year - 2)}>{(year - 3) + '/' + (year - 2)}</option>
            <option value={(year - 4) + '/' + (year - 3)}>{(year - 4) + '/' + (year - 3)}</option>
          </select>
        </div>
        <div className="flex  flex-col">
          <label htmlFor="semester">Semester</label>
          <select name="semester" value={session.current_semester} id="semester" className="border border-[#347836] rounded-md p-2" onChange={e => setSession({...session, current_semester:parseInt(e.target.value)})}>
            <option value="">Select Semester</option>
            <option value={1}>First Semester</option>
            <option value={2}>Second Semester</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
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
              courses.map((course) => <GradeRow key={course.course_id} course={course} session={session.session} student_id={user.id} />)
            }
          </tbody>
        </table>
      </div>

    </div>
  )
}


const GradeRow = ({ course, session, student_id }: { course: Course, session: string | undefined, student_id: string | undefined }) => {
  const [grade, setGrade] = useState<grade>()

  useEffect(() => {
    if (session && student_id) {
      fetch(base + `/grades?student_id=${student_id}&course_id=${course.course_id}&session=${session}`)
        .then(res => res.json())
        .then(data => {
          console.log(data)
          if(data.fetch=='success'){
            setGrade(data?.result?.info[0])
          }
        })
        .catch(err => console.log(err))
    }
  }, [course.id, session, student_id])



  return (
    <tr>
      <td className="border px-4 py-2">{course.title}</td>
      <td className="border px-4 py-2">{course.code?.toUpperCase()}</td>
      <td className="border px-4 py-2">{grade?.attendance || '-'}</td>
      <td className="border px-4 py-2">{grade?.ca || '-'}</td>
      <td className="border px-4 py-2">{grade?.exam || '-'}</td>
      <td className="border px-4 py-2">{grade?.grade || '-'}</td>
    </tr>
  )
}


export type grade = {
  id: string | number,
  session: string,
  ca: string | number,
  exam: string | number,
  attendance: string | number,
  grade: string
}