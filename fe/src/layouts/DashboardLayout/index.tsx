import { Link, Outlet, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState, createContext } from "react";
/* images */
import school from "../../assets/school.png";
import logout from "../../assets/logout.png";
import Icon from "../../components/Icon";

/* hooks */
import useInnerWidth from "../../hooks/useInnerWidth";
import useCloseOnBlur from "../../hooks/useCloseOnBlur";
/* constants */
import * as routes from "../../constants/routes";
import { UserContext, base } from "../../App";
import { getUnixTime } from "date-fns";

export type session = { session: string; current_semester: string | number, first_semester_start: string, first_semester_end: string, second_semester_start: string, second_semester_end: string }

export const SessionContext = createContext<{ session: session|undefined, setSession: React.Dispatch<React.SetStateAction<session|undefined>> } | undefined>({session:{ session: '', current_semester: '', first_semester_start: '', first_semester_end: '', second_semester_start: '', second_semester_end: '' }, setSession: () => { } });


export default function DashboardLayout({ title, DashboardLinks }: { title: string, DashboardLinks: { icon: string, name: string, path: string }[] }) {
  const width = useInnerWidth();
  const widthBool = width > 768 ? true : false;
  const { ref, isOpen: show, setIsOpen: setShow } = useCloseOnBlur();
  const { user, setUser } = useContext(UserContext)
  const [session, setSession] = useState<session>()


  const navigate = useNavigate()

  const signout = () => {
    sessionStorage.removeItem('user')
    setUser(undefined)
    navigate('/')
  }

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user')
    if (storedUser) {
      const user = JSON.parse(storedUser)
      setUser(user?.length ? user[0] : user)
      const { id } = user
      if (id) {
        if (title == 'admin') {
          const fetchAdmin = async () => {
            const res = await fetch(base+`/admins?id=${id}`)
            const data = await res.json()
            if (data?.admin) {
              setUser(data.admin)
              sessionStorage.setItem('user', JSON.stringify(data.admin))
            } else {
              navigate(routes.admin_login)
            }
          }
          fetchAdmin()
        } else if (title == 'student') {
          const fetchStudent = async () => {
            const res = await fetch(base+`/students?id=${id}`)
            const data = await res.json()
            if (data?.students?.length) {
              setUser(data?.students[0])
              sessionStorage.setItem('user', JSON.stringify(data?.students[0]))
            } else {
              navigate(routes.student_login)
            }
          }
          fetchStudent()
        } else {
          const fetchLecturer = async () => {
            const res = await fetch(base+`/lecturers?id=${id}`)
            const data = await res.json()
            if (data?.lecturer) {
              setUser(data.lecturer[0])
              sessionStorage.setItem('user', JSON.stringify(data.lecturer[0]))
            } else {
              navigate(routes.lecturer_login)
            }
          }
          fetchLecturer()
        }
      }


      return
    }
    if (user?.firstName) {

    } else {
      if (title == 'admin') {
        navigate(routes.admin_login)
      } else if (title == 'student') {
        navigate(routes.student_login)
      } else {
        navigate(routes.lecturer_login)
      }
    }
  }, [])
  useEffect(() => {

    fetch(base+'/session?current=' + 'true')
      .then(res => res.json())
      .then(result => {
        if (result?.ok == 1) {
          const currentData = result.data[0]
          const checkSemester = () => {
            const now = (new Date).getTime()/1000
            const first_semester_start = currentData.first_semester_start
            const first_semester_end = currentData.first_semester_end
            const second_semester_start = currentData.second_semester_start
            const second_semester_end = currentData.second_semester_end
            if (now > first_semester_start && now < first_semester_end) {
              currentData.current_semester = 1
            } else if (now > second_semester_start && now < second_semester_end) {
              currentData.current_semester = 2
            } else {
              currentData.current_semester = 0
            }
          }
          checkSemester()
          setSession(currentData)
        } else {
          alert('No session found')
        }
      })
      .catch(err => console.log(err))
  }, [])
  

  return (
    <SessionContext.Provider value={{ session: session, setSession: setSession }}>
      <div className="max-h-[100vh] max-w-[100vw] overflow-hidden z-[40]">
        <header className="flex justify-between items-center bg-[#346837] h-[80px] px-[15px]">
          <div className="flex gap-[14px] items-center">

            {!widthBool && <div className="w-[30px] h-[30px] flex flex-col gap-[3px] justify-center z-10" onClick={() => {
              setShow(!show)
            }}>
              <div className="lines w-full h-[4px] bg-[#fff]"></div>
              <div className="w-full h-[4px] bg-[#fff]"></div>
              <div className="w-full h-[4px] bg-[#fff]"></div>
            </div>}
            <Link to={routes.base} className="flex items-center">
              <Icon src={school} className='w-[40px] h-[40px]' />
              <h1 className="text-[#F5F5F5] text-[20px] font-bold ml-[10px]">WEBAIS</h1>
            </Link>
          </div>

        </header>
        {widthBool || show ? (
          <aside ref={ref} className="bg-[#346837] btbt:w-[30vw] max-w-[300px] w-[240px] h-screen absolute left-0 top-[80px] py-4 p-1 overflow-x-auto z-[40]">
            <ul className="flex flex-col gap-[7px]">
              <li className="flex items-center ">
                <Link to={'/dashboard' + '-' + title.toLowerCase()} onClick={() => setShow(prev => !prev)}>
                  <h1 className="text-[#F5F5F5] text-[20px] font-bold mr-[10px] capitalize">{title}</h1>
                </Link>
                <span onClick={signout}>
                  <Icon src={logout} className="w-[20px] h-[20px]" title="log out" />
                </span>
              </li>
              {DashboardLinks?.length > 0 && DashboardLinks.map((item, index) => {

                return (
                  <li key={index} onClick={() => setShow(prev => !prev)}>
                    <Link to={item.path} className="flex items-center gap-[4px]">
                      <Icon src={item.icon} className='w-[40px] h-[40px]' />
                      <h4 className="text-white text-[18px] font-bold">{item.name}</h4>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </aside>) : null
        }
        <div className={` ${widthBool && 'absolute w-[60vw] pl-3'} left-[30vw] top-[80px]`}>
          <Outlet />
        </div>
      </div>
    </SessionContext.Provider>
  )
}