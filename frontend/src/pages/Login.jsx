import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    // 1. Ganti state username menjadi email
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // 2. Gunakan URL lengkap (127.0.0.1) dan kirim objek email
            const response = await axios.post('/api/auth/login', { 
                email, 
                password 
            });

            // 3. Simpan Token & Role (opsional tapi berguna)
            localStorage.setItem('token', response.data.token);
            
            alert("Login Berhasil! Selamat datang.");
            
            // Pindah ke halaman Products
            navigate('/products');
        } catch (err) {
            if (err.response) {
                // Pesan error dari backend (misal: "User not found")
                alert("Login Gagal: " + (err.response.data.message || "Email atau Password salah!"));
            } else {
                alert("Server tidak merespons. Pastikan Backend & CORS sudah jalan!");
            }
        }
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
                        <label>Email Address</label>
                        <input
                            type="email" // Gunakan type email untuk validasi dasar
                            className="login-input"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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