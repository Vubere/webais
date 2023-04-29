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
    dob: '',
    gender: '',
    id: '',
    password: '',
  })
  const navigate = useNavigate()
  const fetchAdmin = async () => {
    try {
      let url = base+`/admins?id=${id}`
      const res = await fetch(url);
      const data = await res.json()
      if (data?.admin) {
        setForm({...data.admin, dob: formatDateToYMD(data.admin.dob)})
      }else{
      }
    } catch (err) {
    }
  }
  useEffect(() => {
    fetchAdmin();
  }, [])
  const onSubmit = (e: any) => {
    e.preventDefault()
    updateAdmin()
  }
  const updateAdmin = async () => {
    try {
      let url = base+`/admins`
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
      formData.append('method', 'PUT')

      const res = await fetch(url, {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data?.ok) {
        alert('Administrator updated successfully')
     
      } else {
        throw new Error(data?.message || 'Error updating administrator')
      }
    } catch (err) {
    }
  }

  const delete_admin = () => {
    const reply = prompt('are you sure you want to delete this Administrator? Type yes to confirm')
    if (reply?.toLowerCase() !== 'yes') return

    const formData = new FormData()
    formData.append('id', form.id)
    formData.append('method', 'DELETE')
    fetch(base+'/admins?id=' + id, {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        if (data?.ok) {
          alert('Administrator deleted successfully')
          navigate(-1)
        } else {
          throw new Error(data?.message || 'Error deleting administrator')
        }
      })
      .catch((err) => {
        alert(err?.message || 'Error deleting administrator')
      })
  }

  return (
    <div className="p-4 h-[90vh] pb-[30px] flex flex-col items-center">
      <h1>{form.id}</h1>
      <form onSubmit={onSubmit} className="flex flex-col w-[80vw] max-w-[400px] gap-2 p-4">
        <input type="text" name="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />
        <input type="text" name="firstName" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />
        <input type="text" name="name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />
        <input type="text" name="name" value={form.otherNames} onChange={(e) => setForm({ ...form, otherNames: e.target.value })} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />
        <input type="text" name="name" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />
        <input type="date" name="name" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />
        <input type="text" name="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="text-[#346237] h-[40px] bg-transparent border border-[#346837] rounded-[5px] px-2" />
        <button className="bg-[#346837] py-2 mt-4 rounded-[4px] text-[#fff]">
          Update
        </button>
      </form>
      <div className="w-[80vw] max-w-[400px] mx-auto mt-10 flex flex-col items-end" >
        <h4 className="text-[#347836]">Dangerous Operation</h4>
        <button className="bg-[#990000] px-2 rounded text-white py-2" onClick={delete_admin}>Delete Admin</button>
      </div>
    </div>
  )
}