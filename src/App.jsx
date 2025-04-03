import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import HomePage from "./components/home/HomePage";
import NotFoundPage from "./components/ui/NotFoundPage";
import UnauthorizedPage from "./components/ui/UnauthorizedPage";
import ProductPage from "./components/product/ProductPage";
import CartPage from "./components/cart/CartPage";
import CheckoutPage from './components/checkout/CheckoutPage';
import LoginPage from './components/user/LoginPage';
import api from './api';
import ProtectedRoute from './components/ui/ProtectedRoute';
import RoleProtectedRoute from './components/ui/RoleProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import UserProfilePage from './components/user/UserProfilePage';
import PaymentStatusPage from './components/payment/PaymentStatusPage';
import RegisterPage from './components/user/RegisterPage';
import ContactPage from './components/contact/ContactPage';
import SearchResults from './components/search/SearchResults';
import VendorDashboard from './components/vendor/VendorDashboard';
import AdminDashboard from './components/admin/AdminDashboard';

const App = () => {
  const [numCartItems, setNumberCartItems] = useState(0);
  const [chatbotAvailable, setChatbotAvailable] = useState(false);
  const cart_code = localStorage.getItem("cart_code");

  useEffect(function(){
    if(cart_code){
      api.get(`get_cart_stat?cart_code=${cart_code}`)
      .then(res => {
        console.log(res.data)
        setNumberCartItems(res.data.num_of_items)
      })
      .catch(err => {
        console.log(err.message)
      })
    }
  }, []);

  // Verificar si el servidor del chatbot está disponible
  useEffect(() => {
    const checkChatbotServer = async () => {
      try {
        const isAvailable = await checkServerStatus();
        setChatbotAvailable(isAvailable);
      } catch (error) {
        console.error('Error al verificar el servidor del chatbot:', error);
        setChatbotAvailable(false);
      }
    };

    checkChatbotServer();
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout numCartItems={numCartItems} />}>
            <Route index element={<HomePage />} />
            <Route path="products/:slug" element={<ProductPage setNumberCartItems={setNumberCartItems}/>} />
            <Route path="cart" element={<CartPage setNumberCartItems={setNumberCartItems} />} />
            <Route path="checkout" element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="profile" element={<UserProfilePage />} />
            <Route path="contacto" element={<ContactPage />} />
            <Route path="search" element={<SearchResults />} /> 
            <Route path="payment-status" element={<PaymentStatusPage setNumberCartItems={setNumberCartItems} />} />
            <Route path="unauthorized" element={<UnauthorizedPage />} />
            
            {/* Rutas para vendedores */}
            <Route path="vendor/dashboard" element={
              <RoleProtectedRoute allowedRoles={['vendor', 'admin']}>
                <VendorDashboard />
              </RoleProtectedRoute>
            } />
            
            {/* Rutas para administradores */}
            <Route path="admin/dashboard" element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </RoleProtectedRoute>
            } />
            
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes> 
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App