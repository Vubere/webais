import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../App";

/* icon component */
import Icon from "../components/Icon";


/* images */
import school_logo from '../assets/school.png'
import computer from '../assets/computer.png'

/* constant */
import * as routes from '../constants/routes'


export default function LandingPage() {
  const [userType, setUserType] = useState<string>('')
  const { user } = useContext(UserContext);
  const navigate = useNavigate()

  useEffect(() => {

    if (user?.id) {
      const { id } = user
      if (id) {
        if (id.toLowerCase().includes('admin')) {
          setUserType('admin')
        } else if (id.toLowerCase().includes('stu')) {
          setUserType('student')
        } else if (id.toLowerCase().includes('lect')) {
          setUserType('lecturer')
        }
      }
    }
  }, [user])

  const route = userType == 'admin' ? routes.dashboard + '-' + routes.admin : userType == 'student' ? routes.dashboard + '-' + routes.student : userType == 'lecturer' ? routes.dashboard + '-' + routes.lecturer : ''

  const signout = () => {
    sessionStorage.removeItem('user')
    navigate('/')
  }



  return (
    <>
      <main className="w-[100%] overflow-hidden text-[#346837] stbt:mb-0 xs:mb-10">
        <div className="hero blp:mt-4 stbt:flex btbt:gap-[5%] slp:gap-[10%] blp:p-3 stbt:p-2 p-2">
          <Icon src={computer} className="w-full stbt:w-[40%] slp:bg-cover slp:h-[400px] h-[500px] stbt:h-[300px] xs:h-[180px]" />
          <div className="stbt:w-[50%] py-2 stbt:py-4 pr-2 ">
            <h2 className="text-[#346837] font-[700] text-[42px] text-center stbt:text-left leading-[45px] btbt:text-[54px] btbt:leading-[60px] font-bold flex items-center w-full">
              Web Based Academic Information System
            </h2>
            <p className="text-[24px] pt-4 p-3 stbt:p-0 stbt:text-left text-center">A Web Based Academic Information System is a system that handles the details and activities of students and lecturers.</p>
            {
              userType == '' ? (
                <div className="flex flex-col gap-[10px] pt-4 items-center stbt:items-start w-full">
                  <Link to={routes.admin_login} className="bg-[#346837] text-[#fff] font-[500] text-[18px] leading-[24px] font-bold flex items-center justify-center w-[200px] h-[50px] rounded-[10px] hover:underline">
                    Login As Admin
                  </Link>
                  <Link to={routes.student_login} className="bg-[#fff] text-[#346837] font-[500] text-[18px] leading-[24px] font-bold flex items-center justify-center w-[200px] h-[50px] rounded-[10px] border border-[#346837] hover:underline">
                    Login As Student
                  </Link>
                  <Link to={routes.lecturer_login} className="bg-[#34683788] text-[#040a] font-[500] text-[18px] leading-[24px] font-bold flex items-center justify-center w-[200px] h-[50px] rounded-[10px] hover:underline">
                    Login As Lecturer
                  </Link>


                </div>) : (
                <div className="flex flex-col gap-[10px] pt-4 items-center stbt:items-start w-full">
                    <Link to={route} className="bg-[#34683788] text-[#040a] font-[500] text-[18px] leading-[24px] font-bold flex items-center justify-center w-[200px] h-[50px] rounded-[10px] hover:underline">
                      Go to Dashboard
                    </Link>
                    <button className="bg-[#34683788] text-[#040a] font-[500] text-[18px] leading-[24px] font-bold flex items-center justify-center w-[200px] h-[50px] rounded-[10px] hover:underline" onClick={signout}>
                      Log Out
                    </button>
                </div>)
            }
          </div>
        </div>
      </main >
    </>
  )
}