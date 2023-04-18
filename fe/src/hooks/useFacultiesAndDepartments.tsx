import { useEffect, useState } from "react"
import { base } from "../App"



export default function useFacultiesAndDepartments(): { faculties: any[], departments: any[], error: string, population: any[], loading: boolean } {
  const [faculties, setFaculties] = useState<any[]>([])
  const [departments, setDepartments] = useState<any>([])
  const [population, setPopulation] = useState<any>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchFaculties = async () => {
    try {
      const res = await fetch(base+'/faculty')
      const data = await res.json()
      if (data.status == 'success') {
        setFaculties(data.data.data)
      } else {
        throw new Error('something went wrong')
      }
    } catch (err: any) {
      setError(err?.message)
    }
  }
  const fetchDepartments = async () => {
    try {
      const res = await fetch(base+'/department')
      const data = await res.json()
      if (data.status == 'success') {
      
        setDepartments(data.data.data)

        setPopulation(data.data.population)

      } else {
        throw new Error('something went wrong')
      }
    } catch (err: any) {
      setError(err?.message)
    }
  }
  const fetchFacultiesAndDepartments = async () => {
    try {
      setLoading(true)
      await fetchFaculties()
      await fetchDepartments()
      setLoading(false)
    } catch (err: any) {
      setError(err?.message)
    }
  }
  useEffect(() => {
    fetchFacultiesAndDepartments()
  }, [])


  

  return { faculties, population, departments, error, loading }
}