import { useEffect, useState } from "react"
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
    gender: '',
    id: '',
    password: '',
  })
  const navigate = useNavigate()
  const fetchLecturer = async () => {
    try {
      let url = base+`/lecturers?id=${id}`
      const res = await fetch(url);
      const data = await res.json()
      if (data.lecturer.length) {
        setForm(data.lecturer[0])
      } else {
        console.log(data)
      }
    } catch (err) {
      console.log(err)
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
      let url = base+`/lecturers?id=${id}`
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      console.log(data)
    } catch (err) {
      console.log(err)
    }
  }
  const delete_lecturer = () => {
    const reply = prompt('are you sure you want to delete this Lecturer? Type yes to confirm')
    if (reply?.toLowerCase() !== 'yes') return
    fetch('http://localhost/webais/api/lecturers?id=' + id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: id })
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

  return (
    <div className="p-4 flex flex-col w-full items-center">
      <h1>{form.id}</h1>
      <form onSubmit={onSubmit} className="flex flex-col w-[80vw] max-w-[400px] gap-2 p-4">
        <input type="text" name="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />
        <input type="text" name="firstName" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />
        <input type="text" name="name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />
        <input type="text" name="name" value={form.otherNames} onChange={(e) => setForm({ ...form, otherNames: e.target.value })} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />
        <label htmlFor="">Phone</label>
        <input type="text" name="name" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />
        <input type="text" name="name" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />
        <input type="text" name="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />
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