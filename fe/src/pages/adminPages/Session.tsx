import { useContext, useEffect, useState } from "react";
import { base } from "../../App";

import { session, SessionContext } from "../../layouts/DashboardLayout";
import { format, fromUnixTime, getUnixTime } from 'date-fns';

export default function Session() {
  const [session, setSession] = useState<session>({
    session: '',
    current_semester: '',
    first_semester_start: '',
    first_semester_end: '',
    second_semester_start: '',
    second_semester_end: '',
  });
  const [currentData, setCurrentData] = useState<session>({
    session: '',
    current_semester: '',
    first_semester_start: '',
    first_semester_end: '',
    second_semester_start: '',
    second_semester_end: '',
  });

  const [errors, setErrors] = useState({
    session: '',
    current_semester: '',
    first_semester_start: '',
    first_semester_end: '',
    second_semester_start: '',
    second_semester_end: '',
  });

  const globalSessionHandler = useContext(SessionContext)

  useEffect(() => {
    if (currentData?.session) {
      checkSemester()
    }
  }, [currentData.first_semester_start])

  useEffect(() => {
    if (globalSessionHandler?.session?.session) {
      let tempSession = { ...globalSessionHandler.session }
      tempSession.first_semester_start = format(fromUnixTime(parseInt(tempSession.first_semester_start)), 'yyyy-MM-dd')
      tempSession.first_semester_end = format(fromUnixTime(parseInt(tempSession.first_semester_end)), 'yyyy-MM-dd')
      tempSession.second_semester_start = format(fromUnixTime(parseInt(tempSession.second_semester_start)), 'yyyy-MM-dd')
      tempSession.second_semester_end = format(fromUnixTime(parseInt(tempSession.second_semester_end)), 'yyyy-MM-dd')
      setSession(tempSession)
      setCurrentData(tempSession)
    }
  }, [globalSessionHandler?.session])

  const now = Math.floor((new Date()).getTime() / 1000)

  /* check if the unix timestamp now is greater or lesser than end data of first semester start date or second semester end date*/
  const checkSemester = () => {
    const now = getUnixTime(new Date())
    const first_semester_start = getUnixTime(new Date(currentData.first_semester_start))
    const first_semester_end = getUnixTime(new Date(currentData.first_semester_end))
    const second_semester_start = getUnixTime(new Date(currentData.second_semester_start))
    const second_semester_end = getUnixTime(new Date(currentData.second_semester_end))
    if (now > first_semester_start && now < first_semester_end) {
      setCurrentData({
        ...currentData,
        current_semester: 1
      })
    } else if (now > second_semester_start && now < second_semester_end) {
      setCurrentData({
        ...currentData,
        current_semester: 2
      })
    } else {
      setCurrentData({
        ...currentData,
        current_semester: 0
      })
    }
  }

  const validate = () => {
    let tempErrors = { ...errors }
    let isValid = true
    if (session.session === '') {
      tempErrors.session = 'Session is required'
      isValid = false
    }
    if (session.first_semester_start === '') {
      tempErrors.first_semester_start = 'First semester start is required'

      isValid = false
    }
    if (session.first_semester_end === '') {
      tempErrors.first_semester_end = 'First semester end is required'
      isValid = false
    }
    if (session.second_semester_start === '') {
      tempErrors.second_semester_start = 'Second semester start is required'
      isValid = false
    }
    if (session.second_semester_end === '') {
      tempErrors.second_semester_end = 'Second semester end is required'
      isValid = false
    }

    if (!isValid) {
      console.log(tempErrors)
      setErrors(tempErrors)
      setTimeout(() => {
        setErrors({
          session: '',
          current_semester: '',
          first_semester_start: '',
          first_semester_end: '',
          second_semester_start: '',
          second_semester_end: '',
        })
      }, 3000)
    }
    return isValid
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validate()) {
      const f = new FormData()
      const fss = (new Date(session.first_semester_start)).getTime()/1000
      const fse = (new Date(session.first_semester_end)).getTime()/1000
      const sss = (new Date(session.second_semester_start)).getTime()/1000
      const sse = (new Date(session.second_semester_end)).getTime()/1000

      f.append('session', session.session)
      f.append('semester', session.current_semester.toString())
      f.append('first_semester_start', fss.toString())
      f.append('first_semester_end', fse.toString())
      f.append('second_semester_start', sss.toString())
      f.append('second_semester_end', sse.toString())
      const method = globalSessionHandler?.session?.session == session.session ? "PUT" : "POST"
      f.append('method', method)
     

      fetch(base + '/session', {
        method: "POST",
        body: f
      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result)
          if (result.status == 'success') {
            if (globalSessionHandler) {
              globalSessionHandler.setSession(session)
              setCurrentData(session)
            }
            alert('succesful')
          }else{
            if(result?.error?.toLowerCase()?.includes('duplicate')){
              throw new Error('Session already exists')
            }
            throw new Error(result.message)
          }
        })
        .catch((err) => {
          console.log(err)
          alert(err.message||'An error occured')
        })
    }
  }
  const year = new Date().getFullYear()



  const onChange = ({ target }: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSession({
      ...session,
      [target.name]: target.value
    })
  }


  return (
    <div className="w-full h-[90vh] content-box overflow-auto pb-[30px] p-3">
      <h2 className="text-center font-[600] text-[22px] text-[#346837]"> Change Session/Semester</h2>
      <p className="text-center font-[400] text-[12px] text-[#643]">Warning, this affects every operation for the current semester/session, make changes with caution.</p>
      <div className="max-w-[400px] mx-auto w-full p-2">
        <ul className="text-[#346837] font-[400]">
          <li>
            Current Session:{' '}
            {currentData.session || 'No session ongoing'}
          </li>
          <li>
            {now > parseInt(globalSessionHandler?.session?.first_semester_start || '') ? 'started' : 'starts'}: {' '}{currentData.first_semester_start || 'No session ongoing'}
          </li>
          <li>
            {now > parseInt(globalSessionHandler?.session?.first_semester_end || '') ? 'ended' : 'ends'}: {' '}{session.second_semester_end || 'No session ongoing'}
          </li>
          <li>
            Current Semester: {' '}
            {session.current_semester != 0 ? currentData.current_semester : 'No semester ongoing'}
          </li>
          <li>
            {now > parseInt(globalSessionHandler?.session?.second_semester_start || '') ? 'started' : 'starts'}: {' '}{session.current_semester === '1' ? currentData.first_semester_start || 'No semester ongoing' : currentData.second_semester_start || 'No semester ongoing'}
          </li>
          <li>
            {now > parseInt(globalSessionHandler?.session?.second_semester_end || '') ? 'ended' : 'ends'}: {' '}{currentData.current_semester === '1' ? currentData.first_semester_end || 'No semester ongoing' : currentData.second_semester_end || 'No semester ongoing'}
          </li>
        </ul>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col items-center gap-2 mx-auto w-80vw max-w-[400px] mt-3">
        <div className="w-full">
          <label htmlFor="session">Session </label>
          {errors.session && <p className="text-[#f00] text-[10px] font-[400]">{errors.session}</p>}
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
          <label htmlFor="start">First Semester Start Date</label>
          {errors.first_semester_start && <p className="text-[#f00] text-[10px] font-[400]">{errors.first_semester_start}</p>}
          <input type="date" onChange={onChange} value={session.first_semester_start} name="first_semester_start" id="start" className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] flex items-center focus:outline-none px-2" />
        </div>
        <div className="w-full">
          <label htmlFor="end">First Semester End Date</label>
          {errors.first_semester_end && <p className="text-[#f00] text-[10px] font-[400]">{errors.first_semester_end}</p>}
          <input type="date" onChange={onChange} value={session.first_semester_end} name="first_semester_end" id="end" className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] flex items-center focus:outline-none px-2" />
        </div>
        <div className="w-full">
          <label htmlFor="sstart">Second Semester Start Date</label>
          {errors.second_semester_start && <p className="text-[#f00] text-[10px] font-[400]">{errors.second_semester_start}</p>}
          <input type="date" onChange={onChange} value={session.second_semester_start} name="second_semester_start" id="sstart" className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] flex items-center focus:outline-none px-2" />
        </div>
        <div className="w-full">
          <label htmlFor="send">Second Semester End Date</label>
          {errors.second_semester_end && <p className="text-[#f00] text-[10px] font-[400]">{errors.second_semester_end}</p>}
          <input type="date" value={session.second_semester_end} onChange={onChange} name="second_semester_end" id="send" className="w-full h-[40px] rounded-[5px] bg-transparent border border-[#347836] flex items-center focus:outline-none px-2" />
        </div>
        <button type="submit" className="w-full h-[40px] rounded-[5px] bg-[#347836] text-white xs:text-[14px] stbt:text-[18px]">Submit</button>

      </form>


      {/* go to next semester */}
      {/*    <div className="flex flex-col items-center gap-2 mx-auto w-[60vw] max-w-[300px] mt-3">
        <button className="w-full h-[40px] rounded-[5px] bg-[#f33] text-white xs:text-[14px] stbt:text-[18px]">End Current Semester</button>
        <button className="w-full h-[40px] rounded-[5px] bg-[#f33] text-white xs:text-[14px] stbt:text-[18px]">Start Next Semester</button>
      </div> */}
    </div>
  )
}