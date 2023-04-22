import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { base } from "../../../App"




export default function UpdateLecturer() {
  const { id } = useParams()

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    otherNames: '',
    email: '',
    phone: '',
    dob: '',
    degreeAcquired: '',
    discipline: '',
    gender: '',
    id: '',
    password: '',
  })
  const navigate = useNavigate()
  const fetchLecturer = async () => {
    try {
      let url = base + `/lecturers?id=${id}`
      const res = await fetch(url);
      const data = await res.json()
      if (data.lecturer.length) {
        setForm(data.lecturer[0])
      } else {
        throw new Error('Lecturer not found')
      }
    } catch (err: any) {
      alert(err?.message || 'something went wrong')
      navigate(-1)
    }
  }
  useEffect(() => {
    fetchLecturer();
  }, [])
  const onSubmit = (e: any) => {
    e.preventDefault()
    updateLecturer()
  }
  const updateLecturer = async () => {
    try {
      

      let url = base + `/lecturers?id=${id}`

      const formData = new FormData()
      formData.append('id', form.id)
      formData.append('firstName', form.firstName)
      formData.append('lastName', form.lastName)
      formData.append('otherNames', form.otherNames)
      formData.append('email', form.email)
      formData.append('phone', form.phone)
      formData.append('dob', form.dob)
      formData.append('password', form.password)
      formData.append('gender', form.gender)
      formData.append('degreeAcquired', form.degreeAcquired)
      formData.append('discipline', form.discipline)
      formData.append('method', 'PUT')

      const res = await fetch(url, {
        method: 'POST',
        body: formData
      })

      const data = await res.json()
      if(data.ok){
        alert('Lecturer updated successfully')
      }else{
        throw new Error(data?.message || 'Error updating lecturer')
      }
    } catch (err: any) {
      alert(err?.message || 'something went wrong')
    }
  }
  const delete_lecturer = () => {
    const reply = prompt('are you sure you want to delete this Lecturer? Type yes to confirm')
    if (reply?.toLowerCase() !== 'yes') return
    if(!id){ 
      alert('no lecturer id found')
      return
    }
    const formData = new FormData()
    formData.append('id', id)
    formData.append('method', 'DELETE')

    fetch(base + '/lecturers?id=' + id, {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        if (data?.ok) {
          alert('Lecturer deleted successfully')
          navigate(-1)
        } else {
          throw new Error(data?.message || 'Error deleting lecturer')
        }
      })
      .catch((err) => {
        alert(err?.message || 'Error deleting lecturer')
      })
  }

  const dob = useMemo(() => {
    if (form.dob) {
     /* format to yyyy-mm-dd */
      const date = new Date(form.dob)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
    }else{
      return ''
    }
  }, [form.dob])

  return (
    <div className="p-4 flex flex-col w-full items-center h-[90vh] overflow-y-auto">
      <h1>{form.id}</h1>
      <form onSubmit={onSubmit} className="flex flex-col w-[80vw] max-w-[400px] gap-2 p-4">
        <label htmlFor="email">Email</label>
        <input type="text" name="email" id="label" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />
        <label htmlFor="fN">First Name</label>
        <input type="text" name="firstName" id='fN' value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />
        <label htmlFor="lN">Last Name</label>
        <input type="text" id="lN" name="name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />
        <label htmlFor="oN">Other Names</label>
        <input type="text" id="oN" name="name" value={form.otherNames} onChange={(e) => setForm({ ...form, otherNames: e.target.value })} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />
        <label htmlFor="">Phone</label>
        <input type="text" name="name" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />
        <label htmlFor="discipline">Discipline</label>
        <input type="text" id="discipline" name="discipline" value={form.discipline} onChange={(e) => setForm({ ...form, discipline: e.target.value })} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />
        <label htmlFor="dA">Degree Acquired</label>
        <input type="text" id="dA" name="degree" value={form.degreeAcquired} onChange={(e) => setForm({ ...form, degreeAcquired: e.target.value })} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />
        <label htmlFor="dob">Date of Birth</label>
        <input type="date" id="dob" name="dob" value={dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />
        <label htmlFor="pwd">Password</label>
        <input type="text" id="Pwd" name="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />
        <button className="bg-[#346837] py-2 mt-4 rounded-[4px] text-[#fff]">
          Update
        </button>
      </form>
      <div className="w-[80vw] max-w-[400px] mx-auto mt-10 flex flex-col items-end" >
        <h4 className="text-[#347836]">Dangerous Operation</h4>
        <button className="bg-[#990000] px-2 rounded text-white py-2" onClick={delete_lecturer}>Delete Lecturer</button>
      </div>
    </div>
  )
}