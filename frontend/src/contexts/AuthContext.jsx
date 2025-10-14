// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/axiosConfig'
import { saveAuth, clearAuth, getUser as _getUser } from '../utils/auth'
import toast from 'react-hot-toast'

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(_getUser())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) loadProfile()
  }, [])

  const loadProfile = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/user/profile')
      console.log('Profile data:', data)
      setUser(data.user || data)
      localStorage.setItem('user', JSON.stringify(data.user || data))
    } catch (err) {
      console.error('loadProfile', err)
      clearAuth()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async ({ aadhar, password }) => {
    setLoading(true)
    try {
      const { data } = await api.post('/user/login', {

        addharCardNumber: aadhar,
        password
      })
      const token = data.token
      if (!token) throw new Error('No token in response')
      // saveAuth(token, { addharCardNumber: aadhar })
      saveAuth(token)
      await loadProfile() // 🚀 fetch the full profile immediately
      // setUser({ addharCardNumber: aadhar })
      toast.success('Logged in ✅')

      return true
    } catch (err) {
      console.error(err)
      toast.error(err?.response?.data?.error || 'Login failed')
      return false
    } finally {
      setLoading(false)
    }
  }

  const signup = async ({ aadhar, password, name, age, address, email, phone, dob, photo }) => {
    setLoading(true)
    try {
      const { data } = await api.post('/user/signup', {
        addharCardNumber: aadhar,
        password,
        name,
        age,
        address,
        phone,
        dob,
            profilePhoto: photo,
        isVerified: false,
        // ...(email && { email }),
        email: email?.trim() || null,
      })
      const token = data.token
      const userObj = data.person
      if (token) {
        saveAuth(token, userObj)
        setUser(userObj)
      }
      toast.success('Account created 🎉')
      return true
    } catch (err) {
      console.error(err)
      toast.error(err?.response?.data?.error || 'Signup failed')
      return false
    } finally {
      setLoading(false)
    }
  }


  const logout = () => {
    clearAuth()
    setUser(null)
    toast('Logged out')
  }

  const value = {
    user,
    setUser,
    loading,
    login,
    signup,
    logout,
    refreshProfile: loadProfile,
    isAdmin: () => user?.role === 'admin',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
