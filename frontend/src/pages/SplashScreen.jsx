import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const SplashScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="splash-wrapper">
      {/* Elemen Dekorasi Bola */}
      <div className="ball ball-1"></div>
      <div className="ball ball-2"></div>
      <div className="ball ball-3"></div>

      {/* Card Utama */}
      <div className="glass-card">
        <h1 className="welcome-text">Welcome</h1>
        
        <div className="button-container">
          <button 
            className="btn-splash btn-login" 
            onClick={() => navigate('/login')}
          >
            Login
          </button>
          
          <button 
            className="btn-splash btn-signup" 
            onClick={() => navigate('/signup')}
          >
            SignUp
          </button>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;