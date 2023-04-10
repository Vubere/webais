import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { base, UserContext } from "../../App"
import { SessionContext } from "../../layouts/DashboardLayout";

import { Course } from "./AvailableCourses";


export default function Examination () {
  const [registeredCourses, setRegisteredCourses] = useState<Course[] | []>([]);
  const { user } = useContext(UserContext)
  const Session = useContext(SessionContext)
  const [loading, setLoading] = useState(true)
  const [exams, setExams] = useState<any[]>([])
  
  useEffect(() => {

    if (Session && user) {
      const userSes = Session.session.session 
      const userSem = Session.session.semester 

      fetch(base+'/registered_courses?student_id=' + user.id + '&semester=' + userSem + '&session=' + userSes)
        .then(res => res.json())
        .then(res => {
          if (res.status == 200) {
            setRegisteredCourses(res.data)
          }
        }).catch(err => {
          console.log(err)
        })
    }
  }, [Session, user])

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

  useEffect(() => {
   
     
        fetch(base+'/exam' )
          .then(res => res.json())
          .then(res => {
            console.log(res)
            if (res.status == 200&&res?.exams?.length>0) {
              
              setExams(res.exams.filter((exam:any)=>registeredCourses.map((course:Course)=>course.code).includes(exam.course_code)
              ))
            }
          }
          ).catch(err => {
            console.log(err)
          })
    
  }, [registeredCourses])
  console.log(exams)
  
  return(
    <div className="w-full flex flex-col items-center ">
      <h3 className="font-[600] text-[#347836] text-[28px] text-center leading-[40px]">Examinations</h3>
      <table className="shadow-lg bg-white border-separate max-w-[100vw] overflow-auto ">
        <thead>
          <tr >
            <th className="bg-[#34783644]  border text-left px-4 py-2">Time</th>
            <th className="bg-[#34783644] border text-left px-4 py-2">Date</th>
            <th className="bg-[#34783644] border text-left px-4 py-2">Duration</th>
            <th className="bg-[#34783644] border text-left px-4 py-2">Course Code</th>
            <th className="bg-[#34783644] border text-left px-4 py-2">Lecturer ID</th>
            <th className="bg-[#34783644] border text-left px-4 py-2">Venue</th>
          
          </tr>
        </thead>
        <tbody>
          {exams.length?exams.map((lecture) => (
            <tr key={lecture.id}>
              <td className="border px-4 py-2">{lecture.time}</td>
              <td className="border px-4 py-2">{formatDateToDMY(lecture.date)}</td>
              <td className="border px-4 py-2">{lecture.duration}hrs</td>
              <td className="border px-4 py-2">{lecture.course_code}</td>
              <td className="border px-4 py-2">{lecture.lecturer_id}</td>
              <td className="border px-4 py-2">{lecture.venue}</td>
              
            </tr>
          )):<p>No Exams</p>}
        </tbody>
      </table>
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