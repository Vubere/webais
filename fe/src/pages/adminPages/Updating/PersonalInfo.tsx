import { useContext, useEffect, useState } from "react";
import { base, UserContext } from "../../../App"


import { formatDateToYMD } from "../../../helpers/formatDate";

export default function UpdatePersonalInfoAdmin() {
  const [user, setUser] = useState<administrator>({
    id: '',
    firstName: '',
    lastName: '',
    otherNames: '',
    email: '',
    phone: '',
    dob: '',
    password: '',
    gender: '',
  })
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    otherNames: '',
    email: '',
    phone: '',
    dob: '',
    password: '',
    gender: ''
  })
  const [visibility, setVisibility] = useState(false)


  const { user: clientUser, setUser: setClientUser } = useContext(UserContext);

  useEffect(() => {
    setUser({ ...clientUser, dob: formatDateToYMD(clientUser.dob) })
  }, [clientUser])

  const onSubmit = (e: any) => {
    e.preventDefault()
    if (validate()) {
      update_profile()
    }
  }

  const update_profile = async () => {
    try {
      let url = base+ `/admins`

      const formData = new FormData()
      formData.append('id', user.id)
      formData.append('firstName', user.firstName)
      formData.append('lastName', user.lastName)
      formData.append('otherNames', user.otherNames)
      formData.append('email', user.email)
      formData.append('phone', user.phone)
      formData.append('dob', user.dob)
      formData.append('password', user.password)
      formData.append('gender', user.gender)
      formData.append('method', 'PUT')

      const res = await fetch(url, {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()


      if (data.status === 200) {
        setClientUser({ ...clientUser, ...user })
        alert('Profile updated successfully')
      } else {
        throw new Error('Error updating profile')
      }
    } catch (err) {
    }
  }
  const validate = () => {
    let isValid = true
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    if (user.email == '') {
      setErrors({ ...errors, email: 'Email is required' })
      isValid = false
    }
    if (!emailPattern.test(user.email)) {
      setErrors({ ...errors, email: 'Invalid email' })
      isValid = false
    }
    if (user.firstName == '') {
      setErrors({ ...errors, firstName: 'First name is required' })
      isValid = false
    }
    if (user.lastName == '') {
      setErrors({ ...errors, lastName: 'Last name is required' })
      isValid = false
    }
    if (user.phone != '' && user.phone.length < 11) {
      setErrors({ ...errors, phone: 'Phone number must be 11 digits' })
      isValid = false
    }
    if (user.dob == '') {
      setErrors({ ...errors, dob: 'Date of birth is required' })
      isValid = false
    }
    if (user.password == '') {
      setErrors({ ...errors, password: 'Password is required' })
      isValid = false
    }
    if (user.password.length < 6) {
      setErrors({ ...errors, password: 'Password must be at least 6 characters' })
      isValid = false
    }
    if (user.gender == '') {
      setErrors({ ...errors, gender: 'Gender is required' })
      isValid = false
    }
    setTimeout(() => {
      setErrors({
        firstName: '',
        lastName: '',
        otherNames: '',
        email: '',
        phone: '',
        dob: '',
        password: '',
        gender: ''
      })
    }, 2000)
    return isValid
  }



  return (
    <section className="max-h-[90vh] overflow-auto pb-20 flex flex-col items-center">
      <h2 className="font-[700] text-[22px] text-center w-full pb-3 w-full text-[#347836]">Update Personal Information</h2>
      <h3>Username: {user.id}</h3>
      <form onSubmit={onSubmit} className="flex flex-col w-[80vw] max-w-[400px] gap-2 p-4">
        <label htmlFor="email">Email</label>
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        <input type="text" name="email" id='email' value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />
        <label htmlFor="fName">First Name</label>
        {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
        <input type="text" name="firstName" id="fName" value={user.firstName} onChange={(e) => setUser({ ...user, firstName: e.target.value })} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />
        <label htmlFor="lName">Last Name</label>
        {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
        <input type="text" id="lName" name="name" value={user.lastName} onChange={(e) => setUser({ ...user, lastName: e.target.value })} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />
        <label htmlFor="oName">Other Names</label>
        {errors.otherNames && <p className="text-red-500 text-sm">{errors.otherNames}</p>}
        <input type="text" name="name" id="oName" value={user.otherNames} onChange={(e) => setUser({ ...user, otherNames: e.target.value })} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />
        <label htmlFor="tel">Phone Number</label>
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
        <input type="tel" id="tel" name="phone" value={user.phone} onChange={(e) => setUser({ ...user, phone: e.target.value })} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />
        <label htmlFor="dob">Date of Birth</label>
        {errors.dob && <p className="text-red-500 text-sm">{errors.dob}</p>}
        <input type="date" id="dob" name="name" value={user.dob} onChange={(e) => setUser({ ...user, dob: e.target.value })} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />
        <label htmlFor="pwd">Password</label>
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        <input type={visibility ? 'text' : 'password'} id="pwd" name="password" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />
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
    </section>
  )
}


type administrator = {
  id: string,
  firstName: string,
  lastName: string,
  otherNames: string,
  email: string,
  phone: string,
  dob: string,
  password: string,
  gender: string,
}

