"use client"
import { useState } from "react"

export default function SummarizePage() {
  // State management
  const [text, setText] = useState("")
  const [summary, setSummary] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // ADDED: Input validation
    if (!text.trim()) {
      setMessage("Please enter some text to summarize")
      return
    }

    setIsLoading(true)
    setSummary("")
    setMessage("")

    try {
      // ADDED: Debug logging
      console.log("Making API call to summarize endpoint")
      console.log("Text being sent:", text)
      
      // ADDED: Token validation
      const token = localStorage.getItem('token')
      if (!token) {
        setMessage('Please login first')
        return
      }

      // MODIFIED: Updated endpoint URL to match backend
      const response = await fetch('http://127.0.0.1:5000/summarize/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      })

      // ADDED: Response logging
      console.log("Response status:", response.status)
      const data = await response.json()
      console.log("Response data:", data)
      
      if (response.ok) {
        setSummary(data.summary)
      } else {
        setMessage(data.message || 'Failed to summarize')
      }
    } catch (error) {
      console.error('Error:', error)
      setMessage('Error connecting to server')
    } finally {
      setIsLoading(false)
    }
  }

  // Function to save summaries
  const handleSave = async () => {
    if (!summary) return

    try {
      const response = await fetch('http://127.0.0.1:5000/summarize/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ 
          originalText: text, 
          summary,
          // Create a title from first line of text
          title: text.split('\n')[0].substring(0, 50)
        }),
      })

      const data = await response.json()
      
      if (response.ok) {
        setMessage('Summary saved successfully!')
      } else {
        setMessage(data.message || 'Failed to save summary')
      }
    } catch (error) {
      setMessage('Error connecting to server')
      console.error('Error:', error)
    }
  }

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.href = "/login"
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>Text Summarizer</h1>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#dc3545",
            color: "white",
            padding: "8px 12px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {message && (
        <div
          style={{
            padding: "10px",
            backgroundColor: message.includes("successfully") ? "#d4edda" : "#f8d7da",
            color: message.includes("successfully") ? "#155724" : "#721c24",
            borderRadius: "5px",
            marginBottom: "15px",
          }}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Enter text to summarize:</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              minHeight: "200px",
            }}
            placeholder="Paste or type your text here..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "10px 15px",
            border: "none",
            borderRadius: "4px",
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          {isLoading ? "Summarizing..." : "Summarize Text"}
        </button>
      </form>

      {summary && (
        <div
          style={{
            marginTop: "30px",
            padding: "15px",
            backgroundColor: "#f8f9fa",
            borderRadius: "5px",
            border: "1px solid #dee2e6",
          }}
        >
          <h2>Summary</h2>
          <p>{summary}</p>
          <button
            onClick={handleSave}
            style={{
              backgroundColor: "#007bff",
              color: "white",
              padding: "8px 12px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Save Summary
          </button>
        </div>
      )}

      <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-around" }}>
        <a href="/login" style={{ textDecoration: "none", color: "#6c757d" }}>
          Go to Login Page
        </a>
        <a href="/history" style={{ textDecoration: "none", color: "#6c757d" }}>
          Go to History Page
        </a>
      </div>
    </div>
  )
}

