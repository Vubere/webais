import { useLayoutEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { base } from "../../../App"

import { formatDateToYMD } from "../../../helpers/formatDate"

export default function UpdateLectures() {
  const [lectures, setLectures] = useState({
    time: '',
    day: '',
    duration: '',
    code: '',
    lecturer_id: '',
    venue: '',
  })
  console.log(lectures)
  const { id } = useParams()
  const [errors, setErrors] = useState({
    time: '',
    day: '',
    duration: '',
    code: '',
    lecturer_id: '',
    venue: '',
  })
  const navigate = useNavigate()
  const [fetchError, setFetchError] = useState('')
  const validate = () => {
    let isValid = true
    let tempERR = { ...errors }
    if (lectures.time === '') {
      tempERR.time = 'Time is required'
      isValid = false
    }
    if (lectures.day === '') {
      tempERR.day = 'Date is required'
      isValid = false
    }
    if (lectures.duration === '') {
      tempERR.duration = 'Duration is required'
      isValid = false
    }
    if (lectures.code === '') {

      tempERR.code = 'Course code is required'
      isValid = false
    }
    if (lectures.lecturer_id === '') {
      tempERR.lecturer_id = 'Lecturer ID is required'
      isValid = false
    }
    if (lectures.venue === '') {
      tempERR.venue = 'Venue is required'
      isValid = false
    }
    if (!isValid) {
      setErrors(tempERR)
      setTimeout(() => {
        setErrors({
          time: '',
          day: '',
          duration: '',
          code: '',
          lecturer_id: '',
          venue: '',
        })
      }, 2000)
    }
    return isValid
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setLectures({
      ...lectures,
      [name]: value,
    })
  }
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (validate()) {
      try {
        const f = new FormData()
        f.append('id', id?.toString() as string)
        f.append('time', lectures.time)
        f.append('day', lectures.day)
        f.append('duration', lectures.duration)
        f.append('code', lectures.code)
        f.append('lecturer_id', lectures.lecturer_id)
        f.append('venue', lectures.venue)

        const res = await fetch(base+"/lectures", {
          method: "PUT",
          body: f
        })
        const data = await res.json()
        console.log(data)
        if (data.ok) {
          alert('Lecture Updated Successfully')
        } else {
          throw new Error(data?.status || 'something went wrong')
        } 
      } catch (err) {
        console.log(err)
      }
    }
  }

  useLayoutEffect(() => {
    fetch(base+"/lectures?id=" + id)
      .then((res) => res.json())
      .then((data) => {

        if (data.ok) {
          const l = data.lectures[0]
          l.day = l.day?.toLowerCase();
          setLectures(l)
        } else {
          throw new Error('something went wrong')
        }
      })
      .catch((err) => {
        alert(err?.message || 'something went wrong')
        setFetchError('something went wrong')
      })
  }, [])

  const delete_lecture = () => {
    const confirm = window.confirm('Are you sure you want to delete this lecture?')
    if (!confirm) return
    fetch(base+"/lectures", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          alert('Lecture Deleted Successfully')
          navigate(-1)
        } else {
          throw new Error(data?.status || 'something went wrong')
        }
      })
      .catch((err) => {
        alert(err?.message || 'something went wrong')
      })
  }


  return (
    <div className="w-full flex flex-col items-center h-[90vh] overflow-y-auto pb-[30px]">
      <h1 className="font-[600] text-[#347836] text-[28px] text-center leading-[40px]">Update Lectures</h1>
      <form onSubmit={onSubmit} className="flex flex-col items-center gap-2 max-w-[400px] w-[80vw] gap-4 mx-auto">

        <div className="w-full">
          <label htmlFor="time">Time</label>
          <select name="time" id="time" value={lectures.time} onChange={handleChange}
            className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] flex items-center focus:outline-none px-2">
            <option value="">Select Time</option>
            <option value="8:00">8:00</option>
            <option value="9:00">9:00</option>
            <option value="10:00">10:00</option>
            <option value="11:00">11:00</option>
            <option value="12:00">12:00</option>
            <option value="13:00">13:00</option>
            <option value="14:00">14:00</option>
            <option value="15:00">15:00</option>
            <option value="16:00">16:00</option>
          </select>
        </div>
        <div className="w-full">
          <label htmlFor="day">Day</label>
          <select name="day" id="day" value={lectures.day} onChange={handleChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] flex items-center focus:outline-none px-2">
            <option value="">Select Day</option>
            <option value="monday">Monday</option>
            <option value="tuesday">Tuesday</option>
            <option value="wednesday">Wednesday</option>
            <option value="thursday">Thursday</option>
            <option value="friday">Friday</option>

          </select>
        </div>
        <div className="w-full">
          <label htmlFor="duration">Duration</label>
          <select name="duration" id="duration" value={lectures.duration} onChange={handleChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836]  flex items-center focus:outline-none px-2">
            <option value="">Select Duration</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>
        <div className="w-full">
          <label htmlFor="code">Course Code</label>
          <input type="text" name="code" id="code" value={lectures.code} onChange={handleChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] xs:p-2 stbt:p-4 xs:text-[14px] stbt:text-[18px] flex items-center focus:outline-none px-2" />
        </div>
        <div className="w-full">
          <label htmlFor="lecturer_id">Lecturer ID</label>
          <input type="text" name="lecturer_id" id="lecturer_id" value={lectures.lecturer_id} onChange={handleChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] flex items-center focus:outline-none px-2" />
        </div>
        <div className="w-full">
          <label htmlFor="venue">Venue</label>
          <input type="text" name="venue" id="venue" value={lectures.venue} onChange={handleChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] xs:p-2 stbt:p-4 xs:text-[14px] stbt:text-[18px] flex items-center focus:outline-none px-2" />
        </div>
        <button type="submit" className="w-full h-[40px] rounded-[5px] bg-[#347836] text-white xs:text-[14px] stbt:text-[18px]">Update</button>
      </form>
      <div className="w-[80vw] max-w-[400px] mx-auto mt-10 flex flex-col items-end" >
        <h4 className="text-[#347836]">Dangerous Operation</h4>
        <button className="bg-[#990000] px-2 rounded text-white py-2" onClick={delete_lecture}>Delete Lecturer</button>
      </div>
    </div>
  )
}