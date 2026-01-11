import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({
        id: '', // Menambahkan id agar tidak undefined
        role_name: '', // Menambahkan role agar tidak undefined
        name: '', // Mengikuti variabel 'name' di form kamu
        email: '', // Tambahkan email di sini
    });

    // Gunakan useEffect untuk mengambil data asli dari backend saat halaman dimuat

    const fetchUserData = async () => {
        
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/users/me', { // Pastikan URL lengkap jika tidak pakai proxy
                headers: { Authorization: `Bearer ${token}` }
            });

            // Cek di console: apakah datanya di response.data atau response.data.user?
            // Jika getMe kamu tadi res.json(results[0]), maka pakai response.data
            setUser(response.data);
            console.log("Data dari server:", response.data)
        } catch (err) {
            console.error("Gagal mengambil data profil", err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchUserData();
    }, []);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    // Di ProfilePage.jsx
    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/users/${user.id}/profile`, {
                name: user.name,
                email: user.email
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Berhasil Update Profil!");
            setIsEditing(false);
            fetchUserData(); // Refresh data setelah simpan
        } catch (err) {
            alert(err.response?.data?.message || "Gagal Update Profil");
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
                    <p>Electronix Management System</p>
                </div>

                {/* Row ID, Role */}
                <div className="input-row" style={{ display: 'flex', gap: '15px' }}>
                    <div className="input-group">
                        <label className="label-style">ID</label>
                        <input className="input-field read-only" value={user.id} readOnly style={{ width: '120px' }} />
                    </div>
                    {/* Cari bagian ini di dalam return */}
                    <div className="input-group">
                        <label className="label-style">Role</label>
                        <input
                            className="input-field read-only"
                            value={user.role_name || ''}
                            readOnly
                            style={{ width: '120px' }}
                        />
                    </div>
                </div>

                {/* Full Name */}
                <div className="input-group">
                    <label className="label-style">Full Name</label>
                    <input
                        name="name"
                        className={`input-field ${!isEditing ? 'read-only' : ''}`}
                        value={user.name}
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
                        required
                        className={`input-field ${!isEditing ? 'read-only' : ''}`}
                        value={user.email}
                        readOnly={!isEditing}
                        onChange={(e) => setUser({...user, email: e.target.value})}
                        placeholder="example@mail.com"
                    />
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