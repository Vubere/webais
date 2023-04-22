import { useState, useEffect, useContext } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { Fee } from "../FeesManagement"
import useFacultiesAndDepartments from "../../../hooks/useFacultiesAndDepartments"
import { base } from "../../../App"



export default function UpdateFee() {

  const { id } = useParams<{ id: string }>()
  const [fee, setFee] = useState<Fee>({
    id: 0,
    name: '',
    amount: 0,
    department: '',
    session: '',
    semester: 0,
    level: '',
    status: '',
    created: '',
    last_updated: '',
  })

  const [error, setError] = useState({
    id: '',
    name: '',
    amount: '',
    department: '',
    session: '',
    semester: '',
    level: '',
    status: '',
  })
  const { error: dept_error, faculties, departments } = useFacultiesAndDepartments()
  const navigate = useNavigate();

  useEffect(() => {
    fetch(base+'/fee?id=' + id)
      .then(res => res.json())
      .then(data => {
        if (data?.ok) {
          const fee = data.data[0]
          setFee({ ...fee, status: fee.fee_status, department: fee.department_id })
        }
      })
      .catch((err) => {
        alert(err?.message || 'Error updating fee')
      })
  }, [id])




  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFee({ ...fee, [e.target.name]: e.target.value })
  }


  const validate = () => {
    let temp_err = { ...error }
    temp_err.name = fee.name ? '' : 'Name is required'
    temp_err.amount = fee.amount ? '' : 'Amount is required'
    temp_err.department = fee.department ? '' : 'Department is required'
    temp_err.session = fee.session ? '' : 'Session is required'
    temp_err.semester = fee.semester ? '' : 'Semester is required'
    temp_err.level = fee.level ? '' : 'Level is required'
    temp_err.status = fee.status ? '' : 'Status is required'
    setError(temp_err)
    setTimeout(() => {
      setError({
        id: '',
        name: '',
        amount: '',
        department: '',
        session: '',
        semester: '',
        level: '',
        status: '',
      })
    }, 3000)
    return Object.values(temp_err).every(x => x === '')
  }
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (validate()) {

      fetch(base+'/fee', {
        method: 'PUT',
        body: JSON.stringify(fee),
      })
        .then(res => res.json())
        .then(data => {
          if (data?.ok) {
            reset
            alert('Fee updated successfully')
          } else {
            throw new Error(data?.message || 'Error updating fee')
          }
        })
        .catch((err) => {
          alert(err?.message || 'Error updating fee')
        })
    }
  }

  const year = new Date().getFullYear()
  const reset = () => {
    setFee({
      id: 0,
      name: '',
      amount: 0,
      department: '',
      session: '',
      semester: 0,
      level: '',
      status: '',
      created: '',
      last_updated: ''
    })
  }
  

  const delete_fee = () => {
    const reply = prompt('are you sure you want to delete this fee? Type yes to confirm')
    if(reply?.toLowerCase() !== 'yes') return
    fetch(base+'/fee' , {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: id })
    })
      .then(res => res.json())
      .then(data => {
        if (data?.ok) {
          alert('Fee deleted successfully')
          navigate(-1)
        } else {
          throw new Error(data?.message || 'Error deleting fee')
        }
      })
      .catch((err) => {
        alert(err?.message || 'Error deleting fee')
      })
  }

  return (
    <section className="w-full h-[90vh] content-box overflow-auto pb-[30px]">
      <h3 className="text-center text-[22px] text-[#346837]">Create Fee</h3>
      <form onSubmit={onSubmit} className="flex flex-col items-center gap-2 max-w-[400px] mx-auto">
        <div className="w-full flex flex-col gap-1">
          <label htmlFor="name">Name</label>
          {error.name && <span className="text-red-500 text-[12px]">{error.name}</span>}
          <select name="name" id="name" value={fee.name} onChange={onChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836]  flex items-center focus:outline-none px-2">
            <option value="">Select Fee</option>
            <option value="registration">Registration</option>
            <option value="accreditation">Accreditation</option>
            <option value="tuition">Tuition</option>
            <option value="library">Library</option>
            <option value="hostel">Hostel</option>
          </select>
        </div>
        <div className="w-full flex flex-col gap-1">
          <label htmlFor="amount">Amount</label>
          {error.amount && <span className="text-red-500 text-[12px]">{error.amount}</span>}
          <input type="number" name="amount" id="amount" value={fee.amount} onChange={onChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] xs:p-2 stbt:p-4 xs:text-[14px] stbt:text-[18px] flex items-center focus:outline-none px-2" />
        </div>
        <div className="w-full flex flex-col gap-1">
          <label htmlFor="department">Department</label>
          {error.department && <span className="text-red-500 text-[12px]">{error.department}</span>}
          <select name="department" id="department" value={fee.department} onChange={onChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] ] flex items-center focus:outline-none px-2">
            <option value="">Select Department</option>
            <option value="0">All</option>

            {departments && departments.sort((a: any, b: any) => a.name > b.name ? 1 : -1).map((dept: any) => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}

          </select>
        </div>
        <div className="w-full flex flex-col gap-1">
          <label htmlFor="session">Session</label>
          {error.session && <span className="text-red-500 text-[12px]">{error.session}</span>}
          <select name="session" id="session" value={fee.session} onChange={onChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836]  flex items-center focus:outline-none px-2">
            <option value="">Select Session</option>
            <option value={`${year + 2}/${year + 3}`}>{`${year + 2}/${year + 3}`}</option>
            <option value={`${year + 1}/${year + 2}`}>{`${year + 1}/${year + 2}`}</option>
            <option value={`${year}/${year + 1}`}>{`${year}/${year + 1}`}</option>
            <option value={`${year - 1}/${year}`}>{`${year - 1}/${year}`}</option>
            <option value={`${year - 2}/${year - 1}`}>{`${year - 2}/${year - 1}`}</option>
            <option value={`${year - 3}/${year - 2}`}>{`${year - 3}/${year - 2}`}</option>
          </select>
        </div>
        <div className="w-full flex flex-col gap-1">
          <label htmlFor="semester">Semester</label>
          {error.semester && <span className="text-red-500 text-[12px]">{error.semester}</span>}
          <select name="semester" id="semester" value={fee.semester} onChange={onChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836]  flex items-center focus:outline-none px-2">
            <option value="">Select Semester</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value='0'>all</option>
          </select>
        </div>
        <div className="w-full flex flex-col gap-1">
          <label htmlFor="level">Level</label>
          {error.level && <span className="text-red-500 text-[12px]">{error.level}</span>}
          <select name="level" id="level" value={fee.level} onChange={onChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836]  flex items-center focus:outline-none px-2">
            <option value="">Select Level</option>
            <option value="100">100</option>
            <option value="200">200</option>
            <option value="300">300</option>
            <option value="400">400</option>
            <option value="500">500</option>
            <option value="600">600</option>
          </select>
        </div>
        <div className="w-full flex flex-col gap-1">
          <label htmlFor="status">Status</label>
          {error.status && <span className="text-red-500 text-[12px]">{error.status}</span>}
          <select name="status" id="status" value={fee.status} onChange={onChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836]  flex items-center focus:outline-none px-2">
            <option value="">Select Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <button type="submit" className="w-full min-w-[200px] h-[40px] rounded-[5px] bg-[#347836] text-white xs:text-[14px] stbt:text-[18px]">Update</button>


      </form>
      <div className="w-[80vw] max-w-[400px] mx-auto mt-10 flex flex-col items-end" >
        <h4 className="text-[#347836]">Dangerous Operation</h4>
        <button className="bg-[#990000] px-2 rounded text-white py-2" onClick={delete_fee}>Delete Fee</button>
      </div>
    </section >
  )
}