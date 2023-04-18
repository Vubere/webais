import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { User } from "./ViewAdmin"

import * as routes from '../../../constants/routes'
import { base } from "../../../App"
import useFacultiesAndDepartments from "../../../hooks/useFacultiesAndDepartments"

export default function ViewStudents() {
  const [search, setSearch] = useState('')
  const [students, setStudents] = useState<any>([])
  const {departments, faculties} = useFacultiesAndDepartments()

  async function fetchStudents() {
    try {
      let url = base+'/students'

      const res = await fetch(url);
      const data = await res.json()
      console.log(data)
      if(data.length)
      setStudents(data)
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    fetchStudents();
  }, [])
  


  const onSubmit = (e: any) => {
    e.preventDefault()
  }
  const fullname = (student: students) => {
    if (student.firstName && student.lastName) {
      return student.firstName + ' ' + student.lastName
    } else if (student.firstName) {
      return student.firstName
    } else if (student.lastName) {
      return student.lastName
    } else {
      return 'No name'
    }
  }
  const filteredStudents = students?students?.filter((student: students) => fullname(student).toLowerCase().includes(search.toLowerCase()) || student.email.toLowerCase().includes(search.toLowerCase()) || student.faculty.toLowerCase().includes(search.toLowerCase()) || student.id.toLowerCase().includes(search.toLowerCase())):null
 


  
 

  return (
    <div className="w-full h-[100vh] p-4 pb-20 overflow-auto">
      <h2 className="font-[700] text-[22px] align-center w-full pb-3">Students</h2>
      <form onSubmit={onSubmit} className='w-[80vw] m-3 max-w-[400px]'>
        <div className="flex flex-col md:flex-row gap-2 m-2 max-w-[250px]">
          <div className="flex flex-col gap-2">
            <label htmlFor="search"></label>
            <input type="text" name="search" id="email" value={search} onChange={(e) => setSearch(e.target.value)} className='border h-[40px] px-2' />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="filter"></label>
            <button type="submit" className="border text-[#fff] bg-[#346837] px-3 py-1 rounded-[5px]" >Filter</button>
          </div>
        </div>
      </form>

      {filteredStudents?.length ?
        (
          <div className="w-full overflow-x-auto">
            <table className="shadow-lg bg-white border-separate max-w-[100vw] overflow-auto ">
              <thead>
                <tr >
                  <th className="bg-[#34783644]  border text-left px-4 py-2">id</th>
                  <th className="bg-[#34783644] border text-left px-4 py-2">Name</th>
                  <th className="bg-[#34783644] border text-left px-4 py-2">Phone</th>
                  <th className="bg-[#34783644] border text-left px-4 py-2">Email</th>
                  <th className="bg-[#34783644] border text-left px-4 py-2">Department</th>
                  <th className="bg-[#34783644] border text-left px-4 py-2">Faculty</th>
                  <th className="bg-[#34783644] border text-left px-4 py-2">Level</th>
                  

                  <th className="bg-[#34783644] border text-left px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>

                {filteredStudents.map((student: students) => (
                  <tr key={student.id}>
                    <td className="border px-4 py-2">{student.id}</td>
                    <td className="border px-4 py-2">{student.firstName} {student.lastName}</td>
                    <td className="border px-4 py-2">{student.phone}</td>
                    <td className="border px-4 py-2">{student.email}</td>
                    <td className="border px-4 py-2">{student.department_name}</td>
                    <td className="border px-4 py-2">{student.faculty_name}</td>
                    <td className="border px-4 py-2">{student.level}</td>

                    <td className="border px-4 py-2">
                      <Link to={`/dashboard-admin/${routes.update_student}/${student.id}`} className="border text-[#fff] bg-[#346837] px-3 py-1 rounded-[5px]">Edit</Link>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        ) : <p className="text-center text-[18px]">No Students Found</p>}
    </div>
  )
}


export interface students extends User {
  department: string,
  level: string,
  faculty: string,
  department_name: string,
  faculty_name: string
}