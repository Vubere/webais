import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function CreateLecturer() {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    otherNames: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    discipline: '',
    assigned_courses: [],
    degreeAcquired: '',
  })
  const [password, setPassword] = useState('')
  const [passwordErr, setPasswordErr] = useState('')
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    otherNames: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    discipline: '',
    degreeAcquired: ''
  })
  const navigate = useNavigate()


  const handleChange = (e: any) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    })
  }
  const validate = () => {
    let isValid = true
    let tempERR = { ...errors }
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    if (user.firstName === '') {
      tempERR.firstName = 'First name is required'
      isValid = false
    }
    if (user.lastName === '') {
      tempERR.lastName = 'Last name is required'
      isValid = false
    }
    if (!emailPattern.test(user.email)) {
      tempERR.email = 'Email is invalid'
      isValid = false

    }
    if (password.length < 6) {
      setPasswordErr('Password must be at least 6 characters')
      isValid = false

    }
    if (user.email === '') {
      tempERR.email = 'Email is required'
      isValid = false

    }
   

    if (user.discipline === '') {
      tempERR.discipline = 'Discipline is required'
      isValid = false
    }
    if (user.degreeAcquired === '') {
      tempERR.degreeAcquired = 'Degree is required'
      isValid = false
    }
 
    if (!isValid) {
      setErrors(tempERR)
      
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
          discipline: '',
          degreeAcquired: ''
        })
      }, 3000)
    }
    return isValid
  }
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (validate()) {
      try {

        const res = await fetch('http://localhost:80/webais/api/lecturers', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(user),
        });
        const data = await res.json();
        if(data?.status==200){
          alert('Lecturer created successfully')
          setUser({
            firstName: '',
            lastName: '',
            otherNames: '',
            email: '',
            phone: '',
            dob: '',
            gender: '',
            discipline: '',
            assigned_courses: [],
            degreeAcquired: '',
          })
        }else{
          throw new Error('Something went wrong')
        }

      } catch (err:any) {
        alert(err?.message || 'Something went wrong')
      }
    }
  }


  return (
    <div className="w-full h-[90vh] content-box overflow-auto pb-[30px]">
      <h2 className="text-center text-[22px] text-[#346837]">Create Lecturer</h2>
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
          <label htmlFor="othername">Other Names</label>
          {errors.otherNames && <p className="text-red-500 text-[12px]">{errors.otherNames}</p>}
          <input type="text" name="otherNames" id="othername" className="max-w-[400px] w-[80vw] h-[40px] rounded-[5px] bg-transparent border border-[#347836] xs:p-2 stbt:p-4 xs:text-[14px] stbt:text-[18px] px-2"
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
            <input type="date" name="dob" id="dob" className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] xs:p-2 stbt:p-4 xs:text-[14px] stbt:text-[18px] flex items-center focus:outline-none px-2" value={user.dob} onChange={handleChange} />
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
        <div className="flex max-w-[400px] w-[80vw] gap-4">
          <div className="w-full">
            <label htmlFor='discipline'>Discipline</label>
            {errors.discipline && <p className="text-red-500 text-[12px]">{errors.discipline}</p>}
            <input type='text' name='discipline' id='discipline' value={user.discipline} onChange={handleChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836]  text-black flex items-center focus:outline-none px-2" />
          </div>
          <div className="w-full">
            <label htmlFor='degreeAcquired'>Degree Acquired</label>
            {errors.degreeAcquired && <p className="text-red-500 text-[12px]">{errors.degreeAcquired}</p>}
            <select name='degreeAcquired' id='degreeAcquired' className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836]  text-black flex items-center focus:outline-none px-2" value={user.degreeAcquired} onChange={handleChange}>
              <option value=''>Select Degree</option>
              <option value='B.Sc'>B.Sc</option>
              <option value='M.Sc'>M.Sc</option>
              <option value='Ph.D'>Ph.D</option>
            </select>

          </div>

        </div>
        <div className="flex gap-4 max-w-[400px] w-[80vw]">
          <div className="flex flex-col w-full">
            <label htmlFor="password">Administrator's Password</label>
            {passwordErr && <p className="text-red-500 text-[12px]">{passwordErr}</p>}
            <input type="password" name="password" id="password" className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] xs:p-2 stbt:p-4 xs:text-[14px] stbt:text-[18px] flex items-center focus:outline-none px-2" placeholder="enter password for authentication" value={password} onChange={({ target }) => setPassword(target.value)} />
          </div>
        </div>
       
        <button type="submit" className="bg-[#346837] text-white p-2 m-2 rounded-md w-[80vw] stbt:w-[200px] max-w-[400px]">Create</button>
      </form>
    </div>
  )
}
const debounce = (fn: any, ms: any) => {
  let timer;
  return (...argument: any[]) => {
    timer = setTimeout(() => {
      timer = null;
      fn.apply(this, ...argument);
    }, ms);
    clearTimeout(timer);
  };
};