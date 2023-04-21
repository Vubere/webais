import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import * as routes from "../../../constants/routes"
import { base } from "../../../App"



export default function AssignedCourses() {

  const [courses, setCourses] = useState<assigned_course[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
 
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch(base+'/assign_course')
      .then(res => res.json())
      .then((data: any) => {
        if (data?.ok) {
          setCourses(data.data)
          setLoading(false)
        }else{
          throw new Error(data?.message||'something went wrong')
        }
      })
      .catch(err => {
        console.log(err)
        setLoadError(err.message)
        setLoading(false)
      })

  }, [])
  const SearchCourses = courses.filter(course => course.title.toLowerCase().includes(search.toLowerCase()) || course.code.toLowerCase().includes(search.toLowerCase()) || course.session.toLowerCase().includes(search.toLowerCase()) || course.assigned_lecturers.toLowerCase().includes(search.toLowerCase()))
  if (loading) {
    return (
      <div>
        <h3 className="font-[600] text-[#347836] text-[28px] text-center leading-[40px]">Assigned Courses</h3>
        <p>Loading...</p>
      </div>
    )
  }
  return (
    <div className="p-3 h-[90vh] overflow-y-auto pb-20">
      <h3 className="font-[600] text-[#347836] text-[28px] text-center leading-[40px]">Department Assigned Courses</h3>
      <div className="w-full overflow-y-auto">

        {loadError && <p className="text-red-500">{loadError}</p>}
        {courses.length !== 0 ? (
          <table className="shadow-lg bg-white border-separate max-w-[100vw] overflow-auto ">
            <thead>
              <tr >
                <th className="bg-[#34783644]  border text-left px-4 py-2">Title</th>
                <th className="bg-[#34783644] border text-left px-4 py-2">Description</th>
                <th className="bg-[#34783644] border text-left px-4 py-2">Code</th>
                <th className="bg-[#34783644] border text-left px-4 py-2">Units</th>
                <th className="bg-[#34783644] border text-left px-4 py-2">Type</th>
                <th className="bg-[#34783644] border text-left px-4 py-2">Level</th>
                <th className="bg-[#34783644] border text-left px-4 py-2">Departments</th>
                <th className="bg-[#34783644] border text-left px-4 py-2">Session</th>
                <th className="bg-[#34783644] border text-left px-4 py-2">Semester</th>
                <th className="bg-[#34783644] border text-left px-4 py-2">Registration</th>
                <th className="bg-[#34783644] border text-left px-4 py-2">Grading</th>

                <th className="bg-[#34783644] border text-left px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {SearchCourses.map((course) => (
                <tr key={course.id}>
                  <td className="border px-4 py-2">{course.title}</td>
                  <td className="border px-4 py-2">{course.description} </td>
                  <td className="border px-4 py-2">{course.code}</td>
                  <td className="border px-4 py-2">{course.units}</td>
                  <td className="border px-4 py-2">{course.type}</td>
                  <td className="border px-4 py-2">{course.level}</td>
                  <td className="border px-4 py-2">{course.departments.length}</td>
                  <td className="border px-4 py-2">{course.session}</td>
                  <td className="border px-4 py-2">{course.semester}</td>
                  <td className="border px-4 py-2">{course.registration_open?'open':'closed'}</td>
                  <td className="border px-4 py-2">{course.grading_open?'open':'closed'}</td>
                  <td className="border px-4 py-2">
                    <Link to={`/dashboard-admin/${routes.assigned_courses}/${course.id}`} className="border text-[#fff] bg-[#346837] px-3 py-1 rounded-[5px]">View</Link>
                    <Link to={`/dashboard-admin/${routes.update_assigned_course}/${course.id}`} className="border text-[#fff] bg-[#346837] px-3 py-1 rounded-[5px]">Update</Link>
                  </td>
                </tr>

              ))}
            </tbody>

          </table>
        ) : <p>No courses found</p>}
      </div>
    </div>
  )
}

export interface assigned_course {
  id: number,
  course_id: number,
  code: string,
  title: string,
  description: string,
  session: string,
  semester: number,
  level: number,
  departments: string[],
  units: number,
  type: string,
  registration_open: boolean,
  grading_open: boolean,
  assigned_lecturers: any
}