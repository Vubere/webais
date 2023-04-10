import { useLayoutEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"



export default function Faculties() {
  const [faculties, setFaculties] = useState<any[]>([])

  useLayoutEffect(() => {
    fetch('http://localhost/webais/api/faculty')
      .then(res => res.json())
      .then(res => setFaculties(res.data.data))
  }, [])


  return (
    <section className="h-[90vh] overflow-auto pb-20">
      <h2 className="text-center font-[600] text-[22px] leading-[30px] text-[#346837]">Faculties</h2>
      <div className="flex justify-center">
        <Link to={`/dashboard-admin/create-faculty`}>
          <button className="bg-[#346837] text-[#F2F2F2] font-[600] text-[16px] leading-[22px] rounded-[10px] px-4 py-2 mt-4">Add Faculty</button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {faculties.map(faculty => (
          <Faculty key={faculty.id} faculty={faculty} />))}
      </div>

    </section>
  )
}
function Faculty({ faculty }: { faculty: { name: string, id: string } }) {
  const [showDept, setShowDept] = useState(false)
  const [departments, setDepartments] = useState<any>([])

  useLayoutEffect(() => {
    fetch('http://localhost/webais/api/department')
      .then(res => res.json())
      .then(res => setDepartments(res.data.data))
  }, [])
  const dept = useMemo(() => departments.filter((d: any) => d.faculty_id == faculty.id), [departments])
  console.log(dept)
  const [numberOfStudents, setNumberOfStudents] = useState(0)
  const numberOfDept = dept.length

  return (
    <div className="bg-[#F2F2F2] rounded-[10px] p-4 items-center">
      <div className="flex justify-between ">
        <h3 className="text-[#346837] font-[600] text-[18px] leading-[30px] ">{faculty.name}({numberOfDept} department{numberOfDept == 1 ? '' : 's'})</h3>
        <Link to={`/dashboard-admin/update-faculty/${faculty.id}`} className="bg-[#347836] px-2 text-[#fff] rounded flex items-center">edit</Link>
      </div>
      {
        numberOfDept > 0 &&
        <button onClick={() => setShowDept(!showDept)}>{showDept ? 'hide' : `show  department${numberOfDept == 1 ? '' : 's'}`}</button>
      }
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {showDept && dept.map((department: any) => (
          <div key={department.id} className="bg-[#E6E6E6] rounded-[10px] p-4">
            <h4 className="text-[#346837] font-[600] text-[16px] leading-[22px]">{department.name}</h4>
            <Link to={`/dashboard-admin/update-department/${department.id}`}>view</Link>
          </div>
        ))}
      </div>

    </div>
  )
}