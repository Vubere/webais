import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { base } from "../../../App"

export default function UpdateDepartment() {
  const { id } = useParams()

  const [department, setDepartment] = useState({
    name: '',
    faculty_id: '',
    id: '',
  })

  const [faculties, setFaculties] = useState<any[]>([])

  const [errors, setErrors] = useState({
    name: '',
    faculty: '',
  })

  const [fetchError, setFetchError] = useState('')

  useEffect(() => {
    fetchFaculties()
    fetchDepartment()
  }, [])

  const validate = () => {
    let isValid = true
    let tempERR = { ...errors }
    if (department.name === '') {
      tempERR.name = 'Name is required'
      isValid = false
    }
    if (department.faculty_id === '') {
      tempERR.faculty = 'Faculty is required'
      isValid = false
    }
    if (!isValid) {
      setErrors(tempERR)
      setTimeout(() => {
        setErrors({
          name: '',
          faculty: '',
        })
      }, 2000)
    }
    return isValid
  }
  const fetchFaculties = async () => {
    try {
      const res = await fetch(base+'/faculty')
      const result = await res.json()
      setFaculties(result.data.data)
    } catch (error: any) {
      setFetchError(error?.message || 'something went wrong')
    }
  }
  const fetchDepartment = async () => {
    try {
      const res = await fetch(base+`/department?id=${id}`)
      const result = await res.json()
      setDepartment(result.data.data[0])

    } catch (error: any) {
      setFetchError(error?.message || 'something went wrong')
    }
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setDepartment({
      ...department,
      [e.target.name]: e.target.value,
    })
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (validate()) {
      try {
        const f = new FormData()
        f.append('name', department.name)
        f.append('faculty_id', department.faculty_id)
        f.append('id', department.id)

        const res = await fetch(base+`/department`, {
          method: 'PUT',
          body: f
        })
        const result = await res.json()

        if (result.status === 'success') {
          alert('success')
        } else {
          throw new Error(result?.status || 'something went wrong')
        }
      } catch (error: any) {
        setFetchError(error?.message || 'something went wrong')
      }
    }
  }
  return (
    <section className="h-[90vh] overflow-auto p-4 flex flex-col gap-10 pb-10">
      <h3 className="font-[700] text-[22px] text-center w-full pb-3 w-full text-[#347836]">Update Department</h3>
      <form onSubmit={onSubmit} className="w-[80vw] max-w-[400px] mx-auto flex flex-col gap-3">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" name="name" id="name" className=" w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] xs:p-2 stbt:p-4 xs:text-[14px] stbt:text-[18px] flex items-center focus:outline-none px-2" value={department.name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="faculty">Faculty</label>
          <select name="faculty" id="faculty"  value={department.faculty_id} onChange={handleChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836]  flex items-center focus:outline-none px-2">
            <option value="">Select Faculty</option>
            {faculties.map((faculty) => (
              <option key={faculty.id} value={faculty.id}>
                {faculty.name}
              </option>
            ))}

          </select>
        </div>
        <button type="submit" className="w-full h-[40px] rounded-[5px] bg-[#347836] text-white xs:text-[14px] stbt:text-[18px] mt-3">Update</button>
      </form>
      <div className="w-[80vw] max-w-[400px] mx-auto mt-10 flex flex-col items-end">
        <h4 className="text-[#347836]">Dangerous Operation</h4>
        <button className="bg-[#aa0000] px-2 rounded text-white py-1">Delete</button>
      </div>
    </section>
  )
}