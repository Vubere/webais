import { useContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { course } from "../adminPages/Creating/CreateCourse"
import * as routes from "../../constants/routes"
import { SessionContext } from "../../layouts/DashboardLayout"
import { base, UserContext } from "../../App"
import useFacultiesAndDepartments from "../../hooks/useFacultiesAndDepartments"



export default function ViewSingleCourse() {
  const [courseDetails, setCourseDetails] = useState<course>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [pageLoadError, setPageLoadError] = useState('')
  const { id } = useParams()
  const Session = useContext(SessionContext)
  const { user } = useContext(UserContext)
  const [registered, setRegistered] = useState(false)
  const { departments, faculties } = useFacultiesAndDepartments()


  useEffect(() => {
    setLoading(true)
    fetch(base+'/courses?id=' + id)
      .then((res) => res.json())
      .then(result => {
        if (result.ok == 1) {
          setCourseDetails(result.data[0])
        } else {
          throw new Error(result?.message || 'something went wrong')
        }
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        alert(err?.message || 'something went wrong')
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (courseDetails == undefined) return
    checkIfRegistered(courseDetails)
  }, [courseDetails])


  const unregisterCourse = (course: course) => {
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
          }
        }).catch(err => {
          console.log(err)
        })
    }
  }
  const RegisterCourse = (course: course) => {
    if (Session && user) {
      const f = new FormData()
      f.append('course_id', course.id?.toString() as string)
      f.append('student_id', user.id)
      f.append('semester', Session.session.semester)
      f.append('session', Session.session.session)

      fetch('http://localhost/webais/api/course_registration', {
        method: 'POST',
        body: f
      }).then(res => res.json())
        .then(data => {

          alert('Course registered successfully')
        }).catch(err => {
          console.log(err)
          alert('Course registration failed')
        })
    }
  }

  const checkIfRegistered = (course: course) => {
    if (Session && user) {
      fetch('http://localhost/webais/api/course_registration?course_id=' + course.id + '&student_id=' + user.id + '&semester=' + Session.session.semester + '&session=' + Session.session.session)

        .then(res => res.json())
        .then(data => {

          if (data.ok == 1) {

            setRegistered(true)
          } else {
            setRegistered(false)
          }
        }).catch(err => {
          alert('error fetching registration status')
        })
    } else {
      return false
    }
  }


  return (
    <section className="h-[90vh] overflow-auto p-3 pb-20 ">
      {loading && courseDetails == undefined ? <p>loading...</p> : pageLoadError == '' ?
        <>
          {courseDetails != undefined && (
            <div className="w-full flex items-center flex-col">
              <h3 className="font-[700] text-[#347836] text-[22px] text-center ">{courseDetails.title.toUpperCase()} ({courseDetails.code.toUpperCase()})</h3>
              <p>
                {courseDetails.unit} unit
              </p>
              <p>{courseDetails.description}</p>
              <h4 className="font-[700] text-[#347836] text-[22px]">Departments</h4>
              <ul>{courseDetails.departments.map((item) => {
                const name = departments.find(dept => dept.id == item)?.name
                return <li key={item}>{name}</li>
              })}</ul>
              <h4 className="font-[700] text-[#347836] text-[22px]">Faculties</h4>
              <ul>{courseDetails.faculties.map((item) => {
                const name = faculties.find(fac => fac.id == item)?.name
                return <li key={item}>{name}</li>
              })}</ul>
              <h5 className="font-[700] text-[#347836] text-[22px]">Level</h5>
              <p>{courseDetails.level}</p>
              <h5 className="font-[700] text-[#347836] text-[22px]">Semester</h5>
              <p>{courseDetails.semester == 1 ? 'First' : 'Second'}</p>
              <h5 className="font-[700] text-[#347836] text-[22px]">Lecturers</h5>
              <ul>
                {courseDetails.lecturers.length ? courseDetails.lecturers.map(item => <Lecturers key={item.id} lecturer={item} />) : 'No lecturer assigned'}
              </ul>
              <div>
                {!registered ?
                  <button onClick={() => RegisterCourse(courseDetails)} className="bg-[#347836] text-white px-4 py-2 rounded-md m-3">
                    Register
                  </button>
                  :
                  <button onClick={() => unregisterCourse(courseDetails)} className="bg-[#347836] text-white px-4 py-2 rounded-md m-3">
                    Unregister
                  </button>
                }
              </div>
            </div>
          )}
        </>
        : <p>{error}</p>
      }

    </section>
  )
}


const Lecturers = ({ lecturer }: { lecturer: any }) => {
  const { id, assigned_departments } = lecturer
  const [lecturerDetails, setLecturerDetails] = useState<any>()
  const { user } = useContext(UserContext)




  useEffect(() => {
    fetch('http://localhost/webais/api/lecturers?id=' + id)
      .then(res => res.json())
      .then(result => {
        console.log(result)
        setLecturerDetails(result.lecturer[0])
      })
      .catch(err => {
        console.log(err)
      })
  }, [id])


  return (
    <li className="m-3">
      <h5 className="font-[500] text-[#347836] text-[18px]">{lecturerDetails?.firstName} {lecturerDetails?.lastName} ({lecturerDetails?.id})</h5>
      <div>
        <p>{lecturerDetails?.email}</p>
        <Link to={'/dashboard-student/chat/' + lecturerDetails?.id} className="text-[#346837] font-[600] text-white p-1 px-2 bg-[#346837] rounded my-2 block w-[110px] text-center">Send a message</Link>
      </div>


      <h6 className="font-[400] text-[#347836] text-[16px]">Assigned Departments</h6>
      <ul>
        {assigned_departments.map((item: string) => <li>{item}</li>)}
      </ul>
    </li>
  )
}