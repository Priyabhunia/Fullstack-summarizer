
"use client"
import { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLogin, setIsLogin] = useState(true)
  const [message, setMessage] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // Determine the endpoint based on isLogin state
      const endpoint = isLogin ? '/auth/login' : '/auth/signup'
      
      const response = await fetch(`http://127.0.0.1:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      
      if (response.ok) {
        if (isLogin) {
          // Store token and redirect only for login
          localStorage.setItem('token', data.token)
          setMessage('Login successful! Redirecting...')
          setTimeout(() => {
            window.location.href = '/summarize'
          }, 1500)
        } else {
          // Show success message for signup
          setMessage('Signup successful! Please login.')
          setIsLogin(true) // Switch to login form
        }
      } else {
        setMessage(data.message || (isLogin ? 'Login failed' : 'Signup failed'))
      }
    } catch (error) {
      setMessage('Error connecting to server')
      console.error('Error:', error)
    }
  }

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>

      {message && (
        <div
          style={{
            padding: "10px",
            backgroundColor: message.includes("successful") ? "#d4edda" : "#f8d7da",
            color: message.includes("successful") ? "#155724" : "#721c24",
            borderRadius: "5px",
            marginBottom: "15px",
          }}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
            required
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
            required
          />
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "10px 15px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            width: "100%"
          }}
        >
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>

      <p style={{ marginTop: "15px", textAlign: "center" }}>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          onClick={() => {
            setIsLogin(!isLogin)
            setMessage("") // Clear any existing messages
          }}
          style={{
            background: "none",
            border: "none",
            color: "#007bff",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          {isLogin ? 'Sign Up' : 'Login'}
        </button>
      </p>

      <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-around" }}>
        <a href="/summarize" style={{ textDecoration: "none", color: "#6c757d" }}>
          Go to Summarize Page
        </a>
        <a href="/history" style={{ textDecoration: "none", color: "#6c757d" }}>
          Go to History Page
        </a>
      </div>
    </div>
  )
}


  



