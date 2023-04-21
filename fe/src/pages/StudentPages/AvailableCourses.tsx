import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { base, UserContext } from "../../App";
import { session } from "../../constants/routes";
import { SessionContext } from "../../layouts/DashboardLayout";
import { unitLoads } from "../adminPages/Viewing/DepartmentUnitLoads";
import { setWeekYear } from "date-fns";




export default function AvailableCourses() {
  const [availableCourses, setAvailableCourses] = useState<avail_course[]>([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const Session = useContext(SessionContext)
  const [session, setSession] = useState<string>('')
  const [current_semester, setCurrentSemester] = useState<string | number>('')
  const { user } = useContext(UserContext)
  const [registeredCourses, setRegisteredCourses] = useState<Course[]>([])

  const [allowedUnits, setAllowedUnits] = useState<unitLoads>()
  const [unitsRegistered, setUnitsRegisterd] = useState(0)

  const [markedCourse, setMarkedCourse] = useState<{ id: number | string, reg: boolean }[]>([])
  const [unmarkedRegCourse, setUnmarkedRegCourse] = useState<{ id: number | string, reg: boolean }[]>([])


  useEffect(() => {
    if (Session?.session?.session) {

      setSession(Session.session.session)
      setCurrentSemester(Session.session.current_semester)
    }
  }, [Session?.session?.session])

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
    if (session && current_semester && user) {
      fetch(base + '/assign_unit_load?session=' + session + '&semester=' + current_semester + '&level=' + user?.level + '&department_id=' + user?.department + '&faculty=' + user?.faculty)
        .then(res => res.json())
        .then(data => {
          if (data?.ok) {
            setAllowedUnits(data?.data[0])
          } else {
            throw new Error(data?.message || 'something went wrong')
          }
        })
        .catch(err => {
          alert(err?.message || 'something went wrong')
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
          console.log(err)
        })
    }
  }, [session, current_semester, user])

  useEffect(() => {
    if (session && current_semester && user) {
      fetch(base + `/assign_course?student_id=${user.id}&session=${session}&semester=${current_semester}&level=${user.level}&department_id=${user.department}&faculty=${user.faculty}`)
        .then(res => res.json())
        .then(res => {
          if (res?.data)
            setAvailableCourses(res?.data)
          setLoading(false)
        }).catch(err => {
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

  /* check if all compulsory courses has been checked */
  const checkCompulsoryCourses = () => {
    const compulsoryCourses = availableCourses.filter(course => course.type == 'compulsory')
    const compulsoryCoursesMarked = markedCourse.filter(course => course.reg)
    const compulsoryCoursesMarkedIds = compulsoryCoursesMarked.map(course => course.id)
    const compulsoryCoursesIds = compulsoryCourses.map(course => course.id)
    const already_registered = registeredCourses.filter(course => course.type == 'compulsory')
    const already_registered_ids = already_registered.map(course => course.course_id)

    const temp = compulsoryCoursesIds.map(id => {
      if (!compulsoryCoursesMarkedIds.includes(id)&&!already_registered_ids.includes(id)) {
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
    setLoading(true)
    temp.forEach(course => {
      RegisterCourse({ id: course.id, reg: course.registration_open })
    })
    setLoading(false)
  }

  const year = new Date().getFullYear()

  const unregisterCourse = (id: number | string) => {
    if (session && user) {
      const f = new FormData()
      f.append('course_id', id.toString())
      f.append('student_id', user.id)
      f.append('semester', current_semester.toString())
      f.append('session', session)
      fetch(base + '/unregister_course', {
        method: 'POST',
        body: f
      }).then(res => res.json())
        .then(data => {
          if (data?.ok)
            alert('Course unregistered successfully')
        }).catch(err => {
          console.log(err)
          alert('Course unregistration failed')
        })
    }
  }
  /* check for registered courses on unmarked */
  const push_registered_course_for_unregistration = () => {
    setLoading(true)
    if (unmarkedRegCourse.length > 0) {
      unmarkedRegCourse.forEach(course => {
        unregisterCourse(course.id)
      })
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


  return (
    <section className="p-3 h-[90vh] overflow-y-auto pb-20">
      <h3 className="font-[600] text-[#347836] text-[28px] text-center leading-[40px]">Available Courses</h3>
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <label htmlFor="session">Session</label>
          <select name="session" value={session} id="session" className="border border-[#347836] rounded-md p-2" onChange={e => setSession(e.target.value)}>
            <option value="">Select Session</option>
            <option value={year + '/' + (year + 1)}>{year + '/' + (year + 1)}</option>
            <option value={(year - 1) + '/' + year}>{(year - 1) + '/' + year}</option>
            <option value={(year - 2) + '/' + (year - 1)}>{(year - 2) + '/' + (year - 1)}</option>
            <option value={(year - 3) + '/' + (year - 2)}>{(year - 3) + '/' + (year - 2)}</option>
            <option value={(year - 4) + '/' + (year - 3)}>{(year - 4) + '/' + (year - 3)}</option>
          </select>
        </div>
        <div className="flex  flex-col">
          <label htmlFor="semester">Semester</label>
          <select name="semester" value={current_semester} id="semester" className="border border-[#347836] rounded-md p-2" onChange={e => setCurrentSemester(parseInt(e.target.value))}>
            <option value="">Select Semester</option>
            <option value={1}>First Semester</option>
            <option value={2}>Second Semester</option>
          </select>
        </div>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {registeredCourses.length ? (
        <div>
          <p></p>
        </div>
      ) : (
        <div></div>
      )}
      {
        allowedUnits && unitsRegistered &&
        <div className="h-[120px]">
          <ul>
            <li>Minimum allowed units: {allowedUnits?.min_units}</li>
            <li>Maximum allowed units: {allowedUnits?.max_units}</li>
            <li>Units registered: {unitsRegistered}</li>
            <li>Units left: {allowedUnits?.max_units - unitsRegistered}</li>
          </ul>
        </div>
      }
      <div className="w-full overflow-x-auto">

        <table className="shadow-lg bg-white border-separate max-w-[100vw] overflow-auto  mx-auto">
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
      <div>
        <div className="border px-4 py-2"><button className="bg-[#347836] text-white px-4 py-2 rounded-md" onClick={send}>Register</button></div>
      </div>
    </section>
  )
}

const Available_course = ({ course, setMarkedCourse }: { course: avail_course, setMarkedCourse: any }) => {

  const [reg, setReg] = useState(false)

  useEffect(() => {
    if (course.registered) {
      setReg(!!course.registered)
    }
  }, [course.registered])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReg(e.target.checked)
    setMarkedCourse(course, e.target.checked)
  }



  return (<tr key={course.id}>

    <td className="border px-4 py-2">
      <input type="checkbox" checked={reg} name="" id="" onChange={onChange} />

    </td>
    <td className="border px-4 py-2">{course.code}</td>
    <td className="border px-4 py-2">{course.title}</td>
    <td className="border px-4 py-2">{course.units}</td>
    <td className="border px-4 py-2">{course.type}</td>
    <td className="border px-4 py-2">{course.semester}</td>
    <td className="border px-4 py-2">{course.registration_open ? 'open' : 'closed'}</td>
    <td className="border px-4 py-2"><Link to={`/dashboard-student/view-course/${course.course_id}`} className=" text-[#347836] underline font-[500] px-4 py-2 rounded-md">View</Link></td>
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

