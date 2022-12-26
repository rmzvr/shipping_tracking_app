import { createContext, useEffect, useState } from 'react'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(
    sessionStorage.getItem('jwt_token')
  )

  const [role, setRole] = useState(sessionStorage.getItem('role'))

  useEffect(() => {
    setRole(sessionStorage.getItem('role'))
  }, [role])

  return (
    <AuthContext.Provider value={{ auth, setAuth, role, setRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
