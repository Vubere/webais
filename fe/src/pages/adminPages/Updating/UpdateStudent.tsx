import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { base } from "../../../App"

import { formatDateToYMD } from "../../../helpers/formatDate"
import useFacultiesAndDepartments from "../../../hooks/useFacultiesAndDepartments"
import { students } from "../Viewing/ViewStudents"
import { SessionContext } from "../../../layouts/DashboardLayout"


export default function UpdateAdmin() {
  const { id } = useParams()

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    otherNames: '',
    email: '',
    entrance_session: '',
    phone: '',
    dob: '',
    duration: 0,
    gender: '',
    faculty: '',
    department: '',
    password: '',
    level: '',
    studentId: '',
    status: 'undergraduate',
    id: '',
  })
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    otherNames: '',
    password: '',
    email: '',
    duration: '',
    entrance_session: '',
    phone: '',
    dob: '',
    gender: '',
    faculty: '',
    department: '',
    level: '',
    studentId: '',
    id: ''
  })
  const Session = useContext(SessionContext)
  const { faculties, departments, error, loading } = useFacultiesAndDepartments()
  const navigate = useNavigate()
  const validate = () => {
    let isValid = true
    let tempErrors = { ...errors }
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    if (form.firstName === '') {
      tempErrors = { ...tempErrors, firstName: 'First name is required' }
      isValid = false
    }
    if (form.lastName === '') {
      tempErrors = { ...tempErrors, lastName: 'Last name is required' }
      isValid = false
    }
    if (!emailPattern.test(form.email)) {
      tempErrors = { ...tempErrors, email: 'Email is invalid' }
      isValid = false

    }
    if (form.password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters'
      isValid = false

    }
    if (form.email === '') {
      tempErrors = { ...tempErrors, email: 'Email is required' }
      isValid = false

    }
    if (form.dob === '') {
      tempErrors = { ...tempErrors, dob: 'Date of birth is required' }
      isValid = false
    }


    if (form.phone != '' && form.phone.length < 11) {
      tempErrors = { ...tempErrors, phone: 'Phone number is invalid' }
      isValid = false

    }

    if (form.faculty === '') {
      tempErrors = { ...tempErrors, faculty: 'Faculty is required' }
      isValid = false
    }
    if (form.department === '') {
      tempErrors = { ...tempErrors, department: 'Department is required' }
      isValid = false
    }
    if (form.level === '') {
      tempErrors = { ...tempErrors, level: 'Level is required' }
      isValid = false
    }

    if (form.entrance_session === '') {
      tempErrors = { ...tempErrors, entrance_session: 'Entrance session is required' }
      isValid = false
    }


    if (!isValid) {
      setErrors(tempErrors)
      setTimeout(() => {

        setErrors({
          firstName: '',
          lastName: '',
          otherNames: '',
          email: '',
          duration: '',
          entrance_session: '',
          phone: '',
          dob: '',
          gender: '',
          faculty: '',
          department: '',
          level: '',
          studentId: '',
          password: '',
          id: ''
        })
      }, 3000)
    }
    return isValid
  }





  const fetchStudent = async () => {
    try {
      let url = base + `/students?id=${id}`
      const res = await fetch(url);
      const data = await res.json()
      if (data.ok == 1) {
        const student = data.students[0]
        setForm({ ...student, dob: formatDateToYMD(student.dob) })

      } else {
      }
    } catch (err) {
    }
  }
  useEffect(() => {
    fetchStudent();
  }, [])
  const onSubmit = (e: any) => {
    e.preventDefault()

    const formData = new FormData()

    formData.append('firstName', form.firstName)
    formData.append('lastName', form.lastName)
    formData.append('otherNames', form.otherNames)
    formData.append('email', form.email)
    formData.append('entrance_session', form.entrance_session)
    formData.append('password', form.password)
    formData.append('phone', form.phone)
    formData.append('dob', form.dob)
    formData.append('gender', form.gender)
    formData.append('faculty', form.faculty)
    formData.append('department', form.department)
    formData.append('duration', form.duration.toString())
    formData.append('level', form.level)
    formData.append('studentId', form.studentId)
    formData.append('id', form.id)
    formData.append('status', form.status)

    formData.append('method', 'PUT')
    if (validate())
      updateStudent(formData)
  }

  const updateStudent = async (formData:any) => {
    if (id) {
      try {
        let url = base + `/students`

        const res = await fetch(url, {
          method: 'POST',
          body: formData
        })
        const data = await res.json()
        
        if (data.ok) {
          alert(data.message || 'Student updated successfully')
        } else {
          throw new Error(data.message || 'Error updating student')
        }
      } catch (err: any) {
        alert(err.message || 'Error updating student')
      }

    } else {
      alert('failed to update student')
    }
  }
  const expel_student = async () => {

    const formData = new FormData()

    formData.append('firstName', form.firstName)
    formData.append('lastName', form.lastName)
    formData.append('otherNames', form.otherNames)
    formData.append('email', form.email)
    formData.append('entrance_session', form.entrance_session)
    formData.append('password', form.password)
    formData.append('phone', form.phone)
    formData.append('dob', form.dob)
    formData.append('gender', form.gender)
    formData.append('faculty', form.faculty)
    formData.append('department', form.department)
    formData.append('duration', form.duration.toString())
    formData.append('level', form.level)
    formData.append('studentId', form.studentId)
    formData.append('id', form.id)
    formData.append('status', 'expelled')

    setForm({...form, status:'expelled'})

    formData.append('method', 'PUT')
    if (id) {
      if (validate()){
        updateStudent(formData)
      }
    }
  }
  const suspend_student = async () => {
    if (id) {

      const formData = new FormData()

      formData.append('firstName', form.firstName)
      formData.append('lastName', form.lastName)
      formData.append('otherNames', form.otherNames)
      formData.append('email', form.email)
      formData.append('entrance_session', form.entrance_session)
      formData.append('password', form.password)
      formData.append('phone', form.phone)
      formData.append('dob', form.dob)
      formData.append('gender', form.gender)
      formData.append('faculty', form.faculty)
      formData.append('department', form.department)
      formData.append('duration', form.duration.toString())
      formData.append('level', form.level)
      formData.append('studentId', form.studentId)
      formData.append('id', form.id)
      formData.append('status', 'suspended')

      setForm({ ...form, status: 'suspended' })


      formData.append('method', 'PUT')
      if (validate())
        updateStudent(formData)
    }
  }
  const reinstate_student = async () => {
    if (id) {

      const formData = new FormData()

      formData.append('firstName', form.firstName)
      formData.append('lastName', form.lastName)
      formData.append('otherNames', form.otherNames)
      formData.append('email', form.email)
      formData.append('entrance_session', form.entrance_session)
      formData.append('password', form.password)
      formData.append('phone', form.phone)
      formData.append('dob', form.dob)
      formData.append('gender', form.gender)
      formData.append('faculty', form.faculty)
      formData.append('department', form.department)
      formData.append('duration', form.duration.toString())
      formData.append('level', form.level)
      formData.append('studentId', form.studentId)
      formData.append('id', form.id)
      formData.append('status', 'undergraduate')
      setForm({ ...form, status: 'undergraduate' })


      formData.append('method', 'PUT')
      if (validate())
        updateStudent(formData)
    }
  }

  const delete_student = () => {
    const reply = prompt('are you sure you want to delete this Student? Type yes to confirm')
    if (reply?.toLowerCase() !== 'yes' || !id) return

    const formData = new FormData()
    formData.append('id', id)
    formData.append('method', 'DELETE')

    fetch(base + '/students?id=' + id, {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        if (data?.ok) {
          alert('Student deleted successfully')
          navigate(-1)
        } else {
          throw new Error(data?.message || 'Error deleting student')
        }
      })
      .catch((err) => {
        alert(err?.message || 'Error deleting student')
      })
  }

  const departmentFilter = departments?.filter((d) => d.faculty_id == form.faculty)

  const year = (new Date()).getFullYear()


  return (
    <div className="p-4 h-[90vh] overflow-auto flex flex-col items-center w-full">
      <h2 className="font-[700] text-[27px] leading-[30px] m-3 text-[#346837]">Update Student Info</h2>
      <h3 className="pl-3">{form.id}</h3>
      <form onSubmit={onSubmit} className="flex flex-col w-[80vw] max-w-[400px] gap-2 p-4">
        <label htmlFor="email">Email</label>
        <input type="text" id="email" name="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />
        <label htmlFor="fname">First Name</label>
        <input type="text" id="fname" name="firstName" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />
        <label htmlFor="lname">Last Name</label>
        <input type="text" id="lname" name="lastName" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />
        <label htmlFor="oname">Other Names</label>
        <input type="text" id="oname" name="otherNames" value={form.otherNames} onChange={(e) => setForm({ ...form, otherNames: e.target.value })} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />
        <label htmlFor="phone">Phone</label>
        <input type="tel" id="phone" name="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />
        <label htmlFor="dob">Date of Birth</label>
        <input type="date" id="dob" name="dob" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />
        <label htmlFor="pwd">Password</label>
        <input type="text" id="pwd" name="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />
        <label htmlFor="gender">Gender</label>
        <input type="text" id="gender" name="gender" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />
        <label htmlFor="level">Level</label>
        <input type="text" id="levle" name="level" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />

        <div className="w-full">
          <label htmlFor="entrance_session">Entrance Session</label>
          <select name="entrance_session" id="session" value={form.entrance_session} onChange={({ target }) => setForm({ ...form, entrance_session: target.value })} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] flex items-center focus:outline-none px-2">
            <option value="">Select Session </option>
            <option value={`${year + 2}/${year + 3}`}>{`${year + 2}/${year + 3}`}</option>
            <option value={`${year + 1}/${year + 2}`}>{`${year + 1}/${year + 2}`}</option>
            <option value={`${year}/${year + 1}`}>{`${year}/${year + 1}`}</option>
            <option value={`${year - 1}/${year}`}>{`${year - 1}/${year}`}</option>
            <option value={`${year - 2}/${year - 1}`}>{`${year - 2}/${year - 1}`}</option>
            <option value={`${year - 3}/${year - 2}`}>{`${year - 3}/${year - 2}`}</option>
          </select>

        </div>
        <div className='w-full'>
          <label htmlFor='faculty'>Faculty</label>
          {errors.faculty && <p className="text-red-500 text-[12px]">{errors.faculty}</p>}
          <select name='faculty' id='faculty' onChange={(e) => setForm({ ...form, faculty: e.target.value })}
            value={form.faculty} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836]  text-black flex items-center focus:outline-none px-2">
            <option value=''>Select Faculty</option>
            {error && loading && <option value=''>Loading...</option>}
            {!error && !loading && faculties.map((faculty: any) => (
              <option value={faculty.id}>{faculty.name}</option>
            ))}
          </select>
        </div>
        <div className='w-full'>
          <label htmlFor='department'>Department</label>
          {errors.department && <p className="text-red-500 text-[12px]">{errors.department}</p>}
          <select name='department' value={form.department} id='department' onChange={(e) => setForm({ ...form, faculty: e.target.value })} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836]  text-black flex items-center focus:outline-none px-2">
            <option value=''>Select Department</option>
            {error && loading && <option value=''>Loading...</option>}
            {!error && !loading && departmentFilter.map((department: any) => (
              <option value={department.id}>{department.name}</option>
            ))}
          </select>
        </div>


        <button className="bg-[#346837] py-2 mt-4 rounded-[4px] text-[#fff]">
          Update
        </button>
      </form>
      <div className="w-[80vw] max-w-[400px] mx-auto mt-10 flex flex-col items-end" >
        <h4 className="text-[#347836]">Dangerous Operation</h4>
        <div className="flex flex-col gap-2">

          <button className="bg-[#990000] px-2 rounded text-white py-2" onClick={delete_student}>Delete Student</button>
          {form.status == 'undergraduate' ?
            <>
              <button className="bg-[#990000] px-2 rounded text-white py-2" onClick={expel_student}>Expel Student</button>
              <button className="bg-[#990000] px-2 rounded text-white py-2" onClick={suspend_student}>Suspend Student</button>
            </> : null
          }
          {form.status=='expelled'?
          <button className="bg-[#990000] px-2 rounded text-white py-2" onClick={reinstate_student}>Reinstate Student</button>
          :null
          }
          {form.status=='suspended'?
          <button className="bg-[#990000] px-2 rounded text-white py-2" onClick={reinstate_student}>Reinstate Student</button>
          :null
          }
        </div>

      </div>
    </div>
  )
}