import { useState, useEffect, useContext } from "react"
import { base, UserContext } from "../../App"
import { formatDateToYMD } from "../../helpers/formatDate"
import useFacultiesAndDepartments from "../../hooks/useFacultiesAndDepartments"


export default function PersonalInformation() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    otherNames: '',
    email: '',
    phone: '',
    password: '',
    dob: '',
    gender: '',
    faculty: '',
    department: '',
    level: '',
    id: '',
    confirmPassword: ''
  })
  const [errors, setError] = useState({
    firstName: '',
    lastName: '',
    otherNames: '',
    email: '',
    phone: '',
    password: '',
    dob: '',
    gender: '',
    faculty: '',
    department: '',
    level: '',
    id: '',
    confirmPassword: ''
  })
  const {faculties, departments} = useFacultiesAndDepartments()
    
  const onChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  const [visibility, setVisibility] = useState(false)


  const { user: u } = useContext(UserContext)

  const updateStudent = async () => {
    try {
      
      let url = base+`/students?id=${u.id}`
      const res = await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if(data.ok==1){
        alert('Updated Successfully')
      }else{
        throw new Error('Error updating')
      }
    } catch (err:any) {
      alert(err?.message||'Error updating')
    }
  }
  const validilty = () => {
    let valid = true
    const t = { ...errors }
    const temp_error = errors
    const email_pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    if(!email_pattern.test(form.email)){
      temp_error.email = 'Invalid Email'
      valid = false
    }
    
    if (form.email === '') {
      temp_error.email = 'Email is required'
      valid = false
    }
    if (form.phone === '') {
      temp_error.phone = 'Phone is required'
      valid = false
      
    }
    if (form.password === '') {
      temp_error.password = 'Password is required'
      valid = false
    }
    if (form.dob === '') {
      temp_error.dob = 'Date of Birth is required'
      valid = false
    }
    if(form.gender== ''){
      temp_error.gender = 'Pick a gender'
      valid = false
    }
    
    if(!valid){
      setError(temp_error)
      setTimeout(() => {
        setError(t)
      }, 3000)
    }
    return valid
  }



  useEffect(() => {

    if (u?.firstName) {

      fetch(base+'/students?id=' + u.id)
        .then((res) => res.json())
        .then((res) => {
          if (res.students.length) {
            const { students } = res
            setForm({ ...form, ...students[0] })
          }
        })
        .catch((err) => {
          alert(err?.message||'error loading data')
        })
    }

  }, [u])

  const onSubmit = (e: any) => {
    e.preventDefault()
    if (validilty()) {
      updateStudent()
    }
  }
  const faculty = faculties?.find(f=>f.id==form.faculty)?.name
 
  const department = departments?.find(d=>d.id==form.department)?.name

  return (
    <div className="w-full h-[90vh] content-box overflow-auto pb-[30px]">
      <h3 className="text-center text-[22px] text-[#346837]">Personal Information</h3>
      <ul className="flex flex-col w-[80vw] max-w-[400px] gap-2 p-4 mx-auto">
        <li className="flex gap-2">Name:
          <h4>{u?.lastName}, {u?.firstName} {u?.otherNames}</h4>
        </li>
        <li>ID: {u?.id}</li>
        <li>Faculty: {faculty}</li>
        <li>Department: {department}</li>
        <li>Level: {u?.level}</li>

      </ul>
      <h3 className="text-center text-[20px] text-[#346837]">Other Info</h3>
      <form onSubmit={onSubmit} className="flex flex-col w-[80vw] max-w-[400px] gap-2 p-4 mx-auto">
        <label htmlFor="email">Email</label>
        {errors.email && <p className="text-red-500 text-[12px]">{errors.email}</p>}
        <input type="email" id="email" name="email" value={form.email} onChange={onChange} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />
        <label htmlFor="phone">Phone</label>
        {errors.phone && <p className="text-red-500 text-[12px]">{errors.phone}</p>}
        <input type="text" id="phone" name="phone" value={form.phone} onChange={onChange} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />
        <label htmlFor="dob">Date of Birth</label>
        {errors.dob && <p className="text-red-500 text-[12px]">{errors.dob}</p>}
        <input type="date" id="dob" name="dob" value={formatDateToYMD(form.dob)} onChange={onChange} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />
        <label htmlFor="gender">Gender</label>
        {errors.gender && <p className="text-red-500 text-[12px]">{errors.gender}</p> }
        <select name="gender" id="gender" value={form.gender} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2">
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <label htmlFor="password">Password</label>
        <input type={visibility?'text':'password'} id="password" name="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />
        
        <div className="flex items-center gap-2">
          <input type="checkbox" id="visibility" name="visibility" onChange={() => setVisibility(!visibility)} />
          <label htmlFor="visibility">
            toggle password visibility
          </label>
        </div>
        <button className="bg-[#346837] py-2 mt-4 rounded-[4px] text-[#fff]">
          Update
        </button>
      </form>

    </div>
  )
}