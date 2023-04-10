import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { UserContext } from "../../../App";
import { SessionContext } from "../../../layouts/DashboardLayout";
import { Course } from "../../StudentPages/AvailableCourses";



export default function ViewCourses() {
  const [courses, setCourses] = useState<number[]>([]);
  const { user } = useContext(UserContext)
  const session = useContext(SessionContext)


  useEffect(() => {
    if (user ) {
      const assigned_courses = JSON.parse(user?.assigned_courses)
      setCourses(assigned_courses)
      console.log(assigned_courses)
    }
  }, [user])

 


  return (
    <>
      <h3 className="font-[600] text-[#347836] text-[28px] text-center leading-[40px] p-3">Assigned Courses</h3>
      {courses && !courses.length && <p className="text-center">No courses assigned</p>}
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
            <CourseRow key={item} id={item} session={session}/>
          ))}
        </tbody>
      </table>
    </>
  )
}


const CourseRow = ({ id, session }: { id: number, session: any }) => {
  const [course, setCourse] = useState<Course>()
  const [grading, setGrading] = useState<boolean>()

  useEffect(() => {
    fetch('http://localhost/webais/api/courses?id=' + id)
      .then(res => res.json())
      .then(res => setCourse(res.data[0]))
      .catch(err => console.log(err))
  }, [id])

  useEffect(() => {
    if (session&&id) {
      const sess = session.session.session
      fetch('http://localhost/webais/api/grading?id='+id+'&session='+sess)
      .then((res)=>res.json())
      .then(res=>setGrading(!!res?.data?.grading_open))
    }
  }, [id, session])

  return (
    <>
      {
        course &&
        <tr>
          <td className="border px-4 py-2">{course.code.toUpperCase()}</td>

          <td className="border px-4 py-2">{course.title}</td>

          <td className="border px-4 py-2">{course.unit}</td>

          <td className="border px-4 py-2">{course.semester}</td>
          <td className="border px-4 py-2">{course.departments.length}</td>
          <td className="border px-4 py-2">{grading?'open':'closed'}</td>
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