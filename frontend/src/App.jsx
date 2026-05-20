import React from 'react'
import './App.css'
import './styles/theme.css'
import AppRoutes from './routes/AppRoutes'
import { AuthProvider } from './context/AuthContext'
import { useTheme } from './hooks/useTheme'

import { Toaster } from 'react-hot-toast'

// =========================================================================
// ENTRYPOINT COMPONENT (App)
// =========================================================================
// Bootstraps global context configurations (AuthProvider) and kicks off
// the React Router mapping.
function App() {
  useTheme(); // Initialize and apply the theme on app load

  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#18181b',
            color: '#f4f4f5',
            border: '1px solid #27272a',
            fontSize: '12px',
            fontWeight: '600',
            borderRadius: '12px',
            fontFamily: 'Sora, sans-serif'
          },
          success: {
            iconTheme: {
              primary: '#f97316',
              secondary: '#18181b',
            },
          },
        }}
      />
    </AuthProvider>
  )
}

export default App
