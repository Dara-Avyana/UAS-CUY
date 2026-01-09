import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // 1. Pastikan Axios di-import
import '../App.css';

const SignupPage = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        fullName: '',
        age: '',
        email: '',
        keyword: '',
        password: '',
        confirmPassword: ''
    });

    // Fungsi untuk mengupdate state setiap kali input diketik
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // 2. Fungsi handleSignup yang terhubung ke Backend
    const handleSignup = async (e) => {
        e.preventDefault();

        // Validasi: Cek kecocokan password
        if (formData.password !== formData.confirmPassword) {
            alert("Password tidak cocok!");
            return;
        }

        try {
            // Mengirim data ke backend (Stateless)
            // Sesuaikan '/api/register' dengan route di backend kamu
            const response = await axios.post('/api/register', {
                username: formData.username,
                fullName: formData.fullName,
                age: formData.age,
                email: formData.email,
                keyword: formData.keyword,
                password: formData.password
            });

            // Jika berhasil
            alert("Registrasi Berhasil! Silakan Login.");
            navigate('/login');
            
        } catch (err) {
            // Jika gagal (server mati, username duplikat, dll)
            console.error("Signup error:", err);
            const message = err.response?.data?.message || "Koneksi ke server gagal!";
            alert(message);
        }
    };

    return (
        <div className="profile-wrapper">
            <div className="circle-top"></div>
            <div className="circle-bottom"></div>

            <div className="signup-container">
                <div className="signup-header">
                    <h2>Sign Up</h2>
                    <p>Create your Burgerlicious account</p>
                </div>

                <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    
                    {/* Username */}
                    <div className="input-row">
                        <label className="label-side">Username :</label>
                        <div className="input-flex">
                            <input name="username"
                                className="input-field"
                                placeholder="Enter username"
                                onChange={handleChange}
                                value={formData.username}
                                required />
                        </div>
                    </div>

                    {/* Full Name */}
                    <div className="input-row">
                        <label className="label-side">Full Name :</label>
                        <div className="input-flex">
                            <input name="fullName"
                                className="input-field"
                                placeholder="Enter full name"
                                onChange={handleChange}
                                value={formData.fullName}
                                required />
                        </div>
                    </div>

                    {/* Age */}
                    <div className="input-row">
                        <label className="label-side">Age :</label>
                        <div className="input-flex">
                            <input name="age"
                                type="number"
                                className="input-field"
                                placeholder="Enter Age"
                                onChange={handleChange}
                                value={formData.age}
                                required />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="input-row">
                        <label className="label-side">Email :</label>
                        <div className="input-flex">
                            <input name="email"
                                type="email"
                                className="input-field"
                                placeholder="example@mail.com"
                                onChange={handleChange}
                                value={formData.email}
                                required />
                        </div>
                    </div>

                    {/* Keyword */}
                    <div className="input-row">
                        <label className="label-side">Keyword :</label>
                        <div className="input-flex">
                            <input name="keyword"
                                className="input-field"
                                placeholder="Secret Key"
                                onChange={handleChange}
                                value={formData.keyword}
                                required />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="input-row">
                        <label className="label-side">Password :</label>
                        <div className="input-flex" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <input
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                className="input-field"
                                style={{ width: '100%', paddingRight: '45px' }}
                                placeholder="Create password"
                                onChange={handleChange}
                                value={formData.password}
                                required
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)} 
                                className="btn-toggle-eye"
                                style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                {showPassword ? '🤐' : '😎'}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="input-row">
                        <label className="label-side">Confirm :</label>
                        <div className="input-flex">
                            <input
                                name="confirmPassword"
                                type={showPassword ? 'text' : 'password'}
                                className="input-field"
                                placeholder="Repeat password"
                                onChange={handleChange}
                                value={formData.confirmPassword}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-submit-signup">Sign Up</button>
                    
                    <p className="footer-text">
                        Already have an account? <span className="link-pink" style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => navigate('/login')}>Login</span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;