import { useState, useEffect } from 'react'


export default function useInnerWidth(){
  const [innerWidth, setInnerWidth] = useState(window.innerWidth)
  const handleResize = () => {
    setInnerWidth(window.innerWidth)
  }
  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  return innerWidth
}