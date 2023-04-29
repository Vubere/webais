import { useContext, useEffect, useLayoutEffect, useState } from "react"
import { Link } from "react-router-dom"
import { base } from "../../App"
import * as routes from '../../constants/routes'
import { session_row } from "./Viewing/ViewSessions"
import { SessionContext } from "../../layouts/DashboardLayout"


export default function ExaminationManagement() {
  const [exams, setExams] = useState<exam[]>([])
  const [errors, setErrors] = useState('')

  const [ses, setSes] = useState<session_row[]>()
  const Session = useContext(SessionContext)
  const [ses_loading, set_ses_loading] = useState(true)
  const [session, setSession] = useState('')
  const [current_semester, setCurrentSemester] = useState<number|string>(0)
  
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
  useEffect(()=>{
    if(Session?.session){
      setSession(Session.session.session)
      setCurrentSemester(Session.session.current_semester)
    }

  },[Session])

  useLayoutEffect(() => {
    if(session&&current_semester)
    fetch(base + "/exam?session=" + session + "&semester=" + current_semester)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setExams(data.exams)
        } else {
          setErrors('something went wrong')
        }
      })
      .catch((err) => {
        setErrors('something went wrong')
      })
  }, [session, current_semester])
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
    <div className="p-2">
      <div className='w-full flex justify-end'>
        <Link to={routes.create_exam} className='bg-[#347836] text-[#fff] p-1 rounded px-2'>Add Examination</Link>
      </div>
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

      <h3 className="font-[600] text-[#347836] text-[28px] text-center leading-[40px]">Examination Management</h3>
      <section className="w-full overflow-x-auto">
        {exams.length == 0 && <div className='text-center'>No Exams Set</div>}
        {exams.length > 0 &&
          <table className="shadow-lg bg-white border-separate max-w-[100vw] overflow-auto ">
            <thead>
              <tr >
                <th className="bg-[#34783644]  border text-left px-4 py-2">Time</th>
                <th className="bg-[#34783644] border text-left px-4 py-2">Date</th>
                <th className="bg-[#34783644] border text-left px-4 py-2">Duration</th>
                <th className="bg-[#34783644] border text-left px-4 py-2">Course </th>
                <th className="bg-[#34783644] border text-left px-4 py-2">Lecturer</th>
                <th className="bg-[#34783644] border text-left px-4 py-2">Venue</th>
                <th className="bg-[#34783644] border text-left px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => (
                <tr key={exam.id}>
                  <td className="border px-4 py-2">{exam.time}</td>
                  <td className="border px-4 py-2">{formatDateToDMY(exam.date)}</td>
                  <td className="border px-4 py-2">{exam.duration}</td>
                  <td className="border px-4 py-2">{exam.title}({exam.code?.toUpperCase()})</td>
                  <td className="border px-4 py-2">{exam.lecturer_name}</td>
                  <td className="border px-4 py-2">{exam.venue}</td>
                  <td className="border px-4 py-2">
                    <Link to={
                      `/dashboard-admin/update-exams/${exam.id}`
                    } className="bg-[#347836] text-white px-4 py-2 rounded-md">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>}
      </section>
    </div>
  )
}
interface exam {
  id: number
  time: string
  date: string
  duration: string
  code: string
  lecturer_name: string
  venue: string
  title: string
}