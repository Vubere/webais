import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { base } from "../../../App"
import { assigned_course } from "../Viewing/ViewAssignedCourses"

import { MultiSelect } from "react-multi-select-component"
import useFacultiesAndDepartments from "../../../hooks/useFacultiesAndDepartments"
import { isValid } from "date-fns"

interface ac extends assigned_course {
  faculties: string[]
}


export default function UpdateAssignedCourse() {
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [assigned, setAssigned] = useState<ac>({
    id: 0,
    title: '',
    faculties: [],
    description: '',
    course_id: 0,
    departments: [],
    semester: 0,
    session: '',
    units: 0,
    code: '',
    type: 'elective',
    level: 0,
    assigned_lecturers: [],
    registration_open: false,
    grading_open: false
  })

  const [errors, setErrors] = useState({
    code: '',
    type: '',
    units: '',
    departments: '',
    course_id: '',
    session: '',
    semester: '',
    faculties: '',
    level: '',
    assigned_lecturers: '',
    id: ''
  })
  const [lecturers, setLecturers] = useState<any[]>([])
  const { departments, faculties, error, loading: facLoading } = useFacultiesAndDepartments()
  const [selectedFaculties, setSelectedFaculties] = useState<any[]>([])
  const [selectedDepartments, setSelectedDepartments] = useState<any[]>([])
  const [lecturer, setLecturer] = useState<{ id: string, assigned_departments: any[] }>({
    id: '',
    assigned_departments: [],
  })
  useEffect(() => {
    if (id)
      fetch(base + '/assign_course?id=' + id)
        .then(res => res.json())
        .then((data: any) => {
          if (data?.ok) {
            setAssigned(data.data[0])
            setSelectedDepartments(data.data[0]?.departments)
            setLoading(false)
          } else {
            throw new Error(data?.message || 'something went wrong')
          }
        })
        .catch(err => {
          alert(err?.message || 'failed to fetch assigned courses')
          setLoading(false)
        })
  }, [id])
  useEffect(() => {
    if (departments && faculties && assigned.departments) {
      const r = departments.filter((department) => {
        return assigned.departments?.includes(department.id)
      }).map(dept => dept.faculty_id)
      setFaculties(r)
    }

  }, [departments, faculties])
  useEffect(() => {
    fetch(base + '/lecturers')
      .then(res => res.json())
      .then((data: any) => {
        if (data?.status == 'success') {
          setLecturers(data.lecturer)
        }
      }).catch(err => {
        alert(err?.message || 'something went wrong')

        setLoading(false)
      })
  }, [])

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (Validate()) {
      fetch(base + '/assign_course', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(assigned)
      })
        .then(res => res.json())
        .then((data: any) => {
          if (data?.ok) {
            alert('course updated successfully')
          } else {
            throw new Error(data?.message || 'something went wrong')
          }
        })
        .catch(err => {
          alert(err?.message || 'failed to fetch assigned courses')
          setLoading(false)
        })

    }

  }

  const Validate = () => {
    let valid = true
    const temp = { ...errors }
    if (assigned.code === '') {
      temp.code = 'Course code is required'
      valid = false
    }
    if (assigned.type === '') {
      temp.type = 'Course type is required'
      valid = false
    }
    if (assigned.units === 0) {
      temp.units = 'Course units is required'
      valid = false
    }
    if (assigned.departments.length === 0) {
      temp.departments = 'Course departments is required'
      valid = false
    }
    if (assigned.course_id === 0) {
      temp.course_id = 'Course is required'
      valid = false
    }
    if (assigned.session === '') {
      temp.session = 'Course session is required'
      valid = false
    }
    if (assigned.semester === 0) {
      temp.semester = 'Course semester is required'
      valid = false
    }

    if (assigned.level === 0) {
      temp.level = 'Course level is required'
      valid = false
    }

    if (!valid) {
      setErrors(temp)
      setTimeout(() => {
        setErrors({
          code: '',
          type: '',
          units: '',
          departments: '',
          course_id: '',
          session: '',
          semester: '',
          faculties: '',
          level: '',
          assigned_lecturers: '',
          id: ''
        })
      }, 3000)
    }
    return valid
  }
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

    setAssigned({ ...assigned, [e.target.name]: e.target.value })
  }
  const year = new Date().getFullYear()

  const setDepartments = (val: any) => {
    setSelectedDepartments(val)
    setAssigned({
      ...assigned,
      departments: val.map((item: any) => item.value)
    })
  }
  const setFaculties = (val: any) => {
    setSelectedFaculties(val)
    setAssigned({
      ...assigned,
      faculties: val.map((item: any) => item.value)
    })
  }
  const departmentOptions = departments?.map((department) => {
    return {
      label: department.name,
      value: department.id,
    }
  })
  const facultyOptions = faculties?.map((faculty) => {
    return {
      label: faculty.name,
      value: faculty.id,
    }
  })
  const deleteLect = (index: number) => {
    const newLecturers = assigned.assigned_lecturers.filter((_: any, i: number) => i != index)
    setAssigned({
      ...assigned,
      assigned_lecturers: newLecturers
    })
  }
  const addLecturer = () => {
    if (lecturer.id === '') {
      setErrors({
        ...errors,
        assigned_lecturers: 'Lecturer ID is required'
      })
      setTimeout(() => {
        setErrors({
          ...errors,
          assigned_lecturers: ''
        })
      }, 2000)
      return
    }
    if (lecturer.assigned_departments.length === 0) {
      setErrors({
        ...errors,
        assigned_lecturers: 'Assigned department is required'
      })
      setTimeout(() => {
        setErrors({
          ...errors,
          assigned_lecturers: ''
        })
      }, 2000)
      return
    }
    const dept = lecturer.assigned_departments.map(item => item.value)
    const newLecturer = {
      id: lecturer.id,
      assigned_departments: dept,
    }
    setAssigned({
      ...assigned,
      assigned_lecturers: [...assigned.assigned_lecturers, newLecturer]
    })
    setLecturer({
      id: '',
      assigned_departments: [],
    })
  }
  const delete_course = () => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      fetch(base + '/assign_course', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: assigned.id })
      })
        .then(res => res.json())
        .then((data: any) => {
          if (data?.ok) {
            alert('course deleted successfully')
            navigate(-1)
          } else {
            throw new Error(data?.message || 'something went wrong')
          }
        })
        .catch(err => {
          alert(err?.message || 'failed to fetch assigned courses')
          setLoading(false)
        })
    }
  }



  return (
    <div className="flex flex-col h-[90vh] overflow-y-auto pb-[50px]">
      <h2 className="font-[700] text-[20px] text-[#346837] text-center" >Update Assigned Course</h2>
      <section className="w-full flex flex-col items-center">
        <h3>{assigned?.title?.toUpperCase()}</h3>
        <p>{assigned?.description}</p>
        <form onSubmit={onSubmit} className="flex flex-col gap-2">
          <div className="w-full">
            <label htmlFor="code">Course Code *</label>
            {errors.code && <span className="text-red-500 text-[12px]">{errors.code}</span>}
            <input type="text" name="code" id="code" value={assigned?.code} onChange={onChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] xs:p-2 stbt:p-4 xs:text-[14px] stbt:text-[18px] flex items-center focus:outline-none px-2" />
          </div>
          <div className="w-full">
            <label htmlFor="type">Type *</label>
            {errors.type && <span className="text-red-500 text-[12px]">{errors.type}</span>}
            <select name="type" id="type" value={assigned?.type} onChange={onChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836]  flex items-center focus:outline-none px-2" >
              <option value=''>Select Type</option>
              <option value='elective'>Elective</option>
              <option value='compulsory'>Compulsory</option>
            </select>
          </div>
          <div className="w-full">
            <label htmlFor="unit">Unit *</label>
            {errors.units && <span className="text-red-500 text-[12px]">{errors.units}</span>}
            <input type="number" name="units" id="unit" value={assigned?.units} onChange={onChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] xs:p-2 stbt:p-4 xs:text-[14px] stbt:text-[18px] flex items-center focus:outline-none px-2" />
          </div>
          <div className="w-full">
            <label htmlFor="faculty">Faculties *</label>

            {!error && !loading &&
              <MultiSelect
                options={facultyOptions}
                hasSelectAll={false}
                value={selectedFaculties}
                onChange={setFaculties}
                labelledBy={"Select faculties"}
                className="w-full border border-[#347836] rounded-[5px]"
              />
            }
          </div>
          <div className="w-full">
            <label htmlFor="department">Departments *</label>
            {errors.departments && <span className="text-red-500 text-[12px]">{errors.departments}</span>}
            {
              !error && !loading &&
              <MultiSelect
                options={departmentOptions}
                hasSelectAll={false}
                value={selectedDepartments}
                onChange={setDepartments}
                labelledBy={"Select Departments"}
                className="w-full border border-[#347836] rounded-[5px]"
              />
            }
          </div>
          <div className="w-full">
            <label htmlFor="level">Level *</label>
            {errors.level && <span className="text-red-500 text-[12px]">{errors.level}</span>}
            <select name="level" id="level" value={assigned?.level} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836]  flex items-center focus:outline-none px-2" onChange={onChange}>
              <option value="">Select Level</option>
              <option value="100">100</option>
              <option value="200">200</option>
              <option value="300">300</option>
              <option value="400">400</option>
              <option value="500">500</option>
              <option value="600">600</option>
            </select>
          </div>
          <div className="w-full">
            <label htmlFor="semester">Semester *</label>
            {errors.semester && <span className="text-red-500 text-[12px]">{errors.semester}</span>}
            <select name="semester" id="semester" value={assigned?.semester} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836]  flex items-center focus:outline-none px-2" onChange={onChange}>
              <option value="">Select Semester</option>
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </div>
          <div className="w-full">
            <label htmlFor="session">Session</label>
            <select name="session" id="session" value={assigned?.session} onChange={onChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] flex items-center focus:outline-none px-2">
              <option value="">Select Session </option>
              <option value={`${year + 2}/${year + 3}`}>{`${year + 2}/${year + 3}`}</option>
              <option value={`${year + 1}/${year + 2}`}>{`${year + 1}/${year + 2}`}</option>
              <option value={`${year}/${year + 1}`}>{`${year}/${year + 1}`}</option>
              <option value={`${year - 1}/${year}`}>{`${year - 1}/${year}`}</option>
              <option value={`${year - 2}/${year - 1}`}>{`${year - 2}/${year - 1}`}</option>
              <option value={`${year - 3}/${year - 2}`}>{`${year - 3}/${year - 2}`}</option>
            </select>
            <p className="red">{errors.session}</p>
          </div>
          <div className="flex flex-col w-full">
            <h3 className="font-[500] text-[18px] text-center text-[#347836]">Assign Lecturers</h3>
            {errors.assigned_lecturers && <span className="text-red-500 text-[12px]">{errors.assigned_lecturers}</span>}
            {
              assigned?.assigned_lecturers?.length > 0 && <ul className="flex flex-col gap-2">
                {assigned?.assigned_lecturers.map((item: any, index: any) => {
                  let temp = item.assigned_departments
                  temp.map((item: any, index: number) => {

                    const f = departments.find((d) => d.id == item)
                    if (f) {
                      temp[index] = f.name
                    }
                  })
                  const h = lecturers.find((l) => l.id == item.id)


                  return (
                    <li key={index} className="flex flex-col gap-2">
                      {h.firstName} {h.lastName}({h.discipline}) :
                      <p>
                        {temp.join(', ')}
                      </p>
                      <button onClick={() => deleteLect(index)} className=" bg-[#f44] text-[#fff] font-[500] w-[70px] p-1 rounded-[5px]">Delete</button>
                    </li>)
                })}

              </ul>
            }
            <label htmlFor="id">Lecturer </label>
            {/* search lecturers */}

            <select name="id" id="id" value={lecturer.id} onChange={({ target }) => setLecturer({ ...lecturer, id: target.value })} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] flex items-center focus:outline-none px-2">
              <option value="">Select Lecturer</option>
              {lecturers.map((item, index) => (
                <option key={index} value={item.id}>{item.firstName} {item.lastName}({item.discipline})</option>
              ))}
            </select>
            <label htmlFor="ad">Assigned Departments</label>
            <MultiSelect
              options={departmentOptions}
              value={lecturer.assigned_departments}
              hasSelectAll={false}
              onChange={(value: any) => setLecturer({ ...lecturer, assigned_departments: value })}
              labelledBy={"Select Departments"}
              className="w-full border border-[#347836] rounded-[5px]"
            />

            <button type="button" className="text-[#346837] bg-white border border-[#346837] py-2 m-2 rounded-md w-[100px] stbt:w-[100px] self-end" onClick={addLecturer}>Add Lecturer</button>
          </div>

          {/* 'submit button' */}
          <div className="w-full mx-auto min-w-[400px] ">
            <button type="submit" className="w-full text-white bg-[#346837] border border-[#346837] h-[40px] rounded-md  self- ">Submit</button>
          </div>

        </form>
        <div className='max-w-[400px] mx-auto mt-5 flex flex-col items-center'>
          <h6 className='font-[600] text-[18px] text-[#346837] text-center'>Dangerous Operation</h6>
          <button onClick={delete_course} className="bg-[#700] text-white p-2 m-2 rounded-md w-[50vw]  max-w-[120px]">Delete Course</button>
        </div>
      </section>
    </div>
  )
}