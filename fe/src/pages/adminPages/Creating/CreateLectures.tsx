import { useEffect, useMemo, useState } from "react"
import { base } from "../../../App"
import { Course } from "../../StudentPages/AvailableCourses"

export default function CreateLectures() {
  const [lectures, setLectures] = useState({
    time: '',
    day: '',
    duration: '',
    course_id: '',
    lecturer_id: '',
    venue: '',
  })
  
  const [search, setSearch] = useState('')
  const [searchLect, setSearchLect] = useState('')
  const [errors, setErrors] = useState({
    time: '',
    day: '',
    duration: '',

    course_id: '',
    lecturer_id: '',
    venue: '',
  })
  const [courses, setCourses] = useState<Course[]>([])
  const [lecturers, setLecturers] = useState<any[]>([])
  useEffect(() => {

    fetch(base+'/courses')
      .then(res => res.json())
      .then(data => setCourses(data.data))
      .catch(err => console.log(err))
  }, [])
  useEffect(() => {

    fetch(base+'/lecturers')
      .then(res => res.json())
      .then(data => setLecturers(data.lecturer))
      .catch(err => console.log(err))
  }, [])

  const validate = () => {
    let isValid = true
    let tempERR = { ...errors }
    if (lectures.time === '') {
      tempERR.time = 'Time is required'
      isValid = false
    }
    if (lectures.day === '') {
      tempERR.day = 'Day is required'
      isValid = false
    }
    if (lectures.duration === '') {
      tempERR.duration = 'Duration is required'
      isValid = false
    }
    if (lectures.course_id === '') {
      tempERR.course_id = 'Course code is required'
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
          course_id: '',
          lecturer_id: '',
          venue: '',
        })
      }, 2000)
    }
    return isValid
  }
  const reset = () => {
    setLectures({
      time: '',
      day: '',
      duration: '',
      course_id: '',
      lecturer_id: '',
      venue: '',
    })
  }


  const onSubmit = (e: any) => {
    e.preventDefault()
    if (validate()) {
      const f = new FormData()
      f.append('time', lectures.time)
      f.append('day', lectures.day)
      f.append('duration', lectures.duration)
      f.append('course_id', lectures.course_id)
      f.append('lecturer_id', lectures.lecturer_id)
      f.append('venue', lectures.venue)

      fetch(base+'/create_lecture', {
        method: 'POST',
        body: f
      }).then(res => res.json())
        .then(data => {
          console.log(data)
          if (data.ok) {
            alert('Lecture created successfully')
            reset()
          }
        }).catch(err => {
          console.log(err)
        })
    }
  }
  const handleChange = (e: any) => {
    setLectures({
      ...lectures,
      [e.target.name]: e.target.value
    })
  }
  const filteredLecturers = useMemo(() => {
    return lecturers.filter(i => (i.firstName + ' ' + i.lastName).toLowerCase().includes(searchLect.toLowerCase()) || i.email.toLowerCase().includes(searchLect.toLowerCase() || i.id.toLowerCase().includes(searchLect.toLowerCase())) || i.discipline.toLowerCase().includes(searchLect.toLowerCase()))
  }, [searchLect, lecturers])

  const filteredCourses = useMemo(() => {
    return courses.filter(
      (course: any) => course.code.toLowerCase().includes(search.toLowerCase()) || course.title.toLowerCase().includes(search.toLowerCase())
    )
  }, [search, courses])

  return (
    <div className="w-full h-[90vh] content-box overflow-auto pb-[30px]">
      <h1 className="text-center text-[22px] text-[#346837]">Schedule Lectures</h1>
      <form onSubmit={onSubmit} className="flex flex-col items-center gap-2 max-w-[400px] w-[80vw] gap-4 mx-auto">

        <div className="w-full">
          <label htmlFor="time">Time</label>
          {errors.time && <span className="text-red-500 text-xs">{errors.time}</span>}
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
          {errors.day && <span className="text-red-500 text-xs">{errors.day}</span>}
          <select name="day" id="day" className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836]  focus:outline-none px-2 text-[16px] text-[#000]" onChange={handleChange}>
            <option value="">select day</option>
            <option value="monday">Monday</option>
            <option value="tuesday">Tuesday</option>
            <option value="wednesday">Wednesday</option>
            <option value="thursday">Thursday</option>
            <option value="friday">Friday</option>
          </select>
        </div>
        <div className="w-full">
          <label htmlFor="duration">Duration</label>
          {errors.duration && <span className="text-red-500 text-xs">{errors.duration}</span>}
          <select name="duration" id="duration" value={lectures.duration} onChange={handleChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836]  flex items-center focus:outline-none px-2">
            <option value="">Select Duration</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>
        <div className="w-full">
          <label htmlFor="course_id">Course </label>
          {errors.course_id && <span className="text-red-500 text-xs">{errors.course_id}</span>}
          {/* search courses */}
          <div className="flex">
            <label htmlFor="course_code" className="w-[25%] font-[400] text-[14px]"></label>
            <input type="text" name="course_code" id="course_code" value={search} onChange={({ target }) => setSearch(target.value)} className="w-[55%] h-[30px] rounded-[5px] bg-transparent border border-[#347836]  flex items-center focus:outline-none px-2 mb-2" placeholder="search for a course..." />
          </div>
          <select name="course_id" id="course_id" value={lectures.course_id} onChange={handleChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836]  flex items-center focus:outline-none px-2">
            <option value="">Select Course </option>
            {filteredCourses.length ? filteredCourses.map((course: any) => {
              return (
                <option value={course.id}>{course.code}({course.title})</option>
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

          <select name="lecturer_id" id="lecturer_id" value={lectures.lecturer_id} onChange={handleChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836]  flex items-center focus:outline-none px-2">
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
          {errors.venue && <span className="text-red-500 text-xs">{errors.venue}</span>}
          <input type="text" name="venue" id="venue" value={lectures.venue} onChange={handleChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] xs:p-2 stbt:p-4 xs:text-[14px] stbt:text-[18px] flex items-center focus:outline-none px-2" />
        </div>
        <button type="submit" className="w-full h-[40px] rounded-[5px] bg-[#347836] text-white xs:text-[14px] stbt:text-[18px]">Create</button>
      </form>
    </div>

  )
}