import { useContext, useEffect, useMemo, useState } from "react"
import { base } from "../../../App"
import { assigned_course } from "../Viewing/ViewAssignedCourses"
import { SessionContext } from "../../../layouts/DashboardLayout"

export default function CreateLectures() {
  const [exam, setExams] = useState({
    time: '',
    date: '',
    duration: '',
    course_id: '',
    lecturer_id: '',
    venue: '',

  })
  const [courses, setCourses] = useState<assigned_course[]>([])
  const [lecturers, setLecturers] = useState<any[]>([])
  const [errors, setErrors] = useState({
    time: '',
    date: '',
    duration: '',
    course_id: '',
    lecturer_id: '',
    venue: '',
  })
  const [search, setSearch] = useState('')
  const [searchLect, setSearchLect] = useState('')
  const Session = useContext(SessionContext)

  useEffect(() => {
    fetch(base + '/lecturers')
      .then(res => res.json())
      .then(data => {
        if (data.status == 'success')
          setLecturers(data.lecturer)
        else
          throw new Error('something went wrong')
      })
      .catch(err => console.log(err))
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
  useEffect(() => {

    fetch(base + '/assign_course')
      .then(res => res.json())
      .then(data => {
        console.log(data)
        if (data.ok == 1)
          setCourses(data.data)
        else
          throw new Error('something went wrong')
      })
      .catch((err: any) => alert(err?.message || 'something went wrong'))
  }, [])


  const onSubmit = (e: any) => {
    e.preventDefault()
    if (Session?.session) {

      const f = new FormData()
      f.append('time', exam.time)
      f.append('date', exam.date)
      f.append('duration', exam.duration)
      f.append('course_id', exam.course_id)
      f.append('lecturer_id', exam.lecturer_id)
      f.append('venue', exam.venue)
      f.append('session', Session.session.session)
      f.append('semester', Session.session.current_semester.toString())

      f.append('method', 'POST')

      if (validate()) {
        fetch(base + '/create_exam', {
          method: 'POST',
          body: f
        }).then(res => res.json())
          .then(data => {
            console.log(data)
            if (data.ok) {
              alert('Examination created successfully')
              setExams({
                time: '',
                date: '',
                duration: '',
                course_id: '',
                lecturer_id: '',
                venue: '',
              })
            }
          }).catch(err => {
            console.log(err)
          })
      }
    }
  }
  const handleChange = (e: any) => {
    setExams({
      ...exam,
      [e.target.name]: e.target.value
    })
  }
  const filteredCourses = useMemo(() => {
    return courses.filter(
      (course: any) => course.code.toLowerCase().includes(search.toLowerCase()) || course.title.toLowerCase().includes(search.toLowerCase())
    )
  }, [search, courses])

  const filteredLecturers = useMemo(() => {
    return lecturers.filter(i => (i.firstName + ' ' + i.lastName).toLowerCase().includes(searchLect.toLowerCase()) || i.email.toLowerCase().includes(searchLect.toLowerCase() || i.id.toLowerCase().includes(searchLect.toLowerCase())) || i.discipline.toLowerCase().includes(searchLect.toLowerCase()))
  }, [searchLect, lecturers])

  return (
    <div className="w-full h-[90vh] content-box overflow-auto pb-[30px]">
      <h3 className="text-center text-[22px] text-[#346837]">Schedule Examinations</h3>
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
          <input type="date" name="date" id="date" value={exam.date} onChange={handleChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] flex items-center focus:outline-none px-2" />
        </div>
        <div className="w-full">
          <label htmlFor="duration">Duration</label>
          <select name="duration" id="duration" value={exam.duration} onChange={handleChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] flex items-center focus:outline-none px-2">
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
        <button type="submit" className="w-full h-[40px] rounded-[5px] bg-[#347836] text-white xs:text-[14px] stbt:text-[18px]">Create</button>
      </form>
    </div>

  )
}