import { useContext, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { base, UserContext } from "../../../App"
import { SessionContext } from "../../../layouts/DashboardLayout"



export default function ResultSheet() {
  const [grades, setGrades] = useState<Result[]>()
  const session = useContext(SessionContext)
  const { user } = useContext(UserContext)
  const [loading, setLoading] = useState<boolean>(false);
  const [grading, setGrading] = useState<boolean>();


  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    if (session?.session?.session && id) {
      const sess = session.session.session
      fetch(base + '/grading?id=' + id + '&session=' + sess)
        .then((res) => res.json())
        .then(res => setGrading(!!res?.data?.grading_open))
    }
  }, [id, session?.session?.session])

  useEffect(() => {
    if (session?.session?.session && id) {
      const sess = session.session.session

      fetch(base + '/grades?session=' + sess + '&course_id=' + id)
        .then(res => res.json())
        .then(res => {
          console.log(res)
          if (res.fetch == 'success') {
            setGrades(res.result.info)
          }
        })
        .catch(err => console.log(err))
    }
  }, [session, id])






  return (
    <section className="h-[90vh] overflow-auto">
      <h3 className="font-[600] text-[#347836] text-[28px] text-center leading-[40px] p-3">Grade Students</h3>
      <p className="font-[400]  text-[18px] text-center leading-[40px] p-3">Grading is {grading ? 'open' : 'closed'}</p>
      <table className="table-auto w-full overflow-auto">
        <thead>
          <tr>
            <th className="bg-[#34783644]  border text-left px-4 py-2"> Name</th>
            <th className="bg-[#34783644]  border text-left px-4 py-2">Attendance</th>
            <th className="bg-[#34783644]  border text-left px-4 py-2">Continious Assessment</th>
            <th className="bg-[#34783644]  border text-left px-4 py-2">Examination</th>
            <th className="bg-[#34783644]  border text-left px-4 py-2">Grade</th>
            <th className="bg-[#34783644]  border text-left px-4 py-2">Update</th>
          </tr>
        </thead>
        <tbody>
          {grades && grades.map((row) => (
            <Result_row key={row.id} row={row} session={session?.session?.session} course_id={id} grading={grading} />
          ))}
        </tbody>
      </table>
    </section>
  )
}


const Result_row = ({ row, session, course_id, grading }: { row: Result, session: string | undefined, course_id: number | string | undefined, grading: boolean | undefined }) => {

  const [form, setForm] = useState({
    ca: row.ca,
    attendance: row.attendance,
    exam: row.exam,
    grade: row.grade,
    remark: row.remark
  })
  const [error, setError] = useState('')

  const allowedGrade: R = {
    0: 'F',
    1: 'F',
    2: 'F',
    3: 'F',
    4: 'D',
    5: 'C',
    6: 'B',
    7: 'A',
    8: 'A',
    9: 'A'
  }
  type R = {
    [key: number]: string;
  }
  const calculate_grade = () => {
    const calc = Number(form.exam) + Number(form.ca) + Number(form.attendance)
    const num = Math.floor(calc / 10)
    return allowedGrade[num]
  }

  const onChange = (e: any) => {
    let value = e.target.value

    setForm({
      ...form,
      [e.target.name]: value,
    })
  }

  useEffect(() => {
    if (form.attendance == 0 && form.ca == 0 && form.exam == 0) {
      setForm({
        ...form,
        grade: '-'
      })
      return
    }
    setForm({
      ...form,
      grade: calculate_grade()
    })
  }, [form.ca, form.exam, form.attendance])

  const update_form = async (e: any) => {
    e.preventDefault();
    if (session && course_id) {
      try {
        const f = new FormData()
        f.append('attendance', form.attendance.toString())
        f.append('ca', form.ca.toString())
        f.append('exam', form.exam.toString())
        f.append('grade', form.grade)
        f.append('session', session)
        f.append('course_id', course_id.toString())
        f.append('student_id', row.student_id)
        f.append('method', 'POST')

        const res = await fetch(base + '/grades', {
          method: 'POST',
          body: f
        })
        const result = await res.json();
        console.log(result)
        if (result?.status == 200) {
          alert('result updated successfully')
        }
      } catch (err: any) {
        alert(err?.message)
      }
    }
  }


  return (
    <tr>
      <td className="border px-4 py-2">{row.firstName} {row.otherNames || ''} {row.lastName}</td>
      <td className="border px-4 py-2">
        <input type="number" name="attendance" id="attendance" value={form.attendance} className='w-full h-full bg-transparent text-center border ' placeholder="attendance" onChange={onChange} readOnly={!grading} />
      </td>
      <td className="border px-4 py-2">
        <input type="number" name="ca" id="ca" value={form.ca} className='w-full h-full bg-transparent text-center border' placeholder="C/A" onChange={onChange} readOnly={!grading} />
      </td>
      <td className="border px-4 py-2">
        <input type="number" name="exam" id="exam" value={form.exam} className='w-full mx-auto block h-full bg-transparent text-center border ' placeholder="exam score" onChange={onChange} readOnly={!grading} />
      </td>
      <td className="border px-4 py-2">
        <input type="text" name="grade" id="grade" value={form.grade} className='w-full h-full bg-transparent text-center border p-3' placeholder="enter grade" readOnly />
      </td>
      <td className="border px-4 py-2">
        <button className="bg-[#347836] text-white px-4 py-2 rounded-md" onClick={update_form}>
          Submit
        </button>
      </td>
    </tr>
  )
}

type Result = {
  attendance: number,
  ca: number,
  exam: number,
  id: number,
  remark: string,
  session: string,
  grade: string,
  firstName: string,
  otherNames: string,
  lastName: string,
  student_id: string
}