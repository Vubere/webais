import { useContext, useEffect, useState } from "react"
import { UserContext, base } from "../../../App"
import { lecturer } from "../../../constants/routes"





export default function Examinations() {
  const [assigned_course_exams, set_assigned_course_exam] = useState<any[]>([])
  const [invigilate_course_exams, set_invigilate_course_exam] = useState<any[]>([])

  const [error, setError] = useState<any>('')
  const [error2, setError2] = useState<any>('')

  const User = useContext(UserContext)


  useEffect(() => {
    if (User.user?.id) {
      fetch(base + '/lecturer_exams?lecturer_id=' + User.user?.id)
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

      fetch(base + '/exam?lecturer_id=' + User.user?.id)
        .then(res => res.json())
        .then(data => {
          console.log(data.exams)
          if (data?.ok)
            set_invigilate_course_exam(data.exams)
          else
            throw new Error(data?.message || 'something went wrong')
        })
        .catch((err) => {
          setError(err?.message || 'something went wrong')
        })
    }

  }, [User.user?.id])
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
                    <td className="border px-4 py-2">{exam.title}({exam.code})</td>
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
                    <td className="border px-4 py-2">{exam.title}({exam.code})</td>
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