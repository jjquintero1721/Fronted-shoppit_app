
import NavBar from '../components/ui/NavBar'
import Footer from '../components/ui/Footer'
import { ToastContainer} from 'react-toastify'
import { Outlet } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'

const MainLayout = ({numCartItems}) => {
  return (
    <div style={{
      backgroundImage: 'url("/src/assets/Banner.")', 
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed',
      minHeight: '100vh'
    }}>
      <NavBar numCartItems={numCartItems} />
      <ToastContainer />
      <Outlet />
      <Footer />
    </div>
  )
}
export default MainLayout
