import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { base } from "../../../App"

import { formatDateToYMD } from "../../../helpers/formatDate"


export default function UpdateAdmin() {
  const { id } = useParams()

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
  })
  const navigate = useNavigate()

  const fetchStudent = async () => {
    try {
      let url = base+`/students?id=${id}`
      const res = await fetch(url);
      const data = await res.json()
      if (data.length) {
        setForm({...data[0], dob: formatDateToYMD(data[0].dob)})
        
      } else {
        console.log(data)
      }
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    fetchStudent();
  }, [])
  const onSubmit = (e: any) => {
    e.preventDefault()
    updateAdmin()
  }
  const updateAdmin = async () => {
    try {
      let url = base+`/api/students?id=${id}`
      const f = new FormData()
      f.append('firstName', form.firstName)
      f.append('lastName', form.lastName)
      f.append('otherNames', form.otherNames)
      f.append('email', form.email)
      f.append('phone', form.phone)
      f.append('dob', form.dob)
      f.append('gender', form.gender)
      f.append('password', form.password)
      f.append('id', form.id)
      f.append('faculty', form.faculty)
      f.append('department', form.department)
      f.append('level', form.level)

      const res = await fetch(url, {
        method: 'PUT',
        body: f
      })
      const data = await res.json()
      console.log(data)
    } catch (err) {
      console.log(err)
    }
  }
  const delete_student = () => {
    const reply = prompt('are you sure you want to delete this Student? Type yes to confirm')
    if (reply?.toLowerCase() !== 'yes') return
    fetch('http://localhost/webais/api/students?id=' + id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: id })
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
        <label htmlFor="department">Department</label>
        <input type="text" name="department" id="department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />
        <label htmlFor="faculty">Faculty</label>
        <input type="text" id="faculty" name="faculty" value={form.faculty} onChange={(e) => setForm({ ...form, faculty: e.target.value })} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />
        
        <button className="bg-[#346837] py-2 mt-4 rounded-[4px] text-[#fff]">
          Update
        </button>
      </form>
      <div className="w-[80vw] max-w-[400px] mx-auto mt-10 flex flex-col items-end" >
        <h4 className="text-[#347836]">Dangerous Operation</h4>
        <button className="bg-[#990000] px-2 rounded text-white py-2" onClick={delete_student}>Delete Student</button>
      </div>
    </div>
  )
}