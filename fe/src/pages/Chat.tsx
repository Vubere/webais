import { useContext, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { base, UserContext } from "../App"

import image_icon from '../assets/image.png'
import Icon from "../components/Icon"

export default function Message() {
  const { id } = useParams<{ id: string }>()

  const [messages, setMessages] = useState<messages[]>([])
  const [errors, setErrors] = useState('')
  const [message, setMessage] = useState('')
  const [image, setImage] = useState<File>()
  const { user } = useContext(UserContext)
  const imgRef = useRef<HTMLInputElement>(null)
  const [limit, setLimit] = useState(20)

  const lastIdRef = useRef<{
    lastMessage: number | undefined
    seen: number | undefined
  }>()
  const lastMessageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchMessages()
    const name = setInterval(() => {
      fetchMessages()
    }, 1000)
    return () => clearInterval(name)
  }, [id, user])
  useEffect(() => {
    console.log(lastMessageRef.current)
    if (lastMessageRef.current)
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [lastMessageRef.current])

  const fetchMessages = async () => {
    if (id && user) {
      try {

        const req = await fetch(base+'/messages?user_id=' + user.id + '&receiver_id=' + id +'&limit='+limit)
        const res = await req.json()
        if (res.ok) {
          const m = res.messages.length
          const lastMessage = res.messages[m - 1]
          
          if (lastMessage?.id == lastIdRef.current?.lastMessage&&lastMessage?.seen==lastIdRef.current?.seen)
          return
          console.log('here')
          setMessages(res.messages)
          lastIdRef.current = {
            lastMessage: lastMessage?.id,
            seen: lastMessage?.seen
          }
        }
      } catch (err) {
        console.log(err)
      }

    }
  }
 

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    send_message()
  }
  const handle_file = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      /* check if file is an image */
      if (e.target.files[0].type.includes('image')) {

        setImage(e.target.files[0])


      } else {
        alert('File is not an image')
        /* empty file input element */
        if (imgRef.current)
          imgRef.current.files = null
      }
    }
  }
  /*send message */
  const send_message = () => {
    if ((message || image) && id && user) {
      const data = new FormData()
      console.log(user.id, id)
      data.append('message', message)
      data.append('user_id', user.id)
      data.append('user_type', user.id[0]?.toLowerCase() == 's' ? 'students' : user.id[0]?.toLowerCase() == 'l' ? 'lecturers' : 'administrators')

      data.append('receiver_type', id[0]?.toLowerCase() == 's' ? 'students' : id[0]?.toLowerCase() == 'l' ? 'lecturers' : 'administrators')
      data.append('receiver_id', id)
      data.append('method', 'POST')

      if (image)
        data.append('image', image)
        
      fetch(base+'/send_message', {
        method: 'POST',
        body: data
      })
        .then(res => res.json())
        .then(result => {
          console.log(result)
          if (result?.ok == 1) {
            setMessage('')
            setImage(undefined)
            if (imgRef.current)
              imgRef.current.files = null
          }
        })
    }
  }





  return (
    <section className="overflow-y-auto h-[90vh] pb-[30px]">
      <h3 className="font-[600] text-[#347836] text-[28px] text-center leading-[40px] p-3">Message</h3>
      <p className="max-w-[500px] mx-auto">{id?.toLowerCase().includes('lect')&&'Be respectful in your messages to Lecturers, as irresponsible text messages can attract penalties'}</p>
      <div className="w-full border border-[#346837] max-w-[500px] mx-auto h-[80vh] overflow-y-auto relative max-h-[500px]">
        <div className="flex flex-col items-end h-[90%] overflow-y-auto">
          
          {messages.length?messages.map((message, i) => <ChatMessage key={message.id} message={message} lastMessageRef={lastMessageRef} l={messages.length} i={i} user={user} />
          ):<p className="w-full p-4">Send a message to start conversation...</p>}
        </div>
        <form onSubmit={onSubmit} className="mx-auto fixed stbt:absolute bottom-0 left-0 w-full border border-[#346837] h-[40px]">
          <div className="flex w-full relative">
            {/* image preview */}
            {image && <div className="w-[65px] h-[100px] absolute bottom-[40px] left-[15px]">
              <div >

                <img src={URL.createObjectURL(image)} className="w-[65px] h-[100px] object-cover" />
                <button className="absolute top-0 right-0 bg-[#347836] text-white p-1 rounded-full" onClick={() => setImage(undefined)}>x</button>
              </div>
            </div>}
            {/* image input */}
            <label htmlFor="image" className="h-[40px] flex items-center align-center w-[40px]">
              <input type="file" ref={imgRef} id='image' className="hidden" onChange={handle_file} />
              <Icon src={image_icon} className='w-[28px] h-[28px] z-20' />
            </label>
            <textarea value={message} onChange={({ target }) => setMessage(target.value)} className=" p-2 flex items-center resize-none h-[40px] leading-[18px] w-[90%] focus:outline-none" placeholder="Type your message..." />
            <button className="bg-[#347836] text-white p-2 w-[20%] min-w-[30px]">Send</button>
          </div>
        </form>
      </div>
    </section>
  )
}


function ChatMessage({ message,l, i, lastMessageRef, user }: { message: messages, i: number, lastMessageRef: any, user: any, l:number }) {
  const [show, setShow] = useState(false)
  
  const lastMessage = l - 1 == i

  const ref = useRef<any>()
  useEffect(()=>{
    if(lastMessage){
      ref.current.scrollIntoView({behavior:'smooth'})
    }
  },[ref.current])
  return (
    <div className={`w-[100%] p-2 flex flex-col ${message.user_id == user?.id ? 'items-end' : 'items-start'}`} >
      {/* sender_id */}
      <div className="text-[#347836] text-[12px]">{message.full_name}</div>
      <div className={`flex flex-col gap-1`} >
        <div>
          {show && message.image && <ImagePopup image={message.image} close={setShow} />}
          {message.image &&
            <img src={message.image} className="w-[100px] h-[140px] object-cover mt-2 rounded-lg" onClick={() => setShow(true)} />}
          <div className={`${message.user_id == user?.id ? 'bg-[#347836] text-white' : 'bg-white border border-[#346837] text-[#346837]'}  p-2 rounded-lg`} ref={lastMessage ? ref : null}>
            {message.message}
          </div>
        </div>
        <div className="text-[#347836] text-[12px] ml-2">{message.time_sent}</div>
      </div>
      {/* check if seen if message is sent by user*/}
      {message.user_id == user?.id && <div className="text-[#347836] text-[12px]">{message.seen ? 'seen' : 'delivered'}</div>}
    </div>
  )

}

/* image popup */
export const ImagePopup = ({ image, close }: { image: string, close: any }) => {
  return (
    <div className="fixed top-[70px] left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center ">
      <div className="w-full stbt:w-[70%] h-[100%] bg-white flex flex-col items-center justify-center relative overflow-auto">
        <button className="absolute w-[30px] h-[30px] top-[4px] right-[4px] bg-[#347836] text-white p-1 rounded-full flex items-center justify-center" onClick={() => close(false)}>x</button>
        <img src={image} className='object-contain w-auto h-auto contain' />
      </div>
    </div>
  )
}

export interface messages {
  id: number,
  full_name: string,
  chat_id: number,
  message: string,
  time_sent: string,
  user_id: string,
  image: string | null,
  seen: boolean | 1 | 0
}