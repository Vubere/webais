import { useContext, useEffect, useState } from "react";
import { base } from "../../App";

import { session, SessionContext } from "../../layouts/DashboardLayout";

export default function Session() {
  const [session, setSession] = useState<session>({
    session: '',
    semester: '',
  });
  const [errors, setErrors] = useState({
    session: '',
    semester: '',
  });
  const globalSessionHandler = useContext(SessionContext)

  const validate = () => {
    let tempErrors = { ...errors }
    let isValid = true
    if (session.session === '') {
      tempErrors.session = 'Session is required'
      isValid = false
    }
    if (session.semester === '') {
      tempErrors.semester = 'Semester is required'

      isValid = false
    }
    if (!isValid) {
      setTimeout(() => {
        setErrors({
          session: '',
          semester: '',
        })
      }, 3000)
    }
    return isValid
  }
  const onChange = ({ target }: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSession({
      ...session,
      [target.name]: target.value
    })
  }
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validate()) {
      console.log(session)
      fetch(base+'/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(session)
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.status == 'success') {
            if (globalSessionHandler) {
              globalSessionHandler.setSession(session)
            }
            alert('succesful')
          }
        })
        .catch((err) => console.log(err))
    }
  }
  const year = new Date().getFullYear()

  useEffect(() => {
    if (globalSessionHandler) {
      setSession(globalSessionHandler.session)
    }
  }, [globalSessionHandler])


  return (
    <div className="w-full h-[90vh] content-box overflow-auto pb-[30px]">
      <h2 className="text-center font-[600] text-[22px] text-[#346837]"> Change Session/Semester</h2>
      <p className="text-center font-[400] text-[12px] text-[#643]">Warning, this affects every operation for the current semester/session, make changes with caution.</p>
      <form onSubmit={onSubmit} className="flex flex-col items-center gap-2 mx-auto w-80vw max-w-[400px] mt-3">
        <div>
          <ul className="text-[#346837] font-[600]">
            <li>
            Current Session:{' '} 
            {session.session}
            </li>
            Current Semester: {' '}
            {session.semester}
            </ul>
        </div>
        <div className="w-full">
          <label htmlFor="session">Session </label>
          <select name="session" id="session" value={session.session} onChange={onChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] flex items-center focus:outline-none px-2">
            <option value="">Select Session </option>
            <option value={`${year + 2}/${year + 3}`}>{`${year + 2}/${year + 3}`}</option>
            <option value={`${year + 1}/${year + 2}`}>{`${year + 1}/${year + 2}`}</option>
            <option value={`${year}/${year + 1}`}>{`${year}/${year + 1}`}</option>
            <option value={`${year - 1}/${year}`}>{`${year - 1}/${year}`}</option>
            <option value={`${year - 2}/${year - 1}`}>{`${year - 2}/${year - 1}`}</option>
            <option value={`${year - 3}/${year - 2}`}>{`${year - 3}/${year - 2}`}</option>
          </select>
          <p className="red">{errors.session}</p>
        </div>
        <div className="w-full">
          <label htmlFor="semester">Semester </label>
          <select name="semester" id="semester" value={session.semester} onChange={onChange} className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836]  flex items-center focus:outline-none px-2">
            <option value="">Select Semester</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
          <p className="red">{errors.semester}</p>
        </div>
        <button type="submit" className="w-full h-[40px] rounded-[5px] bg-[#347836] text-white xs:text-[14px] stbt:text-[18px]">Submit</button>

      </form>
    </div>
  )
}