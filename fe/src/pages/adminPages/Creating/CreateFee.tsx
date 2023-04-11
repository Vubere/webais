import { useState, useEffect, useContext } from "react"

import { Fee } from "../FeesManagement"
import useFacultiesAndDepartments from "../../../hooks/useFacultiesAndDepartments"
import { SessionContext } from "../../../layouts/DashboardLayout"
import { base } from "../../../App"


export default function CreateFee() {
  const sess = useContext(SessionContext)

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
    last_updated: ''
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
    created: '',
    last_updated: ''
  })
  const {error:dept_error, faculties, departments } = useFacultiesAndDepartments()

  useEffect(() => {
    if(sess){
      setFee({...fee, session: sess.session.session})
    }
  }, [sess])

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
        created: '',
        last_updated: ''
      })
    }, 3000)
    return Object.values(temp_err).every(x => x === '')
  }
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (validate()) {
      const f = new FormData()
      f.append('name', fee.name)
      f.append('amount', fee.amount.toString())
      f.append('department', fee.department)
      f.append('session', fee.session)
      f.append('semester', fee.semester.toString())
      f.append('level', fee.level)
      f.append('status', fee.status)
      f.append('created', fee.created)
      f.append('last_updated', fee.last_updated)
      f.append('id', fee.id.toString())
      

      fetch(base+'/fee', {
        method: 'POST',
        body: f
      })
      .then(res => res.json())
      .then(data => {
        if(data?.ok){
          reset()
          alert('Fee created successfully')
        }else{
          throw new Error(data?.message||'Error creating fee')
        }
      })
      .catch((err)=>{
        alert(err?.message||'Error creating fee')
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
            <option value="Tuition">Tuition</option>
            <option value='Matriculation Gown'>Matriculation Gown</option>
            <option value='Convocation Gown'>Convocation Gown</option>
            <option value="Transcript Fee">Transcript Fee</option>
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
            <option value="all">All</option>

            {departments&&departments.sort((a:any,b:any)=>a.name>b.name?1:-1).map((dept:any) => (
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
            <option value='all'>all</option>
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

        <button type="submit" className="w-full min-w-[200px] h-[40px] rounded-[5px] bg-[#347836] text-white xs:text-[14px] stbt:text-[18px]">Create</button>


      </form>
    </section >
  )
}