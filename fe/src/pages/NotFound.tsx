import { useNavigate } from "react-router-dom"

export default function NotFound() {
  const navigate = useNavigate()


  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-[#346837] font-[700] text-[54px] leading-[54px] font-bold flex items-center w-full justify-center">
        404
      </h1>
      <p className="text-[24px] pt-4">Page Not Found</p>
      <button onClick={()=>navigate(-1)} className="border border-black px-4 py-2 text-[24px] rounded-full mt-4">Go Back</button>
    </div>
  )
}