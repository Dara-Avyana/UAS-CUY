import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const UserPage = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [showSettings, setShowSettings] = useState(false);

    const token = localStorage.getItem('token');
    // Ambil data user yang sedang login untuk proteksi
    const currentUser = JSON.parse(localStorage.getItem('user'));

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('/api/User', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Pastikan handle jika backend mengirim objek pagination atau array langsung
            const data = response.data.data || response.data;
            setEmployees(data);
            setLoading(false);
        } catch (error) {
            console.error("Gagal mengambil data User:", error);
            setLoading(false);
            if (error.response?.status === 401) navigate('/');
        }
    };

    useEffect(() => {
        // Proteksi Halaman: Hanya Admin yang boleh masuk ke menu Pegawai
        if (currentUser?.role !== 'admin') {
            alert("Akses Ditolak! Hanya Admin yang bisa melihat data pegawai.");
            navigate('/products');
            return;
        }
        fetchEmployees();
    }, []);

    const getRoleName = (roleId) => {
        const roles = { 1: 'Admin', 2: 'Staff' };
        return roles[roleId] || 'Unknown';
    };

    const handleDelete = async (id) => {
        if (id === currentUser.id) return alert("Anda tidak bisa menghapus akun sendiri!");
        
        if (window.confirm("Yakin ingin menghapus pengguna ini? 🗑️")) {
            try {
                await axios.delete(`/api/User/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchEmployees();
            } catch (error) {
                alert("Gagal menghapus user.");
            }
        }
    };

    // LOGIKA FILTER & SORT
    const filteredEmployees = employees
        .filter(user => 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'id') return a.id - b.id;
            return 0;
        });

    return (
        <div className="dashboard-wrapper">
            {/* SIDEBAR */}
            <div className="sidebar">
                <div className="sidebar-logo">BURGERLICIOUS</div>
                <div className="sidebar-menu">
                    <div className="menu-item" onClick={() => navigate('/products')}>Products</div>
                    <div className="menu-item" onClick={() => navigate('/transaksi')}>Transactions</div>
                    <div className="menu-item active">Employees</div>
                </div>
            </div>

            <div className="main-content">
                <div className="top-header">
                    <span className="header-icon" onClick={() => navigate('/profile')}>👤 {currentUser?.username}</span>
                    <div className="settings-container">
                        <span className="header-icon" onClick={() => setShowSettings(!showSettings)}>⚙️</span>
                        {showSettings && (
                            <div className="dropdown-menu">
                                <div className="dropdown-item" onClick={() => {localStorage.clear(); navigate('/')}}>Logout</div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="toolbar">
                    <input
                        type="text"
                        className="search-bar"
                        placeholder="Search by name or email..."
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="filter-group">
                        <select className="btn-filter" onChange={(e) => setSortBy(e.target.value)}>
                            <option value="name">Sort by Name</option>
                            <option value="id">Sort by ID</option>
                        </select>
                        {/* Tombol Add User biasanya mengarah ke form registrasi baru */}
                        <button className="btn-add" onClick={() => navigate('/register')}>+ Add User</button>
                    </div>
                </div>

                <div className="table-container">
                    {loading ? (
                        <div className="loading-container"><div className="spinner"></div></div>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Password</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEmployees.length > 0 ? (
                                    filteredEmployees.map((u) => (
                                        <tr key={u.id}>
                                            <td>#{u.id}</td>
                                            <td>{u.name} {u.id === currentUser.id && <strong>(You)</strong>}</td>
                                            <td>{u.email || '-'}</td>
                                            <td>
                                                <span className={`badge ${u.role_id === 1 ? 'type-in' : 'type-out'}`}>
                                                    {getRoleName(u.role_id)}
                                                </span>
                                            </td>
                                            <td><span className="password-placeholder">••••••••</span></td>
                                            <td>
                                                {/* Hanya tampilkan tombol delete jika bukan akun sendiri */}
                                                {u.id !== currentUser.id && (
                                                    <button className="btn-delete" onClick={() => handleDelete(u.id)}>Delete</button>
                                                )}
                                                {u.id === currentUser.id && <span className="text-muted">Current Account</span>}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="6" style={{textAlign:'center'}}>No employees found</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserPage;