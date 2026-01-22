import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'


export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      await axios.post("https://api.tafadzwa.co/api/register/", {
        username,
        email,
        password
      })
      navigate('/login')
    } catch (err) {
  console.log(err.response.data)
  alert(JSON.stringify(err.response.data))
}

  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-6 rounded-xl shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">Register</h2>
        <input className="w-full border p-2 mb-3" placeholder="Username"
          onChange={(e) => setUsername(e.target.value)} />
        <input className="w-full border p-2 mb-3" placeholder="Email"
          onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full border p-2 mb-3" type="password" placeholder="Password"
          onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full bg-green-600 text-white py-2 rounded">Register</button>
        <p className="text-sm mt-3 text-center">
  Already have an account?{" "}
  <Link to="/login" className="text-blue-600">Login</Link>
</p>

      </form>
    </div>
  )
}
