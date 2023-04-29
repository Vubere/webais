import { useContext, useEffect, useRef, useState } from "react"
import { UserContext, base } from "../../App"
import useFacultiesAndDepartments from "../../hooks/useFacultiesAndDepartments"



export default function Dashboard() {
  const [user, setUser] = useState<any>()
  const { user: u } = useContext(UserContext)
  const { departments, population, faculties } = useFacultiesAndDepartments()
  const [student_number, setStudentNumber] = useState<number>(0)

  useEffect(() => {
    if (u) {
      setUser(u)

      setStudentNumber(population?.reduce((acc: any, cur: any) => acc + cur.number_of_students, 0))
    }
  }, [u, departments, faculties, population])

  return (
    <section className="w-full h-[90vh] overflow-y-auto p-2">

      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center gap-[10px]">
          <h3 className="font-[600] text-[#347836] text-[28px] text-center leading-[40px] p-3">Welcome {user?.firstName} {user?.lastName}</h3>
          {/* card to show faculties */}
          <div className="flex flex-col text-white items-center gap-[10px] bg-[#346837] px-4 py-2 rounded text-[24px] w-[250px]">
            {faculties?.length}
            <p className="text-[14px]">Faculties</p>
          </div>
          {/* card to show departments number */}
          <div className="flex flex-col text-white items-center gap-[10px] bg-[#346837] px-4 py-2 rounded text-[24px] w-[250px]">
            {departments?.length}
            <p className="text-[14px]">Departments</p>
          </div>
          {/* card to show students number */}
          <div className="flex flex-col  text-white items-center gap-[10px] bg-[#346837] px-4 py-2 rounded text-[24px] w-[250px]">
            {student_number}
            <p className="text-[14px]">Students</p>
          </div>
        </div>
        <Warning />
      </div>
    </section>
  )
}



function Warning() {
  const { departments, population, faculties } = useFacultiesAndDepartments()
  const [sess, setSes] = useState<any>([])
  const [dul, setDul] = useState<any>([])


  useEffect(() => {
    fetch(base + '/session')
      .then(res => res.json())
      .then(data => {
        if (data.ok == 1) {
          setSes(data.data)
        }
      })
      .catch(err => {

      })
  }, [])

  useEffect(() => {
    if (departments?.length === 0) return
    fetch(base + '/assign_unit_load')
      .then(res => res.json())
      .then(data => {

        if (data.ok == 1) {
          const dul = data.data
          const temp = departments.filter((dep: any) => {
            const d = dul.find((d: any) => d.department_id === dep.id)
            if (!d) {
              return true
            } else {
              return false
            }
          })
          setDul(temp)
        }
      })
      .catch(err => {

      })

  }, [departments])


  /* warn if session is not created */

  /* warn if faculities and departments are not created */

  /* warn if unit load has not been assigned to any department */



  return (
    <div className="p-3 text-[#f33]">
      {
        faculties?.length === 0 && <p>No Faculty created</p>
      }
      {
        departments?.length === 0 ? <p>No Department created</p> : !!dul.length ? <>
          <h3>No unit load has been assigned to the following departments</h3>
          <div>
            {
              dul?.map((dep: any, i:number) => {
                return <p>{i+1}.{dep.name}</p>
              })
            }
          </div>
        </> : null
      }
      {
        sess?.length === 0 && <p>No Session has been initialized</p>
      }

    </div>
  )
}