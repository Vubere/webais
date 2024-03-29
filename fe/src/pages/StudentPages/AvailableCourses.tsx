import { useContext, useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom";
import { base, UserContext } from "../../App";
import { session } from "../../constants/routes";
import { SessionContext } from "../../layouts/DashboardLayout";
import { unitLoads } from "../adminPages/Viewing/DepartmentUnitLoads";
import { setWeekYear } from "date-fns";
import { assigned_course } from "../adminPages/Viewing/ViewAssignedCourses";
import { session_row } from "../adminPages/Viewing/ViewSessions";


export type Performance = {
  cgpa: number,
  total_units: number,
  total_grade_points: number,
  failed_courses: {
    number: number,
    courses: assigned_course[]
  },
}


export default function AvailableCourses() {
  const [availableCourses, setAvailableCourses] = useState<avail_course[]>([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const Session = useContext(SessionContext)
  const { user } = useContext(UserContext)
  const [registeredCourses, setRegisteredCourses] = useState<Course[]>([])

  const [allowedUnits, setAllowedUnits] = useState<unitLoads>()
  const [unitsRegistered, setUnitsRegisterd] = useState(0)

  const [markedCourse, setMarkedCourse] = useState<{ id: number | string, reg: boolean }[]>([])
  const [unmarkedRegCourse, setUnmarkedRegCourse] = useState<{ id: number | string, reg: boolean }[]>([])
  
  const registered_counter = useRef<number>(0)
  const unregister_counter = useRef<number>(0)
  const [session, setSession] = useState<string>('')
  const [current_semester, setCurrentSemester] = useState<string | number>('')
 


  useEffect(() => {
    if (Session?.session?.session) {
      setSession(Session.session.session)
      setCurrentSemester(Session.session.current_semester)
    }
  }, [Session?.session?.session])
  const [performance, setPerformance] = useState<Performance>()

  useEffect(() => {
    if (registeredCourses?.length && availableCourses) {
      const temp = registeredCourses
      const units = temp.map(val => val.units).reduce((a, b) => a + b)
      availableCourses[0]
      let temp2 = availableCourses.map((course) => {
        const f = temp.find((val) => val.course_id === course.id)
        if (f) {
          return { ...course, registered: true }
        }
        return course
      })
      setUnitsRegisterd(units)
      setAvailableCourses(temp2)
    }
  }, [registeredCourses])


  useEffect(() => {
    if (user?.id && session && performance == undefined) {
      fetch(base + '/student_performance?student_id=' + user.id + '&current_session=' + Session?.session?.session + '&current_semester=' + Session?.session?.current_semester)
        .then(res => res.json())
        .then(data => {
          if (data.ok == 1) {
            setPerformance(data.performance)
          } else {
            throw new Error(data?.message || 'something went wrong')
          }
        })
        .catch(err => {
          alert(err?.message || 'something went wrong')
          setError('Failed to fetch necessary data. Reload page')
        })
    }
  }, [user?.id, session])


  useEffect(() => {

    if (session && current_semester && user) {
      fetch(base + '/assign_unit_load?session=' + session + '&semester=' + current_semester + '&level=' + user?.level + '&department_id=' + user?.department + '&faculty=' + user?.faculty)
        .then(res => res.json())
        .then(data => {
          if (data?.ok == 1) {
            setAllowedUnits(data?.data[0])
          } else {
            throw new Error(data?.message || 'something went wrong')
          }
        })
        .catch(err => {
          alert(err?.message || 'something went wrong')
          setError('Failed to fetch necessary data. Reload page')
        })
    }
  }, [session, current_semester, user])

  useEffect(() => {
    if (session && current_semester && user) {
      fetch(base + '/student_registered_courses?student_id=' + user.id + '&session=' + session + '&semester=' + current_semester)
        .then(res => res.json())
        .then(data => {
          if (data?.ok) {
            setRegisteredCourses(data?.details)
          } else {
            throw new Error(data?.message || 'something went wrong')
          }
        })
        .catch(err => {
          alert(err?.message || 'something went wrong')
          setError('Failed to fetch necessary data. Reload page')
        })
    }
  }, [session, current_semester, user])

  useEffect(() => {
    if (session && current_semester && user) {
      setLoading(true)
      fetch(base + `/assign_course?student_id=${user.id}&session=${session}&semester=${current_semester}&level=${user.level}&department_id=${user.department}&faculty=${user.faculty}`)
        .then(res => res.json())
        .then(res => {
          if (res?.data)
            setAvailableCourses(res?.data)
          setLoading(false)
        }).catch(err => {
          setLoading(false)
          if (err?.message)
            setError(err?.message)
        })
    }
  }, [session, current_semester, user])

  const RegisterCourse = ({ id, reg }: { id: number | string, reg: boolean }) => {
    if (!reg) {
      alert('course registration is closed')
      return
    }

    if (Session?.session && user) {
      const f = new FormData()
      f.append('course_id', id.toString())
      f.append('student_id', user.id)
      f.append('semester', current_semester.toString())

      f.append('session', session)
      f.append('method', "POST")

      fetch(base + '/course_registration', {
        method: 'POST',
        body: f
      }).then(res => res.json())
        .then(data => {
          if (data.ok == 1) {
            registered_counter.current += 1
          }
        }).catch(err => {

        })
    }
  }

  /* check if all compulsory courses has been checked */
  const checkCompulsoryCourses = () => {
    const compulsoryCourses = availableCourses.filter(course => course.type == 'compulsory')
    const compulsoryCoursesMarked = markedCourse.filter(course => course.reg)
    const compulsoryCoursesMarkedIds = compulsoryCoursesMarked.map(course => course.id)
    const compulsoryCoursesIds = compulsoryCourses.map(course => course.id)
    const already_registered = registeredCourses.filter(course => course.type == 'compulsory')
    const already_registered_ids = already_registered.map(course => course.course_id)

    const temp = compulsoryCoursesIds.map(id => {
      if (!compulsoryCoursesMarkedIds.includes(id) && !already_registered_ids.includes(id)) {
        return false
      }
      return true
    })
    if (temp.includes(false)) {
      return false
    }
    return true
  }
  const checkUnitsIsAllowed = () => {
    if (!allowedUnits?.max_units) {
      return 'allowed units not set'
    }

    if (unitsRegistered > allowedUnits?.max_units) {
      return 'You have exceeded the maximum allowed units'
    }
    if (unitsRegistered < allowedUnits?.min_units) {
      return 'You have not reached the minimum allowed units'
    }
    return 'allow'
  }

  /* create a useEffect that filters the registered courses from the available courses */
  const setMarkedCourseFunction = (course: Course, reg: boolean) => {

    const registered = registeredCourses.find(val => val.course_id === course.id)
    if (reg) {
      setUnitsRegisterd(unitsRegistered + course.units)
      if (registered) {
        setUnmarkedRegCourse(unmarkedRegCourse.filter(val => val.id !== course.id))
        return
      }
      setMarkedCourse([...markedCourse, { id: course.id, reg: true }])
    } else {
      setUnitsRegisterd(unitsRegistered - course.units)
      if (registered) {
        setUnmarkedRegCourse([...unmarkedRegCourse, { id: course.id, reg: false }])
        return
      }
      setMarkedCourse(markedCourse.filter(val => val.id !== course.id))
    }
  }


  const RegisterAllMarkedCourses = () => {
    const temp = availableCourses.filter(course => {
      const f = markedCourse.find(val => val.id === course.id && val.reg)
      if (f) {
        return true
      }
      return false
    })
    const temp2 = perform.filter(course => {
      const f = markedCourse.find(val => val.id === course.id && val.reg)
      if (f) {
        return true
      }
      return false
    })

    setLoading(true)
    const to_reg = [...temp, ...temp2]

    to_reg.forEach(course => {
      RegisterCourse({ id: course.id, reg: true })
    })

    setTimeout(() => {
      alert(registered_counter.current + ' courses registered successfully')
      registered_counter.current = 0
    }, 1000)
    setLoading(false)
  }

  const unregisterCourse = (id: number | string) => {
    if (session && user) {
      const f = new FormData()
      f.append('course_id', id.toString())
      f.append('student_id', user.id)
      f.append('semester', current_semester.toString())
      f.append('session', session)
      f.append('method', "POST")
      fetch(base + '/unregister_course', {
        method: 'POST',
        body: f
      }).then(res => res.json())
        .then(data => {
          if (data?.ok) {
            unregister_counter.current += 1
          }
        }).catch(err => {
        })
    }
  }
  /* check for registered courses on unmarked */
  const push_registered_course_for_unregistration = () => {
    setLoading(true)
    if (unmarkedRegCourse.length > 0) {
      unmarkedRegCourse.forEach(course => {
        const d = availableCourses.find(val => val.id === course.id)
        if (d?.type == 'compulsory') {
          alert('You cannot unregister a compulsory course')
          return
        }
        unregisterCourse(course.id)
      })
      alert(unregister_counter.current + ' courses unregistered successfully')
    }
    setLoading(false)
  }

  const send = () => {
    const check = checkUnitsIsAllowed()
    if (check !== 'allow') {
      alert(check)
      return
    }
    if (checkCompulsoryCourses() === false) {
      alert('You have not registered all compulsory courses')
      return
    }
    RegisterAllMarkedCourses()
    push_registered_course_for_unregistration()
  }

  const perform = useMemo(() => {
    if (performance != undefined && current_semester && session) {
      const temp2 = performance.failed_courses.courses
      let temp = temp2.filter((course: assigned_course) => {
        if (course == null) return false

        let ses = course?.session?.split('/')
        let ses2 = session?.split('/')
        if (ses && ses[0] == undefined || ses && ses2[0] == undefined) {
          return false
        }
        if ((ses[0] === ses2[0] && ses[1] === ses2[1]) || course.semester != current_semester) {

          return false
        }
        return true
      })
      return temp
    } else {
      return []
    }
  }, [performance, current_semester, session])



  return (
    <section className="p-3 h-[90vh] overflow-y-auto pb-20">
      <h3 className="font-[600] text-[#347836] text-[28px] text-center leading-[40px]">Available Courses</h3>
      <div>

      </div>
   
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {
        !!allowedUnits &&
        <div className="h-[120px]">
          <ul>
            <li>Minimum allowed units: {allowedUnits?.min_units}</li>
            <li>Maximum allowed units: {allowedUnits?.max_units}</li>
            <li>Units registered: {unitsRegistered}</li>
            <li>Units left: {allowedUnits?.max_units - unitsRegistered}</li>
          </ul>
        </div>
      }
      <div className="w-full overflow-x-auto mt-8">

        <table className="w-full shadow-lg bg-white border-separate  w-[80%] overflow-auto  mx-auto  min-w-[80%] ">
          <thead>
            <tr>
              <th className="bg-[#34783644]  border text-left px-4 py-2 text-center"></th>
              <th className="bg-[#34783644]  border text-left px-4 py-2 text-center">Code</th>
              <th className="bg-[#34783644]  border text-left px-4 py-2 text-center">Title</th>
              <th className="bg-[#34783644]  border text-left px-4 py-2 text-center">Units</th>
              <th className="bg-[#34783644]  border text-left px-4 py-2 text-center">Type</th>

              <th className="bg-[#34783644]  border text-left px-4 py-2 text-center">Semester</th>
              <th className="bg-[#34783644]  border text-left px-4 py-2 text-center">Registration</th>
              <th className="bg-[#34783644]  border text-left px-4 py-2 text-center">View</th>
            </tr>
          </thead>
          <tbody>
            {!!availableCourses.length ? availableCourses.map((course) => <Available_course key={course.id} course={course} setMarkedCourse={setMarkedCourseFunction} />) : <tr className="">
              <td colSpan={7}>
                No Course Available
              </td>
            </tr>}
          </tbody>
        </table>
      </div>
      {performance && perform && perform.length > 0 && <>
        <div className="flex justify-between items-center w-full overflow-y-auto mt-20">
          <div className="flex flex-col">
            {performance.failed_courses.number > 0 ? (<div>
              <h4 className="text-center text-[18px] ">Carry Over Courses ({performance.failed_courses.number})</h4>
              <table className="shadow-lg bg-white border-separate max-w-[80%] overflow-auto  mx-auto min-w-[80%] w-[80%]">
                <thead>
                  <tr>
                    <th className="bg-[#34783644]  border text-left px-4 py-2 text-center"></th>
                    <th className="bg-[#34783644]  border text-left px-4 py-2 text-center">Code</th>
                    <th className="bg-[#34783644]  border text-left px-4 py-2 text-center">Title</th>
                    <th className="bg-[#34783644]  border text-left px-4 py-2 text-center">Units</th>
                    <th className="bg-[#34783644]  border text-left px-4 py-2 text-center">Type</th>

                    <th className="bg-[#34783644]  border text-left px-4 py-2 text-center">Semester</th>
                    <th className="bg-[#34783644]  border text-left px-4 py-2 text-center">Registration</th>
                    <th className="bg-[#34783644]  border text-left px-4 py-2 text-center">View</th>
                  </tr>
                </thead>
                <tbody>

                  {perform.map((course: any) => {
                    return <Available_course key={course.id + 'f'} type={'carry over'} course={course} setMarkedCourse={setMarkedCourseFunction} />
                  })}
                </tbody>
              </table>
            </div>)
              : <p></p>}
          </div>
        </div>
      </>
      }
      <div>
        <div className="border px-4 py-2"><button className="bg-[#347836] text-white px-4 py-2 rounded-md" onClick={send}>Register</button></div>
      </div>
    </section>
  )
}

const Available_course = ({ course, setMarkedCourse, type }: { course: avail_course, setMarkedCourse: any, type?: string }) => {

  const [reg, setReg] = useState(false)
  const Session = useContext(SessionContext)
  const [registration_open, setRegistration_open] = useState(false)

  useEffect(() => {
    if (course.registered) {
      setReg(!!course.registered)
    }
  }, [course.registered])
  useEffect(() => {
    if (course.registration_open) {
      setRegistration_open(!!course.registration_open)
    }
    if (type == 'carry over' && Session?.session) {
      fetch(base + '/assign_course?id=' + course.id + '&session=' + Session.session.session)
        .then(res => res.json())
        .then(res => {
          if (res.ok == 1) {
            const course = res.data[0]
            setRegistration_open(course.registration_open)
          }
        })
    }
  }, [course.registration_open, Session?.session])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!registration_open) {
      alert('Registration is closed for this course')
      return
    }
    setReg(e.target.checked)
    setMarkedCourse(course, e.target.checked)
  }




  return (<tr >

    <td className="border px-4 py-2">
      <input type="checkbox" checked={reg} name="" id="" onChange={onChange} />

    </td>
    <td className="border px-4 py-2">{course.code?.toUpperCase()}</td>
    <td className="border px-4 py-2">{course.title}</td>
    <td className="border px-4 py-2">{course.units}</td>
    <td className="border px-4 py-2">{course.type}</td>
    <td className="border px-4 py-2">{course.semester}</td>
    <td className="border px-4 py-2">{registration_open ? 'open' : 'closed'}</td>
    <td className="border px-4 py-2"><Link to={`/dashboard-student/view-course/${course.id}`} className=" text-[#347836] underline font-[500] px-4 py-2 rounded-md">View</Link></td>
  </tr>)
}

export interface Course {
  id: string;
  course_id: string;
  code: string;
  title: string;
  type: 'selective' | 'compulsory';
  units: number;
  level: number;
  semester: number;
  registration_open: boolean;
  registered: boolean;
  departments: string[];
  faculty: string[];
  lecturer: {
    id: string;
    assigned_departments: string[];
  };
  description: string;
}

interface avail_course extends Course {
  registered: boolean;
}

