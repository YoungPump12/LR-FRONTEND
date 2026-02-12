import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

// Use proxy in development, direct URL in production
const API_URL = import.meta.env.DEV 
  ? 'http://localhost:5174/api/register/'
  : 'https://api.tafadzwa.co/api/register/'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await axios.post(API_URL, {
        username,
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      navigate('/login')
    } catch (err) {
      console.log(err.response?.data)
      const errorMessage = err.response?.data?.detail || err.response?.data?.error || "Registration failed"
      setError(typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-shell">
      <div className="floating-blob" style={{ top: "-14%", left: "-8%" }} />
      <div className="floating-blob" style={{ bottom: "-12%", right: "-10%" }} />

      <div className="glass-card" style={{ maxWidth: 480, width: "100%", padding: "2.2rem" }}>
        <div className="pill" style={{ marginBottom: "1rem", width: "fit-content" }}>
          <span>✨</span>
          <span>Create your account</span>
        </div>

        {error && (
          <div style={{ marginBottom: "0.75rem", color: "#fecdd3", background: "rgba(248,113,113,0.14)", border: "1px solid rgba(248,113,113,0.35)", padding: "0.65rem 0.8rem", borderRadius: 12 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
          <input 
            className="field" 
            placeholder="Username" 
            id="register-username" 
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
            disabled={loading}
            required
          />
          <input 
            className="field" 
            placeholder="Email" 
            id="register-email" 
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            disabled={loading}
            required
          />
          <input 
            className="field" 
            type="password" 
            placeholder="Password" 
            id="register-password" 
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            disabled={loading}
            required
          />

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
          <Link to="/login" style={{ textDecoration: "none" }}>
            <button type="button" className="btn-ghost">Already have an account? Login</button>
          </Link>
        </form>
      </div>
    </div>
  )
}
