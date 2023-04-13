import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"

import { Fee } from "../adminPages/FeesManagement"

import school_green from '../../assets/school_green.png'
import { base, UserContext } from "../../App"
import { SessionContext } from "../../layouts/DashboardLayout"


const generate_invoice_no = (id: string | number) => {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  const millisecond = date.getMilliseconds()

  return `WEBAIS${id}${year}${month}${day}${hour}${minute}${second}${millisecond.toString().slice(0, 1)}`
}

export default function GenerateInvoice() {
  const [fee, setFee] = useState<Fee>()
  const { id } = useParams<{ id: string }>()
  const { user } = useContext(UserContext)
  const session = useContext(SessionContext)
  const invoice = generate_invoice_no(id || '')
  const cur_date = getDate()
  const invoice_exist = useRef(false)

  const name = user && (user.firstName + ' ' + (user?.otherNames || '') + ' ' + user.lastName)
  const [invoiceDetails, setInvocieDetails] = useState<any>()

  useLayoutEffect(() => {
    if (fee && user && session) {
      setInvocieDetails({
        invoice_no: invoice,
        name: fee.name,
        date: cur_date,
        amount: fee.amount,
        status: 'pending',
        session: session.session.session,
        level: 200,
        fee_status: 'active',
      })
    }
  }, [fee, user, session])

  useEffect(() => {
    /* get invoice if exist*/
    if (user && id) {
      fetch(base+`/invoice?student_id=${user?.id}&fee_id=${id}`)
        .then(res => res.json())
        .then(data => {
          if (data?.ok) {
            const res = data?.data
            console.log(data)
            if (res.length > 0) {
              const inv = res[0]
              setInvocieDetails(inv)
              invoice_exist.current = true
            }
          } else {
            console.log('Invoice not generated')
          }
        })
    }

  }, [user, id])

  useEffect(() => {

    if (id) {
      fetch(base+`/fee?id=${id}`)
        .then(res => res.json())
        .then(data => {
          console.log(data)
          if (data.ok) {
            const res = data.data
            setFee(res[0])
          }
        })
    }
  }, [id])

  const post_invoice = async () => {
    try {
      const f = new FormData()
      f.append('student_id', user?.id)
      f.append('fee_id', fee?.id.toString() as string)
      f.append('invoice_no', invoice)
      f.append('status', 'pending')
      f.append('date', cur_date)

      const res = await fetch(base+'/invoice', {
        method: 'POST',
        body: f
      })
      const data = await res.json()
    
      if (data.ok) {
        alert('Invoice generated successfully')
      }
    } catch (error) {
      console.log(error)
    }
  }





  return (
    <section className="p-3 w-full overflow-auto h-[90vh] pb-[30px]">{invoiceDetails&&
      <>
        {fee && user && session && <div className="w-full flex flex-col flex items-center p-2 pb-20">
          <div className="flex items-center">
            <img src={school_green} className='w-[40px] h-[40px]' />
            <h1 className="text-[#346837] text-[20px] font-bold ml-[10px]">WEBAIS</h1>
          </div>
          <div className="flex flex-row w-full justify-between">
            <div>
              <h4>FROM</h4>
              <p>{name.toUpperCase()}</p>
              <ul>
                <li>Email: {user.email}</li>
                <li>Phone: {user.phone}</li>
                <li>Programmes: {user?.programmes || 'undergraduate'}</li>
                <li>Department: {user.department}</li>
                <li>Level: {user.level}</li>
                <li>Session: {session.session.session}</li>
                <br></br>
                <li>Student id: {user.id}</li>
              </ul>
            </div>
            <div className="flex flex-col items-end w-[50%]">
              <ul>
                <li className="flex flex-col text-end">Invoice No: <span>{invoiceDetails.invoice_no}</span></li>
                <li className="flex flex-col text-end">Etranzact Payment Type: <span>{fee.name.toUpperCase()}</span></li>
              </ul>
              <h4 >TO</h4>
              <p>WEBAIS</p>
              <p>P.M.B 1xxxx, WEBAIS, Nigeria</p>
              <br />
              <p><span className="font-[600]">Invoice Date: {invoiceDetails.date}</span></p>
            </div>
          </div>
          <br />

          <table className="shadow-lg bg-white border-separate w-full max-w-[100vw] overflow-auto mx-auto">
            <thead>
              <tr >
                <th className="bg-[#34783644]  border text-left px-4 py-2">Item</th>
                <th className="bg-[#34783644] border text-left px-4 py-2">Quantity</th>
                <th className="bg-[#34783644] border text-left px-4 py-2">Unit Price(₦)</th>
                <th className="bg-[#34783644] border text-left px-4 py-2">Total Price(₦)</th>

              </tr>
            </thead>
            <tbody>

              <tr>
                <td className="border px-4 py-2">
                  {fee.name}
                </td>
                <td className="border px-4 py-2">
                  1
                </td>
                <td className="border px-4 py-2">
                  {fee.amount}
                </td>
                <td className="border px-4 py-2">
                  {fee.amount}
                </td>
              </tr>
            </tbody>
          </table>
          <br />
          <div className="flex flex-row w-full">
            <ul className="flex w-full block flex-col items-end px-3">
              <li className=" text-[20px]">Amount Due: {' '}<span className="text-[22px] font-[500]">{fee.amount}</span></li>
            </ul>
          </div>
        </div>
        }
        <div>
          <button className="bg-[#347836] text-white px-3 py-2 rounded-md font-bold mt-4" onClick={() => {
            if(!invoice_exist.current) 
            {
              post_invoice()
            }
            window.print()
          }}>Print Invoice To Pay At Bank</button>
        </div>
      </>

    }
    </section>
  )
}

function getDate() {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const dayOfWeek = days[new Date().getDay()]
  const day = new Date().getDate()
  const month = months[new Date().getMonth()]
  const year = new Date().getFullYear()

  return `${dayOfWeek}, ${month} ${day}, ${year}`
}


export interface invoice_details {
  invoice_no: string,
  name: string,
  date: string,
  amount: string,
  status: 'pending'|'settled',
  session: string,
  level: string|number,
  fee_status: 'active'|'inactive',
}