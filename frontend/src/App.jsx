import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashScreen from './pages/SplashScreen';
import LoginPage from './pages/Login';
import ProfilePage from './pages/Profile';
import SignupPage from './pages/Signup';
import ProductPage from './pages/Products';
import TransaksiPage from './pages/Transactions';
import UserPage from './pages/User';
import ChangePassword from './pages/ChangePassword';
import axios from 'axios';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/transaksi" element={<TransaksiPage />} />
        <Route path="/pengguna" element={<UserPage />} />
        <Route path="/change-password" element={<ChangePassword />} />
      </Routes>
    </Router>
  );
}

axios.defaults.baseURL = 'http://localhost:5000';

export default App;