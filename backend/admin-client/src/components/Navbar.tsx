import { Link } from "react-router-dom"
import { useAuth } from '../context/AuthProvider'

function Navbar() {
  const auth = useAuth()

  return (
    <div className="py-2 px-4 bg-gray-800 text-white flex h-12 justify-between items-center">
        <div className="text-2xl font-bold">
          <Link to="/admin">
            Statico - Admin
          </Link>
        </div>

        <div className="">
          {auth.authToken ?
          <button onClick={() => auth.handleLogout()} className="">Logout</button>
          :
          <Link to="/admin/login">
            Login
          </Link>

          }
        </div>
    </div>
  )
}

export default Navbar