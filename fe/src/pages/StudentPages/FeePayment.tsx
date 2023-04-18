import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base, UserContext } from "../../App";

import * as routes from "../../constants/routes"
import { Fee } from "../adminPages/FeesManagement";

import useFacultiesAndDepartments from "../../hooks/useFacultiesAndDepartments";


export default function FeePayment() {
  const [fees, setFees] = useState<any[]>([])
  const { departments } = useFacultiesAndDepartments()


  const { user } = useContext(UserContext)

  useEffect(() => {
    document.title = 'Fee Payment'
    if (!user && departments?.length) return
    fetch(base+'/fee?student_id='+user.id)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        if (data.ok) {
          const res = data.data
        
          const fee = res.filter((item: any) => item.department_id == user.department)
          if (fee) {
            setFees(fee)
            console.log(fee)
          }
        }
      })
  }, [user, departments])

  return (
    <section className="p-3 h-[90vh] overflow-y-auto">
      <div className='w-full flex justify-end'>
        
        <Link to={'/dashboard-student/'+routes.view_payments} className='bg-[#347836] text-[#fff] p-1 rounded px-2'>View Payments</Link>
      </div>
      <h3 className="font-[600] text-[#347836] text-[28px] text-center leading-[40px] p-3">Fee Payments</h3>
      <div className="w-full flex flex-col items-center">
        <h4>Outstanding Dues</h4>
        <div className="w-full overflow-auto">

          {fees.length ? <table className="shadow-lg bg-white border-separate max-w-[100vw] overflow-auto ">
            <thead>
              <tr >
                <th className="bg-[#34783644]  border text-left px-4 py-2">Name</th>
                <th className="bg-[#34783644] border text-left px-4 py-2">Amount</th>
                <th className="bg-[#34783644] border text-left px-4 py-2">Department</th>
                <th className="bg-[#34783644] border text-left px-4 py-2">Session</th>
                <th className="bg-[#34783644] border text-left px-4 py-2">Semester</th>
                <th className="bg-[#34783644] border text-left px-4 py-2">Level</th>
                <th className="bg-[#34783644] border text-left px-4 py-2">Status</th>
                <th className="bg-[#34783644] border text-left px-4 py-2">action</th>
              </tr>
            </thead>
            <tbody>
            </tbody>
            {fees.map(fee => <FeeRow fee={fee} />)}
          </table> : <p className="">You have no outstanding fees</p>}
        </div>

       
      </div>
    </section>
  )
}


const FeeRow = ({ fee }: { fee: Fee }) => {

  const [department, setDepartment] = useState('')


  useEffect(() => {
    fetch(base+'/department?id=' + fee.department_id)
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
      <td className="border px-4 py-2">{fee.semester != 0 ? fee.semester : 'all'}</td>
      <td className="border px-4 py-2">{fee.level}</td>
      <td className="border px-4 py-2">{fee.fee_status}</td>

      <td className="border px-4 py-2">
        <Link to={
          `/dashboard-student/${routes.generate_invoice}/${fee.id}`
        } className="bg-[#347836] text-white px-2 py-1 rounded-md block text-center"> Invoice</Link>
        <Link to={
          `/dashboard-student/${routes.confirm_payment}/${fee.id}`
        } className="bg-[#347836] text-white px-2 py-1 my-1 rounded-md block text-center">Confirm Payment</Link>
      </td>
    </tr>
  )
}