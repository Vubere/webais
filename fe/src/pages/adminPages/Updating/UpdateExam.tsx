import { useLayoutEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { base } from "../../../App"

export default function UpdateLectures() {
  const [exam, setExam] = useState({
    time: '',
    date: '',
    duration: '',
    course_code: '',
    lecturer_id: '',
    venue: '',
  })
  const { id } = useParams()
  
  const [errors, setErrors] = useState({
    time: '',
    date: '',
    duration: '',
    course_code: '',
    lecturer_id: '',
    venue: '',
  })
  const [fetchError, setFetchError] = useState('')
  const validate = () => {
    let isValid = true
    let tempERR = { ...errors }
    if (exam.time === '') {
      tempERR.time = 'Time is required'
      isValid = false
    }
    if (exam.date === '') {
      tempERR.date = 'Date is required'
      isValid = false
    }
    if (exam.duration === '') {
      tempERR.duration = 'Duration is required'
      isValid = false
    }
    if (exam.course_code === '') {

      tempERR.course_code = 'Course code is required'
      isValid = false
    }
    if (exam.lecturer_id === '') {
      tempERR.lecturer_id = 'Lecturer ID is required'
      isValid = false
    }
    if (exam.venue === '') {
      tempERR.venue = 'Venue is required'
      isValid = false
    }
    if (!isValid) {
      setErrors(tempERR)
      setTimeout(() => {
        setErrors({
          time: '',
          date: '',
          duration: '',
          course_code: '',
          lecturer_id: '',
          venue: '',
        })
      }, 2000)
    }
    return isValid
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setExam({
      ...exam,
      [name]: value,
    })
  }
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (validate()) {
      try {
        const res = await fetch("http://localhost/webais/api/exam", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, ...exam }),
        })
        const data = await res.json()
        if (data.ok) {
          alert('success')
        } else {
          throw new Error(data?.status || 'something went wrong')
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
  const formatDateToYMD = (date: string) => {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = d.getMonth() + 1
    const day = d.getDate()
    const addZero = (n: number) => (n < 10 ? `0${n}` : n)
    return `${year}-${addZero(month)}-${addZero(day)}`
  }
  useLayoutEffect(() => {
    fetch(base+"/exam?id=" + id)
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        if (data.ok&&data.exams.length>0) {
          const l = data.exams[0]
          l.date = formatDateToYMD(l.date)
          setExam(l)
        } else {
          setFetchError('something went wrong')
        }
      })
      .catch((err) => {
        console.log(err)
        setFetchError('something went wrong')
      })
  }, [])


  return (
    <div>
      <h1 className="font-[600] text-[#347836] text-[28px] text-center leading-[40px]">Update Examination</h1>
      <form onSubmit={onSubmit} className="flex flex-col items-center gap-2 max-w-[400px] w-[80vw] gap-4 mx-auto">

        <div className="w-full">
          <label htmlFor="time">Time</label>
          <select name="time" id="time" value={exam.time} onChange={handleChange}
            className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836]  flex items-center focus:outline-none px-2">
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
          <label htmlFor="date">Date</label>
          <input type="date" name="date" id="date" value={exam.date} onChange={handleChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] xs:p-2 stbt:p-4 xs:text-[14px] stbt:text-[18px] flex items-center focus:outline-none px-2" />
        </div>
        <div className="w-full">
          <label htmlFor="duration">Duration</label>
          <select name="duration" id="duration" value={exam.duration} onChange={handleChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836]  flex items-center focus:outline-none px-2">
            <option value="">Select Duration</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>
        <div className="w-full">
          <label htmlFor="course_code">Course Code</label>
          <input type="text" name="course_code" id="course_code" value={exam.course_code} onChange={handleChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] xs:p-2 stbt:p-4 xs:text-[14px] stbt:text-[18px] flex items-center focus:outline-none px-2" />
        </div>
        <div className="w-full">
          <label htmlFor="lecturer_id">Lecturer ID</label>
          <input type="text" name="lecturer_id" id="lecturer_id" value={exam.lecturer_id} onChange={handleChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] xs:p-2 stbt:p-4 xs:text-[14px] stbt:text-[18px] flex items-center focus:outline-none px-2" />
        </div>
        <div className="w-full">
          <label htmlFor="venue">Venue</label>
          <input type="text" name="venue" id="venue" value={exam.venue} onChange={handleChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] xs:p-2 stbt:p-4 xs:text-[14px] stbt:text-[18px] flex items-center focus:outline-none px-2" />
        </div>
        <button type="submit" className="w-full h-[40px] rounded-[5px] bg-[#347836] text-white xs:text-[14px] stbt:text-[18px]">Update</button>
      </form>
    </div>
  )
}