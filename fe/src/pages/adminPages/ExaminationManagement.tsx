import { useEffect, useLayoutEffect, useState } from "react"
import { Link } from "react-router-dom"
import { base } from "../../App"
import * as routes from '../../constants/routes'


export default function ExaminationManagement() {
  const [exams, setExams] = useState<exam[]>([])
  const [errors, setErrors] = useState('')


  useLayoutEffect(() => {
    fetch(base+"/exam")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setExams(data.exams)
        } else {
          setErrors('something went wrong')
        }
      })
      .catch((err) => {
        console.log(err)
        setErrors('something went wrong')
      })
  }, [])
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
      <h3 className="font-[600] text-[#347836] text-[28px] text-center leading-[40px]">Examination Management</h3>
      <section>
        <table className="shadow-lg bg-white border-separate max-w-[100vw] overflow-auto ">
          <thead>
            <tr >
              <th className="bg-[#34783644]  border text-left px-4 py-2">Time</th>
              <th className="bg-[#34783644] border text-left px-4 py-2">Date</th>
              <th className="bg-[#34783644] border text-left px-4 py-2">Duration</th>
              <th className="bg-[#34783644] border text-left px-4 py-2">Course Code</th>
              <th className="bg-[#34783644] border text-left px-4 py-2">Lecturer ID</th>
              <th className="bg-[#34783644] border text-left px-4 py-2">Venue</th>
              <th className="bg-[#34783644] border text-left px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((lecture) => (
              <tr key={lecture.id}>
                <td className="border px-4 py-2">{lecture.time}</td>
                <td className="border px-4 py-2">{formatDateToDMY(lecture.date)}</td>
                <td className="border px-4 py-2">{lecture.duration}</td>
                <td className="border px-4 py-2">{lecture.course_code}</td>
                <td className="border px-4 py-2">{lecture.lecturer_id}</td>
                <td className="border px-4 py-2">{lecture.venue}</td>
                <td className="border px-4 py-2">
                  <Link to={
                    `/dashboard-admin/update-exams/${lecture.id}`
                  } className="bg-[#347836] text-white px-4 py-2 rounded-md">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
interface exam {
  id: number
  time: string
  date: string
  duration: string
  course_code: string
  lecturer_id: string
  venue: string
}