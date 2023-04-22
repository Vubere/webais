import { useEffect, useState } from "react"
import { base } from "../../../App"
import { payment } from "../../StudentPages/Payments"
import { Link, useNavigate } from "react-router-dom"
import * as routes from '../../../constants/routes'



export default function FeePayment() {
  const [payments, setPayments] = useState<payment[]>([])
  const [search, setSearch] = useState('')
  const navigate = useNavigate()


  useEffect(() => {
    document.title = 'fee payments'
    getPayments()

  }, [])
  const getPayments = async () => {
    try {
      const res = await fetch(base + '/student_payments')
      const data = await res.json()
      
      if (data?.ok) {
        setPayments(data.data)
      }
    } catch (err: any) {
      console.log(err)
    }
  }
  const filterPayment = payments.filter((payment) => {
    return payment?.name.toLowerCase().includes(search?.toLowerCase()) || payment?.fullName.toLowerCase().includes(search?.toLowerCase()) || payment.department.toString().toLowerCase().includes(search.toLowerCase()) || payment.faculty?.toString()?.toLowerCase().includes(search.toLowerCase()) || payment.amount?.toString().toLowerCase().includes(search.toLowerCase()) || payment.level?.toString()?.toLowerCase().includes(search.toLowerCase()) || payment.session?.toLowerCase().includes(search.toLowerCase()) || payment.semester?.toString().toLowerCase().includes(search.toLowerCase()) || payment.level?.toString().toLowerCase().includes(search.toLowerCase()) || payment.receipt_number?.toLowerCase().includes(search.toLowerCase()) || payment.confirmation_number?.toLowerCase().includes(search.toLowerCase()) || payment.invoice_no?.toString().toLowerCase().includes(search.toLowerCase()) 
  })

  return (
    <section className="p-3 h-[90vh] overflow-y-auto">
      <button className="flex items-center text-[#347836] font-[400] text-[14px] mb-3" onClick={()=>navigate(-1)}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Go Back
      </button>
      <h3 className="font-[600] text-[#347836] text-[28px] text-center leading-[40px] p-3">Payments</h3>
      {/* go back button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <input type="text" placeholder="Search" className="border-[#347836] border-2 rounded-md p-2" onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="w-full overflow-auto">

        {filterPayment.length > 0 ? (
          <table className="shadow-lg bg-white border-separate max-w-[100vw] overflow-auto ">
            <thead>
              <tr >
                <th className="bg-[#34783644]  border text-left px-4 py-2">Name</th>
                <th className="bg-[#34783644]  border text-left px-4 py-2">Student</th>
                <th className="bg-[#34783644]  border text-left px-4 py-2">Faculty</th>
                <th className="bg-[#34783644]  border text-left px-4 py-2">Department</th>
                <th className="bg-[#34783644] border text-left px-4 py-2">Amount</th>
                <th className="bg-[#34783644] border text-left px-4 py-2">Level</th>
                <th className="bg-[#34783644] border text-left px-4 py-2">Session</th>
                <th className="bg-[#34783644] border text-left px-4 py-2">Semester</th>
                <th className="bg-[#34783644] border text-left px-4 py-2">Level</th>
                <th className="bg-[#34783644] border text-left px-4 py-2">Receipt Number</th>
                <th className="bg-[#34783644] border text-left px-4 py-2">Confirmation Number</th>
                <th className="bg-[#34783644] border text-left px-4 py-2">Invoice Number</th>
                <th className="bg-[#34783644] border text-left px-4 py-2">Date</th>
                <th className="bg-[#34783644] border text-left px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="border px-4 py-2">{payment.name}</td>
                  <td className="border px-4 py-2">{payment.fullName}</td>
                  <td className="border px-4 py-2">{payment.department}</td>
                  <td className="border px-4 py-2">{payment.faculty}</td>
                  <td className="border px-4 py-2">{payment.amount}</td>
                  <td className="border px-4 py-2">{payment.level}</td>
                  <td className="border px-4 py-2">{payment.session}</td>
                  <td className="border px-4 py-2">{payment.semester != '0' ? payment.semester : 'all'}</td>
                  <td className="border px-4 py-2">{payment.level}</td>
                  <td className="border px-4 py-2">{payment.receipt_number}</td>
                  <td className="border px-4 py-2">{payment.confirmation_number}</td>
                  <td className="border px-4 py-2">{payment.invoice_no}</td>
                  <td className="border px-4 py-2">{payment.date || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center">
            <p className="text-[#347836] font-[600] text-[20px]">No Payments</p>
          </div>
        )}
      </div>

    </section>
  )
}
