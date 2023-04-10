import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base } from "../../App";

import * as routes from "../../constants/routes";


export default function FeeManagement() {

  const [fees, setFees] = useState<Fee[]>([])
  const [errors, setErrors] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch(base+'/fee')
      .then(res => res.json())
      .then(data => {
        console.log(data)
        if (data.ok) {
          setFees(data.data)
        } else {
          throw new Error(data?.message || 'something went wrong')
        }
      })
      .catch((err: any) => {
        console.log(err)
        setErrors(err?.message || 'something went wrong')
      })
  }, [])

  const filtered_fee = fees.filter(fee => fee.name.toLowerCase().includes(search.toLowerCase())||fee.session.toLowerCase().includes(search.toLowerCase())||fee.semester.toString()==search||fee.level.toLowerCase().includes(search.toLowerCase())||fee?.fee_status?.toLowerCase().includes(search.toLowerCase())||fee.amount.toString()==search)



  return (
    <section className="p-4 w-full h-[90vh] overflow-y-auto">
      <div className="w-full flex justify-end">
        <Link to={routes.create_fee} className='bg-[#347836] text-[#fff] p-1 rounded px-2'>Create Fee</Link>
      </div>
      <h3 className="font-[600] text-[#347836] text-[28px] text-center leading-[40px] p-3">Fee Management</h3>
      <div className="w-full flex flex-col items-center">
        <div className="w-full flex justify-center">
          <Link to='' className="bg-[#347836] text-[#fff] p-1 rounded px-2 block w-[160px] text-center m-2">
            View Fee Payments
          </Link>
        </div>
        <div className="w-full flex justify-center">
          <Link to='' className="bg-[#347836] text-[#fff] p-1 rounded px-2 block w-[160px] text-center m-2">
            Register Fee Payment
          </Link>
        </div>
      </div>
      <div>
        <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search" className="w-[200px] border border-[#347836] rounded p-2 my-2" />


      </div>
      <div className="w-full overflow-y-auto">
      
        {errors == '' ? <table className="shadow-lg bg-white border-separate max-w-[100vw] overflow-auto ">
          <thead>
            <tr >
              <th className="bg-[#34783644]  border text-left px-4 py-2">Name</th>
              <th className="bg-[#34783644] border text-left px-4 py-2">Amount</th>
              <th className="bg-[#34783644] border text-left px-4 py-2">Department</th>
              <th className="bg-[#34783644] border text-left px-4 py-2">Session</th>
              <th className="bg-[#34783644] border text-left px-4 py-2">Semester</th>
              <th className="bg-[#34783644] border text-left px-4 py-2">Level</th>
              <th className="bg-[#34783644] border text-left px-4 py-2">Status</th>
              <th className="bg-[#34783644] border text-left px-4 py-2">Created</th>
              <th className="bg-[#34783644] border text-left px-4 py-2">Last Updated</th>
              <th className="bg-[#34783644] border text-left px-4 py-2">Update</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
          {filtered_fee.map(fee => <FeeRow fee={fee} />)}
        </table> : <p className="w-full ">{errors}</p>}
      </div>
    </section>
  )
}

const FeeRow = ({ fee }: { fee: Fee }) => {

  const [department, setDepartment] = useState('')
  const created = new Date(fee.created_at||'').toLocaleDateString()
  const last_updated = new Date(fee.updated_at||'').toLocaleDateString()
  console.log(fee)

  useEffect(() => {
    fetch('http://localhost/webais/api/department?id=' + fee.department_id)
      .then(res => res.json())
      .then(data => {
     
        if (data.status == 'success') {
          setDepartment(data?.data.data[0].name)
        }
      })
      .catch(err => console.log(err))
  }, [])




  return (
    <tr key={fee.id}>
      <td className="border px-4 py-2">{fee.name}</td>
      <td className="border px-4 py-2">{fee.amount}</td>
      <td className="border px-4 py-2">{department}</td>
      <td className="border px-4 py-2">{fee.session}</td>
      <td className="border px-4 py-2">{fee.semester!=0?fee.semester:'all'}</td>
      <td className="border px-4 py-2">{fee.level}</td>
      <td className="border px-4 py-2">{fee.fee_status}</td>
      <td className="border px-4 py-2">{created}</td>
      <td className="border px-4 py-2">{last_updated}</td>
      <td className="border px-4 py-2">
        <Link to={
          `/dashboard-admin/update-fee/${fee.id}`
        } className="bg-[#347836] text-white px-4 py-2 rounded-md">Update</Link>
      </td>
    </tr>
  )
}

export type Fee = {
  id: number,
  name: string,
  amount: number,
  department: string,
  department_id?: number,
  session: string,
  semester: number,
  level: string,
  status: string,
  fee_status?: string,
  created: string,
  created_at?: string,
  last_updated: string
  updated_at?: string
}