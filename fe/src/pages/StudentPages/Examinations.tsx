import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { base, UserContext } from "../../App"
import { SessionContext } from "../../layouts/DashboardLayout";

import { Course } from "./AvailableCourses";
import { session_row } from "../adminPages/Viewing/ViewSessions";


export default function Examination() {
  const [registeredCourses, setRegisteredCourses] = useState<Course[]>([]);
  const { user } = useContext(UserContext)
  const Session = useContext(SessionContext)
  
  const [loading, setLoading] = useState(true)
  const [exams, setExams] = useState<any[]>([])
  const [ses, setSes] = useState<session_row[]>()
  const [ses_loading, set_ses_loading] = useState(true)
  const [session, setSession] = useState('')
  const [current_semester, setCurrentSemester] = useState<number | string>(0)

  useEffect(() => {
    fetch(base + '/session')
      .then(res => res.json())
      .then(data => {
        if (data.ok == 1) {
          set_ses_loading(false)
          setSes(data.data)
        } else {
          throw new Error(data.message || 'something went wrong')
        }
      })
      .catch(err => {
        alert(err.message || 'something went wrong')
        set_ses_loading(false)
      })
  }, [])
  useEffect(() => {
    if (Session?.session) {
      setSession(Session.session.session)
      setCurrentSemester(Session.session.current_semester)
    }
  }, [Session])



  useEffect(() => {

    if (Session?.session?.session && user) {
      const userSes = Session.session.session
      const userSem = Session.session.current_semester
      setLoading(true)
      fetch(base + '/student_registered_courses?student_id=' + user.id + '&semester=' + userSem + '&session=' + userSes)
        .then(res => res.json())
        .then(res => {
          if (res.ok = 1) {
            setRegisteredCourses(res.details)
          }
          setLoading(false)
        }).catch(err => {
          alert(err?.message || 'something went wrong')
          setLoading(false)
        })
    }
  }, [Session?.session?.session, user])

  const formatDateToDMY = (date: string) => {
    const d = new Date(date)
    const day = d.getDay()
    const getNameOfDay = (day: number) => {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      return days[day]
    }
    return (
      <span>
        {d.getDate()}/{d.getMonth() + 1}/{d.getFullYear()}
        <span className="block">
          {getNameOfDay(d.getDay())}
        </span>
      </span>)
  }



  useEffect(() => {

    if (registeredCourses.length && current_semester && session) {
      setLoading(true)
      fetch(base + "/exam?session=" + session + "&semester=" + current_semester)
        .then(res => res.json())
        .then(res => {
          if (res.status == 200 && res?.exams?.length > 0) {
            console.log(res)
            setExams(res.exams.filter((exam: any) => registeredCourses.map((course: Course) => course.course_id.toString()).includes(exam.course_id.toString())
            ))
          }
          setLoading(false)
        }
        ).catch(err => {
          setLoading(false)
          alert(err?.message || 'something went wrong')
        })
    }
  }, [registeredCourses?.length, current_semester, session])

  return (
    <div className="w-full flex flex-col items-center p-3 h-[90vh] overflow-y-auto">
      <h3 className="font-[600] text-[#347836] text-[28px] text-center leading-[40px]">Examinations</h3>
      <div className="flex justify-between items-center w-full max-w-[400px]">
        <div className="flex flex-col">
          <label htmlFor="session">Session</label>
          <select name="session" value={session} id="session" className="border border-[#347836] rounded-md p-2" onChange={e => setSession(e.target.value)}>
            <option value="">Select Session</option>

            {ses && ses.map((s) => {
              return (
                <option key={s.session} value={s.session}>{s.session}</option>
              )
            })}
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
      <div className="w-full overflow-x-auto mt-2">
        <table className="shadow-lg bg-white border-separate max-w-[100vw] overflow-auto mx-auto">
          <thead>
            <tr >
              <th className="bg-[#34783644]  border text-left px-4 py-2">Time</th>
              <th className="bg-[#34783644] border text-left px-4 py-2">Date</th>
              <th className="bg-[#34783644] border text-left px-4 py-2">Duration</th>
              <th className="bg-[#34783644] border text-left px-4 py-2">Course Code</th>
              <th className="bg-[#34783644] border text-left px-4 py-2">Lecturer</th>
              <th className="bg-[#34783644] border text-left px-4 py-2">Venue</th>

            </tr>
          </thead>
          <tbody>
            {exams.length ? exams.map((lecture) => (
              <tr key={lecture.id}>
                <td className="border px-4 py-2">{lecture.time}</td>
                <td className="border px-4 py-2">{formatDateToDMY(lecture.date)}</td>
                <td className="border px-4 py-2">{lecture.duration}hrs</td>
                <td className="border px-4 py-2 capitalize">{lecture.title}({lecture.code.toUpperCase()})</td>
                <td className="border px-4 py-2">{lecture.lecturer_name}({lecture.discipline})</td>
                <td className="border px-4 py-2">{lecture.venue}</td>

              </tr>
            )) : loading ? <tr><td colSpan={5}>loading...</td></tr> : <tr><td colSpan={5}>No exams</td></tr>}
          </tbody>
        </table>
      </div>

    </div>
  )
}

type exams = {
  course_code: string,
  date: string,
  time: string,
  venue: string,
  lecturer_id: string,
  duration: string,
}