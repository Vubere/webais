import { useContext, useEffect, useState } from "react"
import { base, UserContext } from "../../App"
import { SessionContext } from "../../layouts/DashboardLayout"


export default function DashboardPage() {

  const { user } = useContext(UserContext)

  const u = user ? user : undefined
  const [lectures, setLectures] = useState<any>([])
  const [notif, setNotif] = useState<{
    message: string,
    count: number
  }[]>([])
  const session_data = useContext(SessionContext)

  const TodayLectures = lectures.filter((l: any) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const today = new Date()
    const dayOftheWeek = today.getDay()
    return l.day.toString().toLowerCase() === days[dayOftheWeek].toString().toLowerCase()
  })


  useEffect(() => {

    if (u?.id) {
      fetch(base + `/lectures?lecturer_id=${u.id}`)
        .then(res => res.json())
        .then(data => {
          console.log(data)
          setLectures(data.lectures)
        })
    }
  }, [u?.id])
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


  const fullName = (user: any) => {
    if (user.firstName && user.lastName) {
      return user.firstName + ' ' + user.lastName
    } else if (user.firstName) {
      return user.firstName
    } else if (user.lastName) {
      return user.lastName
    } else {
      return 'No name'
    }
  }

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
    <>
      {u && (

        <div className="p-3">
          <h2 className="font-[600] text-[#347836] text-[28px] text-center leading-[40px] p-3">Welcome, {fullName(u)}</h2>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h4 className="font-[500] text-[#346837] text-[18px]">Session: {session_data?.session?.session}</h4>
              <h4 className="font-[500] text-[#346837] text-[18px] ml-3">Semester: {session_data?.session?.current_semester}</h4>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-[400px]">
            <div className="bg-[#34783644] p-3 rounded-[10px]">
              {notif.map((n: any) => (
                !!n.count && <div className="flex justify-between items-center">
                  <h4 className="font-[500] text-[#346837] text-[18px]">{n.count}{' '}{n.message}</h4>

                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-[500] text-[#346837] text-[18px]">Lectures Today</h4>
            {TodayLectures.length > 0 ? (
              <>
                <table className="table-auto w-full overflow-auto">
                  <thead>
                    <tr>
                      <th className="bg-[#34783644]  border text-left px-4 py-2">Time</th>
                      <th className="bg-[#34783644] border text-left px-4 py-2">Day</th>
                      <th className="bg-[#34783644] border text-left px-4 py-2">Duration</th>
                      <th className="bg-[#34783644] border text-left px-4 py-2">Course </th>
                      {/*   <th className="bg-[#34783644] border text-left px-4 py-2">Lecturer ID</th> */}
                      <th className="bg-[#34783644] border text-left px-4 py-2">Venue</th>
                      {/* <th className="bg-[#34783644] border text-left px-4 py-2">Action</th> */}
                    </tr>
                  </thead>
                  {TodayLectures.map((lecture: any) => (
                    <>
                      <td className="border px-4 py-2">{lecture.time}</td>
                      <td className="border px-4 py-2">{lecture.day}</td>
                      <td className="border px-4 py-2">{lecture.duration}hr(s)</td>
                      <td className="border px-4 py-2">{lecture.title}({lecture.code.toUpperCase()})</td>
                      {/* <td className="border px-4 py-2">{lecture.lecturer_id}</td> */}
                      <td className="border px-4 py-2">{lecture.venue}</td>
                    </>))}
                </table>
              </>
            ) : <p>No lectures today</p>}

          </div>
        </div>
      )
      }
    </>
  )
}