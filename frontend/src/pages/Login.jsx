import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('/api/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            
            alert("Login Berhasil!");
            navigate('/products');
        } catch (err) {
            const msg = err.response?.data?.message || "Email atau Password salah!";
            alert("Login Gagal: " + msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="splash-wrapper">
            {/* Elemen Visual (Tetap dipertahankan agar tidak jelek) */}
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
                            type="email"
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
                                {showPassword ? '🫣' : '😎'}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn-submit-login" disabled={loading}>
                        {loading ? "Checking..." : "Login"}
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