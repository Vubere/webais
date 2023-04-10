import { useEffect, useLayoutEffect, useState } from "react"
import { Link } from "react-router-dom"
import { base } from "../../../App"


export default function ViewLectures() {
  const [lectures, setLectures] = useState<Lecture[]>([])
  const [errors, setErrors] = useState('')


  useLayoutEffect(() => {
    fetch(base+"/lectures")
      .then((res) => res.json())
      .then((data) => {
        
        if (data.ok) {
          setLectures(data.lectures)
        } else {
          setErrors('something went wrong')

        }
      })
      .catch((err) => {
        console.log(err)
        setErrors('something went wrong')
      })
  }, [])
  

  return (
    <div>
      <h1 className="font-[600] text-[#347836] text-[28px] text-center leading-[40px]">Lectures</h1>
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
            {lectures.map((lecture) => (
              <tr key={lecture.id}>
                <td className="border px-4 py-2">{lecture.time}</td>
                <td className="border px-4 py-2">{lecture.day}</td>
                <td className="border px-4 py-2">{lecture.duration}</td>
                <td className="border px-4 py-2">{lecture.code.toUpperCase()}</td>
                <td className="border px-4 py-2">{lecture.lecturer_id}</td>
                <td className="border px-4 py-2">{lecture.venue}</td>
                <td className="border px-4 py-2">
                  <Link to={
                    `/dashboard-admin/update-lecture/${lecture.id}`
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
export interface Lecture {
  id: number
  time: string
  day: string
  duration: string
  code: string
  lecturer_id: string
  venue: string
  title: string
  lecturer_name: string
  course_id: string|number
}