import { supabase } from './supabaseClient'

// Check if user is logged in
export const checkUserLoggedIn = async () => {
  try {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    return data.session
  } catch (err) {
    console.error('Error checking session:', err.message)
    return null
  }
}

// Check if the logged-in account is a Google account
export const isGoogleAccount = async () => {
  try {
    const { data, error } = await supabase.auth.getUser()
    if (error) throw error

    const user = data.user
    if (!user) return false

    // Check if provider is Google by looking at identities array
    const isGoogle = user.identities?.some(identity => identity.provider === 'google') || false
    return isGoogle
  } catch (err) {
    console.error('Error checking provider:', err.message)
    return false
  }
}

// Get current user info
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser()
    if (error) throw error
    return data.user
  } catch (err) {
    console.error('Error fetching user:', err.message)
    return null
  }
}

// Get user provider type
export const getUserProvider = async () => {
  try {
    const user = await getCurrentUser()
    if (!user) return null

    // Check identities array for provider
    const identity = user.identities?.[0]
    const provider = identity?.provider || 'email'
    return provider
  } catch (err) {
    console.error('Error getting provider:', err.message)
    return null
  }
}

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}`,
      },
    })
    if (error) throw error
    return data
  } catch (err) {
    console.error('Error signing in with Google:', err.message)
    throw err
  }
}

// Sign in with Email/Password
export const signInWithEmail = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  } catch (err) {
    console.error('Error signing in with email:', err.message)
    throw err
  }
}

// Sign up with Email/Password
export const signUpWithEmail = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error
    return data
  } catch (err) {
    console.error('Error signing up:', err.message)
    throw err
  }
}

// Sign out
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (err) {
    console.error('Error signing out:', err.message)
    throw err
  }
}

// Listen to auth state changes
export const onAuthStateChange = (callback) => {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session)
  })
  return data
}