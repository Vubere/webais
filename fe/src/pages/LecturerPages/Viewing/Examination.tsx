import { useContext, useEffect, useState } from "react"
import { UserContext, base } from "../../../App"
import { lecturer } from "../../../constants/routes"
import { SessionContext } from "../../../layouts/DashboardLayout"
import { session_row } from "../../adminPages/Viewing/ViewSessions"





export default function Examinations() {
  const [assigned_course_exams, set_assigned_course_exam] = useState<any[]>([])
  const [invigilate_course_exams, set_invigilate_course_exam] = useState<any[]>([])

  const [error, setError] = useState<any>('')
  const [error2, setError2] = useState<any>('')

  const User = useContext(UserContext)
  const [ses, setSes] = useState<session_row[]>()

  const [ses_loading, set_ses_loading] = useState(true)
  const [session, setSession] = useState('')
  const [current_semester, setCurrentSemester] = useState<number | string>(0)
  const Session = useContext(SessionContext)

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
    if (User.user?.id&&current_semester&&session) {
      fetch(base + '/lecturer_exams?lecturer_id=' + User.user?.id + "&session=" + session + "&semester=" + current_semester)
        .then(res => res.json())
        .then(data => {
          if (data?.ok)
            set_assigned_course_exam(data.exams)
          else
            throw new Error(data?.message || 'something went wrong')
        })
        .catch((err) => {
          setError(err?.message || 'something went wrong')

        })

      fetch(base + '/exam?lecturer_id=' + User.user?.id + "&session=" + session + "&semester=" + current_semester)
        .then(res => res.json())
        .then(data => {
          if (data?.ok)
            set_invigilate_course_exam(data.exams)
          else
            throw new Error(data?.message || 'something went wrong')
        })
        .catch((err) => {
          setError(err?.message || 'something went wrong')
        })
    }

  }, [User.user?.id, current_semester, session])
  const formatDateToDMY = (date: string) => {
    const d = new Date(date)
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


  return (
    <section className="p-3 w-full h-[90vh] overflow-y-auto">
      <h1 className="text-2xl font-bold text-center text-[#346837]">Examinations</h1>
      <div className="flex flex-col gap-2">
        <h3 className="w-full text-center text-[20px]">Examinations to Invigilate</h3>
        <div className="flex justify-between items-center">
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
        <div className="flex flex-col gap-2">
          {invigilate_course_exams.length == 0 && <h3 className="w-full">No Examinations to Invigilate</h3>}
          {invigilate_course_exams.length > 0 &&
            <table className="shadow-lg bg-white border-separate max-w-[100vw] overflow-auto ">
              <thead>
                <tr >
                  <th className="bg-[#34783644]  border text-left px-4 py-2">Time</th>
                  <th className="bg-[#34783644] border text-left px-4 py-2">Date</th>
                  <th className="bg-[#34783644] border text-left px-4 py-2">Duration</th>
                  <th className="bg-[#34783644] border text-left px-4 py-2">Course</th>
                  <th className="bg-[#34783644] border text-left px-4 py-2">Venue</th>

                </tr>
              </thead>
              <tbody>
                {invigilate_course_exams.map((exam, i) => (
                  <tr key={exam.id}>
                    <td className="border px-4 py-2">{exam.time}</td>
                    <td className="border px-4 py-2">{formatDateToDMY(exam.date)}</td>
                    <td className="border px-4 py-2">{exam.duration}hrs</td>
                    <td className="border px-4 py-2">{exam.title}({exam.code?.toUpperCase()})</td>
                    <td className="border px-4 py-2">{exam.venue}</td>
                  </tr>
                ))}
              </tbody>
            </table>}
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="w-full text-center text-[20px]">Assigned Course Examinations</h3>
          {assigned_course_exams.length == 0 && <h3>No Assigned Course Examinations</h3>}
          {assigned_course_exams.length > 0 &&
            <table className="shadow-lg bg-white border-separate max-w-[100vw] overflow-auto ">
              <thead>
                <tr >
                  <th className="bg-[#34783644]  border text-left px-4 py-2">Time</th>
                  <th className="bg-[#34783644] border text-left px-4 py-2">Date</th>
                  <th className="bg-[#34783644] border text-left px-4 py-2">Duration</th>
                  <th className="bg-[#34783644] border text-left px-4 py-2">Course</th>
                  <th className="bg-[#34783644] border text-left px-4 py-2">Venue</th>

                </tr>
              </thead>
              <tbody>
                {assigned_course_exams.map((exam, i) => (
                  <tr key={exam.id}>
                    <td className="border px-4 py-2">{exam.time}</td>
                    <td className="border px-4 py-2">{formatDateToDMY(exam.date)}</td>
                    <td className="border px-4 py-2">{exam.duration}hrs</td>
                    <td className="border px-4 py-2">{exam.title}({exam.code?.toUpperCase()})</td>
                    <td className="border px-4 py-2">{exam.venue}</td>
                  </tr>
                ))}
              </tbody>
            </table>}
        </div>
      </div>
    </section>
  )
}