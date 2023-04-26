import { useEffect, useMemo, useState } from "react"
import { base } from "../../../App"
import { session } from "../../../layouts/DashboardLayout"


type session_row = session & {current:1|0, id:string}

const months = ['January', 'Febuary', 'March','April','May', 'June', 'July','August', 'September', 'October',"November", 'December']

export default function ViewSessions() {

  const [session, setSessions] = useState<session_row[]>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(base + '/session')
      .then(res => res.json())
      .then(data => {
        if (data.ok == 1) {
          setLoading(false)
          setSessions(data.data)

        } else {
          throw new Error(data.message || 'something went wrong')
        }
      })
      .catch(err => {
        alert(err.message || 'something went wrong')
        setLoading(false)
      })
  }, [])

  
  return (
    <section className="w-full p-3 h-[90vh] overflow-auto">
      <div className="w-full">
        <h3 className="text-center font-[600] text-[#346837] text-[18px] uppercase">Initialized Sessions</h3>
      </div>
      {loading ? <h3 className="text-center font-[600] text-[#346837] text-[18px] uppercase">Loading...</h3> : null}
      {session && session.length == 0 ? <h3 className="text-center font-[600] text-[#346837] text-[18px] uppercase">No Sessions</h3> : null}
      {session ? (
        <div className="w-full overflow-x-auto">
          <table className="shadow-lg bg-white border-separate max-w-[100vw] overflow-auto mx-auto">
            <thead>
              <tr >
                <th className="bg-[#34783644]  border text-left px-4 py-2">Session</th>
                <th className="bg-[#34783644]  border text-left px-4 py-2">Session Starts</th>
                <th className="bg-[#34783644] border text-left px-4 py-2">Session Ends</th>
                <th className="bg-[#34783644] border text-left px-4 py-2">Current</th>
              </tr>
            </thead>
            <tbody>
              {session.map((session) => (
                <SessionRow key={session.id} sess={session}/>
              ))}
            </tbody>
          </table>

        </div>
      ) : null
      }


    </section>
  )
}

function SessionRow ({sess}:{sess:session_row}) {

  const start_date = useMemo(()=>{
    const date = new Date(Number(sess.first_semester_start)*1000)
    const year = date.getFullYear()
    const month = date.getMonth()
    const month_name = months[month]
    const day_of_month = date.getDate()
    return `${year}/${month + 1}/${day_of_month}`
  }, [sess.first_semester_start])
  const end_date = useMemo(()=>{
    const date = new Date(Number(sess.second_semester_end)*1000)
    const year = date.getFullYear()
    const month = date.getMonth()
    const month_name = months[month]
    const day_of_month = date.getDate()
    return `${year}/${month+1}/${day_of_month}`
  }, [sess.second_semester_end])



  return (
    <tr >
      <td className="border px-4 py-2">{sess.session}</td>
      <td className="border px-4 py-2">{start_date}</td>
      <td className="border px-4 py-2">{end_date}</td>
      <td className="border px-4 py-2">{sess.current ==0? 'No' : 'Yes'}</td>
    </tr>
  )
}