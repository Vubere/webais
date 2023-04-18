import { useContext, useEffect, useState } from "react"
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

  const TodayLectures = lectures.filter((l: any) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const today = new Date()
    const dayOftheWeek = today.getDay()
    return l.date === days[dayOftheWeek]
  })


  const fullName = user?.firstName + ' ' + user?.lastName

  useEffect(() => {
    if (user&&Session?.session?.session&&Session?.session.current_semester) {
      
      fetch(base+'/student_lectures?student_id=' + user?.id + '&session=' + Session.session.session + '&semester=' + Session.session.current_semester)
        .then(res => res.json())
        .then(data => {
          console.log(data)
          setLectures(data.lectures)})
        .catch(err => console.log(err))
    }
  }, [user, Session])

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
      fetch(base+'/unread_messages?user_id=' + user_id)
        .then((res) => res.json())
        .then(result => {
          console.log(result)
          if (result?.ok) {
            let unread_messages = result?.messages
            let chats = unread_messages?.length
            const val = unread_messages.map((message: any) => message?.count).reduce((a: any, b: any) => a + b, 0)
          
            if(notif.find(n=>n.message.includes('unread message(s) from '+chats+' conversation(s)' ))) return
            setNotif([...notif, { message: 'unread message(s) from '+chats+' conversation(s)', count: val}])

          }
        })
        .catch(err => console.log(err))
    }
  }, [user])


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
    <section className="p-3">
      {user &&
        <>
          <h3 className="font-[600] text-[#347836] text-[28px] text-center leading-[40px] p-3">Welcome, {fullName}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-[#34783644] p-3 rounded-[10px] max-w-[400px]">
              {notif.map((n: any) => (
                !!n.count&&<div className="flex justify-between items-center">
                  <h4 className="font-[500] text-[#346837] text-[18px]">{n.count}{' '}{n.message}</h4>
                 
                </div>
              ))}
            </div>
          </div>
        
          <h4 className="font-[500] text-[#346837] text-[18px]">Lectures Today</h4>
          {TodayLectures.length > 0 ? (
            <>
              <table className="table-auto w-full overflow-auto">
                <thead>
                  <tr>
                    <th className="bg-[#34783644]  border text-left px-4 py-2">Time</th>
                    <th className="bg-[#34783644] border text-left px-4 py-2">Date</th>
                    <th className="bg-[#34783644] border text-left px-4 py-2">Duration</th>
                    <th className="bg-[#34783644] border text-left px-4 py-2">Course Code</th>
                    {/*   <th className="bg-[#34783644] border text-left px-4 py-2">Lecturer ID</th> */}
                    <th className="bg-[#34783644] border text-left px-4 py-2">Venue</th>
                    {/* <th className="bg-[#34783644] border text-left px-4 py-2">Action</th> */}
                  </tr>
                </thead>
                {TodayLectures.map((lecture: any) => (
                  <>
                    <td className="border px-4 py-2">{lecture.time}</td>
                    <td className="border px-4 py-2">{formatDateToDMY(lecture.date)}</td>
                    <td className="border px-4 py-2">{lecture.duration}hr(s)</td>
                    <td className="border px-4 py-2">{lecture.code.toUpperCase()}</td>
                    {/* <td className="border px-4 py-2">{lecture.lecturer_id}</td> */}
                    <td className="border px-4 py-2">{lecture.venue}</td>
                  </>))}
              </table>
            </>
          ) : <p>No lectures today</p>
          }

          
        </>
      }
    </section>
  )
}