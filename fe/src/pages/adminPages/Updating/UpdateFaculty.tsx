import { ChangeEvent, useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { base } from "../../../App"


export default function UpdateFaculty() {
  const [faculty, setFaculty] = useState({
    name: '',
    id: '',
  })
  const [facultyDepartments, setFacultyDepartments] = useState<any[]>([])
  const [department, setDepartment] = useState({
    name: '',
    duration: ''
  })
  const [errors, setErrors] = useState({
    name: '',
    duration: ''
  })
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    fetch(base + `/faculty?id=${id}`)
      .then(res => res.json())
      .then(res => setFaculty(res.data.data[0]))

  }, [id])
  useEffect(() => {
    if (faculty.name !== '') {
      fetch(base + `/department?faculty=${faculty.id}`)
        .then(res => res.json())
        .then(res => {
          console.log(res)
          setFacultyDepartments(res.data.data)

        }).catch(err => {
          console.log(err)
        })
    }
  }, [faculty.name])
  const changeFacultyName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFaculty({
      ...faculty,
      name: e.target.value
    })
  }
  const submitNameChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData()
    f.append('name', faculty.name)
    f.append('id', faculty.id)
    f.append('method', 'PUT')

    fetch(base + `/faculty`, {
      method: 'POST',
      body: f
    }).then(res => res.json())
      .then(data => {
        console.log(data)
      }).catch(err => {
        console.log(err)
      })
  }
  const addDepartment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData()
    f.append('name', department.name)
    f.append('duration', department.duration)
    f.append('faculty_id', faculty.id)
    f.append('method', 'POST')

    fetch(base + `/department`, {
      method: 'POST',
      body: f
    }).then(res => res.json())
      .then(data => {
        if (data.status == 'success') {
          alert('Department added successfully')
          setFacultyDepartments(prev => [...prev, department])
          setDepartment({
            duration: '',
            name: ''
          })
        } else {
          throw new Error(data?.message || 'something went wrong')
        }
      })
      .catch((err: any) => {
        alert(err?.message || 'something went wrong')
      })
  }
  const onDeptChange = (e: ChangeEvent<HTMLInputElement|HTMLSelectElement>) => {
    const { name, value } = e.target
    setDepartment({
      ...department,
      [name]: value
    })
  }
  const delete_faculty = async () => {
    const f = new FormData()
    f.append('id', faculty.id)
    f.append('method', 'DELETE')
    const res = await fetch(base + `/faculty`, {
      method: 'POST',
      body: f
    })
    const data = await res.json()
    if (data.status == 'success') {
      alert('Faculty deleted successfully')
      navigate(-1)
    } else {
      alert(data.message)
    }
  }

  return (
    <section className="h-[90vh] overflow-auto p-4 flex flex-col gap-10 pb-10">
      <h2 className="font-[700] text-[22px] text-center w-full pb-3 w-full text-[#347836]">{faculty.name == '' ? 'Faculty' : `Faculty of ${faculty.name}`}</h2>
      <form onSubmit={submitNameChange} className="w-[80vw] max-w-[400px] mx-auto ">
        <input type="text" name="name" id="name" value={faculty.name} onChange={changeFacultyName} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] xs:p-2 stbt:p-4 xs:text-[14px] stbt:text-[18px] flex items-center focus:outline-none px-2" />
        <button type="submit" className="w-full h-[40px] rounded-[5px] bg-[#347836] text-white xs:text-[14px] stbt:text-[18px] mt-3">Change Name</button>
      </form>
      <div className="w-[80vw] max-w-[400px] mx-auto flex flex-col gap-2">
        <h3 className="font-[500] text-[22px] text-center w-full pb-3 w-full text-[#347836]">Departments</h3>
        {
          facultyDepartments.length > 0 ?
            facultyDepartments.map((department, index) => {
              return (
                <div key={index} className='flex gap-[10px] w-full justify-between'>
                  <p className="text-[#346837]"><span>{index + 1}</span>{': '}{department.name}({department.duration} years)</p>
                  <Link to={`/dashboard-admin/update-department/${department.id}`}>
                    <button className="bg-[#346837] px-2 rounded text-[#fff]">edit</button>
                  </Link>
                </div>
              )
            }) : <p>No departments</p>
        }
      </div>
      <div>

        <h3 className="font-[500] text-[22px] text-center w-full pb-3 w-full text-[#347836]">Add Department</h3>
        <form onSubmit={addDepartment} className="w-[80vw] max-w-[400px] mx-auto">
          <label htmlFor="dept_name">Department Name</label>
          <input type="text" name="name" id="dept_name" value={department.name} onChange={onDeptChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] xs:p-2 stbt:p-4 xs:text-[14px] stbt:text-[18px] flex items-center focus:outline-none px-2 " placeholder="name..." />
          <label htmlFor="duration">Duration</label>
          <select  name="duration" id="duration" value={department.duration} onChange={onDeptChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] flex items-center focus:outline-none px-2 ">
            <option value=''>Select Duration</option>
            <option value='3'>3</option>
            <option value='4'>4</option>
            <option value='5'>5</option>
            <option value='6'>6</option>
            <option value='7'>7</option>
          </select>
          <button type="submit" className="w-full h-[40px] rounded-[5px] bg-[#347836] text-white xs:text-[14px] stbt:text-[18px] mt-3">Add</button>
        </form>
        <div className="w-[80vw] max-w-[400px] mx-auto mt-10 flex flex-col items-end" >
          <h4 className="text-[#347836]">Dangerous Operation</h4>
          <button className="bg-[#990000] px-2 rounded text-white py-2" onClick={delete_faculty}>Delete Faculty</button>
        </div>
      </div>
    </section>
  )
}