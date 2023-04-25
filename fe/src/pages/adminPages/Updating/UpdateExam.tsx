import { useEffect, useLayoutEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { base } from "../../../App"
import { assigned_course } from "../Viewing/ViewAssignedCourses"

export default function UpdateLectures() {
  const [exam, setExam] = useState({
    time: '',
    date: '',
    duration: '',
    course_id: '',
    lecturer_id: '',
    venue: '',
  })
  const { id } = useParams()
  const [courses, setCourses] = useState<assigned_course[]>([])
  const [lecturers, setLecturers] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [searchLect, setSearchLect] = useState('')
  
  const [errors, setErrors] = useState({
    time: '',
    date: '',
    duration: '',
    course_id: '',
    lecturer_id: '',
    venue: '',
  })
  const navigate = useNavigate()


  const [fetchError, setFetchError] = useState('')
  useEffect(() => {
    fetch(base + '/lecturers')
      .then(res => res.json())
      .then(data => setLecturers(data.lecturer))
      .catch(err => console.log(err))
  }, [])
  useEffect(() => {
    fetch(base + '/assign_course')
      .then(res => res.json())
      .then(data => {
        setCourses(data.data)
      })
      .catch((err: any) => alert(err?.message || 'something went wrong'))
  }, [])
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
    if (exam.course_id === '') {

      tempERR.course_id = 'Course code is required'
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
          course_id: '',
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
    if (validate()&&id) {
      try {
        const f = new FormData()
        f.append('time', exam.time)
        f.append('date', exam.date)
        f.append('duration', exam.duration)
        f.append('course_id', exam.course_id)
        f.append('lecturer_id', exam.lecturer_id)
        f.append('venue', exam.venue)
        f.append('id', id.toString())
        f.append('method', 'PUT')


        const res = await fetch(base+"/exam", {
          method: "POST",
          body: f
        })
        const data = await res.json()
      
        if (data.ok) {
          alert('success')
        } else {
          throw new Error(data?.status || 'something went wrong')
        }
      } catch (err:any) {
        alert(err?.message||'something went wrong')
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
        
        if (data.ok&&data.exams.length>0) {
          const l = data.exams[0]
          if(l===undefined){
            throw new Error('could not find course')
          }
          l.date = formatDateToYMD(l.date)
          setExam(l)
        } else {
          setFetchError('something went wrong')
        }
      })
      .catch((err) => {
        console.log(err)
        alert(err?.message||'something went wrong')
        navigate(-1)
        setFetchError('something went wrong')
      })
  }, [])

  const filteredCourses = useMemo(() => {
    return courses.filter(
      (course: any) => course.code.toLowerCase().includes(search.toLowerCase()) || course.title.toLowerCase().includes(search.toLowerCase())
    )
  }, [search, courses])

  const filteredLecturers = useMemo(() => {
    return lecturers.filter(i => (i.firstName + ' ' + i.lastName).toLowerCase().includes(searchLect.toLowerCase()) || i.email.toLowerCase().includes(searchLect.toLowerCase() || i.id.toLowerCase().includes(searchLect.toLowerCase())) || i.discipline.toLowerCase().includes(searchLect.toLowerCase()))
  }, [searchLect, lecturers])
  
  const delete_exam = async () => {
    const confirm = window.confirm('Are you sure you want to delete this exam?')
    if(id&&confirm){
      try {
        const formData = new FormData()
        formData.append('id', id.toString())
        formData.append('method', 'DELETE')

        const res = await fetch(base+"/exam", {
          method: "POST",
          body: formData
        })
        const data = await res.json()
        if (data.ok) {
          alert('success')
          navigate(-1)
        } else {
          throw new Error(data?.status || 'something went wrong')
        }
      } catch (err:any) {
        alert(err?.message||'something went wrong')
      }
    }
  }


  return (
    <div className="w-full h-[90vh] overflow-y-auto pb-[40px]">
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
          <label htmlFor="course_id">Course </label>
          {/* search courses */}
          <div className="flex">
            <label htmlFor="course_id" className="w-[25%] font-[400] text-[14px]"></label>
            <input type="text" name="course_id" id="course_id" value={search} onChange={({ target }) => setSearch(target.value)} className="w-[55%] h-[30px] rounded-[5px] bg-transparent border border-[#347836]  flex items-center focus:outline-none px-2 mb-2" placeholder="search for a course..." />
          </div>
          <select name="course_id" id="course_id" value={exam.course_id} onChange={handleChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836]  flex items-center focus:outline-none px-2">
            <option value="">Select Course </option>
            {filteredCourses.length ? filteredCourses.map((course: any) => {
              return (
                <option value={course.id}>{course.code?.toUpperCase()}({course.title})</option>
              )
            }) : <option value="" className="text-[#a22]">No Course</option>
            }
          </select>
        </div>
        <div className="w-full">
          <label htmlFor="lecturer_id">Lecturer </label>
          {errors.lecturer_id && <span className="text-red-500 text-xs">{errors.lecturer_id}</span>}
          {/* search lecturers */}
          <div className="flex">
            <label htmlFor="lecturer_id" className="w-[25%] font-[400] text-[14px]"></label>
            <input type="text" name="lecturer_id" id="lecturer_id" value={searchLect} onChange={({ target }) => setSearchLect(target.value)} className="w-[55%] h-[30px] rounded-[5px] bg-transparent border border-[#347836]  flex items-center focus:outline-none px-2 mb-2" placeholder="search for a lecturer..." />
          </div>

          <select name="lecturer_id" id="lecturer_id" value={exam.lecturer_id} onChange={handleChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836]  flex items-center focus:outline-none px-2">
            <option value="">Select Lecturer</option>
            {filteredLecturers.length ?
              filteredLecturers
                .map((lecturer: any) => {
                  return (
                    <option value={lecturer.id}>{lecturer.firstName} {lecturer.lastName}({lecturer.discipline})
                    </option>
                  )
                }) : <option value="" className="text-[#a22]">No Lecturer</option>}
          </select>
        </div>
        <div className="w-full">
          <label htmlFor="venue">Venue</label>
          <input type="text" name="venue" id="venue" value={exam.venue} onChange={handleChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] xs:p-2 stbt:p-4 xs:text-[14px] stbt:text-[18px] flex items-center focus:outline-none px-2" />
        </div>
        <button type="submit" className="w-full h-[40px] rounded-[5px] bg-[#347836] text-white xs:text-[14px] stbt:text-[18px]">Update</button>
      </form>
      <div className="w-[80vw] max-w-[400px] mx-auto mt-10 flex flex-col items-end" >
        <h4 className="text-[#347836]">Dangerous Operation</h4>
        <button className="bg-[#990000] px-2 rounded text-white py-2" onClick={delete_exam}>Delete Exmination</button>
      </div>
    </div>
  )
}