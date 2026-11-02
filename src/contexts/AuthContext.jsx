import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import api from '../lib/api'
import PropTypes from 'prop-types'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem('evaaz-admin-token'))
  const clearSession = useCallback(() => {
    sessionStorage.removeItem('evaaz-admin-token')
    setToken(null)
  }, [])

  useEffect(() => {
    const interceptor = api.interceptors.response.use((response) => response, (error) => {
      if (error.response?.status === 401 && error.config?.headers?.token) clearSession()
      return Promise.reject(error)
    })
    return () => api.interceptors.response.eject(interceptor)
  }, [clearSession])

  async function login(username, password) {
    const { data } = await api.post('/auth/login', { username, password })
    sessionStorage.setItem('evaaz-admin-token', data.results.token)
    setToken(data.results.token)
  }

  async function logout() {
    try {
      await api.post('/auth/logout', {}, { headers: { token } })
    } finally {
      clearSession()
    }
  }

  return <AuthContext.Provider value={{ token, isAuthenticated: Boolean(token), login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}

AuthProvider.propTypes = { children: PropTypes.node.isRequired }
