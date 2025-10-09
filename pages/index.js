"use client"

// pages/index.js
// This is the home page that redirects to the login page
import { useEffect } from "react"

export default function HomePage() {
  useEffect(() => {
    // Redirect to login page
    window.location.href = "/login"
  }, [])

  return <div>Redirecting to login page...</div>
}

