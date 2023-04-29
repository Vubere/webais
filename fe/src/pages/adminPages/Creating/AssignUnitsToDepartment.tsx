import { FormEventHandler, useContext, useEffect, useState } from "react"
import { SessionContext } from "../../../layouts/DashboardLayout"
import useFacultiesAndDepartments from "../../../hooks/useFacultiesAndDepartments"
import { MultiSelect, Option } from "react-multi-select-component"
import { base } from "../../../App"



export default function AssignUnitsToDepartment() {
  const [distribution, setDistribution] = useState({
    semester: 0,
    level: '',
    department_id: '',
    min_units: '',
    max_units: ''
  })
  const [err, setErr] = useState({
    department_id: '',
    semester: '',
    level: '',
    min_units: '',
    max_units: ''
  })
  const { faculties, departments, loading: sLoading, error } = useFacultiesAndDepartments()
  const [loading, setLoading] = useState(true)
  const Session = useContext(SessionContext)

  const [search, setSearch] = useState('')

  const reset_distribution = () => {
    setDistribution({
      semester: 0,
      level: '',
      department_id: '',
      min_units: '',
      max_units: ''
    })
  }


  useEffect(() => {
    if (Session?.session) {
      setDistribution({ ...distribution, semester: Session.session.current_semester as number })
    }
  }, [Session?.session])

  const validate = () => {
    let isValid = true
    const tempErr = { ...err }
    if (distribution.semester === 0) {
      tempErr.semester = 'Semester is required'
      isValid = false
    }
    if (distribution.level === '') {
      tempErr.level = 'Level is required'
      isValid = false
    }

    if (distribution.department_id === '') {
      tempErr.department_id = 'Department is required'
      isValid = false
    }
    if (distribution.min_units === '') {
      tempErr.min_units = 'Minimum units is required'

      isValid = false
    }
    if(distribution.min_units !== '' && distribution.max_units !== '' && parseInt(distribution.min_units) > parseInt(distribution.max_units)){
      tempErr.min_units = 'Minimum units cannot be greater than maximum units'
      tempErr.max_units = 'Maximum units cannot be less than minimum units'
      isValid = false
    }
    if(parseInt(distribution.min_units) < 14){
      tempErr.min_units = 'Minimum units cannot be less than 14'
      isValid = false
    }
    if(parseInt(distribution.max_units) > 26){
      tempErr.max_units = 'Maximum units cannot be greater than 26'
      isValid = false
    }
    if (distribution.max_units === '') {
      tempErr.max_units = 'Maximum units is required'
      isValid = false
    }
    if (!isValid) {
      setErr(tempErr)
      setTimeout(() => {
        setErr({
          department_id: '',
          level: '',
          semester: '',
          min_units: '',
          max_units: ''
        })
      }, 2000)
    }
    return isValid
  }

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    if (validate()) {
      const { department_id, level, semester, min_units, max_units } = distribution
      const form = new FormData()
      form.append('department_id', department_id)
      form.append('level', level)
      form.append('semester', semester.toString())
      form.append('min_units', min_units)
      form.append('max_units', max_units)
      form.append('method', "POST")
      setLoading(true)
      fetch(base + '/assign_unit_load', {
        method: 'POST',
        body: form
      }).then(res => res.json())
        .then(data => {
          if (data?.ok == 1) {
            alert('unit load assigned successfully')
            reset_distribution()
          } else {
            throw new Error(data?.message || 'something went wrong')
          }
          setLoading(false)
        })
        .catch(err => {
          alert(err?.message || 'something went wrong')
          setLoading(false)
        })
    }
  }


  const handleChange = (err: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = err.target
    setDistribution({
      ...distribution,
      [name]: value
    })
  }

  const year = new Date().getFullYear()


  const departmentFilter = departments?.filter(
    dept=> dept.name.toLowerCase().includes(search.toLowerCase())
  )||[]

  return (
    <div className="p-3 w-full overflow-y-auto flex flex-col items-center">
      <h3 className="w-full text-center font-[700] text-[22px] text-[#346837] mb-3">Assign Unit Load To Department</h3>
      <form onSubmit={onSubmit} className="max-w-[400px] w-[80vw]">

        <div className="w-full">
          <label htmlFor="department">Departments *</label>
          <label htmlFor="search" className="block m-2 flex gap-2 text-[#346837]" >
            Search:
            <input type="text" name="search" id="search" value={search} onChange={e=>setSearch(e.target.value)} className="bg-transparent border border-[#346837] outline-none rounded p-2 h-[25px]"/>
          </label>
          {err.department_id && <span className="text-red-500 text-[12px]">{err.department_id}</span>}
          <select name="department_id" value={distribution.department_id} onChange={handleChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836]  flex items-center focus:outline-none px-2">
            <option value="">Select Department</option>
            {departmentFilter?.map(department => (
              <option key={department.id} value={department.id}>{department.name}</option>
            ))}
          </select>

        </div>
        <div className="w-full">
          <label htmlFor="level">Level *</label>
          {err.level && <span className="text-red-500 text-[12px]">{err.level}</span>}
          <select name="level" id="level" value={distribution.level} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836]  flex items-center focus:outline-none px-2" onChange={handleChange}>
            <option value="">Select Level</option>
            <option value="100">100</option>
            <option value="200">200</option>
            <option value="300">300</option>
            <option value="400">400</option>
            <option value="500">500</option>
            <option value="600">600</option>
          </select>
        </div>
        <div className="w-full">
          <label htmlFor="semester">Semester *</label>
          {err.semester && <span className="text-red-500 text-[12px]">{err.semester}</span>}
          <select name="semester" id="semester" value={distribution.semester} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836]  flex items-center focus:outline-none px-2" onChange={handleChange}>
            <option value="">Select Semester</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </div>
        <div className="w-full">
          <label htmlFor="min_units">Minimum Units *</label>
          {err.min_units && <span className="text-red-500 text-[12px]">{err.min_units}</span>}
          <input type="number" name="min_units" id="min_units" value={distribution.min_units} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836]  flex items-center focus:outline-none px-2" onChange={handleChange} />
        </div>
        <div className="w-full">
          <label htmlFor="max_units">Maximum Units *</label>
          {err.max_units && <span className="text-red-500 text-[12px]">{err.max_units}</span>}
          <input type="number" name="max_units" id="max_units" value={distribution.max_units} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836]  flex items-center focus:outline-none px-2" onChange={handleChange} />
        </div>
        <button type="submit" className="bg-[#347836] text-white px-4 py-2 rounded-[5px] mt-4 w-full">Submit</button>
      </form>
    </div>
  )
}