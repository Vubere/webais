import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { base, UserContext } from "../../../App"


/* constants */
import * as routes from '../../../constants/routes'

export default function ViewAdmin() {
  const [search, setSearch] = useState<string>('')
  const [admins, setAdmins] = useState<any>(null)

  const { user } = useContext(UserContext)

  async function fetchAdmins() {
    try {
      let url = base+'/admins'

      const res = await fetch(url);
      const data = await res.json()

      setAdmins(data[0])

    } catch (err) {
    }
  }
  useEffect(() => {
    fetchAdmins();
  }, [])

  const onSubmit = (e: any) => {
    e.preventDefault()
  }

  const fullName = (admin: User) => {
    if (admin.firstName && admin.lastName) {
      return admin.firstName + ' ' + admin.lastName
    } else if (admin.firstName) {
      return admin.firstName
    } else if (admin.lastName) {
      return admin.lastName
    } else {
      return 'No name'
    }
  }
  const filteredAdmins = admins?.filter((admin: User) => admin.id !== user?.id && (fullName(admin).toLowerCase().includes(search.toLowerCase()) || admin.email.toLowerCase().includes(search.toLowerCase()) || admin.id.toLowerCase().includes(search.toLowerCase())))



  return (
    <div className="w-full p-4">
      <h2 className="font-[700] text-[22px] align-center w-full pb-3">Administrators</h2>
      <form onSubmit={onSubmit} className='w-[50%] m-2'>
        <div className="flex flex-col">
          <label htmlFor="search"></label>
          <input type="text" name="search" id="id" className="border border-[#0006] p-2 rounded-[5px]" value={search} onChange={(e) => setSearch(e.target.value)} />

        </div>
        <div className="flex justify-end pt-5">
          <button type="submit" className="border text-[#fff] bg-[#346837] px-3 py-1 rounded-[5px]" >Filter</button>
        </div>
      </form>

      {filteredAdmins?.length ?
        (
          <>
            <table className="shadow-lg bg-white border-separate max-w-[100vw] overflow-auto ">
              <thead>
                <tr >
                  <th className="bg-[#34783644]  border text-left px-4 py-2">id</th>
                  <th className="bg-[#34783644] border text-left px-4 py-2">Name</th>
                  <th className="bg-[#34783644] border text-left px-4 py-2">Phone</th>
                  <th className="bg-[#34783644] border text-left px-4 py-2">Email</th>

                  <th className="bg-[#34783644] border text-left px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>

                {filteredAdmins.map((admin: User) => (
                  <tr key={admin.id}>
                    <td className="border px-4 py-2">{admin.id}</td>
                    <td className="border px-4 py-2">{admin.firstName} {admin.lastName}</td>
                    <td className="border px-4 py-2">{admin.phone}</td>
                    <td className="border px-4 py-2">{admin.email}</td>
                    <td className="border px-4 py-2">
                      <Link to={`/dashboard-admin/${routes.update_admin}/${admin.id}`} className="border text-[#fff] bg-[#346837] px-3 py-1 rounded-[5px]">Edit</Link>
                    </td>
                  </tr>

                ))}
              </tbody>

            </table>
          </>
        ) : <p className="text-center text-[18px]">No Admins Found</p>}
    </div>

  )
}

export interface User {
  id: string,
  email: string,
  firstName: string,
  lastName: string,
  otherNames: string,
  phone: string,
  password: string,
  createdAt: string,
  dob: string,
  gender: string
}
