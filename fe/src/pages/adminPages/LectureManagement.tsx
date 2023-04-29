import { useEffect, useLayoutEffect, useState } from "react"
import { Link } from "react-router-dom"
import Icon from "../../components/Icon"

import searchImg from '../../assets/search.png'
import * as routes from "../../constants/routes"
import { base } from "../../App"

interface lecture_list extends Lecture {
  code: string,
  lecturer_name: string,
  title: string,
  discipline: string
}


export default function LectureManagement() {
  const [lectures, setLectures] = useState<lecture_list[]>([])
  const [errors, setErrors] = useState('')
  const [search, setSearch] = useState('')

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  const searchedLectures = lectures.filter(lect => lect.title.toLowerCase().includes(search.toLowerCase()) || lect.code.toLowerCase().includes(search.toLowerCase())).sort((a, b) => days.indexOf(b.day) - days.indexOf(a.day))




  useLayoutEffect(() => {
    fetch(base + "/lectures")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setLectures(data.lectures)
        } else {
          setErrors('something went wrong')

        }
      })
      .catch((err) => {
        setErrors('something went wrong')
      })
  }, [])




  return (
    <div className="p-3 h-[90vh] overflow-y-auto pb-20">
      <div className="w-full flex justify-end">
        <Link to={routes.create_lectures} className='bg-[#347836] text-[#fff] p-1 rounded px-2'>Create Lecture</Link>
      </div>
      <h3 className="font-[600] text-[#347836] text-[28px] text-center leading-[40px]">Lecture Management</h3>
      <section>
        <label htmlFor="search" className='relative max-w-[230px] m-3 block'>
          <input type="text" id='search' placeholder="Search" onChange={e => setSearch(e.target.value)} className='max-w-[240px] px-1 py-2 pr-10 rounded bg-transparent border border-[#347836]  xs:text-[14px] stbt:text-[18px] flex items-center focus:outline-none px-2' />
          <button className='absolute right-2 top-3 cursor-pointer '>
            <Icon src={searchImg} className='w-[20px] h-[20px] block ' />
          </button>
        </label>
        {errors == '' ?
          <div className="w-full overflow-y-auto">
            {lectures.length == 0 && <p className="text-center">No lectures found</p>}
            {lectures.length > 0 &&
              <table className="shadow-lg bg-white border-separate max-w-[100vw] overflow-auto ">
                <thead>
                  <tr >
                    <th className="bg-[#34783644]  border text-left px-4 py-2">Time</th>
                    <th className="bg-[#34783644] border text-left px-4 py-2">Day</th>
                    <th className="bg-[#34783644] border text-left px-4 py-2">Duration</th>
                    <th className="bg-[#34783644] border text-left px-4 py-2">Course </th>
                    <th className="bg-[#34783644] border text-left px-4 py-2">Lecturer</th>
                    <th className="bg-[#34783644] border text-left px-4 py-2">Venue</th>
                    <th className="bg-[#34783644] border text-left px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {searchedLectures.map((lecture) => (
                    <tr key={lecture.id}>
                      <td className="border px-4 py-2">{lecture.time}</td>
                      <td className="border px-4 py-2">{lecture.day}</td>
                      <td className="border px-4 py-2">{lecture.duration}</td>
                      <td className="border px-4 py-2">{lecture.title}({lecture.code?.toUpperCase()})</td>
                      <td className="border px-4 py-2">{lecture.lecturer_name}({lecture.discipline})</td>
                      <td className="border px-4 py-2">{lecture.venue}</td>
                      <td className="border px-4 py-2">
                        <Link to={
                          `/dashboard-admin/update-lecture/${lecture.id}`
                        } className="bg-[#347836] text-white px-4 py-2 rounded-md">Edit</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            }
          </div> : <p className="w-full ">{errors}</p>}
      </section>
    </div>
  )
}
export interface Lecture {
  id: number
  time: string
  day: string
  duration: string
  code: string
  lecturer_id: string
  venue: string
  title: string
}