import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { UserContext } from "../../App"
import { SessionContext } from "../../layouts/DashboardLayout"

import { invoice_details } from "./GenerateInvoice"


export default function ConfirmPayment() {
  const { user } = useContext(UserContext)
  const { id } = useParams<{ id: string }>()
  const session = useContext(SessionContext)
  const navigate = useNavigate()
  const [invoice, setInvoice] = useState<invoice_details>()
  const [form, setForm] = useState({
    confirmation_number: '',
    receipt_number: '',
  })

  useEffect(() => {
    if (user && id) {
      fetch(`http://localhost:80/webais/api/invoice?student_id=${user?.id}&fee_id=${id}`)
        .then(res => res.json())
        .then(data => {
          if (data?.ok) {
            const res = data?.data
            console.log(data)
            if (res.length > 0) {
              setInvoice(res[0])
            } else {
              alert('No invoice has been generated for this fee')
              navigate(-1)
            }
          } else {
            alert('No invoice has been generated for this fee')
            navigate(-1)
          }
        })
        .catch(err => {
          alert(err?.message || 'Error fetching invoice')
          navigate(-1)
        })
    }
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (invoice) {
      if (!Number(form.receipt_number)) {
        alert('Receipt number must be a number')
        return
      }
      if (form.receipt_number.length < 13) {
        alert('Receipt number must be at least 21 characters long')
        return
      }
      if (!Number(form.confirmation_number)) {

        alert('Confirmation number must be a number')
        return
      }
      if (form.confirmation_number.length < 21) {
        alert('Confirmation number must be at least 21 characters long')
        return
      }

      console.log({
        invoice_no: invoice?.invoice_no,
        confirmation_number: form.confirmation_number,
        receipt_number: form.receipt_number,
        student_id: user?.id,
        fee_id: id,
      })
      post_payment()
    }
  }


  const post_payment = async () => {
    if (invoice && user) {
      
      try {
        let url = `http://localhost:80/webais/api/payments`
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            invoice_no: invoice?.invoice_no,
            confirmation_number: form.confirmation_number,
            receipt_number: form.receipt_number,
            student_id: user?.id,
            fee_id: id,
          })
        })
     
        const data = await res.json()
        console.log(data)
        if (data.ok == 1) {
          alert('Payment Confirmed')
          navigate(-1)
        } else {
          throw new Error('Error confirming payment')
        }
      } catch (err: any) {
        alert(err?.message || 'Error confirming payment')
      }
    }
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {  
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }


  return (
    <section className="p-3 w-full overflow-auto h-[90vh] pb-[30px]">
      <h3 className="font-[600] text-[#347836] text-[28px] text-center leading-[40px]">Confirm Payment</h3>
      <ul className="max-w-[500px] mx-auto">
        <li className=" text-[18px]  leading-[40px]">Invoice Number: {invoice?.invoice_no}</li>
        <li className="text-[18px] leading-[40px]">For: {invoice?.name.toUpperCase()}</li>
        <li className="text-[18px] leading-[40px]">Amount: {invoice?.amount}</li>


      </ul>
      <div className="w-full flex flex-col flex items-center p-2 pb-20">
        <form onSubmit={handleSubmit}>
          <div className="w-full flex flex-col flex p-2 ">
            <label className="font-[600] text-[#347836] text-[18px]  leading-[40px]">Receipt Number</label>
            <input type="number" name='receipt_number' className="w-[300px] h-[40px] border-[1px] border-[#347836] rounded-[5px] p-2" value={form.receipt_number} onChange={handleChange}/>
          </div>
          <div className="w-full flex flex-col flex  p-2 ">
            <label className="font-[600] text-[#347836] text-[18px]  leading-[40px]">Confirmation Number</label>
            <input type="number" name='confirmation_number' className="w-[300px] h-[40px] border-[1px] border-[#347836] rounded-[5px] p-2" value={form.confirmation_number} onChange={handleChange}/>
          </div>
          {/* submit */}
          <div className="w-full flex flex-col flex items-center p-2 ">
            <button type="submit" className="w-[300px] h-[40px] bg-[#347836] text-white rounded-[5px] p-2">Submit</button>
          </div>
        </form>
      </div>
    </section>
  )
}