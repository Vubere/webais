import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { payment } from "./Payments"



import school_green from '../../assets/school_green.png'
import { base } from "../../App"



export default function GenerateReceipt() {

  const [receipt, setReceipt] = useState<payment>()
  const { id } = useParams<{ id: string }>()
  const print_button = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    document.title = 'Generate Receipt'
    if (id)
      getReceipt()
  }, [id])
  const getReceipt = async () => {
    try {
      const res = await fetch(base+`/student_payments?id=${id}`)
      const data = await res.json()

      if (data?.ok) {
        const d = data.data[0]
        const date = new Date(Number(d.date)*1000)
     
        const date_string = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
        d.date = date_string
        setReceipt(d)
      } else {
        throw new Error('Could not generate receipt')
      }
    } catch (err: any) {
      alert(err?.message || 'Could not generate receipt')
    }
  }


  return (
    <>
      {receipt ?
        <>
          <section className="p-3 w-full overflow-auto h-[90vh] pb-[30px] flex flex-col flex items-center p-2 pb-20" >

            <div className="flex flex-row w-full justify-between">
              <div className="left">
                <div className="flex items-center">
                  <img src={school_green} className='w-[40px] h-[40px]' />
                  <h1 className="text-[#346837] text-[20px] font-bold ml-[10px]">Nigerian University</h1>
                </div>
                <p>Nigerian University</p>
                <p>P.M.B 1xxxx, Nigerian University, Nigeria</p>
                <br />
              </div>
              <div className="flex flex-col items-end w-[50%]">
                <ul className="flex flex-col items-end w-[50%]">
                  <li>
                    <p className="text-end">Session</p>
                    <p className="text-end">{receipt.session}</p>
                  </li>
                  <li>
                    <p className="text-end">Semester</p>
                    <p className="text-end">{receipt.semester != '0' ? receipt.semester : 'All'}</p>
                  </li>
                  <li>
                    <p className="text-end">Level</p>
                    <p className="text-end">{receipt.level}</p>
                  </li>
                  <li>
                    <p className="text-end">Date Paid</p>
                    <p className="text-end">{receipt.date || '-'}</p>
                  </li>
                  <li>
                    <p className="text-end">Receipt Number</p>
                    <p className="text-end">{receipt.receipt_number}</p>
                  </li>
                  <li>
                    <p className="text-end">Etranzact Confirmation</p>
                    <p className="text-end">{receipt.confirmation_number}</p>
                  </li>
                </ul>
              </div>
            </div>

            <div className="w-full">
              <h4 className="w-full font-[700] text-[32px]">Receipt</h4>
              <table className="shadow-lg bg-white border-separate w-full max-w-[100vw] overflow-auto mx-auto">
                <thead>
                  <tr>
                    <th className="bg-[#34783644]  border text-left px-4 py-2">Item</th>
                    <th className="bg-[#34783644]  border text-left px-4 py-2">Quanity</th>
                    <th className="bg-[#34783644]  border text-left px-4 py-2">Amount(₦)</th>
                    <th className="bg-[#34783644]  border text-left px-4 py-2">Total(₦)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-4 py-2">{receipt.name}</td>
                    <td className="border px-4 py-2">1</td>
                    <td className="border px-4 py-2">{receipt.amount}</td>
                    <td className="border px-4 py-2">{receipt.amount}</td>
                  </tr>
                </tbody>
              </table>
              <div className="flex w-full block flex-row justify-end px-3 py-4">
                <p className="text-[20px] font-[600]">Total: {receipt.amount}</p>
              </div>
            </div>
            <div className="py-20">
              <button className="bg-[#347836] text-white px-3 py-2 rounded-md font-bold mt-4" ref={print_button} onClick={() => {
                if (print_button.current) {
                  print_button.current.style.display = 'none'
                }
                window.print()
                if (print_button.current) {
                  print_button.current.style.display = 'block'
                }
              }}>Print Receipt</button>
            </div>
          </section>
        </> : <div className="text-center">
          <p className="text-[#347836] font-[600] text-[20px]">Couldn't generate receipt</p>
        </div>
      }
    </>
  )
}