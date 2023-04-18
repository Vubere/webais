import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { base, UserContext } from "../../App";
import { session } from "../../constants/routes";
import { SessionContext } from "../../layouts/DashboardLayout";
import { unitLoads } from "../adminPages/Viewing/DepartmentUnitLoads";



export default function AvailableCourses() {
  const [availabelCourses, setAvailableCourses] = useState<Course[] | []>([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const Session = useContext(SessionContext)
  const { user } = useContext(UserContext)
  const [registeredCourses, setRegisteredCourses] = useState<Course[] | []>([])

  const [allowedUnits, setAllowedUnits] = useState<unitLoads>()


  useEffect(()=>{
    if(Session?.session&&user){
      fetch(base+'/assign_unit_load?session='+Session.session.session+'&semester='+Session.session.current_semester+'&level='+user?.level+'&department_id='+user?.department+'&faculty='+user?.faculty)
      .then(res=>res.json())
      .then(data=>{
        if(data?.ok){
          setAllowedUnits(data?.data[0])
        }else{
          throw new Error(data?.message || 'something went wrong')
        }
      })
      .catch(err=>{
        alert(err?.message || 'something went wrong')
      })
    }
  },[Session?.session,user])

  useEffect(()=>{
    if(Session?.session&&user){
      fetch(base+'/student_registered_courses?student_id='+user.id+'&session='+Session.session.session+'&semester='+Session.session.current_semester)
      .then(res=>res.json())
      .then(data=>{
        if(data?.ok){
        }else{
          throw new Error(data?.message || 'something went wrong')
        }
      })
      .catch(err=>{
      })
    }
  },[Session?.session, user])

  useEffect(() => {
    if (Session?.session && user) {
      fetch(base + `/available_course?student_id=${user.id}&session=${Session.session.session}&semester=${Session.session.current_semester}&level=${user.level}&department_id=${user.department}&faculty=${user.faculty}`)
        .then(res => res.json())
        .then(res => {
          if (res?.data)
            setAvailableCourses(res?.data)
          setLoading(false)
        }).catch(err => {
          console.log(err)
          if (err?.message)
            setError(err?.message)
        })
    }
  }, [Session?.session, user])


  const RegisterCourse = (course: Course, reg: any) => {
    if (!reg) {
      alert('course registration is closed')
      return
    }

    if (Session?.session && user) {
      const f = new FormData()
      f.append('course_id', course.id)
      f.append('student_id', user.id)
      f.append('semester', Session.session.current_semester.toString())
      f.append('session', Session.session.session)

      fetch(base + '/course_registration', {
        method: 'POST',
        body: f
      }).then(res => res.json())
        .then(data => {
          console.log(data)
          alert('Course registered successfully')
        }).catch(err => {
          console.log(err)
          alert('Course registration failed')
        })
    }
  }


  return (
    <section className="p-3">
      <h3 className="font-[600] text-[#347836] text-[28px] text-center leading-[40px]">Available Courses</h3>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div className="w-full overflow-x-auto">

        <table className="shadow-lg bg-white border-separate max-w-[100vw] overflow-auto  mx-auto">
          <thead>
            <tr>
              <th className="bg-[#34783644]  border text-left px-4 py-2">Code</th>
              <th className="bg-[#34783644]  border text-left px-4 py-2">Title</th>
              <th className="bg-[#34783644]  border text-left px-4 py-2">Units</th>
              <th className="bg-[#34783644]  border text-left px-4 py-2">Type</th>

              <th className="bg-[#34783644]  border text-left px-4 py-2">Semester</th>
              <th className="bg-[#34783644]  border text-left px-4 py-2">Registration</th>
              <th className="bg-[#34783644]  border text-left px-4 py-2">View</th>
              <th className="bg-[#34783644]  border text-left px-4 py-2">Register</th>
            </tr>
          </thead>
          <tbody>

            {!!availabelCourses.length ? availabelCourses.map((course) => <Available_course course={course} session={Session?.session?.session} RegisterCourse={RegisterCourse} />) : <tr className="" >
              <td colSpan={7}>
                No Course Available
              </td>
            </tr>}
          </tbody>
        </table>
      </div>
    </section>
  )
}

const Available_course = ({ course, session, RegisterCourse }: any) => {
  const [registration, setRegistration] = useState<boolean>(false)



  useEffect(() => {
    if (session && course.id) {

      fetch(base + '/grading?id=' + course.id + '&session=' + session)
        .then((res) => res.json())
        .then(res =>{
          if(res){
            setRegistration(false)
          }
        })
    }
  }, [course.id, session])

  return (<tr key={course.id}>
    <td className="border px-4 py-2">{course.code}</td>
    <td className="border px-4 py-2">{course.title}</td>
    <td className="border px-4 py-2">{course.units}</td>
    <td className="border px-4 py-2">{course.type}</td>
    <td className="border px-4 py-2">{course.semester}</td>
    <td className="border px-4 py-2">{registration ? 'open' : 'closed'}</td>
    <td className="border px-4 py-2"><Link to={`/dashboard-student/view-course/${course.id}`} className=" text-[#347836] underline font-[500] px-4 py-2 rounded-md">View</Link></td>
    <td className="border px-4 py-2"><button className="bg-[#347836] text-white px-4 py-2 rounded-md" onClick={() => RegisterCourse(course, registration)}>Register</button></td>
  </tr>)
}

export type Course = {
  id: string;
  code: string;
  title: string;
  unit: number;
  level: number;
  semester: number;
  departments: string[];
  faculty: string[];
  lecturer: {
    id: string;
    assigned_departments: string[];
  };
  description: string;
}

