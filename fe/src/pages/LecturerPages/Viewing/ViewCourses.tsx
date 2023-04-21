import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { base, UserContext } from "../../../App";
import { SessionContext } from "../../../layouts/DashboardLayout";
import { Course } from "../../StudentPages/AvailableCourses";
import { assigned_course } from "../../adminPages/Viewing/ViewAssignedCourses";



export default function ViewCourses() {
  const [courses, setCourses] = useState<assigned_course[]>([]);
  const { user } = useContext(UserContext)
  const session = useContext(SessionContext)
  const [sess, setSess] = useState('')
  const [current_semester, setCurrent_semester] = useState<number | string>('')

  useEffect(() => {
    if (session?.session?.session) {
      setSess(session?.session?.session)
      setCurrent_semester(session?.session?.current_semester)
    }
  }, [session?.session?.session])

  useEffect(() => {
    if (user?.id&&sess&&current_semester) {
      fetch(base + '/assign_course?lecturer_id=' + user.id + '&session=' + sess + '&semester=' + current_semester)
        .then(res => res.json())
        .then(res => {
          console.log(res)
          if (res.ok = 1) {
            setCourses(res.data)
          }
        }).catch(err => {
          console.log(err)
        })
    }
  }, [user?.id, sess, current_semester])



  const year = new Date().getFullYear()

  return (
    <section className="p-3 h-[90vh] overflow-y-auto pb-20">
      <h3 className="font-[600] text-[#347836] text-[28px] text-center leading-[40px] p-3">Assigned Courses</h3>
      <div className="flex gap-2 p-2">
        <select className="border border-[#347836] rounded-md p-2 m" value={sess} onChange={(e) => setSess(e.target.value)}>
          <option value="">Select Session</option>
          <option value={year + '/' + (year + 1)}>{year + '/' + (year + 1)}</option>
          <option value={(year - 1) + '/' + year}>{(year - 1) + '/' + year}</option>
          <option value={(year - 2) + '/' + (year - 1)}>{(year - 2) + '/' + (year - 1)}</option>
          <option value={(year - 3) + '/' + (year - 2)}>{(year - 3) + '/' + (year - 2)}</option>
          <option value={(year - 4) + '/' + (year - 3)}>{(year - 4) + '/' + (year - 3)}</option>
        </select>
        <select className="border border-[#347836] rounded-md p-2" value={current_semester} onChange={(e) => setCurrent_semester(e.target.value)}>
          <option value="">Select Semester</option>
          <option value="1">First Semester</option>
          <option value="2">Second Semester</option>
        </select>
      </div>
      {courses && !courses.length && <p className="text-center">No courses assigned</p>}
      <div className="w-full overflow-x-auto">

        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="bg-[#34783644]  border text-left px-4 py-2">Code</th>
              <th className="bg-[#34783644]  border text-left px-4 py-2">Title</th>
              <th className="bg-[#34783644]  border text-left px-4 py-2">Unit</th>
              <th className="bg-[#34783644]  border text-left px-4 py-2">Semester</th>
              <th className="bg-[#34783644]  border text-left px-4 py-2">Departments</th>
              <th className="bg-[#34783644]  border text-left px-4 py-2">Grading</th>
              <th className="bg-[#34783644]  border text-left px-4 py-2">View</th>
            </tr>
          </thead>
          <tbody>
            {courses && courses?.map(item => (
              <CourseRow key={item.id} course={item} session={session} />
            ))}
          </tbody>
        </table>
      </div>

    </section>
  )
}


const CourseRow = ({ course, session }: { course: assigned_course, session: any }) => {


  return (
    <>
      {
        course &&
        <tr>
          <td className="border px-4 py-2">{course.code.toUpperCase()}</td>

          <td className="border px-4 py-2">{course.title}</td>

          <td className="border px-4 py-2">{course.units}</td>

          <td className="border px-4 py-2">{course.semester}</td>
          <td className="border px-4 py-2">{course.departments.length}</td>
          <td className="border px-4 py-2">{course.grading_open ? 'open' : 'closed'}</td>
          <td className="border px-4 py-2">
            <Link to={'/dashboard-lecturer/view-courses/' + course.id}>
              <button className="bg-[#347836] text-white px-4 py-2 rounded-md">View</button>
            </Link>
          </td>
        </tr>
      }
    </>
  )
}