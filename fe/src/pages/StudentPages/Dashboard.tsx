import { useContext, useEffect, useMemo, useState } from "react"
import { base, UserContext } from "../../App"
import { SessionContext } from "../../layouts/DashboardLayout"
import { Lecture } from "../adminPages/LectureManagement"



export default function Dashboard() {
  const { user } = useContext(UserContext)
  const [lectures, setLectures] = useState<Lecture[]>([])
  const [notif, setNotif] = useState<{
    message: string,
    count: number
  }[]>([])

  const Session = useContext(SessionContext)

  const TodayLectures = useMemo(() => lectures.filter((l: any) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const today = new Date()
    const dayOftheWeek = today.getDay()
    return l.day.toLowerCase() === days[dayOftheWeek].toLowerCase()
  }), [lectures])
  const [performance, setPerformance] = useState<{
    cgpa: number,
    failed_courses: { number: number, courses: any[] },
    unmarked_courses: { number: number, courses: any[] },
    courses: any[]
  }>()
  console.log(performance)
  const fullName = user?.firstName + ' ' + user?.lastName

  useEffect(() => {
    if (user && Session?.session?.session && Session?.session.current_semester) {
      fetch(base + '/student_lectures?student_id=' + user?.id + '&session=' + Session.session.session + '&semester=' + Session.session.current_semester)
        .then(res => res.json())
        .then(data => {
          setLectures(data.lectures)
        })
        .catch(err => console.log(err))
    }
  }, [user, Session])

  useEffect(() => {
    if (user?.id) {
      fetch(base + '/student_performance?student_id=' + user.id + '&current_session=' + Session?.session?.session + '&current_semester=' + Session?.session?.current_semester)
        .then(res => res.json())
        .then(data => {
          console.log(data)
          if (data.ok == 1) {
            setPerformance(data.performance)
          }
        })
        .catch(err => console.log(err?.message || 'something went wrong'))
    }
  }, [user?.id])


  useEffect(() => {
    if (user && (user?.length || user?.id)) {
      let user_id = '';

      if (user?.length) {
        let user_type = user && user[0] && user[0]?.id[0].toLowerCase() == 's' ? 'student' : user[0]?.id[0] == 'l' ? 'lecturer' : 'admin'
        if (user_type == 'admin') return
        user_id = user[0]?.id
      } else {
        let user_type = user?.id && user?.id[0].toLowerCase() == 's' ? 'student' : user?.id[0].toLowerCase() == 'l' ? 'lecturer' : 'admin'

        if (user_type == 'admin') return
        user_id = user?.id
      }
      fetch(base + '/unread_messages?user_id=' + user_id)
        .then((res) => res.json())
        .then(result => {
          if (result?.ok) {
            let unread_messages = result?.messages
            let chats = unread_messages?.length
            const val = unread_messages.map((message: any) => message?.count).reduce((a: any, b: any) => a + b, 0)

            if (notif.find(n => n.message.includes('unread message(s) from ' + chats + ' conversation(s)'))) return
            setNotif([...notif, { message: 'unread message(s) from ' + chats + ' conversation(s)', count: val }])
          }
        })
        .catch(err => console.log(err))
    }
  }, [user])




  return (
    <section className="p-3 w-full h-[90vh] overflow-y-auto">
      {user &&
        <>
          <h3 className="font-[600] text-[#347836] text-[28px] text-center leading-[40px] p-3">Welcome, {fullName}</h3>
          <div>
            <ul className="text-[#346837] text-[18px]">
              <li>Level: {user.level}</li>
              <li className="capitalize">Status: {user.status}</li>
            </ul>
          </div>
          <div className="flex bmb:justify-between items-center flex-col bmb:flex-row">
            <div className="w-full ">
              <h4 className="font-[500] text-[#346837] text-[18px]">Current Session: {Session?.session?.session || 'none ongoing'}</h4>
              <h4 className="font-[500] text-[#346837] text-[18px] ">Semester: {Session?.session?.current_semester || 'none ongoing'}</h4>
            </div>
            <div className="w-full">
              <h4 className="font-[500] text-[#346837] text-[18px]">Entrance Session: {user.entrance_session}</h4>
              <h4 className="font-[500] text-[#346837] text-[18px]">Graduation Session: {user.graduation_session}</h4>

            </div>
          </div>
          <div className="py-2">
            {performance && <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-[#34783644] p-3 rounded-[10px] max-w-[400px]">
                <h4 className="font-[500] text-[#346837] text-[18px]">CGPA: {performance?.cgpa.toFixed(2)} {performance?.unmarked_courses?.number ? <span>(with {performance.unmarked_courses.number} unmarked courses)</span>:null}</h4></div>
            </div>
            }
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-[#34783644] p-3 rounded-[10px] max-w-[400px]">
              {notif.map((n: any) => (
                !!n.count && <div className="flex justify-between items-center" key={n.count}>
                  <h4 className="font-[500] text-[#346837] text-[18px]">{n.count}{' '}{n.message}</h4>
                </div>
              ))}
            </div>
          </div>
          {user && (user.status == 'undergraduate' || user.status == 'spill over') ? <>
            <h4 className="font-[500] text-[#346837] text-[18px]">Lectures Today</h4>
            <div className="w-full overflow-y-auto">

              {TodayLectures.length > 0 ? (
                <section>
                  <table className="table-auto w-full overflow-auto">
                    <thead>
                      <tr>
                        <th className="bg-[#34783644]  border text-left px-4 py-2">Time</th>
                        <th className="bg-[#34783644] border text-left px-4 py-2">Day</th>
                        <th className="bg-[#34783644] border text-left px-4 py-2">Duration</th>
                        <th className="bg-[#34783644] border text-left px-4 py-2">Course</th>
                        {/*   <th className="bg-[#34783644] border text-left px-4 py-2">Lecturer ID</th> */}
                        <th className="bg-[#34783644] border text-left px-4 py-2">Venue</th>
                        {/* <th className="bg-[#34783644] border text-left px-4 py-2">Action</th> */}
                      </tr>
                    </thead>
                    <tbody>

                      {TodayLectures.map((lecture: any) => (
                        <tr key={lecture.id}>
                          <td className="border px-4 py-2">{lecture.time}</td>
                          <td className="border px-4 py-2">{lecture.day}</td>
                          <td className="border px-4 py-2">{lecture.duration}hr(s)</td>
                          <td className="border px-4 py-2 capitalize">{lecture.title}({lecture.code.toUpperCase()})</td>
                          {/* <td className="border px-4 py-2">{lecture.lecturer_id}</td> */}
                          <td className="border px-4 py-2">{lecture.venue}</td>
                        </tr>))}
                    </tbody>
                  </table>
                </section>
              ) : <p>No lectures today</p>
              }
            </div>
          </> : user && user.status == 'graduate' ?
            <div>
              <h3 className="text-center p-3 font-[600] text-[18px] text-[#346837]">Congrats you succesfully made it through</h3>
            </div> :
            <div className="text-[f44]">{user.status}</div>
          }
        </>
      }
    </section>
  )
}