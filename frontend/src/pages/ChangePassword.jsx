import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css'; // Pastikan CSS kamu terload

const ChangePassword = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        // 1. Validasi kecocokan password baru di Frontend
        if (formData.newPassword !== formData.confirmPassword) {
            return alert("Password baru dan konfirmasi tidak cocok!");
        }

        try {
            const token = localStorage.getItem('token');
            // Ambil ID user dari payload token jika perlu, atau gunakan /me di backend
            // Di sini kita asumsikan routemu: PATCH /api/users/password
            await axios.patch('/api/users/password', {
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Password berhasil diubah! Silakan login kembali.");
            localStorage.removeItem('token'); // Logout otomatis demi keamanan
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.message || "Gagal mengubah password");
        }
    };

    return (
        <div className="profile-wrapper">
            <div className="profile-container" style={{ maxWidth: '400px' }}>
                <div className="profile-header">
                    <h2 style={{ color: 'var(--pink-primary)' }}>Change Password</h2>
                    <p>Secure your account</p>
                </div>

                <form onSubmit={handleUpdate}>
                    <div className="input-group">
                        <label className="label-style">Old Password</label>
                        <input
                            type="password"
                            name="oldPassword"
                            className="input-field"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="label-style">New Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            className="input-field"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="label-style">Confirm New Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            className="input-field"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="profile-actions" style={{ marginTop: '20px' }}>
                        <button type="button" className="btn-outline-pink" onClick={() => navigate(-1)}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary-pink">
                            Update Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;