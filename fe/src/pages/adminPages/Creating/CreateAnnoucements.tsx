import { useEffect, useState } from "react"



export default function Annoucements() {
  const [form, setForm] = useState({
    title: '',
    type: '',
    content: '',
    date: '',
    time: '',
    targets: 'all'
  })
  const [errors, setErrors] = useState({
    title: '',
    type: '',
    content: '',
    date: '',
    time: '',
    targets: ''
  })
  const [announcements, setAnnouncements] = useState<any>([])

  useEffect(() => {
    fetch('http://localhost/webais/api/announcements')

      .then(res => res.json())
      .then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
  }, [])

  const onChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }
  const validate = () => {
    let tempErrors = { ...errors }
    let isValid = true
    if (form.title === '') {
      tempErrors.title = 'Title is required'
      isValid = false
    }
    if (form.type === '') {
      tempErrors.type = 'Type is required'
      isValid = false
    }
    if (form.content === '') {
      tempErrors.content = 'Content is required'
      isValid = false
    }
    if (form.date === '') {
      tempErrors.date = 'Date is required'
      isValid = false
    }
    if (form.time === '') {

      tempErrors.time = 'Time is required'
      isValid = false
    }
    if (form.targets === '') {
      tempErrors.targets = 'Targets is required'
      isValid = false
    }
    if (!isValid) {
      setErrors(tempErrors)
      setTimeout(() => {
        setErrors({
          title: '',
          type: '',
          content: '',
          date: '',
          time: '',
          targets: ''
        })
      }
        , 3000)
    }
    return isValid
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (validate()) {
      fetch(`http://localhost/webais/api/announcements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      }).then(res => res.json())
        .then(data => {
          console.log(data)
          alert('Announcement added successfully')
          setForm({
            title: '',
            type: '',
            content: '',
            date: '',
            time: '',
            targets: ''
          })
        }).catch(err => {
          console.log(err)
        })
    }else{
      console.log(errors)
    }
  }



  return (
    <div className="w-full h-[90vh] content-box overflow-auto pb-[30px]">
      <h2 className="text-center text-[22px] text-[#346837]">Announcements</h2>
      <form onSubmit={onSubmit} className="flex flex-col items-center gap-2 mx-auto w-80vw max-w-[400px]">
        <div className="w-full">
          <label htmlFor="title">Title</label>
          <input type="text" name="title" id="title" onChange={onChange} value={form.title} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] xs:p-2 stbt:p-4 xs:text-[14px] stbt:text-[18px] flex items-center focus:outline-none px-2" />
        </div>
        <div className="w-full">
          <label htmlFor="type">Type</label>
          <select name="type" id="type" onChange={onChange} value={form.type} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] xs:p-2 stbt:p-4 xs:text-[14px] stbt:text-[18px] flex items-center focus:outline-none px-2" >
            <option value="">Select Type</option>
            <option value="1">Announcement</option>
            <option value="2">Event</option>
          </select>
        </div>
        <div className="w-full">
          <label htmlFor="content">Content</label>
          <textarea  name="content" id="content" onChange={onChange} value={form.content} className="w-full h-[80px] rounded-[5px] bg-transparent border border-[#347836] xs:p-2 stbt:p-4 xs:text-[14px] stbt:text-[18px] flex items-center focus:outline-none px-2 resize-none" />
        </div>
        <div className="w-full">
          <label htmlFor="date">Date</label>
          <input type="date" name="date" id="date" onChange={onChange} value={form.date} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] xs:p-2 stbt:p-4 xs:text-[14px] stbt:text-[18px] flex items-center focus:outline-none px-2" />
        </div>
        <div className="w-full">
          <label htmlFor="time">Time</label>
          <input type="time" name="time" id="time" onChange={onChange} value={form.time} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] xs:p-2 stbt:p-4 xs:text-[14px] stbt:text-[18px] flex items-center focus:outline-none px-2" />
        </div>
        <div className="w-full">
          <label htmlFor="targets">Targets</label>
          <select  name="targets" id="targets" onChange={onChange} value={form.targets} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] xs:p-2 stbt:p-4 xs:text-[14px] stbt:text-[18px] flex items-center focus:outline-none px-2">
            <option value="all">All</option>
            <option value="students">Students</option>
            <option value="lecturers">Lecturers</option>
          </select>
        </div>
        <button type="submit" className="w-full h-[40px] rounded-[5px] bg-[#347836] text-white xs:text-[14px] stbt:text-[18px]">Submit</button>

      </form>
    </div>
  )
}