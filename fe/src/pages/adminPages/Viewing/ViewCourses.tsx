import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { course } from '../Creating/CreateCourse'

import * as routes from '../../../constants/routes'
import { SessionContext } from '../../../layouts/DashboardLayout'
import useFacultiesAndDepartments from '../../../hooks/useFacultiesAndDepartments'
import { base } from '../../../App'

export default function ViewCourse() {
  const [courses, setCourses] = useState<course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [loadError, setLoadError] = useState('')
  const [search, setSearch] = useState('')

  const Session = useContext(SessionContext);

  const searchedCourses = courses.filter(course => course.title.toLowerCase().includes(search.toLowerCase()))

  useEffect(() => {
    fetch(base+'/courses')
      .then(res => res.json())
      .then(data => {
        setCourses(data.data)

        setLoading(false)
      })
      .catch(err => {
        setLoadError(err.message)
        setLoading(false)
      })
  }, [])

  const create_session_result_table = async () => {
    if (Session) {
      try {
        //course_id, session, semester, all:boolean,
        const { session, semester } = Session.session
        const f = new FormData()
        f.append('session', session)
        f.append('semester', semester)
        f.append('all', 'true')

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
        f.append('all', 'true')
        f.append('bool', bool.toString())

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
        f.append('all', 'true')
        f.append('bool', bool.toString())

        const req = await fetch(base+'/registration', {
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



  return (
    <div className='p-4 h-[90vh] overflow-auto pb-20'>
      <h2>View Course</h2>
      {loading ? <p>Loading...</p> : loadError ? <p>{loadError}</p> : (
        <div className='flex flex-col gap-5'>
          <input type="text" placeholder="Search" onChange={e => setSearch(e.target.value)} />
          {searchedCourses.map(course => (
            <div key={course.id}>
              <Link to={`/admin/view/course/${course.id}`}>
                <p>{course.id}</p>
              </Link>
              <p>{course.title.toUpperCase()}({course.code.toUpperCase()})</p>
              <p>{course.description}</p>
              <ul>
                {course.lecturers.map(lecturer => (
                  <li key={lecturer.id}>
                    <Link to={routes.dashboard + '-' + 'admin' + '/' + routes.update_lecturer + '/' + lecturer.id}>
                      <p>Lecturer Id: {lecturer.id}</p>
                    </Link>
                  </li>
                ))}
              </ul>

              <button className='bg-[#347836] text-[#fff] text-[14px] p-1 px-2 rounded-[5px] w-[100px] mt-5 m-2'>
                <Link to={routes.dashboard + '-' + 'admin' + '/' + routes.update_course + '/' + course.id}>
                  Update
                </Link>
              </button>
              <button className='bg-[#347836] text-[#fff] text-[14px] p-1 px-2 rounded-[5px] w-[100px] mt-5 m-2'>
                <Link to={routes.dashboard + '-' + 'admin' + '/' + routes.view_course + '/' + course.id}>
                  View
                </Link>
              </button>

            </div>
          ))}
          <div className='flex flex-col'>
            <h5 className='text-[18px] text-[#aa4444] mt-10'> Expensive Operations </h5>
            <button className='bg-[#aa4444] text-[#fff] text-[14px] p-1 px-2 rounded-[5px] w-[220px] mt-5 m-2' onClick={() => toggle_registration_open(true)}>
              Open Registration For All Courses
            </button>
            <button className='bg-[#aa4444] text-[#fff] text-[14px] p-1 px-2 rounded-[5px] w-[220px] mt-5 m-2'
              onClick={() => toggle_registration_open(false)}>
              Close Registration For All Courses
            </button>
            <button className='bg-[#aa4444] text-[#fff] text-[14px] p-1 px-2 rounded-[5px] w-[220px] mt-5 m-2' onClick={() => toggle_grading_open(true)}>
              Open Grading For All Courses
            </button>
            <button className='bg-[#aa4444] text-[#fff] text-[14px] p-1 px-2 rounded-[5px] w-[220px] mt-5 m-2' onClick={() => toggle_grading_open(false)}>
              Close Grading For All Courses
            </button>
            <button className='bg-[#aa4444] text-[#fff] text-[14px] p-1 px-2 rounded-[5px] w-[220px] mt-5 m-2'
              onClick={() => create_session_result_table()}>
              Create Session Result Table for All Courses
            </button>
          </div>
        </div>
      )}
    
    </div>
  )
}