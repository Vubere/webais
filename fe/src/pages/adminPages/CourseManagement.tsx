import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { course } from './Creating/CreateCourse'

import * as routes from '../../constants/routes'
import { SessionContext } from '../../layouts/DashboardLayout'
import Icon from '../../components/Icon'
import searchImg from '../../assets/search.png'
import { base } from '../../App'

export default function CourseManagement() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [loadError, setLoadError] = useState('')
  const [search, setSearch] = useState('')

  const Session = useContext(SessionContext);

  const searchedCourses = courses.filter(course => course.title.toLowerCase().includes(search.toLowerCase()))

  useEffect(() => {
    fetch(base + '/courses')
      .then(res => res.json())
      .then((data: any) => {
        console.log(data)
        if (data?.ok) {
          setCourses(data.data)
          setLoading(false)
        }
      })
      .catch(err => {
        setLoadError(err.message)
        setLoading(false)
      })
  }, [])

  
  const toggle_grading_open = async (bool: boolean) => {
    if (Session?.session) {
      try {
        //course_id, session, semester, all:boolean, 

        const f = new FormData()
        f.append('session', Session?.session?.session)
        f.append('all', 'true')
        f.append('bool', !!bool?'1':'0')

        const req = await fetch(base + '/grading', {
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
    if (Session?.session) {
      try {
        //course_id, session, semester, all:boolean,
        const { session, current_semester } = Session.session
        const f = new FormData()
        f.append('session', session)
        f.append('semester', current_semester.toString())
        f.append('all', 'true')
        f.append('bool', bool.toString())

        const req = await fetch(base + '/registration', {
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
      <div className='w-full flex justify-between'>
        <Link to={routes.dashboard + '-' + 'admin' + '/' + routes.assigned_courses}
          className='bg-[#347836] text-[#fff] p-1 rounded px-2'>Assigned Courses</Link>
        <Link to={routes.create_course} className='bg-[#347836] text-[#fff] p-1 rounded px-2'>Add Course </Link>
      </div>
      <h2 className='w-full text-center font-[700] text-[22px] text-[#346837]'>Course Management</h2>
      {loading ? <p>Loading...</p> : loadError ? <p>{loadError}</p> : (
        <div className='flex flex-col gap-5'>
          <h4 className='text-[18px]'>Courses</h4>
          <label htmlFor="search" className='relative max-w-[230px]'>
            <input type="text" id='search' placeholder="Search" onChange={e => setSearch(e.target.value)} className='max-w-[240px] px-1 py-2 pr-10 rounded bg-transparent border border-[#347836]  xs:text-[14px] stbt:text-[18px] flex items-center focus:outline-none px-2' />
            <button className='absolute right-2 top-3 cursor-pointer '>
              <Icon src={searchImg} className='w-[20px] h-[20px] block ' />
            </button>
          </label>
          {searchedCourses.length > 0 ? (
            <div className="w-full overflow-y-auto">
              <table className="shadow-lg bg-white border-separate max-w-[100vw] overflow-auto ">
                <thead>
                  <tr >
                    <th className="bg-[#34783644]  border text-left px-4 py-2">Title</th>
                    <th className="bg-[#34783644] border text-left px-4 py-2">Description</th>
                    <th className="bg-[#34783644] border text-left px-4 py-2">Actions</th>

                  </tr>
                </thead>
                <tbody>
                  {searchedCourses.map((course) => (
                    <tr key={course.id}>
                      <td className="border px-4 py-2">{course.title}</td>
                      <td className="border px-4 py-2">{course.description}</td>
                      <td className="border px-4 py-2 flex flex-col gap-2">
                        <div className='flex gap-2'>

                          <Link to={routes.dashboard + '-' + 'admin' + '/' + routes.update_course + '/' + course.id}>
                            <button className='bg-[#347836] text-[#fff] text-[14px]  rounded-[5px] w-[100px] h-[30px]'>
                              Update
                            </button>
                          </Link>
                          <Link to={routes.dashboard + '-' + 'admin' + '/' + routes.view_course + '/' + course.id}>
                            <button className='bg-[#347836] text-[#fff] text-[14px] h-[30px] rounded-[5px] w-[100px] '>
                              View
                            </button>
                          </Link>
                        </div>
                        <Link to={routes.dashboard + '-' + 'admin' + '/assign_course/' + course.id}>
                          <button className='bg-[#347836] text-[#fff] text-[14px] p-1 px-2 rounded-[5px] w-[140px] m-1 mx-auto '>
                            Assign To Department
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No Course Found</p>
          )}
          <div className='flex flex-col'>
            <h5 className='text-[18px] text-[#aa4444] mt-10'> Expensive Operations</h5>
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
          </div>
        </div>
      )}

    </div>
  )
}