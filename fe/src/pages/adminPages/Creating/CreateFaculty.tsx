import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { base } from "../../../App"


export default function CreateFaculty(){
  const [faculty, setFaculty] = useState({
    name: '',
  })
  const [errors, setErrors] = useState({
    name: '',
  })
  const navigate = useNavigate()
  const validate = () => {
    let isValid = true
    let tempERR = { ...errors }
    if (faculty.name === '') {
      tempERR.name = 'Name is required'
      isValid = false
    }
    if (!isValid) {
      setErrors(tempERR)
      setTimeout(() => {
        setErrors({
          name: '',
        })
      }, 2000)
      navigate('/dashboard-admin/update-faculty')
    }
    return isValid
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (validate()) {
      const f = new FormData()
      f.append('name', faculty.name)

      f.append('method', 'POST')

      fetch(base+'/faculty', {
        method: 'POST',
        body: f
      }).then((res)=>res.json())
      .then((data)=>{
        if(data?.status === 'success'){
          setFaculty({
            name: '',
          })
          alert('Faculty created successfully')
          navigate('/dashboard-admin/update-faculty/'+data?.id)
        }
      })
      .catch((err) => console.log(err))
      }
  }
  return(
    <section className="w-full h-[90vh] content-box overflow-auto pb-[30px]">
      <h3 className="text-center text-[22px] text-[#346837]">Create Faculty</h3>
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2 max-w-[400px] w-[80vw] gap-4 mx-auto">
          <div className="w-full">
            <label htmlFor="name" >Name</label>
          <input type="text" name="name" id="name" onChange={(e) => setFaculty({ ...faculty, name: e.target.value })} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] xs:p-2 stbt:p-4 xs:text-[14px] stbt:text-[18px] flex items-center focus:outline-none px-2" value={faculty.name}/>
            <p>{errors.name}</p>
          </div>
        <button type="submit" className="w-full h-[40px] rounded-[5px] bg-[#347836] text-white xs:text-[14px] stbt:text-[18px]">Create</button>
        </form>
    </section>
  )
}