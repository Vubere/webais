import Icon from "../../components/Icon"
import school_logo from "../../assets/school.png"
/* components */
import { Link } from "react-router-dom"

export default function Header() {
  return (
    <header className="flex items-center h-[65px] md:h-[100px] bg-[#346837] w-[100%]">
      <Link to="/">
        <h1 className="text-[#fff] font-[700] text-[24px] leading-[24px] md:text-[32px] md:leading-[32px] m-4 font-bold flex items-center p-4 ">
          <Icon src={school_logo} className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] " />
          Nigerian University
        </h1>
      </Link>
    </header>
  )
}