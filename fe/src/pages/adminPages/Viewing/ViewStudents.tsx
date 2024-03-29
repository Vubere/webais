import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { User } from "./ViewAdmin"

import * as routes from '../../../constants/routes'
import { base } from "../../../App"

export default function ViewStudents() {
  const [search, setSearch] = useState('')
  const [students, setStudents] = useState<any>([])
  const [filter, setFilter] = useState<string>('undergraduate')



  async function fetchStudents() {
    try {
      let url = base + '/students'

      const res = await fetch(url);
      const data = await res.json()
      if (data.message == 'successful')
        setStudents(data.students)
      else
        throw new Error('unable to fetch students')
    } catch (err:any) {
      alert(err?.message||'something went wrong')
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
  const filteredStudents = students ? students?.filter((student: students) => filter.toLowerCase()==student.status&& (fullname(student).toLowerCase().includes(search.toLowerCase()) || student.email.toLowerCase().includes(search.toLowerCase()) || student.faculty.toLowerCase().includes(search.toLowerCase()) || student.id.toLowerCase().includes(search.toLowerCase()))) : null


  return (
    <div className="w-full h-[100vh] p-4 pb-20 overflow-auto">
      <h2 className="font-[700] text-[22px] align-center w-full pb-3">Students</h2>
      <p>Showing available status</p>
      <form onSubmit={onSubmit} className='w-[80vw] m-3 max-w-[400px]'>
        <div className="flex flex-col md:flex-row gap-2 m-2 max-w-[250px]">
          <div className="flex flex-col gap-2">
            <label htmlFor="search">Search by student details</label>
            <input type="text" name="search" id="email" value={search} onChange={(e) => setSearch(e.target.value)} className='border h-[40px] px-2' />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="filter">Filter by status</label>
            <select className='border h-[40px] px-2' value={filter} onChange={({target})=>setFilter(target.value)}>
                <option value='undergraduate'>Undergraduates</option>
                <option value='graduate'>Graduates</option>
                <option value='spill over'>Spill Over</option>
                <option value='expelled'>Expelled</option>
                <option value='suspended'>Suspended</option>
            </select>
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
                  <th className="bg-[#34783644] border text-left px-4 py-2">Status</th>


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
                    <td className="border px-4 py-2">{student.status}</td>

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
  otherNames: string,
  level: string,
  faculty: string,
  studentId:string,
  department_name: string,
  entrance_session: string,
  graduation_session: string,
  dob: string,
  faculty_name: string,
  status: 'undergraduate'|'graduate'|'suspended'|'expelled'|'spill over',
}