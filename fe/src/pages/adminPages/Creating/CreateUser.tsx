import Icon from "../../../components/Icon";


import admin from '../../../assets/admin.png'
import student from '../../../assets/student.png'
import lecturer from '../../../assets/lecturer.png'
import { Link } from "react-router-dom";

import * as routes from '../../../constants/routes'


export default function CreateUser() {
  return (
    <div className="w-full">
      <div className="w-full flex justify-center">
        <div className="w-[80%]">
          <h2 className="text-center text-[22px] text-[#346837]">Create User</h2>
          
          <div className="flex flex-col justify-center gap-4">
            <div className="flex flex-col items-center gap-2">
              <Icon src={student} className="w-[100px] h-[100px] rounded-[50%] bg-[#346837] flex items-center justify-center bg-transparent" />
              <Link to={routes.create_student}>Create Student</Link>

            </div>
            <div className="flex flex-col items-center gap-2">
              <Icon src={lecturer} className="w-[100px] h-[100px] rounded-[50%] bg-[#346837] flex items-center justify-center bg-transparent" />
              <Link to={routes.create_lecturer}>Create Lecturer</Link>

            </div>
            <div className="flex flex-col items-center gap-2">
              <Icon src={admin} className="w-[100px] h-[100px] rounded-[50%] bg-[#346837] flex items-center justify-center bg-transparent"/>
              <Link to={routes.create_admin}>Create Administrator</Link>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}