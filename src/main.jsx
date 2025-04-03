// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.css'
// Import our dark theme css (can be imported here or in MainLayout.jsx)
import './dark-theme.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)