import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { base } from "../../../App"
import { Announcement } from "./ViewAnnouncements"


export default function ViewAnnouncement(){
  const [announcement, setAnnouncement] = useState<Announcement>()
  const [error, setError] =   useState('')
  const [loading, setLoading] = useState(false)
  
  const {id} = useParams()
  const navigate = useNavigate()

  useEffect(()=>{
    setLoading(true)
    fetch(base+`/announcements?id=${id}`)
    .then(res=>res.json())
    .then(res=>{
      if(res?.status=='success'){
        setAnnouncement(res.annoucements[0])
      }else{
        throw new Error(res?.message||'Something went wrong')
      }
      setLoading(false)
    }).catch(err=>{
      setError(err)
      setLoading(false)
      navigate(-1)
    })
  },[id])

  const delete_announcement = async ()=>{
    const confirm = window.confirm('are you sure you want to delete announcements')
    if(confirm){
      setLoading(true)
      const formData = new FormData()
      formData.append('id',id as string)
      formData.append('method','DELETE')

      fetch(base+`/announcements`,{
        method:'POST',
        body:formData
      })
      .then(res=>res.json())
      .then(res=>{
        if(res?.status=='success'){
          alert('Announcement deleted successfully')
          navigate(-1)
        }else{
          throw new Error(res?.message||'Something went wrong')
        }
        setLoading(false)
      }).catch(err=>{
        alert(err?.message||'something went wrong')
        setError(err)
        setLoading(false)
      })
    }
  }



  return (
    <section className="p-3 flex items-center flex-col max-w-[400px] flex flex-col items-center mx-auto">
      {
        announcement&&(
          <article className="w-[80vw] max-w-[500px] p-3">
            <div>
             
              <h3 className="text-[22px] text-[#348247] font-[600] w-full text-center">{announcement.title} ({announcement.type})</h3>
              <p className="max-w-500px text-[18px]">{announcement.content}</p>
            </div>
            <div>
              <p ><span>Sent on: </span>{announcement.date} at {announcement.time}</p>
              <p><span className="font-[500] inline-block\">Sent to:</span> {announcement.target} at {announcement.created_at}</p>
            </div>
          </article>
        )
      }
      <div className="flex w-full justify-end">
        <button className="bg-[#a00] text-white px-3 py-1 rounded-[5px]" onClick={delete_announcement}>Delete</button>
      </div>
    </section>
  )
}