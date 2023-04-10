import { FormEvent, useContext, useEffect, useState } from "react"
import { base, UserContext } from "../../../App"
import { formatDateToYMD } from "../../../helpers/formatDate";
import visible from '../../../assets/visible.png'
import invisible from '../../../assets/invisible.png'


export default function PersonalInfo() {

  const { user } = useContext(UserContext)

  const [lecturer, setLecturer] = useState<any>();
  const [confirmPassword, setConfirmPassword] = useState('');
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

  useEffect(() => {
    if (user) {
      setLecturer(user)
    }
  }, [user])


  const validate = () => {
    const t = { ...errors }
    let isValid = true
    const temp_error = { ...errors }
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    if (lecturer.firstName === '') {
      temp_error.firstName = 'First name is required'
      isValid = false
    }
    if (lecturer.lastName === '') {
      temp_error.lastName = 'Last name is required'
      isValid = false
    }
    if (!emailPattern.test(lecturer.email)) {
      temp_error.email = 'Email is invalid'
      isValid = false

    }
    if (lecturer.password.length < 6) {
      temp_error.password = 'Password must be at least 6 characters'
      isValid = false

    }
    if (lecturer.email === '') {
      temp_error.email = 'Email is required'
      isValid = false

    }
    if (lecturer.password === '') {
      temp_error.password = 'Password is required'
      isValid = false
    }
    if (lecturer.phone != '' && lecturer.phone.length < 11) {
      temp_error.phone = 'Phone number is invalid'
      isValid = false

    }

    if (!isValid) {
      setError(temp_error)
      setTimeout(() => {
        setError(t)
      }, 3000)
    }
    return isValid
  }

  const updateInfo = async (e: FormEvent) => {
    e.preventDefault()
    if (validate()) {
      try {
        let url = base+`/lecturers`
        const res = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(lecturer)
        })
        const data = await res.json()
        if(data?.ok){
          alert('Updated successfully')
        }else{
          throw new Error(data?.message)
        }
      } catch (err:any) {
        console.log(err)
        alert(err?.message||'An error occured')
      }
    }
  }

  const togglePasswordVisibility = (e: any) => {
    const passwordInput = document.getElementById('password') as HTMLInputElement
    const confirmPasswordInput = document.getElementById('confirmPassword') as HTMLInputElement
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text'
      confirmPasswordInput.type = 'text'
    } else {
      passwordInput.type = 'password'
      confirmPasswordInput.type = 'password'
    }
  }

  return (
    <section className="h-[90vh] overflow-auto">
      <h3 className="font-[600] text-[#347836] text-[28px] text-center leading-[40px] p-3">Personal Information</h3>
      {lecturer && (
        <div>
          <ul className="flex flex-col w-[80vw] max-w-[400px] gap-2 p-4 mx-auto">
            <li>Name: {lecturer.firstName} {lecturer.otherName} {lecturer.lastName}</li>
            <li>ID: {lecturer.id}</li>
            <li>Degree: {lecturer.degreeAcquired}</li>
            <li>Discipline: {lecturer.discipline}</li>

            <form onSubmit={updateInfo} className="flex flex-col w-[80vw] max-w-[400px] gap-2 p-4 mx-auto">
              <label htmlFor="">Email</label>
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              <input type="email" id="email" name="email" value={lecturer.email} onChange={(e) => setLecturer({ ...lecturer, email: e.target.value })} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />
              <label htmlFor="phone">Phone</label>
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
              <input type="text" id="phone" name="phone" value={lecturer.phone} onChange={(e) => setLecturer({ ...lecturer, phone: e.target.value })} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />
              <label htmlFor="dob">Date of Birth</label>
              {errors.dob && <p className="text-red-500 text-sm">{errors.dob}</p>}
              <input type="date" id="dob" name="dob" value={formatDateToYMD(lecturer.dob)} onChange={(e) => setLecturer({ ...lecturer, password: e.target.value })} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />
              <label htmlFor="gender">Gender</label>
              {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
              <select name="gender" id="gender" value={lecturer.gender} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" onChange={(e) => setLecturer({ ...lecturer, gender: e.target.value })}>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <div className="flex max-w-full overflow-hidden justify-between">
                <div className="flex flex-col w-full">
                  <label htmlFor="password">Password</label>
                  {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                  <input type="password" id="password" name="password" value={lecturer.password} onChange={(e) => setLecturer({ ...lecturer, password: e.target.value })} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2 " />
                </div>    
              </div>
              <div className="flex gap-2">
                <input type="checkbox" name="showPassword" id="showPassword" onChange={togglePasswordVisibility} />
                <p>Toggle Password Visibility</p>
              </div>
              <button className="bg-[#346837] py-2 mt-4 rounded-[4px] text-[#fff]">
                Update Information
              </button>
            </form>
          </ul>
        </div>
      )}
    </section>
  )
} 