import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(true);
    const [users, setUsersusers] = useState({
        id: '', // Menambahkan id agar tidak undefined
        role: '', // Menambahkan role agar tidak undefined
        username: '',
        name: '', // Mengikuti variabel 'name' di form kamu
        age: '',
        email: '', // Tambahkan email di sini
        password: ''
    });

    // Gunakan useEffect untuk mengambil data asli dari backend saat halaman dimuat
    useEffect(() => {
        const fetchUserData = async () => {
            // 1. Mulai loading sebelum ambil data
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsersusers(response.data);
            } catch (err) {
                console.error("Gagal mengambil data profil", err);
            } finally {
                // 2. Matikan loading setelah data didapat (baik sukses maupun error)
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const handleChange = (e) => {
        setUsersusers({ ...users, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:5000/api/update-profile', users, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Profile updated successfully!");
            setIsEditing(false);
        } catch (err) {
            alert("Failed to update profile");
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Load profile data...</p>
            </div>
        );
    }

    return (
        <div className="profile-wrapper">
            <div className="circle-top"></div>
            <div className="circle-bottom"></div>

            <div className="profile-container">
                <div className="profile-header">
                    <h2 style={{ color: 'var(--pink-primary)' }}>My Profile</h2>
                    <p>Burgerlicious Management System</p>
                </div>

                {/* Row ID, Role, Age */}
                <div className="input-row" style={{ display: 'flex', gap: '15px' }}>
                    <div className="input-group">
                        <label className="label-style">ID</label>
                        <input className="input-field read-only" value={users.id} readOnly style={{ width: '120px' }} />
                    </div>
                    <div className="input-group">
                        <label className="label-style">Role</label>
                        <input className="input-field read-only" value={users.role} readOnly style={{ width: '120px' }} />
                    </div>
                    <div className="input-group">
                        <label className="label-style">Age</label>
                        <input
                            name="age"
                            type="number" // Ubah dari number ke text
                            className={`input-field ${!isEditing ? 'read-only' : ''}`}
                            // Jika tidak sedang edit, tambahkan kata ' Tahun', jika sedang edit munculkan angka saja
                            value={!isEditing ? `${users.age} Tahun` : users.age}
                            readOnly={!isEditing}
                            onChange={handleChange}
                            style={{ width: '120px' }}
                        />
                    </div>
                </div>

                {/* Username */}
                <div className="input-group">
                    <label className="label-style">Username</label>
                    <input
                        name="username"
                        className={`input-field ${!isEditing ? 'read-only' : ''}`}
                        value={users.username}
                        readOnly={!isEditing}
                        onChange={handleChange}
                    />
                </div>

                {/* Full Name */}
                <div className="input-group">
                    <label className="label-style">Full Name</label>
                    <input
                        name="name"
                        className={`input-field ${!isEditing ? 'read-only' : ''}`}
                        value={users.name}
                        readOnly={!isEditing}
                        onChange={handleChange}
                    />
                </div>

                {/* Email - KOLOM BARU */}
                <div className="input-group">
                    <label className="label-style">Email Address</label>
                    <input
                        name="email"
                        type="email"
                        className={`input-field ${!isEditing ? 'read-only' : ''}`}
                        value={users.email}
                        readOnly={!isEditing}
                        onChange={handleChange}
                        placeholder="example@mail.com"
                    />
                </div>

                {/* Password */}
                <div className="input-group">
                    <label className="label-style">Password</label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <input
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            className={`input-field ${!isEditing ? 'read-only' : ''}`}
                            style={{ width: '100%', paddingRight: '50px' }}
                            value={users.password}
                            readOnly={!isEditing}
                            onChange={handleChange}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="btn-toggle-eye">
                            {showPassword ? '🤐' : '😎'}
                        </button>
                    </div>
                </div>

                {/* Tombol Aksi */}
                <div className="profile-actions">
                    {!isEditing ? (
                        <>
                            <button className="btn-outline-pink" onClick={() => navigate(-1)}>
                                ← Back
                            </button>
                            <button className="btn-primary-pink" onClick={() => setIsEditing(true)}>
                                Edit Profile
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="btn-cancel" onClick={() => setIsEditing(false)}>
                                Cancel
                            </button>
                            <button className="btn-primary-pink" onClick={handleSave}>
                                Save Changes
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;