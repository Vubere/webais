import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Announcement } from "./Announcements"


export default function ViewAnnouncement() {
  const [announcement, setAnnouncement] = useState<Announcement>()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { id } = useParams()

  useEffect(() => {
    setLoading(true)
    fetch(`http://localhost/webais/api/announcements?id=${id}`)
      .then(res => res.json())
      .then(res => {
        if (res?.status == 'success') {

          setAnnouncement(res.annoucements[0])
        } else {
          throw new Error(res?.message || 'Something went wrong')
        }
        setLoading(false)
      }).catch(err => {
        setError(err)
        setLoading(false)
      })
  }, [id])



  return (
    <section className="p-3 flex items-center flex-col">
      {
        announcement && (
          <article className="w-[80vw] max-w-[500px] p-3">
            <div>

              <h3 className="text-[22px] text-[#348247] font-[600] w-full text-center">{announcement.title} ({announcement.type})</h3>
              <p className="max-w-500px text-[18px]">{announcement.content}</p>
            </div>
            <div>
              <p ><span>Sent on: </span>{announcement.date} at {announcement.time}</p>
            </div>
          </article>
        )
      }
    </section>
  )
}