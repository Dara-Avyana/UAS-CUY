import React, { useState, useEffect } from 'react'; // Tambah useEffect
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const ChangePassword = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null); // Simpan ID di sini

    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // AMBIL DATA USER SAAT HALAMAN DIBUKA (Sama seperti Profile)
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/users/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserId(response.data.id); // Set ID dari database
            } catch (err) {
                console.error("Gagal verifikasi user", err);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            return alert("Password baru dan konfirmasi tidak cocok!");
        }

        try {
            const token = localStorage.getItem('token');
            // Gunakan userId yang didapat dari fetchUser tadi
            await axios.put(`/api/users/${userId}/password`, {
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Password berhasil diperbarui!");
            alert("Silakan login kembali dengan password baru.");
            localStorage.removeItem('token');
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.message || "Gagal mengubah password");
        }
    };

    if (loading) return <div className="spinner"></div>;

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