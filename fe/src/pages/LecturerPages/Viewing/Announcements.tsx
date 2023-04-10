import { useEffect, useState } from "react"
import { Link } from "react-router-dom"




export default function Annoucement(){
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')


  const getAnnouncements = async () => {
    setLoading(true)
    try {
      const res = await fetch(`http://localhost/webais/api/announcements`)
      const data = await res.json()
      setAnnouncements(data.annoucements.filter((item:any)=>item.target=='lecturers'||item.target=='all'))

      setLoading(false)
    } catch (err: any) {
      setError(err?.message)
      setLoading(false)
    }
  }
  useEffect(() => {
    getAnnouncements()
  }, [])

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setSearch(e.target.value)
  }
  const filtered = announcements.filter(annoucement => annoucement.title.toLowerCase().includes(search.toLowerCase()) || annoucement.content.toLowerCase().includes(search.toLowerCase()))

  return (
    <section className="h-[90vh] overflow-y-auto p-3">


      <h4 className="font-[600] text-[#347836] text-[28px] text-center leading-[40px]">Announcements</h4>
      <div className="body flex flex-col gap-2 justify-center">

        <div className="search flex flex-col gap-3 w-[80vw] max-w-[200px]">
          <label htmlFor="search" className="w-[40%] max-w-[60px] ">Search</label>
          <input type="text" className="w-[60%] h-[40px] rounded-[5px] bg-transparent border border-[#347836] xs:p-2 stbt:p-4 xs:text-[14px] stbt:text-[18px] flex items-center focus:outline-none px-2" id="search" name="search" onChange={onChange} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 w-full justify-center">
        {
          loading ? <div>Loading...</div> : error ? <div>{error}</div> : filtered.length ? filtered.map((annoucement) => (
            <article className="w-[80vw] max-w-[300px] border p-3 rounded my-2 flex flex-col justify-between gap-2">
              <div>
                <div className="w-full flex justify-end">
                  <Link to={`/dashboard-student/announcement/${annoucement.id}`} className="text-[#347836] font-[600]">View</Link>
                </div>
                <h3 className="text-[18px] text-[#348247] font-[600]">{annoucement.title} ({annoucement.type})</h3>
                <p>{annoucement.content.length > 100 ? annoucement.content.slice(0, 120) + '...' : annoucement.content}</p>
              </div>
              <div>
                <p ><span>Sent on: </span>{annoucement.date}</p>
                <p>{annoucement.time}</p>
                <p><span className="font-[500] inline-block">Sent to:</span> {annoucement.target} at {annoucement.created_at}</p>
              </div>
            </article>)) : <div>No Announcements</div>
        }
      </div>
    </section >
  )
}

export type Announcement = {
  id: number
  title: string
  type: string
  content: string
  date: string
  time: string
  target: string,
  created_at: string
}