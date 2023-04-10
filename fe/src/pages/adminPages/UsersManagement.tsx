import Icon from "../../components/Icon";


import admin from '../../assets/admin.png'
import student from '../../assets/student.png'
import lecturer from '../../assets/lecturer.png'
import { Link } from "react-router-dom";

import * as routes from '../../constants/routes'


export default function UsersManagement() {
  return (
    <div className="w-full">
      <div className="w-full flex justify-center">
        <div className="w-[80%]">
          <h2 className="text-center text-[22px] text-[#346837]">Manage Users</h2>

          <div className="flex flex-col justify-center gap-4">
            <div className="flex flex-col items-center gap-2">
              <Icon src={student} className="w-[100px] h-[100px] rounded-[50%] bg-[#346837] flex items-center justify-center bg-transparent" />
              <div className="flex gap-2">

                <Link to={routes.create_student}
                  className="text-[#fff] bg-[#346837] p-1 rounded text-[16px] font-[400]"
                >Create Student</Link>
                <Link to={routes.dashboard + '-admin' + '/' + routes.view_students} className="text-[#fff] bg-[#346837] p-1 rounded text-[16px] font-[400]">View Students</Link>
              </div>

            </div>
            <div className="flex flex-col items-center gap-2">
              <Icon src={lecturer} className="w-[100px] h-[100px] rounded-[50%] bg-[#346837] flex items-center justify-center bg-transparent" />
              <div className="flex gap-2">

                <Link to={routes.create_lecturer} className="text-[#fff] bg-[#346837] p-1 rounded text-[16px] font-[400]">Create Lecturer</Link>
                <Link to={routes.view_lecturer} className="text-[#fff] bg-[#346837] p-1 rounded text-[16px] font-[400]">View Lecturers</Link>
              </div>

            </div>
            <div className="flex flex-col items-center gap-2">
              <Icon src={admin} className="w-[100px] h-[100px] rounded-[50%] bg-[#346837] flex items-center justify-center bg-transparent" />
              <div className="flex gap-2 flex-wrap">

                <Link to={routes.create_admin} className="text-[#fff] bg-[#346837] p-1 rounded text-[16px] font-[400]">Create Administrator</Link>
                <Link to={routes.view_admin} className="text-[#fff] bg-[#346837] p-1 rounded text-[16px] font-[400]">View Administrator</Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}