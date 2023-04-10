import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { base } from "../../../App"


export default function UpdateFaculty() {
  const [faculty, setFaculty] = useState({
    name: '',
    id: '',
  })
  const [facultyDepartments, setFacultyDepartments] = useState<any[]>([])
  const [department, setDepartment] = useState('')
  const { id } = useParams()

  useEffect(() => {
    fetch(base+`/faculty?id=${id}`)
      .then(res => res.json())
      .then(res => setFaculty(res.data.data[0]))
   
  }, [id])
  useEffect(() => {
    if (faculty.name !== '') {
      fetch(base+`/department?faculty=${faculty.name}`)
        .then(res => res.json())
        .then(res => {
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
    fetch(base+`/faculty`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(faculty)
    }).then(res => res.json())
      .then(data => {
        console.log(data)
      }).catch(err => {
        console.log(err)
      })
  }
  const addDepartment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    fetch(base+`/department`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: department,
        faculty_id: faculty.id
      })
    }).then(res => res.json())
      .then(data => {
      })
      .catch(err => {
        console.log(err)
      })
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
                  <p className="text-[#346837]"><span>{index + 1}</span>{': '}{department.name}</p>
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
          <input type="text" name="department" id="department" value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] xs:p-2 stbt:p-4 xs:text-[14px] stbt:text-[18px] flex items-center focus:outline-none px-2 "
            placeholder="department name..." />
          <button type="submit" className="w-full h-[40px] rounded-[5px] bg-[#347836] text-white xs:text-[14px] stbt:text-[18px] mt-3">Add</button>
        </form>
        <div className="w-[80vw] max-w-[400px] mx-auto mt-10 flex flex-col items-end" >
          <h4 className="text-[#347836]">Dangerous Operation</h4>
          <button className="bg-[#990000] px-2 rounded text-white py-2" >Delete Faculty</button>
        </div>
      </div>
    </section>
  )
}