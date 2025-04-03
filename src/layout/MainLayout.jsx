// src/layout/MainLayout.jsx
import NavBar from '../components/ui/NavBar'
import Footer from '../components/ui/Footer'
import ChatBot from '../components/chatbot/ChatBot';
import { ToastContainer } from 'react-toastify'
import { Outlet } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
// Import our dark theme CSS
import '../dark-theme.css'

const MainLayout = ({numCartItems}) => {
  return (
    <div style={{
      backgroundColor: '#121212', // Dark background color
      minHeight: '100vh'
    }}>
      <NavBar numCartItems={numCartItems} />
      <ToastContainer 
        theme="dark" // Make toasts match our dark theme 
      />
      <Outlet />
      <Footer />
      <ChatBot />
    </div>
  )
}

export default MainLayout