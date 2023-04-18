import { useContext, useEffect, useState } from "react"
import { assigned_course } from "./ViewAssignedCourses"
import { Link, useNavigate, useParams } from "react-router-dom"
import useFacultiesAndDepartments from "../../../hooks/useFacultiesAndDepartments"
import { SessionContext } from "../../../layouts/DashboardLayout"

import * as routes from "../../../constants/routes"
import { base } from "../../../App"


export default function ViewAssignedCourse() {
  const { id } = useParams()
  const [courses, setCourses] = useState<assigned_course>()
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const { departments, faculties } = useFacultiesAndDepartments()
  console.log(departments, faculties)
  const Session = useContext(SessionContext)
  

  const [search, setSearch] = useState('')

  useEffect(() => {
    if (id)
      fetch(base+'/assign_course?id=' + id)
        .then(res => res.json())
        .then((data: any) => {
          
          if (data?.ok) {
            setCourses(data.data[0])
            setLoading(false)
          }
        })
        .catch(err => {
          alert(err?.message || 'something went wrong')
          setLoadError(err.message)
          setLoading(false)
        })

  }, [id])



  const navigate = useNavigate()

  const create_session_result_table = async () => {
    if (Session?.session) {
      try {
        //course_id, session, semester, all:boolean,
        const { session, current_semester: semester } = Session.session
        const f = new FormData()
        f.append('session', session)
        f.append('semester', semester.toString())
        f.append('all', 'true')
        f.append('course_id', id as string)

        const req = await fetch(base+'/session_result', {
          method: 'POST',
          body: f
        })
        const res = await req.json();
        if (res.status === 'success') {
          alert(res.message)
        } else {
          throw new Error(res.message)
        }
      } catch (err: any) {

        alert(err?.message)
      }
    }
  }
  const toggle_grading_open = async (bool: boolean) => {
    if (Session?.session) {
      try {
        //course_id, session, semester, all:boolean, 
        const { session, current_semester: semester } = Session.session
        const f = new FormData()
        f.append('session', session)
        f.append('all', 'false')
        f.append('bool', bool ? 'true' : 'false')
        f.append('course_id', id as string)

        const req = await fetch(base+'/grading', {
          method: 'POST',
          body: f
        })
        const res = await req.json();
        if (res.status === 'success') {
          alert(res.message)
        } else {
          throw new Error(res.message)
        }
      } catch (err: any) {

        alert(err?.message)
      }
    }
  }
  const toggle_registration_open = async (bool: boolean) => {
    if (Session?.session) {
      try {
        //course_id, session, semester, all:boolean,
        const { session, current_semester: semester } = Session.session
        const f = new FormData()
        f.append('session', session)
        f.append('semester', semester.toString())
        f.append('all', 'false')
        f.append('bool', bool ? 'true' : 'false')
        f.append('course_id', id as string)

        const req = await fetch(base+'/registration', {
          method: 'POST',
          body: f
        })
        const res = await req.json();
        console.log(res)
        if (res.status === 'success') {
          alert(res.message)
          create_session_result_table()
        } else {

          throw new Error(res.message)
        }
      } catch (err: any) {
        alert(err?.message)
      }
    }
  }

  const delete_course = async (e: any) => {
    e.preventDefault()
    const check = confirm('Are you sure you want to delete this course?');
    if (check) {
      try {

        const req = await fetch(base+'/courses', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: id
          })
        })
        const res = await req.json();
        if (res.ok == 1) {
          alert('course deleted')
          navigate(-1)
        } else {
          throw new Error(res?.message || 'something went wrong')
        }
      } catch (err: any) {

        alert(err?.message)
      }
    }
  }

  if (loading) {
    return (
      <div className="p-3">
        <h3>Course</h3>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="p-3">
      {loadError && <p>{loadError}</p>}
      {courses && (
        <div className="w-full">
          <h3 className="font-[600] text-[#347836] text-[28px] text-center leading-[40px]">{courses.title?.toUpperCase()}({courses.code.toUpperCase()})</h3>
          <p className="max-w-[400px] mx-auto text-center">{courses.description}</p>
          <ul className="max-w-[400px] mx-auto">
            <li className="text-[#346837]"> <span className="font-[600] ">Units</span>: {courses.units}</li>
            <li className="text-[#346837] capitalize"> <span className="font-[600] ">Type</span>: {courses.type}</li>
            <li className="text-[#346837]"> <span className="font-[600] ">Level</span>: {courses.level}</li>
            <li className="text-[#346837]"> <span className="font-[600] ">Semester</span>: {courses.semester}</li>
            <li className="text-[#346837]"> <span className="font-[600] ">Session</span>: {courses.session}</li>
            <li className="text-[#346837]"> <span className="block font-[600] text-[18px] text-[#346837]">Departments</span>{courses.departments.length == 0 && <p>No departments</p>} {courses.departments.map((dept: any, i) => (
              <Departments i={i} key={dept} dept={dept} departments={departments} faculties={faculties} />
            ))}</li>

            <li> <span className=" block font-[600] text-[18px] text-[#346837]">Lecturers</span> {courses.assigned_lecturers.length == 0 && <p>No assigned lecturers</p>}{courses.assigned_lecturers.map((d: any) => <Lecturers lecturer={d}/>)}</li>

          </ul>
          <div className="w-[400px] mx-auto">

            <div>
              <button className='bg-[#347836] text-[#fff] text-[14px] p-1 px-2 rounded-[5px] w-[100px] mt-5 m-2'>
                <Link to={routes.dashboard + '-' + 'admin' + '/' + routes.update_assigned_course + '/' + courses.id}>
                  Update
                </Link>
              </button>

            </div>
            <div className="mt-4">
              <h6 className="font-[700] text-[#aa4444] text-[16px]">Expensive Operations</h6>

              <button className='bg-[#aa4444] text-[#fff] text-[14px] p-1 px-2 rounded-[5px] w-[100px] mt-5 m-2' onClick={() => toggle_registration_open(true)}>
                Open Registration
              </button>
              <button className='bg-[#aa4444] text-[#fff] text-[14px] p-1 px-2 rounded-[5px] w-[100px] mt-5 m-2' onClick={() => toggle_registration_open(false)}>
                Close Registration
              </button>
            </div>
            <div className="mt-1">
              <button className='bg-[#aa4444] text-[#fff] text-[14px] p-1 px-2 rounded-[5px] w-[100px] mt-5 m-2' onClick={() => toggle_grading_open(true)}>
                Open Grading
              </button>
              <button className='bg-[#aa4444] text-[#fff] text-[14px] p-1 px-2 rounded-[5px] w-[100px] mt-5 m-2' onClick={() => toggle_grading_open(false)}>
                Close Grading
              </button>
            </div>
            <div>
              <button className='bg-[#aa4444] text-[#fff] text-[14px] p-1 px-2 rounded-[5px] w-[200px] mt-5 m-2' onClick={() => create_session_result_table()}>
                Create Result Table
              </button>
            </div>
            <div>
              {/* delete course */}
              <div className='flex flex-col'>
                <h5 className='text-[18px] text-[#aa4444] mt-10'> Delete Course</h5>
                <button className='bg-[#aa4444] text-[#fff] text-[14px] p-1 px-2 rounded-[5px] w-[220px] mt-5 m-2' onClick={delete_course}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


const Departments = ({ i, dept, faculties, departments }: { i: number, dept: number, faculties: { id: number, name: string }[], departments: { faculty_id: number, id: number, name: string }[] }) => {
  const facultyName = faculties.find(f => f.id === departments.find(d => d.id === dept)?.faculty_id)?.name
  const dapartmentName = departments.find(d => d.id === dept)?.name

  return (
    <div>
      <p>{i + 1}. {dapartmentName} (Faculty of {facultyName})</p>
    </div>
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
      <h5 className="font-[500] text-[#347836] text-[18px]">{lecturerDetails?.firstName} {lecturerDetails?.lastName} ({lecturerDetails?.discipline})</h5>

      <h6 className="font-[400] text-[#347836] text-[16px]">Assigned Departments</h6>
      <ul>
        {assigned_departments.map((item: string) => <li>{item}</li>)}
      </ul>
    </li>
  )
}