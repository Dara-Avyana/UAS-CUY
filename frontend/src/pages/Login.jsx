import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Menghubungkan ke Backend
            const response = await axios.post('/api/login', { username, password });

            // Menyimpan Token
            localStorage.setItem('token', response.data.token);

            // Pindah ke halaman Products
            navigate('/products');
        } catch (err) {
            if (err.response) {
                alert("Username atau Password salah!");
            } else {
                alert("Server tidak merespons. Pastikan Backend sudah jalan!");
            }
        }
    };

    // Fungsi ini biasanya dipanggil di Sidebar/Header Dashboard, 
    // tapi tetap saya sertakan di sini sesuai kode kamu.
    const handleLogout = () => {
        localStorage.removeItem('token'); 
        navigate('/'); 
    };

    return (
        <div className="splash-wrapper">
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
}; // Tutup fungsi LoginPage di sini

export default LoginPage;