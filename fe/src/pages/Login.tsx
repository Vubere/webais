import { useContext, useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Icon from "../components/Icon"

/* constant */
import * as routes from '../constants/routes'
/* images */
import arrow_back from '../assets/arrow_back.png'

/* user context */
import { base, UserContext } from "../App"



export default function Login({ title, src }: { title: string, src: string }) {
  const [form, setForm] = useState({
    id: '',
    password: ''
  })

  const [error, setError] = useState({
    id: '',
    password: ''
  })
  const [postError, setPostError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setUser } = useContext(UserContext)
  const pwd_ref = useRef<HTMLInputElement>(null)


  const navigate = useNavigate()


  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (validate()) {
      setLoading(true)
      const f = new FormData()
      f.append('id',form.id.toUpperCase())
      f.append('password', form.password)
      f.append('type', title.toLowerCase())
      f.append('method','POST')
   
      try {
        const res = await fetch(base+'/authenticate', {
          method: 'POST',
          body: f,

        })
        const data = await res.json()

        if (data?.authenticated) {
          sessionStorage.setItem('user', JSON.stringify(data.user))
          setUser(data.user)
          setLoading(false)
          if (title.toLowerCase() == 'student') {
            navigate(routes.dashboard + '-' + routes.student)
          } else if (title.toLowerCase() == 'lecturer') {
            navigate(routes.dashboard + '-' + routes.lecturer)
          } else {
            navigate(routes.dashboard + '-' + routes.admin)
          }
        } else {
          console.log(data)
          throw new Error(data?.message||'something went wrong')
        }
      } catch (err: any) {
        setPostError(err?.message);
        setLoading(false)
        setTimeout(() => {
          setPostError('')
        }, 3000)
      }

    }
  }
  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const validate = () => {
    let isValid = true
    let tempError = error


    if (form.password.length < 6) {
      tempError = {
        ...tempError,
        password: 'Password must be at least 6 characters'
      }

      isValid = false
    }
    if (form.id === '') {
      tempError = {
        ...tempError,
        id: 'id is required'
      }
      isValid = false
    }
    if (form.password === '') {
      tempError = {
        ...tempError,
        password: 'Password is required'
      }
      isValid = false
    }
    if (!isValid) {
      setError(tempError)
      setTimeout(() => {
        setError({
          id: '',
          password: ''
        })
      }, 3000)
    }
    return isValid
  }

  const password_visibility = () => {
    if(pwd_ref.current==null||pwd_ref.current==undefined) return
    if (pwd_ref.current?.type === 'password') {
      pwd_ref.current.type = 'text'
    } else {
      pwd_ref.current.type = 'password'
    }
  }



  return (
    <div className="w-[100vw] p-2 flex flex-col justify-center">
      <Link to="/">
        <Icon src={arrow_back} className="xs:w-[44px] xs:h-[20px] stbt:w-[50px] md:h-[50px] m-4" />
      </Link>
      <form onSubmit={handleSubmit} className="w-[90vw] max-w-[400px] m-auto my-8">
        <div className="flex flex-col items-center">
          <img src={src} alt="" className="w-20 h-20" />
          <h1 className="text-2xl font-bold text-[#346837] capitalize">{title}</h1>
        </div>
        {postError && <p className="text-red-500 text-[12px] stbt:text-[16px]">{postError}</p>}
        <div className="flex flex-col my-2 bmb:my-4">
          <label htmlFor="id" className="text-[16px] stbt:text-[18px] text-[#346837]">Id</label>
          <input type="username" name="id" id="id" onChange={handleChange} value={form.id} className={`border-2 border-gray-300 p-2 rounded-md focus:border-[#346837] ${error.id && 'border-[#f005]'}`} />
          {error.id && <p className="text-red-500 text-[12px] stbt:text-[14px]">{error.id}</p>}
        </div>
        <div className="flex flex-col">
          <label htmlFor="password" className="text-[16px] stbt:text-[18px] text-[#346837]">Password</label>
          <input type="password" name="password" id="password" onChange={handleChange} value={form.password} ref={pwd_ref}  className={`border-2 border-gray-300 p-2 rounded-md focus:border-[#346837] ${error.password && 'border-[#f005]'}`} />
          {error.password && <p className="text-red-500 text-[12px] stbt:text-[14px]">{error.password}</p>}
        </div>
        <div className="flex gap-2 m-2">
          <input type="checkbox" name="check" id="check" className="w-[10px] h-[10px] mt-2" onChange={password_visibility} />
          <label htmlFor="check">password visibility</label>
        </div>
        <button type="submit" className="bg-[#346837] text-white w-full my-4 py-2 px-4 rounded-md">{loading ? 'loading...' : "Login"}</button>
      </form>
    </div>
  )
}