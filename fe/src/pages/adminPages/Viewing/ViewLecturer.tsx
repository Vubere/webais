import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { User } from "./ViewAdmin"

import * as routes from '../../../constants/routes'
import { base } from "../../../App"

export default function ViewLecturers() {
  const [search, setSearch] = useState('')
  const [lecturers, setLecturers] = useState<any>([])

  async function fetchLecturers() {
    try {
      let url = base+'/lecturers'
     
      
      const res = await fetch(url);
      const data = await res.json()
      
      if(data.status=='success')
      setLecturers(data.lecturer)
      else 
      throw new Error('something went wrong')

    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    fetchLecturers();
  }, [])

  const fullName = (lecturer: lecturer) => {
    if (lecturer.firstName && lecturer.lastName) {
      return lecturer.firstName + ' ' + lecturer.lastName
    } else if (lecturer.firstName) {
      return lecturer.firstName
    } else if (lecturer.lastName) {
      return lecturer.lastName
    } else {
      return 'No name'
    }
  }

  const filteredLecturers = lecturers.filter((lecturer: lecturer) => fullName(lecturer).toLowerCase().includes(search.toLowerCase())||lecturer.email.toLowerCase().includes(search.toLowerCase())||lecturer.discipline.toLowerCase().includes(search.toLowerCase())||lecturer.degreeAcquired.toLowerCase().includes(search.toLowerCase())||lecturer.id.toLowerCase().includes(search.toLowerCase()))
  
  return (
    <div className="w-full p-4 overflow-auto h-[90vh] pb-10">
      <h2 className="font-[700] text-[22px] align-center w-full pb-3">Lecturers</h2>
     
        <div className="flex flex-col md:flex-row gap-2 max-w-[250px]">
         
          <div className="flex flex-col gap-2">
            <label htmlFor="search"></label>
            <input type="text" name="search" id="degree" value={search} onChange={(e) => setSearch(e.target.value)} className='border h-[40px] px-2' />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="submit"></label>
            <button type="submit" className="border text-[#fff] bg-[#346837] px-3 py-1 rounded-[5px]" >Search</button>
          </div>
        </div>
      

      {filteredLecturers?.length ?
        (
          <div className="w-full overflow-auto">
            <table className="shadow-lg bg-white border-separate max-w-[100vw] overflow-auto ">
              <thead>
                <tr >
                  <th className="bg-[#34783644]  border text-left px-4 py-2">id</th>
                  <th className="bg-[#34783644] border text-left px-4 py-2">Name</th>
                  <th className="bg-[#34783644] border text-left px-4 py-2">Phone</th>
                  <th className="bg-[#34783644] border text-left px-4 py-2">Email</th>
                  <th className="bg-[#34783644] border text-left px-4 py-2">Discipline</th>
                  <th className="bg-[#34783644] border text-left px-4 py-2">Degree</th>

                  <th className="bg-[#34783644] border text-left px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>

                {filteredLecturers.map((lect: lecturer) => (
                  <tr key={lect.id}>
                    <td className="border px-4 py-2">{lect.id}</td>
                    <td className="border px-4 py-2">{lect.firstName} {lect.lastName}</td>
                    <td className="border px-4 py-2">{lect.phone}</td>
                    <td className="border px-4 py-2">{lect.email}</td>
                    <td className="border px-4 py-2">{lect.discipline}</td>
                    <td className="border px-4 py-2">{lect.degreeAcquired}</td>
                    <td className="border px-4 py-2">
                      <Link to={`/dashboard-admin/${routes.update_lecturer}/${lect.id}`} className="border text-[#fff] bg-[#346837] px-3 py-1 rounded-[5px]">Edit</Link>
                    </td>
                  </tr>

                ))}
              </tbody>

            </table>
          </div>
        ) : <p className="text-center text-[18px]">No Lecturers Found</p>}
    </div>
  )
}


interface lecturer extends User {
  discipline: string,
  degreeAcquired: string,
}