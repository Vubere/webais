import React, { useEffect, useState } from 'react'

import { useNavigate, useParams } from 'react-router-dom'
import { course } from '../Creating/CreateCourse'
import * as routes from '../../../constants/routes'
import { MultiSelect, Option } from 'react-multi-select-component'
import { departments, faculties } from '../../../helpers/schoolStructure'
import useFacultiesAndDepartments from '../../../hooks/useFacultiesAndDepartments'
import { base } from '../../../App'


export default function UpdateCourse() {
  const navigate = useNavigate()
  const [course, setCourse] = useState({
    title: '',
    description: '',
  })
  const [errors, setErrors] = useState({
    title: '',
    description: '',
  })
  const { id } = useParams()
  console.log(errors)
  useEffect(() => {
    if (id) {
      const url = base + '/courses?id=' + id
      fetch(url)
        .then(res => res.json())
        .then(data => {

          if (data.ok) {
            if(data.data.length === 0){
              throw new Error('course not found')
            }
            setCourse(data?.data[0])
          } else {
            throw new Error(data?.message)
          }
        })
        .catch(err => {
          alert(err?.message || 'something went wrong')
          navigate(-1)
        })
    }
  }, [id])

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

  const update = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (validate()) {
      try {

        const url = base + '/courses'
        const res = await fetch(url, {
          method: 'PUT',
          body: JSON.stringify({ ...course, id: id })
        })
        const data = await res.json()
        console.log(data)
        if (data.ok) {
          alert('Course updated successfully')
        } else {
          throw new Error(data?.message)
        }
      } catch (err: any) {
        alert(err?.message || 'something went wrong')
      }
    }
  }
  const delete_course = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const url = base + '/courses'
      const res = await fetch(url, {
        method: 'DELETE',
        body: JSON.stringify({ id: id })
      })
      const data = await res.json()
      console.log(data)
      if (data.ok) {
        alert('Course deleted successfully')
        navigate(-1)
      } else {
        throw new Error(data?.message || 'failed to delete course')
      }
    }
    catch (err: any) {
      alert(err?.message || 'something went wrong')
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
      <h2 className="text-center text-[22px] text-[#346837]">Update Course</h2>
      <form onSubmit={update} className="flex flex-col items-center gap-2 max-w-[400px] mx-auto">
        <div className="w-full">
          <label htmlFor="title">Title *</label>
          {errors.title && <span className="text-red-500 text-[12px]">{errors.title}</span>}
          <input type="text" name="title" id="title" value={course?.title} onChange={onChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] xs:p-2 stbt:p-4 xs:text-[14px] stbt:text-[18px] flex items-center focus:outline-none px-2" />
        </div>

        <div className="w-full">
          <label htmlFor="description">Description *</label>
          {errors.description && <span className="text-red-500 text-[12px]">{errors.description}</span>}
          <input type="text" name="description" id="description" value={course?.description} onChange={onChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] xs:p-2 stbt:p-4 xs:text-[14px] stbt:text-[18px] flex items-center focus:outline-none px-2" />
        </div>
        <button type="submit" className="bg-[#346837] text-white p-2 m-2 rounded-md w-[80vw] stbt:w-[200px] max-w-[400px]">Update Course</button>
      </form>
      <div className='max-w-[400px] mx-auto mt-5 flex flex-col items-center'>
        <h6 className='font-[600] text-[18px] text-[#346837] text-center'>Dangerous Operation</h6>
        <button onClick={delete_course} className="bg-[#700] text-white p-2 m-2 rounded-md w-[50vw]  max-w-[120px]">Delete Course</button>
      </div>
    </section>
  )

}
