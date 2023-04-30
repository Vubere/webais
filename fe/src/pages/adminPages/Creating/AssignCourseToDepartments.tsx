import { useContext, useEffect, useState } from "react";

import { MultiSelect } from "react-multi-select-component";
import { useParams } from "react-router-dom";
import { base } from "../../../App";
import useFacultiesAndDepartments from "../../../hooks/useFacultiesAndDepartments";
import { SessionContext } from "../../../layouts/DashboardLayout";



export default function AssignCoursesToDepartments() {
  const [currentCourse, setCurrentCourse] = useState({
    id: 0,
    title: '',
    description: ''
  })
  const { id } = useParams<{ id: string }>()
  useEffect(() => {
    if (id)
      fetchCourse(id)
  }, [id])
  const Session = useContext(SessionContext)
  useEffect(() => {
    if (Session?.session)
      setCourse({
        ...course,
        semester: Session?.session?.current_semester as string,
      })
  }, [Session?.session])

  const [course, setCourse] = useState<department_course>({
    departments: [],
    faculties: [],
    course_id: '',
    type: '',
    code: '',
    units: 0,
    semester: '',
    level: 0,
    assigned_lecturers: [],
    id: ''
  })
 

  const [errors, setErrors] = useState({
    departments: '',
    course_id: '',
    type: '',
    code: '',
    units: '',
    semester: '',
    faculties: '',
    level: '',
    assigned_lecturers: '',
    id: ''
  })
  const { departments, faculties, loading: fload, error: ferror } = useFacultiesAndDepartments()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [loadError, setLoadError] = useState('')
  const [selectedFaculties, setSelectedFaculties] = useState<any[]>([])
  const [selectedDepartments, setSelectedDepartments] = useState<any[]>([])
  const [lecturer, setLecturer] = useState<{ id: string, assigned_departments: any[] }>({
    id: '',
    assigned_departments: [],
  })
  const [lecturers, setLecturers] = useState<any[]>([])
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

  const fetchCourse = async (id: string) => {
    setLoading(true)
    try {
      const url = base + '/courses?id=' + id
      const res = await fetch(url)
      const data = await res.json()

      if (data.ok) {

        setCurrentCourse({ ...data?.data[0], course_id: id })
      } else {
        throw new Error(data?.message || 'error fetching course')
      }
    } catch (error: any) {
      alert(error?.message || 'error fetching course')
      setLoadError('Error loading course')
    }
    setLoading(false)
  }
  const reset = () => {
    setCourse({
      departments: [],
      faculties: [],
      course_id: '',
      type: '',
      code: '',
      units: 0,
      semester: '',
      level: 0,
      assigned_lecturers: [],
      id: ''
    })
    setSelectedDepartments([])
    setSelectedFaculties([])
    setLecturer({
      id: '',
      assigned_departments: [],
    })
  }
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.target.name == 'units') {
      if (parseInt(e.target.value) < 0 || parseInt(e.target.value) > 16) {
        setErrors({
          ...errors,
          units: 'Unit must be between 0 and 16'
        })
        setTimeout(() => {
          setErrors({
            ...errors,
            units: ''
          })
        }, 2000)
        return
      }
    }
    setCourse({
      ...course,
      [e.target.name]: e.target.value
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
    setCourse({
      ...course,
      assigned_lecturers: [...course.assigned_lecturers, newLecturer]
    })
    setLecturer({
      id: '',
      assigned_departments: [],
    })
  }

  const validate = () => {
    const temp = errors
    let isValid = true
    if (course.departments.length === 0) {
      temp.departments = 'Please select at least one department'
      isValid = false
    }

    if (course.type == '') {
      temp.type = 'Please select a course type'
      isValid = false
    }
    if (course.code == '') {
      temp.code = 'Please enter a course code'
      isValid = false
    }
    if (course.units == 0) {
      temp.units = 'Please enter a course unit'
      isValid = false
    }

    if (course.semester === '') {
      temp.semester = 'Please enter a semester'
      isValid = false
    }
    if (course.level == 0) {
      temp.level = 'Please enter a level'
      isValid = false
    }


    if (!isValid) {
      setErrors({ ...errors, ...temp })

      setTimeout(() => {
        setErrors({
          departments: '',
          course_id: '',
          type: '',
          code: '',
          faculties: '',
          units: '',
          semester: '',
          level: '',
          assigned_lecturers: '',
          id: ''
        })
      }, 3000)
    }
    return isValid
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (validate()&&Session?.session?.session) {
      try {

        const form = new FormData()

        form.append('departments', JSON.stringify(course.departments))
        form.append('faculties', JSON.stringify(course.faculties))
        form.append('course_id', id as string)
        form.append('type', course.type)
        form.append('code', course.code)
        form.append('units', course.units.toString())
        form.append('session', Session?.session?.session)
        form.append('semester', course.semester)
        form.append('level', course.level.toString())
        form.append('assigned_lecturers', JSON.stringify(course.assigned_lecturers))
        form.append('id', course.id)
        form.append('method', 'POST')
        
        const req = await fetch(base + '/assign_course', {
          method: 'POST',
          body: form
        })
        const res = await req.json()
        if(res?.ok==1){
          alert('Course assigned successfully')
          reset()
       
        }else{
          throw new Error(res?.message || 'error assigning course')
        }
      } catch (err: any) {
        if(err?.message?.toLowerCase().includes('duplicate')){
          alert('Course code already exist')
          return
        }
        alert(err?.message || 'error assigning course')
      }
    }
  }


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
    const newLecturers = course.assigned_lecturers.filter((_, i) => i != index)
    setCourse({
      ...course,
      assigned_lecturers: newLecturers
    })
  }

  const year = new Date().getFullYear()

  return (
    <section className="w-full h-[90vh] content-box overflow-auto pb-[80px] p-3">
      <h2 className="text-center font-[600] text-[24px] text-[#346837]">Assign Course to Departments</h2>
      <div className="flex flex-col gap-2">
        <h5 className="w-full font-[500]  text-center text-[20px] text-[#346837] underline">{currentCourse.title}</h5>
        <p className="max-w-[500px] text-center mx-auto text-[16px] mb-[20px]">{currentCourse.description}</p>
      </div>
      <form onSubmit={onSubmit} className="flex flex-col items-center gap-2 max-w-[400px] mx-auto">
        <div className="w-full">
          <label htmlFor="code">Course Code *</label>
          {errors.code && <span className="text-red-500 text-[12px]">{errors.code}</span>}
          <input type="text" name="code" id="code" value={course.code} onChange={onChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] xs:p-2 stbt:p-4 xs:text-[14px] stbt:text-[18px] flex items-center focus:outline-none px-2" />
        </div>
        <div className="w-full">
          <label htmlFor="code">Type *</label>
          {errors.type && <span className="text-red-500 text-[12px]">{errors.type}</span>}
          <select name="type" id="type" value={course.type} onChange={onChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836]  flex items-center focus:outline-none px-2" >
            <option value=''>Select Type</option>
            <option value='elective'>Elective</option>
            <option value='compulsory'>Compulsory</option>
          </select>
        </div>

        <div className="w-full">
          <label htmlFor="unit">Unit *</label>
          {errors.units && <span className="text-red-500 text-[12px]">{errors.units}</span>}
          <input type="number" name="units" id="unit" value={course.units} onChange={onChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] xs:p-2 stbt:p-4 xs:text-[14px] stbt:text-[18px] flex items-center focus:outline-none px-2" />
        </div>
        <div className="w-full">
          <label htmlFor="faculty">Faculties *</label>
          {errors.faculties && <span className="text-red-500 text-[12px]">{errors.faculties}</span>}
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
          <select name="level" id="level" value={course.level} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836]  flex items-center focus:outline-none px-2" onChange={onChange}>
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
          <select name="semester" id="semester" value={course.semester} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836]  flex items-center focus:outline-none px-2" onChange={onChange}>
            <option value="">Select Semester</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </div>

        <div className="flex flex-col w-full">
          <h3 className="font-[500] text-[18px] text-center text-[#347836]">Assign Lecturers</h3>
          {errors.assigned_lecturers && <span className="text-red-500 text-[12px]">{errors.assigned_lecturers}</span>}
          {
            course.assigned_lecturers?.length > 0 && <ul className="flex flex-col gap-2">

              {course.assigned_lecturers.map((item, index) => {
                let temp = item.assigned_departments
                temp.map((item, index) => {
              
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
    </section>
  )
}

type department_course = {
  departments: string[];
  course_id: string;
  type: '' | 'elective' | 'selective' | 'compulsory';
  code: string;
  units: number;
  faculties: string[];
  semester: string;
  level: number;
  assigned_lecturers: {
    id: string,
    assigned_departments: string[],
  }[];
  id: string;
}
const multiSelectStyle = {
  option: (provided: any, state: any) => ({
    ...provided,
    color: state.isSelected ? 'white' : 'black',
    backgroundColor: state.isSelected ? '#1a202c' : 'white',
    padding: 10,

  }),
  control: (provided: any, state: any) => ({
    ...provided,
    border: '1px solid #e2e8f0',
    borderRadius: '0.25rem',
    padding: '0.5rem 1rem',
    boxShadow: 'none',
    '&:hover': {
      borderColor: '#e2e8f0',
      boxShadow: 'none',
    },
    '&:focus': {
      borderColor: '#e2e8f0',
      boxShadow: 'none',
    },
  }),
  multiValue: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: '#1a202c',
    color: 'white',
    borderRadius: '0.25rem',
    padding: '0.25rem 0.5rem',
    margin: '0.25rem 0.5rem',
  }),
  multiValueLabel: (provided: any, state: any) => ({
    ...provided,
    color: 'white',
  }),
  multiValueRemove: (provided: any, state: any) => ({
    ...provided,
    color: 'white',
    '&:hover': {
      backgroundColor: 'red',
      color: 'white',
    },
  }),
  menu: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: '#1a202c',

  }),
  menuList: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: '#1a202c',
    color: 'white',
  }),
  input: (provided: any, state: any) => ({
    ...provided,
    color: 'white',
  }),
  placeholder: (provided: any, state: any) => ({
    ...provided,
    color: 'white',
  }),
  singleValue: (provided: any, state: any) => ({
    ...provided,
    color: 'white',
  }),
  valueContainer: (provided: any, state: any) => ({
    ...provided,
    color: 'white',
  }),
}

