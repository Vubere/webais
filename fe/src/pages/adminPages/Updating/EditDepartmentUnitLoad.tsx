import { FormEventHandler, useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { base } from "../../../App"
import { unitLoads } from "../Viewing/DepartmentUnitLoads"
import useFacultiesAndDepartments from "../../../hooks/useFacultiesAndDepartments"



export default function EditUnitLoad() {
  const [unitLoad, setUnitLoad] = useState({
    department_id: '',
    session: '',
    semester: 0,
    level: '',
    min_units: '',
    max_units: '',
  })
  const [err, setErr] = useState({
    department_id: '',
    session: '',
    semester: '',
    level: '',
    min_units: '',
    max_units: '',
  })
  const { id } = useParams()

  useEffect(() => {
    if (id) {
      fetch(base + '/assign_unit_load?id=' + id)
        .then(res => res.json())
        .then(data => {
          if (data?.ok == 1) {
            setUnitLoad(data?.data[0])
          } else {
            throw new Error(data?.message || 'something went wrong')
          }
        })
        .catch((err: any) => {
          alert(err?.message || 'something went wrong')
        })
    }
  }, [id])
  const { faculties, departments, loading: sLoading, error } = useFacultiesAndDepartments()
  const [loading, setLoading] = useState(true)


  const handleChange = (e: any) => {
    setUnitLoad({
      ...unitLoad,
      [e.target.name]: e.target.value
    })
  }
  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    if (validate()) {
      console.log(unitLoad.session)
      fetch(base + '/assign_unit_load', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(unitLoad)
      }).then(res => res.json())
        .then(data => {
          console.log(data)
          if (data?.ok == 1) {
            alert('department load updated successfully')
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
  const validate = () => {
    let isValid = true
    const tempErr = { ...err }
    if (unitLoad.session === '') {
      tempErr.session = 'Session is required'
      isValid = false
    }
    if (unitLoad.semester === 0) {
      tempErr.semester = 'Semester is required'
      isValid = false
    }
    if (unitLoad.level === '') {
      tempErr.level = 'Level is required'
      isValid = false
    }
    if (unitLoad.min_units === '') {
      tempErr.min_units = 'Minimum units is required'

      isValid = false
    }
    if (unitLoad.min_units !== '' && unitLoad.max_units !== '' && parseInt(unitLoad.min_units) > parseInt(unitLoad.max_units)) {
      tempErr.min_units = 'Minimum units cannot be greater than maximum units'
      tempErr.max_units = 'Maximum units cannot be less than minimum units'
      isValid = false
    }
    if (parseInt(unitLoad.min_units) < 14) {
      tempErr.min_units = 'Minimum units cannot be less than 14'
      isValid = false
    }
    if (parseInt(unitLoad.max_units) > 26) {
      tempErr.max_units = 'Maximum units cannot be greater than 26'
      isValid = false
    }
    if (unitLoad.max_units === '') {
      tempErr.max_units = 'Maximum units is required'
      isValid = false
    }
    if (!isValid) {
      setErr(tempErr)
      setTimeout(() => {
        setErr({
          session: '',
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



  const dept = useMemo(() => departments?.find(dept => dept.id == unitLoad.department_id), [unitLoad?.department_id, departments])
  const faculty = useMemo(() => faculties?.find(fac => fac.id == dept?.faculty_id), [dept?.faculty_id, faculties])

  const year = new Date().getFullYear()

  return (
    <div className="w-full h-[90vh] overflow-y-auto p-3 flex flex-col items-center pb-20">
      <h3 className="w-full text-center font-[700] text-[22px] text-[#346837]">Edit Department Unit Load</h3>
      {dept && faculty && <div className="w-full h-full flex items-center justify-center">
        <ul>
          <li>Faculty: {faculty?.name}</li>
          <li>Department: {dept?.name}</li>
        </ul>
      </div>}
      <div className="w-full flex flex-col items-center">
        <form onSubmit={onSubmit} className="max-w-[400px] w-[80vw]">
          <div>
            <label htmlFor="session">Session *</label>
            {err.session && <span className="text-red-500 text-[12px]">{err.session}</span>}
            <select name="session" value={unitLoad.session} onChange={handleChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836]  flex items-center focus:outline-none px-2">
              <option value="">Select session</option>
              <option value={`${year + 2}/${year + 3}`}>{`${year + 2}/${year + 3}`}</option>
              <option value={`${year + 1}/${year + 2}`}>{`${year + 1}/${year + 2}`}</option>
              <option value={`${year}/${year + 1}`}>{`${year}/${year + 1}`}</option>
              <option value={`${year - 1}/${year}`}>{`${year - 1}/${year}`}</option>
              <option value={`${year - 2}/${year - 1}`}>{`${year - 2}/${year - 1}`}</option>
            </select>
          </div>
          <div className="w-full">
            <label htmlFor="level">Level *</label>
            {err.level && <span className="text-red-500 text-[12px]">{err.level}</span>}
            <select name="level" id="level" value={unitLoad.level} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836]  flex items-center focus:outline-none px-2" onChange={handleChange}>
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
            <select name="semester" id="semester" value={unitLoad.semester} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836]  flex items-center focus:outline-none px-2" onChange={handleChange}>
              <option value="">Select Semester</option>
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </div>
          <div className="w-full">
            <label htmlFor="min_units">Minimum Units *</label>
            {err.min_units && <span className="text-red-500 text-[12px]">{err.min_units}</span>}
            <input type="number" name="min_units" id="min_units" value={unitLoad.min_units} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836]  flex items-center focus:outline-none px-2" onChange={handleChange} />
          </div>
          <div className="w-full">
            <label htmlFor="max_units">Maximum Units *</label>
            {err.max_units && <span className="text-red-500 text-[12px]">{err.max_units}</span>}
            <input type="number" name="max_units" id="max_units" value={unitLoad.max_units} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836]  flex items-center focus:outline-none px-2" onChange={handleChange} />
          </div>
          <button type="submit" className="bg-[#347836] text-white px-4 py-2 rounded-[5px] mt-4 w-full">Submit</button>
        </form>
      </div>
    </div>
  )
}