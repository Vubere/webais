import { useContext, useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { course } from "../Creating/CreateCourse"
import * as routes from "../../../constants/routes"
import { SessionContext } from "../../../layouts/DashboardLayout"
import useFacultiesAndDepartments from "../../../hooks/useFacultiesAndDepartments"
import { base } from "../../../App"


export default function ViewSingleCourse() {
  const [courseDetails, setCourseDetails] = useState<course>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [pageLoadError, setPageLoadError] = useState('')
  const { id } = useParams()
  const Session = useContext(SessionContext)
  const { faculties, departments } = useFacultiesAndDepartments();

  

  useEffect(() => {
    setLoading(true)
    fetch(base+'/courses?id=' + id)
      .then((res) => res.json())
      .then(result => {
        setCourseDetails(result.data[0])
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setPageLoadError(err?.message || 'something went wrong')
        setLoading(false)
      })
  }, [])
  const navigate = useNavigate()

  const create_session_result_table = async () => {
    if (Session) {
      try {
        //course_id, session, semester, all:boolean,
        const { session, semester } = Session.session
        const f = new FormData()
        f.append('session', session)
        f.append('semester', semester)
        f.append('all', 'true')
        f.append('course_id', id as string)

        const req = await fetch('http://localhost:80/webais/api/session_result', {
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
        setError(err?.message)
        alert(err?.message)
      }
    }
  }
  const toggle_grading_open = async (bool: boolean) => {
    if (Session) {
      try {
        //course_id, session, semester, all:boolean, 
        const { session, semester } = Session.session
        const f = new FormData()
        f.append('session', session)
        f.append('all', 'false')
        f.append('bool', bool ? 'true' : 'false')
        f.append('course_id', id as string)

        const req = await fetch('http://localhost/webais/api/grading', {
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
        setError(err?.message)
        alert(err?.message)
      }
    }
  }
  const toggle_registration_open = async (bool: boolean) => {
    if (Session) {
      try {
        //course_id, session, semester, all:boolean,
        const { session, semester } = Session.session
        const f = new FormData()
        f.append('session', session)
        f.append('semester', semester)
        f.append('all', 'false')
        f.append('bool', bool ? 'true' : 'false')
        f.append('course_id', id as string)

        const req = await fetch('http://localhost:80/webais/api/registration', {
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
        setError(err?.message)
        alert(err?.message)
      }
    }
  }

  const delete_course = async (e: any) => {
    e.preventDefault()
    const check = confirm('Are you sure you want to delete this course?');
    if(check){
      try{

        const req = await fetch('http://localhost:80/webais/api/courses', {
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
          throw new Error(res?.message||'something went wrong')
        }
      }catch(err: any){
        setError(err?.message)
        alert(err?.message)
      }
    }
  }

  
  return (
    <section className="h-[90vh] overflow-auto p-3 pb-20 ">
      {loading && courseDetails == undefined ? <p>loading...</p> : pageLoadError == '' ?
        <>
          {courseDetails != undefined && (
            <div className="w-full flex items-center flex-col">
              <h3 className="font-[700] text-[#347836] text-[22px] text-center">{courseDetails.title.toUpperCase()} ({courseDetails.code.toUpperCase()})</h3>
              <p>
                {courseDetails.unit} unit
              </p>
              <p>{courseDetails.description}</p>
              <h4 className="font-[700] text-[#347836] text-[22px]">Departments</h4>
              <ul>{courseDetails.departments.map((item) =>{
                const name = departments.find((dept)=>dept.id==item)?.name
              return <li>{name}</li>})
            }</ul>
              <h4 className="font-[700] text-[#347836] text-[22px]">Faculties</h4>
              <ul>{courseDetails.faculties.map((item) =>{
                const name = faculties.find((f)=>f.id==item)?.name
                return <li>{name}</li>})}</ul>
              <h5 className="font-[700] text-[#347836] text-[22px]">Level</h5>
              <p>{courseDetails.level}</p>
              <h5 className="font-[700] text-[#347836] text-[22px]">Semester</h5>
              <p>{courseDetails.semester==1?'First':'Second'}</p>
              <h5 className="font-[700] text-[#347836] text-[22px]">Lecturers</h5>
              <ul>
                {courseDetails.lecturers.length?courseDetails.lecturers.map(item=><Lecturers lecturer={item}/>):'No Lecturer Assigned'}
              </ul>

              <div>
                <button className='bg-[#347836] text-[#fff] text-[14px] p-1 px-2 rounded-[5px] w-[100px] mt-5 m-2'>
                  <Link to={routes.dashboard + '-' + 'admin' + '/' + routes.update_course + '/' + courseDetails.id}>
                    Update
                  </Link>
                </button>

              </div>
              <div className="mt-4">
                <h6 className="font-[700] text-[#aa4444] text-[16px]">Expensive Operations</h6>
                
                <button className='bg-[#aa4444] text-[#fff] text-[14px] p-1 px-2 rounded-[5px] w-[100px] mt-5 m-2' onClick={()=>toggle_registration_open(true)}>
                  Open Registration
                </button>
                <button className='bg-[#aa4444] text-[#fff] text-[14px] p-1 px-2 rounded-[5px] w-[100px] mt-5 m-2' onClick={() => toggle_registration_open(false)}>
                  Close Registration
                </button>
              </div>
              <div className="mt-1">
                <button className='bg-[#aa4444] text-[#fff] text-[14px] p-1 px-2 rounded-[5px] w-[100px] mt-5 m-2' onClick={()=>toggle_grading_open(true)}>
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
          )}
        </>
        : <p>{error}</p>
      }
    </section>
  )
}


const Lecturers = ({lecturer}:{lecturer:any}) => {
  const {id, assigned_departments} = lecturer
  const [lecturerDetails, setLecturerDetails] = useState<any>()

  useEffect(()=>{
    fetch('http://localhost/webais/api/lecturers?id='+id)
    .then(res=>res.json())
    .then(result=>setLecturerDetails(result.lecturer[0]))
  },[])


  return(
    <li className="m-3">
      <h5 className="font-[500] text-[#347836] text-[18px]">{lecturerDetails?.firstName} {lecturerDetails?.lastName} ({lecturerDetails?.id})</h5>
      
      <h6 className="font-[400] text-[#347836] text-[16px]">Assigned Departments</h6>
      <ul>
        {assigned_departments.map((item:string)=><li>{item}</li>)}
      </ul>
    </li>
  )
}