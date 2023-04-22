import { useContext, useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { course } from "../Creating/CreateCourse"
import * as routes from "../../../constants/routes"
import { SessionContext } from "../../../layouts/DashboardLayout"
import useFacultiesAndDepartments from "../../../hooks/useFacultiesAndDepartments"
import { base } from "../../../App"
import { assigned_course } from "./ViewAssignedCourses"


export default function ViewSingleCourse() {
  const [courseDetails, setCourseDetails] = useState<course>()
  const [assigned, setAssigned] = useState<assigned_course[]>();
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [pageLoadError, setPageLoadError] = useState('')
  const { id } = useParams()



  useEffect(() => {
    setLoading(true)
    fetch(base + '/courses?id=' + id)
      .then((res) => res.json())
      .then(result => {
        if (result?.ok == 1) {
          setCourseDetails(result?.data[0])
          setAssigned(result?.assigned)
        } else {
          throw new Error(result?.message || 'something went wrong')
        }
        setLoading(false)
      })
      .catch(err => {
        alert(err?.message || 'something went wrong')
        setPageLoadError(err?.message || 'something went wrong')
        setLoading(false)
      })
    fetch(base + '/assign_course?course_id=' + id)
      .then(res => res.json())
      .then((data: any) => {
        if (data?.ok) {
          console.log(data)
          setAssigned(data.data)
          setLoading(false)
        } else {
          throw new Error(data?.message || 'something went wrong')
        }
      })
      .catch(err => {
        alert(err?.message || 'failed to fetch assigned courses')
        setLoading(false)
      })
  }, [])
  const navigate = useNavigate()


  const delete_course = async (e: any) => {
    e.preventDefault()
    const check = confirm('Are you sure you want to delete this course?');
    if (check) {
      try {
        const formData = new FormData()
        formData.append('id', id as string)
        formData.append('method', 'DELETE')

        const req = await fetch(base + '/courses', {
          method: 'POST',
          body: formData
        })
        const res = await req.json();
        if (res.ok == 1) {
          alert('course deleted')
          navigate(-1)
        } else {
          throw new Error(res?.message || 'something went wrong')
        }
      } catch (err: any) {
        setError(err?.message)
        alert(err?.message)
      }
    }
  }



  return (
    <section className="h-[90vh] overflow-auto p-3 pb-20 ">
      {
        courseDetails&&
        <Link to={routes.dashboard + '-' + 'admin' + '/assign_course/' + courseDetails?.id}>
          <button className='bg-[#347836] text-[#fff] text-[14px] p-1 px-2 rounded-[5px] w-[140px] m-1 mx-auto '>
            Assign To Department
          </button>
        </Link>
      }
      {loading && <p>Loading...</p>}
      {courseDetails && (<div className="flex flex-col items-center w-full">
        <h2 className="text-[#347836] text-[22px] font-[500]">{courseDetails.title}</h2>
        <p className="max-w-[400px]">{courseDetails.description}</p>
      </div>
      )}
      {error && <p>{error}</p>}
      {pageLoadError && <p>{pageLoadError}</p>}
      {(!assigned || !assigned?.length) && (
        <div className="flex flex-col items-center">
          <p className="text-[#347836] text-[18px] font-[500]">Course not assigned to any department</p>
        </div>
      )}
      {!!assigned?.length && (<h4 className="w-full text-[20px] text-[#346837] text-center">Assigned As</h4>)}
      {!!assigned?.length && (
        <div className="max-w-full overflow-auto">
          <table className="shadow-lg bg-white border-separate max-w-[100vw] overflow-auto ">

            <thead>
              <tr >
                <th className="bg-[#34783644] border text-left px-4 py-2">Code</th>
                <th className="bg-[#34783644] border text-left px-4 py-2">Units</th>
                <th className="bg-[#34783644] border text-left px-4 py-2">Type</th>
                <th className="bg-[#34783644] border text-left px-4 py-2">Level</th>
                <th className="bg-[#34783644] border text-left px-4 py-2">Departments</th>
                <th className="bg-[#34783644] border text-left px-4 py-2">Session</th>
                <th className="bg-[#34783644] border text-left px-4 py-2">Semester</th>
                <th className="bg-[#34783644] border text-left px-4 py-2">Registration Open</th>
                <th className="bg-[#34783644] border text-left px-4 py-2">Grading Open</th>
                <th className="bg-[#34783644] border text-left px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {assigned.map((course) => (
                <tr key={course.id}>

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
        </div>
      )}

    </section>
  )
}


export const Lecturers = ({ lecturer }: { lecturer: any }) => {
  const { id, assigned_departments } = lecturer
  const [lecturerDetails, setLecturerDetails] = useState<any>()

  useEffect(() => {
    fetch(base + '/lecturers?id=' + id)
      .then(res => res.json())
      .then(result => setLecturerDetails(result.lecturer[0]))
  }, [])


  return (
    <li className="m-3">
      <h5 className="font-[500] text-[#347836] text-[18px]">{lecturerDetails?.firstName} {lecturerDetails?.lastName} ({lecturerDetails?.id})</h5>

      <h6 className="font-[400] text-[#347836] text-[16px]">Assigned Departments</h6>
      <ul>
        {assigned_departments.map((item: string) => <li>{item}</li>)}
      </ul>
    </li>
  )
}