import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { UserContext } from "../../App";
import { session } from "../../constants/routes";
import { SessionContext } from "../../layouts/DashboardLayout";



export default function AvailableCourses() {
  const [availabelCourses, setAvailableCourses] = useState<Course[] | []>([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const Session = useContext(SessionContext)
  const { user } = useContext(UserContext)


  useEffect(() => {
    
    if (Session && user) {

      fetch(`http://localhost/webais/api/available_course?student_id=${user.id}&session=${Session.session.session}&semester=${Session.session.semester}&level=${user.level}&department=${user.department}&faculty=${user.faculty}`)
        .then(res => res.json())
        .then(res => {
            console.log(res)
           if (res?.data)
            setAvailableCourses(res?.data) 
          setLoading(false)
        }).catch(err => {
          if (err?.message)
            setError(err?.message)

        })
    }
  }, [Session, user])


  const RegisterCourse = (course: Course, reg:any) => {
    if(!reg){
      alert ('course registration is closed')
      return
    }
  
    if(Session && user){

      fetch('http://localhost/webais/api/course_registration', {
        method: 'POST',
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
    <section>
      <h3 className="font-[600] text-[#347836] text-[28px] text-center leading-[40px]">Available Courses</h3>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <table className="shadow-lg bg-white border-separate max-w-[100vw] overflow-auto  mx-auto">
        <thead>
          <tr>
            <th className="bg-[#34783644]  border text-left px-4 py-2">Code</th>
            <th className="bg-[#34783644]  border text-left px-4 py-2">Title</th>
            <th className="bg-[#34783644]  border text-left px-4 py-2">Unit</th>
            <th className="bg-[#34783644]  border text-left px-4 py-2">Semester</th>
            <th className="bg-[#34783644]  border text-left px-4 py-2">Registration</th>
            <th className="bg-[#34783644]  border text-left px-4 py-2">View</th>
            <th className="bg-[#34783644]  border text-left px-4 py-2">Register</th>
          </tr>
        </thead>
        <tbody>

          {!!availabelCourses.length ?availabelCourses.map((course) => <Available_course course={course} session={Session?.session?.session} RegisterCourse={RegisterCourse}/>):<p>No Course Available</p>}
        </tbody>
      </table>
    </section>
  )
}

const Available_course = ({course, session, RegisterCourse}:any) => {
  const [registration, setRegistration] = useState<boolean>(false)



  useEffect(() => {
    if (session && course.id) {
    
      fetch('http://localhost/webais/api/grading?id=' + course.id + '&session=' + session)
        .then((res) => res.json())
        .then(res => setRegistration(!!res?.data?.registration_open))
    }
  }, [course.id, session])

  return (<tr key={course.id}>
    <td className="border px-4 py-2">{course.code}</td>
    <td className="border px-4 py-2">{course.title}</td>
    <td className="border px-4 py-2">{course.unit}</td>
    <td className="border px-4 py-2">{course.semester}</td>
    <td className="border px-4 py-2">{registration?'open':'closed'}</td>
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

