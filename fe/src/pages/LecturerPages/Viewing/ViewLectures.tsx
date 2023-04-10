import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { base, UserContext } from "../../../App"

import { Lecture } from "../../adminPages/Viewing/ViewLectures"

export default function ViewLectures() {
  const [lectures, setLectures] = useState<Lecture[]>([])
  const { user } = useContext(UserContext)

  useEffect(() => {

    if (user) {
      fetch(base+`/lectures?lecturer_id=${user.id}`)
        .then(res => res.json())
        .then(data => {
     
          setLectures(data.lectures)})
          .catch(err => console.log(err))

    }
  }, [user])


  return (
    <div>
      <h3 className="font-[600] text-[#347836] text-[28px] text-center leading-[40px]">Lectures</h3>
      <section>
        <table className="shadow-lg bg-white border-separate max-w-[100vw] overflow-auto mx-auto">
          <thead>
            <tr >
              <th className="bg-[#34783644]  border text-left px-4 py-2">Time</th>
              <th className="bg-[#34783644] border text-left px-4 py-2">Day</th>
              <th className="bg-[#34783644] border text-left px-4 py-2">Duration</th>
              <th className="bg-[#34783644] border text-left px-4 py-2">Course </th>
              {/*   <th className="bg-[#34783644] border text-left px-4 py-2">Lecturer ID</th> */}
              <th className="bg-[#34783644] border text-left px-4 py-2">Venue</th>
              <th className="bg-[#34783644] border text-left px-4 py-2">Action</th>

            </tr>
          </thead>
          <tbody>
            {lectures.map((lecture) => (
              <tr key={lecture.id}>
                <td className="border px-4 py-2">{lecture.time}</td>
                <td className="border px-4 py-2">{lecture.day}</td>
                <td className="border px-4 py-2">{lecture.duration}hr(s)</td>
                <td className="border px-4 py-2">{lecture.title}({lecture.code.toUpperCase()})</td>
                {/* <td className="border px-4 py-2">{lecture.lecturer_id}</td> */}
                <td className="border px-4 py-2">{lecture.venue}</td>
                <td className="border px-4 py-2">
                  <Link to={'/dashboard-lecturer/view-lectures/' + lecture.id}>
                    <button className="bg-[#347836] text-white px-4 py-2 rounded-md">View</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}