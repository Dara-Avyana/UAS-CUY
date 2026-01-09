import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Untuk sementara, kita buat login sederhana
    console.log("Login dengan:", username, password);
    navigate('/profile'); // Jika sukses, pindah ke profile
  };

  return (
    <div className="splash-wrapper"> {/* Pakai wrapper yang sama agar background konsisten */}
      <div className="ball ball-1"></div>
      <div className="ball ball-2"></div>
      <div className="ball ball-3"></div>
      

      <div className="glass-card">
        <div className="profile-header">
          <h2>Login</h2>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              className="login-input" 
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-container">
              <input 
                type={showPassword ? 'text' : 'password'} 
                className="login-input" 
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                className="btn-toggle-eye"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🫣' : '👁️'} 
              </button>
            </div>
          </div>

          <button type="submit" className="btn-submit-login">
            Login
          </button>
        </form>
        
        <p style={{ marginTop: '20px', fontSize: '0.8rem', color: '#6d5656' }}>
          Don't have an account? <span style={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={() => navigate('/signup')}>SignUp</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;