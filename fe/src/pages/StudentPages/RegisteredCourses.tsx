import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { base, UserContext } from "../../App"
import { SessionContext } from "../../layouts/DashboardLayout";

import { Course } from './AvailableCourses'
import { session_row } from "../adminPages/Viewing/ViewSessions";

export default function RegisteredCourses() {
  const [registeredCourses, setRegisteredCourses] = useState<Course[] | []>([]);
  const { user } = useContext(UserContext)
  const Session = useContext(SessionContext)

  const [ses, setSes] = useState<session_row[]>()
  const [ses_loading, set_ses_loading] = useState(true)
  const [session, setSession] = useState<string>('')
  const [current_semester, setCurrentSemester] = useState<string | number>('')
  const [loading, setLoading] = useState(false)



  useEffect(() => {
    if (Session?.session?.session) {
      setSession(Session.session.session)
      setCurrentSemester(Session.session.current_semester)
    }
  }, [Session?.session?.session])

  useEffect(() => {
    fetch(base + '/session')
      .then(res => res.json())
      .then(data => {
        if (data.ok == 1) {
          set_ses_loading(false)
          setSes(data.data)

        } else {
          throw new Error(data.message || 'something went wrong')
        }
      })
      .catch(err => {
        alert(err.message || 'something went wrong')
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (session && current_semester && user) {
      fetch(base + '/student_registered_courses?student_id=' + user.id + '&session=' + session + '&semester=' + current_semester)
        .then(res => res.json())
        .then(data => {

          if (data?.ok) {
            setRegisteredCourses(data?.details)
          } else {
            throw new Error(data?.message || 'something went wrong')
          }
        })
        .catch(err => {
        })
    }
  }, [session, current_semester, user])

  const unregisterCourse = (course: Course) => {
    if (Session?.session && user) {

      const formData = new FormData()
      formData.append('course_id', course.id)
      formData.append('student_id', user.id)
      formData.append('semester', Session?.session.current_semester.toString())
      formData.append('session', Session.session.session)
      formData.append('method', 'POST')
      fetch(base + '/course_registration', {
        method: 'POST',
        body: formData
      }).then(res => res.json())
        .then(res => {
          if (res.status == 200) {
            alert('Course unregistered successfully')
            setRegisteredCourses(registeredCourses.filter((c) => c.id !== course.id))
          }
        }).catch(err => {
        })
    }
  }


  return (
    <div className="h-[90vh] overflow-y-auto w-full p-2 pb-20">
      <h3 className="font-[600] text-[#347836] text-[28px] text-center leading-[40px]">Registered Courses</h3>
      <div className="flex justify-between items-center my-2">
        <div className="flex flex-col">
          <label htmlFor="session">Session</label>
          <select name="session" value={session} id="session" className="border border-[#347836] rounded-md p-2" onChange={e => setSession(e.target.value)}>
            <option value="">Select Session</option>

            {ses && ses.map((s) => {
              return (
                <option key={s.session} value={s.session}>{s.session}</option>
              )
            })}
          </select>
        </div>
        <div className="flex  flex-col">
          <label htmlFor="semester">Semester</label>
          <select name="semester" value={current_semester} id="semester" className="border border-[#347836] rounded-md p-2" onChange={e => setCurrentSemester(parseInt(e.target.value))}>
            <option value="">Select Semester</option>
            <option value={1}>First Semester</option>
            <option value={2}>Second Semester</option>
          </select>
        </div>
      </div>
      <div className="w-full overflow-x-auto">

        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="bg-[#34783644]  border text-left px-4 py-2">Code</th>
              <th className="bg-[#34783644]  border text-left px-4 py-2">Title</th>
              <th className="bg-[#34783644]  border text-left px-4 py-2">Unit</th>
              <th className="bg-[#34783644]  border text-left px-4 py-2">Semester</th>
              <th className="bg-[#34783644]  border text-left px-4 py-2">View</th>
            </tr>
          </thead>
          <tbody>

            {registeredCourses.length ? registeredCourses.map((course) => (<tr key={course.course_id}>
              <td className="border px-4 py-2">{course.code?.toUpperCase()}</td>
              <td className="border px-4 py-2">{course.title}</td>
              <td className="border px-4 py-2">{course.units}</td>
              <td className="border px-4 py-2">{course.semester}</td>
              <td className="border px-4 py-2"><Link to={`/dashboard-student/view-course/${course.course_id}`} className=" text-[#347836] underline font-[500] px-4 py-2 rounded-md">View</Link></td>

            </tr>)) : <p>No registered course</p>}
          </tbody>
        </table>
      </div>

    </div>
  )
}