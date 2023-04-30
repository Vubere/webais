import { useContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { course } from "../adminPages/Creating/CreateCourse"
import * as routes from "../../constants/routes"
import { SessionContext } from "../../layouts/DashboardLayout"
import { base, UserContext } from "../../App"
import useFacultiesAndDepartments from "../../hooks/useFacultiesAndDepartments"
import { assigned_course } from "../adminPages/Viewing/ViewAssignedCourses"



export default function ViewSingleCourse() {
  const [courseDetails, setCourseDetails] = useState<assigned_course>()
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
    if(Session?.session)
    fetch(base+'/assign_course?id=' + id)
      .then((res) => res.json())
      .then(result => {
        if (result.ok == 1) {
          let dept = result.data[0]?.departments 
          let a_l = result.data[0]?.assigned_lecturers 
          if(typeof dept == 'string'){
            dept = JSON.parse(dept)
          }
          if(typeof a_l =='string'){
            a_l = JSON.parse(a_l)
          }
          setCourseDetails({...result.data[0],departments: dept, assigned_lecturers: a_l})
          if(result.data[0]==undefined){
            throw new Error('course not found')
          }
        } else {
          throw new Error(result?.message || 'something went wrong')
        }
        setLoading(false)
      })
      .catch(err => {
        alert(err?.message || 'something went wrong')
        setLoading(false)
      })
  }, [Session])

  useEffect(() => {
    if (courseDetails == undefined) return
    checkIfRegistered(courseDetails)
  }, [courseDetails])


  const checkIfRegistered = (course: course) => {
    if (Session?.session && user) {
      fetch(base+'/course_registration?course_id=' + course.id + '&student_id=' + user.id + '&semester=' + Session.session.current_semester + '&session=' + Session.session.session)

        .then(res => res.json())
        .then(data => {
          if (data.ok == 1) {
            if(data?.data.length>0)
            setRegistered(true)
            else
            setRegistered(false)
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
                {courseDetails.units} unit(s) ({courseDetails.type})
              </p>
              <p className="max-w-[400px]">{courseDetails.description}</p>
              <h4 className="font-[700] text-[#347836] text-[22px]">Departments</h4>
              <ul>{courseDetails.departments.map((item:string) => {
                const name = departments.find(dept => dept.id == item)?.name
                return <li key={item}>{name}</li>
              })}</ul>
              
              <h5 className="font-[700] text-[#347836] text-[22px]">Level</h5>
              <p>{courseDetails.level}</p>
              <h5 className="font-[700] text-[#347836] text-[22px]">Semester</h5>
              <p>{courseDetails.semester == 1 ? 'First' : 'Second'}</p>
              <h5 className="font-[700] text-[#347836] text-[22px]">Lecturers</h5>
              <ul>
                {courseDetails.assigned_lecturers.length ? courseDetails.assigned_lecturers.map((item:any) => <Lecturers key={item.id} lecturer={item} />) : 'No lecturer assigned'}
              </ul>
              <div>
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
  const [loading, setLoading] =  useState(false)




  useEffect(() => {
    setLoading(true)
    fetch(base+'/lecturers?id=' + id)
      .then(res => res.json())
      .then(result => {
        if(result?.lecturer?.length == 0) throw new Error('no lecturer found')
        else
        setLecturerDetails(result?.lecturer[0])
        setLoading(false)
      })
      .catch(err => {
        setLoading(false)
      })
  }, [id])


  return (
    <li className="m-3">
      {loading? <p>loading...</p> : null }
      {lecturerDetails&&
      <h5 className="font-[500] text-[#347836] text-[18px] underline">{lecturerDetails?.firstName} {lecturerDetails?.lastName} ({lecturerDetails?.discipline})</h5>}
      <div>
        <p>{lecturerDetails?.email}</p>
        <Link to={'/dashboard-student/chat/' + lecturerDetails?.id} className="text-[#346837] font-[600] text-white p-1 px-2 bg-[#346837] rounded my-2 block w-[110px] text-center">Send a message</Link>
      </div>


      <h6 className="font-[400] text-[#347836] text-[16px]">Assigned Departments</h6>
      <ul>
        {assigned_departments.map((item: string) => <li key={item}>{item}</li>)}
      </ul>
    </li>
  )
}