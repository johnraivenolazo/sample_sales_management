import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { supabase } from './supabaseClient'
import { isGoogleAccount, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut } from './auth'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isGoogleUser, setIsGoogleUser] = useState(false)

  // Check auth state on mount and listen for changes
  useEffect(() => {
    checkAuthState()

    // Listen for auth state changes (e.g., OAuth redirects)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setIsLoggedIn(true)
        const isGoogle = await isGoogleAccount()
        setIsGoogleUser(isGoogle)
      } else {
        setIsLoggedIn(false)
        setIsGoogleUser(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const checkAuthState = async () => {
    const session = await supabase.auth.getSession()
    if (session.data.session) {
      setIsLoggedIn(true)
      const isGoogle = await isGoogleAccount()
      setIsGoogleUser(isGoogle)
    }
  }

  // Email & Password Login
  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await signInWithEmail(email, password)
      setIsLoggedIn(true)
      setEmail('')
      setPassword('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Email & Password Sign Up
  const handleEmailSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await signUpWithEmail(email, password)
      setError('Check your email for confirmation!')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Google OAuth Login
  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')

    try {
      await signInWithGoogle()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Logout
  const handleLogout = async () => {
    setLoading(true)
    try {
      await signOut()
      setIsLoggedIn(false)
      setIsGoogleUser(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="auth-container">
        <h1>Sales Management Login</h1>
        
        <form onSubmit={handleEmailLogin} className="auth-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <button onClick={handleEmailSignUp} className="btn-secondary" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>

        <div className="divider">OR</div>

        <button onClick={handleGoogleLogin} className="btn-google" disabled={loading}>
          {loading ? 'Loading...' : '🔐 Login with Google'}
        </button>

        {error && <p className="error-message">{error}</p>}
      </div>
    )
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <p>{isGoogleUser ? '✓ Logged in with Google' : '✓ Logged in with Email'}</p>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <button onClick={handleLogout} className="btn-logout">
        Logout
      </button>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App