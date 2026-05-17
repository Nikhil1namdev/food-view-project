import React from 'react'
import './App.css'
import './styles/theme.css'
import AppRoutes from './routes/AppRoutes'
import { AuthProvider } from './context/AuthContext'

// =========================================================================
// ENTRYPOINT COMPONENT (App)
// =========================================================================
// Bootstraps global context configurations (AuthProvider) and kicks off
// the React Router mapping.
function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
