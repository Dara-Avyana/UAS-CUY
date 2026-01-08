import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './AuthPage';
import ProfilePage from './Profile';

function App() {
  return (
    <Router>
      <Routes>
        {/* Halaman Pertama (Home) adalah Auth */}
        <Route path="/" element={<AuthPage />} />
        
        {/* Halaman Profile */}
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;