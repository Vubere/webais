import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { base, UserContext } from "../../../App"
import useFacultiesAndDepartments from "../../../hooks/useFacultiesAndDepartments"

export default function CreateUser() {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    otherNames: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    faculty: '',
    department: '',
    level: '',
    studentId: '',
  })
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    otherNames: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    faculty: '',
    department: '',
    level: '',
    studentId: '',
  })
  const [password, setPassword] = useState('')
  const [passwordErr, setPasswordErr] = useState('')
  const {faculties, departments, error, loading} = useFacultiesAndDepartments()
 
  const { user: admin } = useContext(UserContext)
 

  const handleChange = (e: any) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    })
  }
  const validate = () => {
    let isValid = true
    let tempErrors = { ...errors }
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    if (user.firstName === '') {
      tempErrors = { ...tempErrors, firstName: 'First name is required' }
      isValid = false
    }
    if (user.lastName === '') {
      tempErrors = { ...tempErrors, lastName: 'Last name is required' }
      isValid = false
    }
    if (!emailPattern.test(user.email)) {
      tempErrors = { ...tempErrors, email: 'Email is invalid' }
      isValid = false

    }
    if (password.length < 6) {
      setPasswordErr('Password must be at least 6 characters')
      isValid = false

    }
    if (user.email === '') {
      tempErrors = { ...tempErrors, email: 'Email is required' }
      isValid = false

    }
  

    if (user.phone != '' && user.phone.length < 11) {
      tempErrors = { ...tempErrors, phone: 'Phone number is invalid' }
      isValid = false

    }

    if (user.faculty === '') {
      tempErrors = { ...tempErrors, faculty: 'Faculty is required' }
      isValid = false
    }
    if (user.department === '') {
      tempErrors = { ...tempErrors, department: 'Department is required' }
      isValid = false
    }
    if (user.level === '') {
      tempErrors = { ...tempErrors, level: 'Level is required' }
      isValid = false
    }
 

    if (!isValid) {
      setErrors(tempErrors)
      setTimeout(() => {
        setPasswordErr('')
        setErrors({
          firstName: '',
          lastName: '',
          otherNames: '',
          email: '',
          phone: '',
          dob: '',
          gender: '',
          faculty: '',
          department: '',
          level: '',
          studentId: '',
        })
      }, 3000)
    }
    return isValid
  }
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (validate()) {
      try {
        const authAdmin = await fetch(base+'/authenticate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            type: 'admin',
            id: admin?.id,
            password: password
          })
        })
        const auth = await authAdmin.json()
        if (auth.authenticated) {
          const res = await fetch('http://localhost:80/webais/api/students', {
            method: 'POST',
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(user),
          });
          const data = await res.json();
          if(data?.status==200){
            alert('Student created successfully')
            setUser({
              firstName: '',
              lastName: '',
              otherNames: '',
              email: '',
              phone: '',
              dob: '',
              gender: '',
              faculty: '',
              department: '',
              level: '',
              studentId: '',
            })
          }else{
            throw new Error('Student not created')
          }
        }else{
          throw new Error('invalid admin password')
        }

      } catch (err:any) {
        alert(err?.message||'something went wrong')
      }
    }
  }

  const departmentFilter = departments.filter(item=>user.faculty==''||item.faculty_id==user.faculty)

  return (
    <div className="w-full h-[90vh] content-box overflow-auto pb-[30px]">
      <h2 className="text-center text-[22px] text-[#346837]">Create Student</h2>
      <form className="flex flex-col items-center gap-2" onSubmit={handleSubmit}>
        <div className="flex flex-row max-w-[400px] w-[80vw] gap-4">
          <div >

            <label htmlFor="name">First Name</label>
            {errors.firstName && <p className="text-red-500 text-[12px]">{errors.firstName}</p>}
            <input type="text" name="firstName" id="name" className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] xs:p-2 stbt:p-4 xs:text-[14px] stbt:text-[18px] flex items-center focus:outline-none px-2"
              placeholder=""
              value={user.firstName}
              onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="lname">Last Name</label>
            {errors.lastName && <p className="text-red-500 text-[12px]">{errors.lastName}</p>}
            <input type="text" name="lastName" id="lname" className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] xs:p-2 stbt:p-4 xs:text-[14px] stbt:text-[18px] flex items-center focus:outline-none px-2"
              value={user.lastName}
              onChange={handleChange} />
          </div>
        </div>
        <div className="flex flex-col">
          <label htmlFor="otherName">Other Names</label>
          {errors.otherNames && <p className="text-red-500 text-[12px]">{errors.otherNames}</p>}
          <input type="text" name="otherNames" id="otherName" className="max-w-[400px] w-[80vw] h-[40px] rounded-[5px] bg-transparent border border-[#347836] xs:p-2 stbt:p-4 xs:text-[14px] stbt:text-[18px] px-2"
            value={user.otherNames}
            onChange={handleChange} />
        </div>
        <div className="flex flex-row gap-4 max-w-[400px] w-[80vw]">
          <div >
            <label htmlFor="email">Email</label>
            {errors.email && <p className="text-red-500 text-[12px]">{errors.email}</p>}
            <input type="email" name="email" id="email" className="max-w-[400px] w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] xs:p-2 stbt:p-4 xs:text-[14px] stbt:text-[18px] flex items-center focus:outline-none px-2" value={user.email} onChange={handleChange} />
          </div>
          <div>

            <label htmlFor="phone">Phone</label>
            {errors.phone && <p className="text-red-500 text-[12px]">{errors.phone}</p>}
            <input type="text" name="phone" id="phone" className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] xs:p-2 stbt:p-4 xs:text-[14px] stbt:text-[18px] flex items-center focus:outline-none px-2" value={user.phone} onChange={handleChange} />
          </div>
        </div>

        <div className="flex max-w-[400px] w-[80vw] gap-4">
          <div className="w-full">
            <label htmlFor="dob">Date of birth</label>
            {errors.dob && <p className="text-red-500 text-[12px]">{errors.dob}</p>}
            <input type="date" name="dob" id="dob" className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836]  flex items-center focus:outline-none px-2" value={user.dob} onChange={handleChange} />
          </div>
          <div className="w-full">
            <label htmlFor="gender">Gender</label>
            {errors.gender&&<p className="text-red-500 text-[12px]">{errors.gender}</p>}
            <select name="gender" id="gender" className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836]  text-black flex items-center focus:outline-none px-2"
              onChange={handleChange} value={user.gender}>
              <option value='' disabled >select gender</option>
              <option value="male">male</option>
              <option value="female">female</option>
            </select>
          </div>
        </div>
        <div className="flex flex-row gap-4 max-w-[400px] w-[80vw]">
          <div className='w-full'>
            <label htmlFor='faculty'>Faculty</label>
            {errors.faculty&&<p className="text-red-500 text-[12px]">{errors.faculty}</p>}
            <select name='faculty' id='faculty' onChange={handleChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836]  text-black flex items-center focus:outline-none px-2">
              <option value=''>Select Faculty</option>
              {error&&loading&&<option value=''>Loading...</option>}
              {!error&&!loading&&faculties.map((faculty:any)=>(
                <option value={faculty.id}>{faculty.name}</option>
              ))}
            </select>
          </div>
          <div className='w-full'>
            <label htmlFor='department'>Department</label>
            {errors.department&&<p className="text-red-500 text-[12px]">{errors.department}</p>}
            <select name='department' id='department' onChange={handleChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836]  text-black flex items-center focus:outline-none px-2">
              <option value=''>Select Department</option>
              {error&&loading&&<option value=''>Loading...</option>}
              {!error&&!loading&&departmentFilter.map((department:any)=>(
                <option value={department.id}>{department.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className='w-[80vw] max-w-[400px]'>
          <label htmlFor='level'>Level</label>
          {errors.level&&<p className="text-red-500 text-[12px]">{errors.level}</p>}
          <select name='level' className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] text-black flex items-center px-2 focus:outline-none" id='level' onChange={handleChange}>
            <option value=''>Select Level</option>
            <option value='100'>100</option>
            <option value='200'>200</option>
            <option value='300'>300</option>
            <option value='400'>400</option>
            <option value='500'>500</option>
            <option value='600'>600</option>
            <option value='700'>700</option>
          </select>
        </div>
        <div className="flex gap-4 max-w-[400px] w-[80vw]">
          <div className="flex flex-col w-full">
            <label htmlFor="password">Administrator's Password</label>
            {passwordErr && <p className="text-red-500 text-[12px]">{passwordErr}</p>}
            <input type="password" name="password" id="password" className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] xs:p-2 stbt:p-4 xs:text-[14px] stbt:text-[18px] flex items-center focus:outline-none px-2" placeholder="enter password for authentication" value={password} onChange={({ target }) => setPassword(target.value)} />
          </div>
        </div>
        
        <button type="submit" className="bg-[#346837] text-white p-2 m-2 rounded-md w-[80vw] stbt:w-[200px] max-w-[400px]">Create Student</button>
      </form>
    </div>
  )
}