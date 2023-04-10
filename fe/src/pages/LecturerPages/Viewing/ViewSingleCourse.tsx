import { useContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { UserContext } from "../../../App"
import useFacultiesAndDepartments from "../../../hooks/useFacultiesAndDepartments"
import { SessionContext } from "../../../layouts/DashboardLayout"

export type course_students = {
  course_id: string,
  department: string | number,
  faculty: string | number,
  id: string | number,
  name: string,
  semester: string | number,
  session: string
}

export default function ViewSingleCourse() {
  const [course, setCourse] = useState<any>()
  const { id } = useParams()
  let { user } = useContext(UserContext)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [grading, setGrading] = useState<boolean>();
  const { faculties, departments } = useFacultiesAndDepartments()
  const [students, setStudents] = useState<course_students[]>([])

  const session = useContext(SessionContext)

  useEffect(() => {
    if (session && id) {
      const sess = session.session.session
      fetch('http://localhost/webais/api/grading?id=' + id + '&session=' + sess)
        .then((res) => res.json())
        .then(res => setGrading(!!res?.data?.grading_open))
    }
  }, [id, session])


  useEffect(() => {

    if (user) {
      setLoading(true)
      fetch('http://localhost/webais/api/courses?id=' + id)
        .then(res => res.json())
        .then(res => {
          console.log(res)
          if (res?.status == 200) {
            if (res.data.length == 0)
              throw new Error('course not found')
            let data = res.data[0] as course
            let assigned_departments = data.lecturers.filter(i => i.id == user.id)[0]?.assigned_departments

            setCourse({ ...data, assigned_departments })
          }
          setLoading(false)
        })
        .catch(err => {
          console.log(err)
          setError(err?.message || 'something went wrong')
          alert(err?.message || 'something went wrong')
          setLoading(false)
        })
    }
  }, [id, user])
  useEffect(() => {
    if (session && course) {
      fetch('http://localhost/webais/api/course_students?course_id=' + course.id + '&session=' + session.session.session)
        .then(res => res.json())
        .then(res => {
          if (res?.ok) {
            let data = res.data
            setStudents(data)
          } else {
            throw new Error(res?.message || 'something went wrong')
          }
        })
        .catch(err => {
          alert(err?.message || 'something went wrong')
        })
    }
  }, [session, course])

  return (
    <section className='p-4 h-[90vh] overflow-auto pb-20'>
      {!loading ?
        error != '' ? <p>{error} here</p> : course != undefined ? (
          <div className="w-full flex items-center flex-col gap-4">
            <h3 className="font-[700] text-[#347836] text-[22px] text-center capitalize">{course.title}({course.code.toUpperCase()})</h3>
            <p>{course.description}</p>
            <ul>
              <li><span className="font-[600]">Semester:{' '}</span>{course.semester}</li>
              <li><span className="font-[600]">Units:{' '}</span>{course.unit}</li>
              <li><span className="font-[600]">Level:{' '}</span>{course.level}</li>
              <li><span className="font-[600]">Grading:{' '}</span>{grading ? 'open' : 'closed'}</li>
            </ul>
            <div className="flex flex-col items-center">
              <h4 className="font-[700] text-[#347836] text-[22px]">Faculties</h4>
              <ul className="flex flex-col items-center">
                {course.faculties.map((falc: string) => (
                  <li key={falc}>
                    {!!faculties && faculties?.find(i => i.id == falc)?.name}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-center">
              <h4 className="font-[700] text-[#347836] text-[22px]">Departments</h4>
              <ul className="flex flex-col items-center">
                {course.departments.map((dept: string) => (
                  <li key={dept}>
                    {!!departments && departments?.find(i => i.id == dept)?.name}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-center">
              <h4 className="font-[700] text-[#347836] text-[22px]">Assigned Departments</h4>
              {!!course?.assigned_departments && course.assigned_departments.map((asDept: string) => (
                <AssignedDepartment name={asDept} faculties={faculties} departments={departments} students={students} />
              ))}
            </div>
            <div className="flex flex-col items-center">
              <Link to={'/dashboard-lecturer/result_sheet/' + id} className="border text-[#fff] bg-[#346837] px-3 py-1 rounded-[5px]">Result Sheet</Link>
            </div>

          </div>) : <p>{error || 'course not found'}</p> : <p>Loading...</p>
      }
    </section>
  )
}

const AssignedDepartment = ({ name, students, departments, faculties }: { name: string, students: course_students[], faculties: any, departments: any }) => {
  const [show, setShow] = useState(false)
  const [student, setStudent] = useState<course_students[]>()

  useEffect(() => {
    if (students.length > 0) {
      let student = students.filter(i => {
        const dp_name = departments.find((d: any) => d.id == i.department)?.name
        const fc_name = faculties.find((f: any) => f.id == i.faculty)?.name
        return dp_name == name || fc_name == name
      })
      setStudent(student)
    }
  }, [students])
  return (
    <li className="flex flex-col items-center m-1">
      <div className="flex gap-4">
        <p>{name}</p>
        <button onClick={() => setShow(!show)} className='border  px-2 text-white bg-[#346837] rounded-full'>{show ? 'hide students' : 'show students'}</button>
      </div>
      {show && student?.map((s: course_students) => (
        <p key={s.id} className='flex gap-1 my-[4px]'>{s.name}
          <Link to={'/dashboard-lecturer/chat/' + s.id} className='border border-[#346837]  px-2 text-[#346837] bg-whiter rounded-full'>message</Link>
        </p>
      ))}
    </li>
  )
}


type course = {
  code: string,
  departments: string[],
  description: string,
  faculties: string[],
  id: number,
  lecturers: {
    id: string,
    assigned_departments: string[]
  }[],
  level: number,
  semester: number,
  title: string,
  unit: number,

}