import { useContext, useEffect, useRef, useState } from "react"
import { UserContext } from "../../App"
import useFacultiesAndDepartments from "../../hooks/useFacultiesAndDepartments"



export default function Dashboard() {
  const [user, setUser] = useState<any>()
  const { user: u } = useContext(UserContext)
  const {departments,population, faculties} = useFacultiesAndDepartments()
  const student_number = useRef<number>(0)

  useEffect(() => {
    if (u) {
      setUser(u)
      console.log(population[0])
      student_number.current = population?.reduce((acc:any,cur:any)=>acc+cur.number_of_students,0)    
    }
  }, [u])

  return (
    <section>

      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center gap-[10px]">
          <h3 className="font-[600] text-[#347836] text-[28px] text-center leading-[40px] p-3">Welcome {user?.firstName} {user?.lastName}</h3>
          {/* card to show faculties */ }
          <div className="flex flex-col text-white items-center gap-[10px] bg-[#346837] px-4 py-2 rounded text-[24px] w-[250px]">
            {faculties?.length}
            <p className="text-[14px]">Faculties</p>
          </div>
          {/* card to show departments number */ }
          <div className="flex flex-col text-white items-center gap-[10px] bg-[#346837] px-4 py-2 rounded text-[24px] w-[250px]">
            {departments?.length}
            <p className="text-[14px]">Departments</p>
          </div>
          {/* card to show students number */}
          <div className="flex flex-col  text-white items-center gap-[10px] bg-[#346837] px-4 py-2 rounded text-[24px] w-[250px]">
            {student_number.current}
            <p className="text-[14px]">Students</p>
          </div>
        </div>
      </div>
    </section>
  )
}