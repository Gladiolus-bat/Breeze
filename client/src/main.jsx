import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { AuthProvider } from './context/AuthContext.jsx'
import { NavProvider } from './context/NavContext.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <NavProvider>
        <App />
      </NavProvider>
    </AuthProvider>
  </StrictMode>,
)
