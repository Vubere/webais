import React, { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'
import { course } from '../Creating/CreateCourse'
import * as routes from '../../../constants/routes'
import { MultiSelect, Option } from 'react-multi-select-component'
import { departments, faculties } from '../../../helpers/schoolStructure'
import useFacultiesAndDepartments from '../../../hooks/useFacultiesAndDepartments'
import { base } from '../../../App'


export default function UpdateCourse() {
  const { id } = useParams()
  const [course, setCourse] = useState<course>({
    id: '',
    code: '',
    title: '',
    unit: '',
    description: '',
    departments: [],
    faculties: [],
    level: '',
    semester: 0,
    lecturers: [],

  })
  const [lecturer, setLecturer] = useState<{ id: string, assigned_departments: Option[] }>({
    id: '',
    assigned_departments: [],
  })
  const [lecturers, setLecturers] = useState<any[]>([])
  const [errors, setErrors] = useState({
    code: '',
    title: '',
    level: '',
    unit: '',
    description: '',
    department: '',
    faculty: '',
    semester: '',
    lecturers: '',
  })
  const { faculties, departments } = useFacultiesAndDepartments()

  useEffect(() => {

    fetch(base+'/lecturers')
      .then(res => res.json())
      .then(data => setLecturers(data.lecturer))
      .catch(err => console.log(err))
  }, [])

  const [selectedFaculties, setSelectedFaculties] = useState<any[]>([])
  const [selectedDepartments, setSelectedDepartments] = useState([])


  useEffect(() => {
    fetch(`http://localhost:80/webais/api/courses?id=${id}`)
      .then(res => res.json())
      .then(data => {

        setCourse(data.data[0])
        if (departments.length && faculties.length) {

          let dept = data.data[0].departments.map((dpt: any) => {
           
            const deptObj = departments.find((d: any) => d.id === dpt)
            return {
              label: deptObj?.name,
              value: deptObj?.id,
            }
          })
          setSelectedDepartments(dept)
          let fclty = data.data[0].faculties.map((flt: any) => {
            const fcltyObj = faculties.find((f: any) => f.id == flt)
           
            return {
              label: fcltyObj.name,
              value: fcltyObj.id,
            }
          }
          )
          setSelectedFaculties(fclty)
        }
      })
  }, [id, departments, faculties])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
   
    if (validate()) {
      try {
        const res = await fetch('http://localhost:80/webais/api/courses', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(course),
        })
        
        const data = await res.json()
        if (data?.ok) {
          alert('success')
        }
      } catch (err: any) {
        console.log(err.message)
      }

    }
  }
  
  const validate = () => {
    let isValid = true
    let newErrors = errors
    if (course.code === '') {
      newErrors = {
        ...newErrors,
        code: 'Course code is required'
      }
      isValid = false
    }
    if (course.title === '') {
      newErrors = {
        ...newErrors,
        title: 'Title is required'
      }
      isValid = false
    }
    if (course.unit === '') {
      newErrors = {
        ...newErrors,
        unit: 'Unit is required'
      }
    }
    if (course.departments.length === 0) {
      newErrors = {
        ...newErrors,
        department: 'Department is required'
      }
      isValid = false
    }
    if (course.faculties.length === 0) {
      newErrors = {
        ...newErrors,
        faculty: 'Faculty is required'
      }
      isValid = false
    }
    if (course.level === '') {
      newErrors = {
        ...newErrors,
        level: 'Level is required'
      }
      isValid = false
    }
    if (course.semester == 0) {
      newErrors = {
        ...newErrors,
        semester: 'Semester is required'
      }
      isValid = false
    }
    setErrors(newErrors)
    setTimeout(() => {
      setErrors({
        code: '',
        title: '',
        unit: '',
        level: '',
        description: '',
        department: '',
        faculty: '',
        semester: '',
        lecturers: '',
      })
    }, 3000)

    return isValid
  }
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCourse({
      ...course,
      [e.target.name]: e.target.value
    })
  }

  const addLecturer = () => {
    if (lecturer.id === '') {
      setErrors({
        ...errors,
        lecturers: 'Lecturer ID is required'
      })
      setTimeout(() => {
        setErrors({
          ...errors,
          lecturers: ''
        })
      }, 2000)
      return
    }
    if (lecturer.assigned_departments.length === 0) {
      setErrors({
        ...errors,
        lecturers: 'Assigned department is required'
      })
      setTimeout(() => {
        setErrors({
          ...errors,
          lecturers: ''
        })
      }, 2000)
      return
    }
    const dept = lecturer.assigned_departments.map(item => item.value)
    const newLecturer = {
      id: lecturer.id,
      assigned_departments: dept,
    }
    setCourse({
      ...course,
      lecturers: [...course.lecturers, newLecturer]
    })
    setLecturer({
      id: '',
      assigned_departments: [],
    })
  }

  const departmentFilter = departments.filter(dep => {

    if (selectedFaculties.length && !selectedFaculties.find(item => {

      return item.value == dep.faculty_id
    })) {
      return false
    }
    return true
  })

  const departmentOptions: any = [{ label: 'General', value: 'General' }]

  const facultyOptions: any = [{ label: 'General', value: 'General' }]

  const setDepartments = (val: any) => {
    setSelectedDepartments(val)
    setCourse({
      ...course,
      departments: val.map((item: any) => item.value)
    })
  }
  const setFaculties = (val: any) => {
    setSelectedFaculties(val)
    setCourse({
      ...course,
      faculties: val.map((item: any) => item.value)
    })
  }

  departmentFilter.forEach(element => {

    departmentOptions.push({ label: element.name, value: element.name })
  });
  faculties.forEach(element => {
    facultyOptions.push({ label: element.name, value: element.id })
  });

  const deleteLect = (index: number) => {
    const newLecturers = course.lecturers.filter((item, i) => i != index)
    setCourse({
      ...course,
      lecturers: newLecturers
    })
  }

  return (
    <div className="p-4 h-[90vh] overflow-auto w-full">
      <h2 className="font-[700] text-[24px] text-center w-full pb-3 w-full text-[#346837]">Update Course</h2>
      <form onSubmit={onSubmit} className="flex flex-col items-center gap-2 max-w-[400px] mx-auto ">
        <div className="w-full">
          <label htmlFor="id">Course Code *</label>
          {errors.code && <span className="text-red-500 text-[12px]">{errors.code}</span>}
          <input type="text" name="code" id="code" value={course.code} onChange={onChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] flex items-center focus:outline-none px-2" />
        </div>
        <div className="w-full">
          <label htmlFor="title">Title *</label>
          {errors.title && <span className="text-red-500 text-[12px]">{errors.title}</span>}
          <input type="text" name="title" id="title" value={course.title} onChange={onChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] xs:p-2 stbt:p-4 xs:text-[14px] stbt:text-[18px] flex items-center focus:outline-none px-2" />
        </div>
        <div className="w-full">
          <label htmlFor="unit">Unit *</label>
          <input type="number" name="unit" id="unit" value={course.unit} onChange={onChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] xs:p-2 stbt:p-4 xs:text-[14px] stbt:text-[18px] flex items-center focus:outline-none px-2" />
        </div>
        <div className="w-full">
          <label htmlFor="description">Description</label>
          <input type="text" name="description" id="description" value={course.description} onChange={onChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] xs:p-2 stbt:p-4 xs:text-[14px] stbt:text-[18px] flex items-center focus:outline-none px-2" />
        </div>
        <div className="w-full">
          <label htmlFor="department">Departments *</label>
          {errors.department && <span className="text-red-500 text-[12px]">{errors.department}</span>}
          <MultiSelect
            options={departmentOptions}
            hasSelectAll={false}
            value={selectedDepartments}
            onChange={setDepartments}
            labelledBy={"Select Departments"}
            className="w-full border border-[#347836] rounded-[5px]"
          />
        </div>
        <div className="w-full">
          <label htmlFor="faculty">Faculties *</label>
          {errors.faculty && <span className="text-red-500 text-[12px]">{errors.faculty}</span>}
          <MultiSelect
            options={facultyOptions}
            hasSelectAll={false}
            value={selectedFaculties}
            onChange={setFaculties}
            labelledBy={"Select faculties"}
            className="w-full border border-[#347836] rounded-[5px]"
          />
        </div>
        <div className="w-full">
          <label htmlFor="level">Level *</label>
          {errors.level && <span className="text-red-500 text-[12px]">{errors.level}</span>}
          <select name="level" id="level" value={course.level} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836]  flex items-center focus:outline-none px-2" onChange={onChange}>
            <option value="">Select Level</option>
            <option value="100">100</option>
            <option value="200">200</option>
            <option value="300">300</option>
            <option value="400">400</option>
            <option value="500">500</option>
            <option value="600">600</option>
            <option value="700">700</option>
          </select>
        </div>
        <div className="w-full">
          <label htmlFor="semester">Semester *</label>
          {errors.semester && <span className="text-red-500 text-[12px]">{errors.semester}</span>}
          <select name="semester" id="semester" value={course.semester} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] xs:p-2  flex items-center focus:outline-none px-2" onChange={onChange}>
            <option value="">Select Semester</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </div>
        <div className="flex flex-col w-full">
          <h3 className="font-[500] text-[18px] text-center text-[#347836]">Assign Lecturers</h3>
          {errors.lecturers && <span className="text-red-500 text-[12px]">{errors.lecturers}</span>}
          {
            course.lecturers.length > 0 && <ul className="flex flex-col gap-2">

              {course.lecturers.map((item, index) =>{
                let temp = item.assigned_departments
                temp.map((item, index) => {
                  const f = departments.find((d) => d.value === item)
                  if (f) {
                    temp[index] = f.label
                  }
                })
                
               return  (
                <li key={index} className="flex flex-col gap-2">
                  {item.id} :
                  <p>
                    {temp.join(', ')}
                  </p>
                  <button onClick={() => deleteLect(index)} className=" bg-[#f44] text-[#fff] font-[500] w-[70px] p-1 rounded-[5px]">Delete</button>
                </li>)})}

            </ul>
          }
          <label htmlFor="id">Lecturer</label>
          <select name="id" id="id" value={lecturer.id} onChange={({ target }) => setLecturer({ ...lecturer, id: target.value })} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] flex items-center focus:outline-none px-2" >
            <option value="">Select Lecturer</option>
            {lecturers.map((item) => (
              <option key={item.id} value={item.id}>{item.firstName} {item.lastName}({item.discipline})</option>
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

          <button type="button" className="text-[#346837] bg-white border border-[#3467837] py-2 m-2 rounded-md w-[100px] stbt:w-[100px] self-end" onClick={addLecturer}>Add Lecturer</button>
        </div>

        <button type="submit" className="bg-[#346837] text-white p-2 m-2 rounded-md w-[80vw] stbt:w-[200px] max-w-[400px]">Update Course</button>
      </form>
    </div>
  )
}
