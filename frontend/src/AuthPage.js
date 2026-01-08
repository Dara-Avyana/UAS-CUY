import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
    const navigate = useNavigate();
  // Mode: 'welcome', 'login', atau 'signup'
  const [mode, setMode] = useState('welcome');

  // --- Style Utama ---
  const wrapperStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#FFF5F7',
    position: 'relative',
    fontFamily: "'Poppins', sans-serif",
    overflow: 'hidden'
  };

  const cardStyle = {
    width: '90%',
    maxWidth: '400px',
    padding: '40px',
    backgroundColor: '#FFFFFF',
    borderRadius: '30px',
    boxShadow: '0 15px 35px rgba(181, 71, 88, 0.3)',
    textAlign: 'center',
    zIndex: 1
  };

  const buttonPrimary = {
    width: '100%',
    padding: '15px',
    borderRadius: '15px',
    border: 'none',
    backgroundColor: '#FF4D6D',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
    marginBottom: '10px'
  };

  const buttonSecondary = {
    ...buttonPrimary,
    backgroundColor: '#FFF',
    color: '#FF4D6D',
    border: '2px solid #FF4D6D'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '12px',
    border: '1px solid #DDD',
    marginBottom: '15px',
    boxSizing: 'border-box'
  };

  // --- RENDER LOGIC ---

  // 1. Tampilan AWAL (Splash/Welcome)
  if (mode === 'welcome') {
    return (
      <div style={wrapperStyle}>
        <div style={cardStyle}>
          <h1 style={{ color: '#FF4D6D' }}> WELCOME !</h1>
          <p style={{ color: '#888', marginBottom: '30px' }}>Management System</p>
          <button style={buttonPrimary} onClick={() => setMode('login')}>Login</button>
          <button style={buttonSecondary} onClick={() => setMode('signup')}>Sign Up</button>
        </div>
      </div>
    );
  }

  // 2. Tampilan LOGIN
  if (mode === 'login') {
    return (
      <div style={wrapperStyle}>
        <div style={cardStyle}>
          <h2 style={{ color: '#5D4037' }}>Welcome Back!</h2>
          <input style={inputStyle} type="text" placeholder="Username" />
          <input style={inputStyle} type="password" placeholder="Password" />
          <button style={buttonPrimary} onClick={() => navigate('/profile')}>Sign In</button>
          <p onClick={() => setMode('welcome')} style={{ cursor: 'pointer', color: '#888', fontSize: '12px' }}>← Back</p>
        </div>
      </div>
    );
  }

  // 3. Tampilan SIGN UP
  if (mode === 'signup') {
    return (
      <div style={wrapperStyle}>
        <div style={cardStyle}>
          <h2 style={{ color: '#5D4037' }}>Create Account</h2>
          <input style={inputStyle} type="text" placeholder="Full Name" />
          <input style={inputStyle} type="email" placeholder="Email" />
          <input style={inputStyle} type="password" placeholder="Password" />
          <input style={inputStyle} type="text" placeholder="Admin Key (Optional)" />
          <button style={buttonPrimary}>Register</button>
          <p onClick={() => setMode('welcome')} style={{ cursor: 'pointer', color: '#888', fontSize: '12px' }}>← Back</p>
        </div>
      </div>
    );
  }
};

export default AuthPage;