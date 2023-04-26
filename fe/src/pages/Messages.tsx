import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { base, UserContext } from "../App";


export default function Messages() {
  const [messages, setMessages] = useState<messageArr[]>([])
  const { user } = useContext(UserContext)
  const chat_url = useRef<string>('')
 


  useEffect(() => {
    console.log(user)
    if (user) {
      if(user?.length){
        chat_url.current = user[0].id[0].toLowerCase()=='s'?'/dashboard-student':'/dashboard-lecturer'
      }else{
        chat_url.current = user?.id&&user?.id[0].toLowerCase()=='s'?'/dashboard-student':'/dashboard-lecturer'
      }
      fetch(base+'/retrieve_messages?user_id=' + user.id)
        .then(res => res.json())
        .then(result => {
         
          if (result.ok) {
            setMessages(result?.chats)
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }, [user])

  let type = ''
  if (user?.length) {
    type = user[0].id[0].toLowerCase() == 'l' ? 'student' : 'lecturer'
  } else {
    type = user?.id && user?.id[0].toLowerCase() == 'l' ? 'student' : 'lecturer'
  }
  return (
    <section className="w-full h-[90vh] overflow-y-auto flex flex-col p-4 items-center">
      <h2 className="font-[600] text-[22px] text-[#346837]">Messages</h2>
      <div className="w-full max-w-[500px]">
        {messages.length==0&&<p> You have not sent messages to anyone... <span>You can send messages to a listed {type} associated with a course.</span></p>}
        {messages.map((message, index) => (
          <Link to={chat_url.current+'/chat/' + message.user_id} key={index} className='border p-2 block'>
            <h3 className="font-bold text-[#347837]">{message.full_name}</h3>
            <p className="text-[14px] flex justify-between"><span className="w-[60%] overflow-hidden truncate text-ellipsis ">{message.message}</span><span>{message.time_sent}</span></p>
          </Link>)
        )}
      </div>
    </section>
  )
}

interface message_display {
  full_name: string,
  chat_id: number,
  message: string,
  image: string | null,
  time_sent: string,
  user_id: number,
  contact_id: number,
}
interface student {
  department: number,
}
interface lecturer {
  discipline: string,
  degreeAcquired: string,
}

type messageArr = message_display & (student | lecturer)
