import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { base, UserContext } from "../../App"
import * as routes from "../../constants/routes"



export default function ViewPayments() {

  const [payments, setPayments] = useState<payment[]>([])
  const { user } = useContext(UserContext)

  useEffect(() => {
    document.title = 'Student Payments'
    if (user) {
      getPayments()
    }
  }, [user])
  const getPayments = async () => {
    if (user) {
      try {
        const res = await fetch(base + '/student_payments?id=' + user?.id)
        const data = await res.json()
        if (data?.ok) {
          setPayments(data.data)
        }
      } catch (err: any) {
      }
    }
  }

  const unix_time_to_calender_date = (unix_time: number) => {
    const date = new Date(unix_time)
    return date.toLocaleDateString()
  }

  return (
    <section className="p-3 h-[90vh] overflow-y-auto">
      <h3 className="font-[600] text-[#347836] text-[28px] text-center leading-[40px] p-3">Payments</h3>
      <div className="w-full overflow-x-auto">
        {payments.length > 0 ? (
          <table className="shadow-lg bg-white border-separate max-w-[100vw] overflow-auto ">
            <thead>
              <tr >
                <th className="bg-[#34783644]  border text-left px-4 py-2">Name</th>
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
                <tr>
                  <td className="border px-4 py-2">{payment.name}</td>
                  <td className="border px-4 py-2">{payment.amount}</td>
                  <td className="border px-4 py-2">{payment.level}</td>
                  <td className="border px-4 py-2">{payment.session}</td>
                  <td className="border px-4 py-2">{payment.semester != '0' ? payment.semester : 'all'}</td>
                  <td className="border px-4 py-2">{payment.level}</td>
                  <td className="border px-4 py-2">{payment.receipt_number}</td>
                  <td className="border px-4 py-2">{payment.confirmation_number}</td>
                  <td className="border px-4 py-2">{payment.invoice_no}</td>
                  <td className="border px-4 py-2">{(payment.date&&unix_time_to_calender_date(Number(payment.date*1000))) || '-'}</td>
                  <td className="border px-4 py-2">
                    <Link to={'/dashboard-student/' + routes.receipt + '/' + payment.id} className=" block bg-[#347836] text-white px-2 py-1 rounded-md">Generate Receipt</Link>
                  </td>
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


export interface payment {
  id: number;
  name: string;
  fullName: string;
  department: string;
  faculty: string;
  session: string;
  semester: string;
  level: string;
  amount: number;
  date: number;
  receipt_number: string;
  confirmation_number: string;
  invoice_no: string;
}