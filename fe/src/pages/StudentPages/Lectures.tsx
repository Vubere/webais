import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base, UserContext } from "../../App";
import { SessionContext } from "../../layouts/DashboardLayout";
import { Lecture } from "../adminPages/Viewing/ViewLectures";


export default function Lectures(){
  const [lectures, setLectures] = useState<Lecture[]>()
  const [errors, setErrors] = useState('')
  const [loading, setLoading] = useState(true)

  const {user} = useContext(UserContext)
  const Session = useContext(SessionContext)

  useEffect(() => {
    if(user&&Session?.session?.session){
      fetch(base+'/student_lectures?student_id='+user?.id+'&session='+Session.session.session+'&semester='+Session.session.current_semester)
      .then(res => res.json())
      .then(result => {
        if(result.status == 'success'){
          setLectures(result.lectures)
        }
        setLoading(false)
      })
      .catch(err => {
        setErrors(err)
        setLoading(false)
        alert(err?.message || 'something went wrong')
      })
    }
  },[user, Session])





  return (
    <div className="p-2 h-[90vh] w-full">
      <h3 className="font-[600] text-[#347836] text-[28px] text-center leading-[40px]">Lectures</h3>
      <section className="w-full overflow-x-auto">
        <table className="shadow-lg bg-white border-separate max-w-[100vw] overflow-auto mx-auto">
          <thead>
            <tr >
              <th className="bg-[#34783644]  border text-left px-4 py-2">Time</th>
              <th className="bg-[#34783644] border text-left px-4 py-2">Day</th>
              <th className="bg-[#34783644] border text-left px-4 py-2">Duration</th>
              <th className="bg-[#34783644] border text-left px-4 py-2">Course </th>
              <th className="bg-[#34783644] border text-left px-4 py-2">Lecturer </th>
              <th className="bg-[#34783644] border text-left px-4 py-2">Venue</th>
              <th className="bg-[#34783644] border text-left px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {errors==''?lectures&&lectures?.length?lectures.map((lecture) => (
              <tr key={lecture.id}>
                <td className="border px-4 py-2">{lecture.time}</td>
                <td className="border px-4 py-2">{lecture.day}</td>
                <td className="border px-4 py-2">{lecture.duration}hrs</td>
                <td className="border px-4 py-2 capitalize">{lecture.title}({lecture?.code?.toUpperCase()})</td>
                <td className="border px-4 py-2">{lecture?.lecturer_name}</td>
                <td className="border px-4 py-2 capitalize">{lecture.venue}</td>
                <td className="border px-4 py-2"><Link to={`/dashboard-student/view-course/${lecture.course_id}`} className="underline text-[#346837]">View Course</Link></td>
              </tr>
            )) : loading ?<tr><td colSpan={6}>loading...</td></tr>: <tr><td colSpan={6}>No lectures</td></tr>:<p>errors</p>}
          </tbody>
        </table>
      </section>
    </div>
  )
}