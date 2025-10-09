

"use client"
import { useState, useEffect } from "react"

export default function HistoryPage() {
  const [summaries, setSummaries] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState("")

  // Fetch summaries when component mounts
  useEffect(() => {
    fetchSummaries()
  }, [])

  const fetchSummaries = async () => {
    try {
      // Make API call to get history
      const response = await fetch('http://127.0.0.1:5000/summarize/history', {
        headers: {
          // Include JWT token for authentication
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })

      const data = await response.json()
      
      if (response.ok) {
        setSummaries(data)
      } else {
        setMessage(data.message || 'Failed to fetch summaries')
      }
    } catch (error) {
      setMessage('Error connecting to server')
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle deleting a summary
  const handleDelete = (id) => {
    // This is where you'll connect to your Python backend to delete the summary
    console.log("Deleting summary with ID:", id)

    // Example of how you would connect to your backend:
    /*
    fetch(`http://localhost:5000/api/summaries/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Remove the deleted summary from state
          setSummaries(summaries.filter(summary => summary.id !== id));
          setMessage('Summary deleted successfully!');
        } else {
          setMessage(data.message || 'Failed to delete summary');
        }
      })
      .catch(error => {
        setMessage('Error connecting to server');
        console.error('Error:', error);
      });
    */

    // For demo purposes, we'll just remove it from the state
    setSummaries(summaries.filter((summary) => summary.id !== id))
    setMessage("Summary deleted successfully!")
  }

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.href = "/login"
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>Summary History</h1>
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

      {isLoading ? (
        <p>Loading summaries...</p>
      ) : summaries.length === 0 ? (
        <p>No summaries found. Go create some!</p>
      ) : (
        <div>
          {summaries.map((summary) => (
            <div
              key={summary.id}
              style={{
                marginBottom: "15px",
                padding: "15px",
                backgroundColor: "#f8f9fa",
                borderRadius: "5px",
                border: "1px solid #dee2e6",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: "0 0 10px 0" }}>{summary.title}</h3>
                <span style={{ color: "#6c757d", fontSize: "0.9em" }}>{summary.date}</span>
              </div>
              <p>{summary.summary}</p>
              <button
                onClick={() => handleDelete(summary.id)}
                style={{
                  backgroundColor: "#dc3545",
                  color: "white",
                  padding: "5px 10px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.9em",
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-around" }}>
        <a href="/login" style={{ textDecoration: "none", color: "#6c757d" }}>
          Go to Login Page
        </a>
        <a href="/summarize" style={{ textDecoration: "none", color: "#6c757d" }}>
          Go to Summarize Page
        </a>
      </div>
    </div>
  )
}

