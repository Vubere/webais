import { useLayoutEffect, useState } from "react"
import { departments, faculties } from "../../../helpers/schoolStructure"

import { base } from "../../../App";
import { useNavigate } from "react-router-dom";

export default function CreateCourse() {
  const navigate = useNavigate()
  const [course, setCourse] = useState({
    title: '',
    description: '',
  })
  const [errors, setErrors] = useState({
    title: '',
    description: '',
  })
  const validate = () => {
    let temp = { ...errors }
    let isValid = true
    if (course.title === '') {
      isValid = false
      temp.title = 'This field is required'
    }
    if (course.description === '') {
      isValid = false
      temp.description = 'This field is required'
    }
    if (!isValid) {
      setErrors(temp)
      setTimeout(() => {
        setErrors({
          title: '',
          description: '',
        })
      }, 3000)
    }
    return isValid
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (validate()) {
      try {
        const form = new FormData()
        form.append('title', course.title)
        form.append('description', course.description)
        const url = base + '/courses'
        const res = await fetch(url, {
          method: 'POST',
          body: form
        })
        const data = await res.json()
        console.log(data)
        if (data.ok) {
          setCourse({
            title: '',
            description: '',
          })
          alert('Course created successfully')
          navigate('/dashboard-admin/assign_course/'+data?.id)
        }else{
          throw new Error(data?.message)
        }
      } catch (err:any) {
        alert(err?.message || 'something went wrong')
      }
    }
  }
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCourse({
      ...course,
      [e.target.name]: e.target.value
    })
  }


  return (
    <section className="w-full h-[90vh] content-box overflow-auto pb-[30px] p-3">
      <h2 className="text-center text-[22px] text-[#346837]">Create Course</h2>
      <form onSubmit={onSubmit} className="flex flex-col items-center gap-2 max-w-[400px] mx-auto">
        <div className="w-full">
          <label htmlFor="title">Title *</label>
          {errors.title && <span className="text-red-500 text-[12px]">{errors.title}</span>}
          <input type="text" name="title" id="title" value={course.title} onChange={onChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] xs:p-2 stbt:p-4 xs:text-[14px] stbt:text-[18px] flex items-center focus:outline-none px-2" />
        </div>

        <div className="w-full">
          <label htmlFor="description">Description *</label>
          {errors.description && <span className="text-red-500 text-[12px]">{errors.description}</span>}
          <input type="text" name="description" id="description" value={course.description} onChange={onChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] xs:p-2 stbt:p-4 xs:text-[14px] stbt:text-[18px] flex items-center focus:outline-none px-2" />
        </div>
        <button type="submit" className="bg-[#346837] text-white p-2 m-2 rounded-md w-[80vw] stbt:w-[200px] max-w-[400px]">Create Course</button>
      </form>
    </section>
  )
}

interface course {
  title: string;
  description: string;
  id: number;
}
export type { course };