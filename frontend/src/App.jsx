import { Navigate, Route, Routes } from 'react-router-dom'

import Login from './pages/Login'
import Reset from './pages/Reset'
import Registration from './pages/Registration'
import DashboardShipper from './pages/DashboardShipper'
import DashboardDriver from './pages/DashboardDriver'
import Profile from './pages/Profile'
import Layout from './pages/Layout'
import RequireAuth from './components/RequireAuth'
import useAuth from './hooks/useAuth'

export default function App() {
  const { role } = useAuth()

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route path='register' element={<Registration />} />
        <Route path='login' element={<Login />} />
        <Route path='reset' element={<Reset />} />

        <Route element={<RequireAuth allowedRoles={['SHIPPER']} />}>
          <Route
            path='dashboard/shipper'
            element={<DashboardShipper />}
          />
        </Route>

        <Route element={<RequireAuth allowedRoles={['DRIVER']} />}>
          <Route
            path='dashboard/driver'
            element={<DashboardDriver />}
          />
        </Route>

        <Route
          element={
            <RequireAuth allowedRoles={['DRIVER', 'SHIPPER']} />
          }
        >
          <Route
            index
            element={
              <Navigate
                to={
                  role === 'SHIPPER'
                    ? 'dashboard/shipper'
                    : 'dashboard/driver'
                }
                replace
              />
            }
          />
          
          <Route path='profile' element={<Profile />} />

          <Route
            path='*'
            element={
              <Navigate
                to={
                  role === 'SHIPPER'
                    ? 'dashboard/shipper'
                    : 'dashboard/driver'
                }
                replace
              />
            }
          />
        </Route>
      </Route>
    </Routes>
  )
}
