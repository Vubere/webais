import { useContext, useEffect, useMemo, useState } from "react"
import { SessionContext } from "../../../layouts/DashboardLayout"
import { base } from "../../../App"
import { Link } from "react-router-dom"

import * as routes from '../../../constants/routes'


export default function DepartmentUnitLoad() {

  const [unitLoads, setUnitLoads] = useState<unitLoads[]>([])
  const [loading, setLoading] = useState(true)


  const [err, setErr] = useState()
  const [search, setSearch] = useState({
    search: '',
  })
  const session = useContext(SessionContext)
  const [sess, setSession] = useState<string>(session?.session?.session || '')



  useEffect(() => {
    if (session?.session) {
      setSession(session?.session?.session || '')
    }
  }, [session?.session])
  useEffect(() => {
    if (sess) {
      fetch(base + '/assign_unit_load?session=' + sess)
        .then(res => res.json())
        .then(data => {
          if (data?.ok == 1) {
            setUnitLoads(data?.data)
          } else {
            throw new Error(data?.message || 'something went wrong')
          }
          setLoading(false)
        })
        .catch((err: any) => {
          alert(err?.message || 'something went wrong')
          setErr(err?.message)
          setLoading(false)
        })
    }
  }, [sess])

  const filteredUnitLoads = useMemo(() => unitLoads?.filter((unitLoad) => {
    return unitLoad.department_name.toLowerCase().includes(search.search.toLowerCase()) || unitLoad.level.toLowerCase().includes(search.search.toLowerCase()) || unitLoad.semester.toString().toLowerCase().includes(search.search.toLowerCase()) || unitLoad.min_units.toString().toLowerCase().includes(search.search.toLowerCase()) || unitLoad.max_units.toString().toLowerCase().includes(search.search.toLowerCase())
  }), [unitLoads, search])

  const year = new Date().getFullYear()
  return (
    <div className="p-2">
      <div className="flex justify-end w-full">
        <Link to={routes.assign_units} className="border border-[#346837] p-2 py-1 rounded hover:text-[white] hover:bg-[#346837]">Assign Unit Load to Department</Link>
      </div>
      <h3 className="w-full text-center font-[700] text-[22px] text-[#346837]">Departments Unit Load</h3>
      <div className="w-full flex justify-center items-center m-1 gap-2">
        <input type="text" placeholder="Search" className="border border-[#346837] p-2 rounded w-[40%] focus:outline-none" onChange={(e) => setSearch({ ...search, search: e.target.value })} />
        <select className="border border-[#346837] p-2 rounded w-[40%] h-[40px] focus:outline-none bg-transparent" onChange={(e) => setSession(e.target.value)}>
          <option value="">Select Session</option>
          {Array.from({ length: 5 }, (_, i) => year - i).map((year, index) => (
            <option key={index} value={year + 1 + '/' + (year + 2)}>{year + 1 + '/' + (year + 2)}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="w-full flex justify-center items-center">
          <h3 className="text-[#346837] font-[700] text-[22px]">Loading...</h3>
        </div>
      ) : (
        <div className="w-full flex justify-center items-center">
          {err ? (
            <h3 className="text-[#346837] font-[700] text-[22px]">{err}</h3>
          ) : (

            <div className="w-full overflow-x-auto">
              {unitLoads?.length > 0 ? (
                <table className="shadow-lg bg-white border-separate max-w-[100vw] overflow-auto ">
                  <thead>
                    <tr>
                      <th className="bg-[#34783644]  border text-left px-4 py-2">
                        Department
                      </th>
                      <th className="bg-[#34783644]  border text-left px-4 py-2">
                        Level
                      </th>
                      <th className="bg-[#34783644]  border text-left px-4 py-2">
                        Semester
                      </th>
                      <th className="bg-[#34783644]  border text-left px-4 py-2">
                        Minimum Units
                      </th>
                      <th className="bg-[#34783644]  border text-left px-4 py-2">
                        Maximum Units
                      </th>
                      <th className="bg-[#34783644]  border text-left px-4 py-2">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {unitLoads?.map((unitLoad, index) => (
                      <tr key={unitLoad.id}>
                        <td className="border px-4 py-2">{unitLoad.department_name}</td>
                        <td className="border px-4 py-2">{unitLoad.level}</td>
                        <td className="border px-4 py-2">{unitLoad.semester}</td>
                      
                        <td className="border px-4 py-2">{unitLoad.min_units}</td>
                        <td className="border px-4 py-2">{unitLoad.max_units}</td>
                        <td className="border px-4 py-2">
                          <Link to={routes.edit_unit_load + '/' + unitLoad.id} className="border border-[#346837] p-2 py-1 rounded hover:text-[white] hover:bg-[#346837]">Edit</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="w-full flex justify-center items-center">
                  <h3 className="text-[#346837] font-[700] text-[22px]">No Department Unit Load assigned for session {sess}</h3>
                </div>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  )
}

export type unitLoads = {
  id: string,
  faculty_id: string,
  department_id: string,
  department_name: string,
  level: string,
  semester: number,
  min_units: number,
  max_units: number
}