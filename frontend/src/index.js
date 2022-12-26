import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SnackbarProvider } from 'notistack'
import { AuthProvider } from './context/AuthProvider'
import { AvatarProvider } from './context/AvatarProvider'

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <SnackbarProvider
    maxSnack={3}
    autoHideDuration={2000}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left'
    }}
  >
    <BrowserRouter>
      <AuthProvider>
        <AvatarProvider>
          <Routes>
            <Route path='/*' element={<App />} />
          </Routes>
        </AvatarProvider>
      </AuthProvider>
    </BrowserRouter>
  </SnackbarProvider>
)
