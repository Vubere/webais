import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { UserContext } from "../../App"
import { SessionContext } from "../../layouts/DashboardLayout";

import { Course } from "./AvailableCourses";

export default function RegisteredCourses() {
  const [registeredCourses, setRegisteredCourses] = useState<Course[] | []>([]);
  const { user } = useContext(UserContext)
  const Session = useContext(SessionContext)
  const [session, setSession] = useState({ semester: '', session: '' })

  useEffect(() => {

    if (Session && session && user) {
      const userSes = session.session == '' ? Session.session.session : session.session
      const userSem = session.semester == '' ? Session.session.semester : session.semester
    
      fetch('http://localhost/webais/api/registered_courses?student_id=' + user.id + '&semester=' + userSem + '&session=' + userSes)
        .then(res => res.json())
        .then(res => {
        
          if (res.status == 200) {
            setRegisteredCourses(res.data)
          }
        }).catch(err => {
          console.log(err)
        })
    }
  }, [Session, user])

  const unregisterCourse = (course: Course) => {
    if (Session && user) {
      fetch('http://localhost/webais/api/course_registration', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          course_id: course.id,
          student_id: user.id,
          semester: Session.session.semester,
          session: Session.session.session
        })
      }).then(res => res.json())
        .then(res => {
          if (res.status == 200) {
            alert('Course unregistered successfully')
            setRegisteredCourses(registeredCourses.filter((c) => c.id !== course.id))
          }
        }).catch(err => {
          console.log(err)
        })
    }
  }
  


  return (
    <div>
      <h3 className="font-[600] text-[#347836] text-[28px] text-center leading-[40px]">Registered Courses</h3>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="bg-[#34783644]  border text-left px-4 py-2">Code</th>
            <th className="bg-[#34783644]  border text-left px-4 py-2">Title</th>
            <th className="bg-[#34783644]  border text-left px-4 py-2">Unit</th>
            <th className="bg-[#34783644]  border text-left px-4 py-2">Semester</th>
            <th className="bg-[#34783644]  border text-left px-4 py-2">View</th>
            <th className="bg-[#34783644]  border text-left px-4 py-2">Unregister</th>

          </tr>
        </thead>
        <tbody>

          {registeredCourses.length ? registeredCourses.map((course) => (<tr key={course.id}>
            <td className="border px-4 py-2">{course.code}</td>
            <td className="border px-4 py-2">{course.title}</td>
            <td className="border px-4 py-2">{course.unit}</td>
            <td className="border px-4 py-2">{course.semester}</td>
            <td className="border px-4 py-2"><Link to={`/dashboard-student/view-course/${course.id}`} className=" text-[#347836] underline font-[500] px-4 py-2 rounded-md">View</Link></td>
            <td className="border px-4 py-2"><button className="bg-[#347836] text-white px-4 py-2 rounded-md" onClick={() => unregisterCourse(course)}>Unregister</button></td>

          </tr>)) : <p>No registered course</p>}
        </tbody>
      </table>
    </div>
  )
}