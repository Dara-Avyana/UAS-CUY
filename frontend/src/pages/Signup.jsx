import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../App.css';

const SignupPage = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '', email: '', keyword: '', password: '', confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return alert("Password dan Confirm Password tidak cocok!");
        }

        setLoading(true);
        try {
            // Destructuring untuk memisahkan confirmPassword agar tidak ikut terkirim ke backend
            const { confirmPassword, ...payload } = formData;
            const response = await axios.post('/api/auth/register', payload);

            alert("Berhasil: " + response.data.message);
            navigate('/login');
        } catch (error) {
            alert("Gagal: " + (error.response?.data?.message || "Terjadi kesalahan server"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-wrapper">
            <div className="circle-top"></div>
            <div className="circle-bottom"></div>

            <div className="signup-container">
                <div className="signup-header">
                    <h2>Sign Up</h2>
                    <p>Create your SUB-ATOMIC account</p>
                </div>

                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {/* Full Name */}
                    <div className="input-row">
                        <label className="label-side">Full Name :</label>
                        <div className="input-flex">
                            <input name="name" className="input-field" placeholder="Enter full name" onChange={handleChange} value={formData.name} required />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="input-row">
                        <label className="label-side">Email :</label>
                        <div className="input-flex">
                            <input name="email" type="email" className="input-field" placeholder="example@mail.com" onChange={handleChange} value={formData.email} required />
                        </div>
                    </div>

                    {/* Keyword */}
                    <div className="input-row">
                        <label className="label-side">Keyword :</label>
                        <div className="input-flex">
                            <input name="keyword" type="text" className="input-field" placeholder="Enter Secret Keyword" onChange={handleChange} value={formData.keyword} required />
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

                    <button type="submit" className="btn-submit-signup" disabled={loading}>
                        {loading ? "Processing..." : "Sign Up"}
                    </button>

                    <p className="footer-text">
                        Already have an account? <span className="link-pink" style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => navigate('/login')}>Login</span>
                    </p>
                </form>
            </div>
        </div>
    );
};
export default SignupPage;