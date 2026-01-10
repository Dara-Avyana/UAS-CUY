import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // 1. Pastikan Axios di-import
import '../App.css';

const SignupPage = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        keyword: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        // Validasi tambahan di Frontend
        if (formData.password !== formData.confirmPassword) {
            return alert("Password dan Confirm Password tidak cocok!");
        }

        try {
            console.log("Mengirim data...", formData);
            const response = await axios.post('/api/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                keyword: formData.keyword // Pastikan backend menerima field ini
            });

            alert("Berhasil: " + response.data.message);
            navigate('/login');
        } catch (error) {
            // Cek apakah ada pesan error spesifik dari backend
            const errorMsg = error.response?.data?.message || "Terjadi kesalahan pada server";
            alert("Gagal: " + errorMsg);
            console.error("Detail Error:", error);
        }
    };

    // RETURN INI HARUS DI LUAR handleRegister
    return (
        <div className="profile-wrapper">
            <div className="circle-top"></div>
            <div className="circle-bottom"></div>

            <div className="signup-container">
                <div className="signup-header">
                    <h2>Sign Up</h2>
                    <p>Create your Burgerlicious account</p>
                </div>

                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                    {/* Full Name */}
                    <div className="input-row">
                        <label className="label-side">Full Name :</label>
                        <div className="input-flex">
                            <input name="name"
                                className="input-field"
                                placeholder="Enter full name"
                                onChange={handleChange}
                                value={formData.name}
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
                            <input
                                name="keyword"
                                type="text"
                                placeholder="Enter Secret Keyword"
                                value={formData.keyword}
                                onChange={handleChange}
                                className="input-field"
                            />
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