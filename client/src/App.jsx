import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;

// Interceptor to handle token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 && 
      !originalRequest._retry && 
      !originalRequest.url.includes('/api/auth/refresh')
    ) {
      originalRequest._retry = true;
      try {
        const res = await axios.post('http://localhost:5000/api/auth/refresh');
        const token = res.data.token;
        localStorage.setItem('Token', token);
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        return axios(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('Token');
        localStorage.removeItem('User');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
import Home from "./pages/public/Home";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Buyer from "./pages/buyer/Buyer";
import Seller from "./pages/seller/Seller";
import Chat from "./layouts/Chats";
import RazorPay from "./layouts/Razopay";

const App = () => {
  return (
    <div>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/buyer/*" element={
          <ProtectedRoutes>
            <Buyer />
          </ProtectedRoutes>
        } />
        <Route path="/seller/*" element={
          <ProtectedRoutes>
            <Seller />
          </ProtectedRoutes>
        } />
        <Route path="/chat/:id" element={
          <ProtectedRoutes>
            <Chat />
          </ProtectedRoutes>
        } />
        <Route path="/razorpay/:id" element={
          <ProtectedRoutes>
            <RazorPay />
          </ProtectedRoutes>
        } />

      </Routes>
    </div>
  );
};

export default App;