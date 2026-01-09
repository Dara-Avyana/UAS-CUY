import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const UserPage = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fungsi mapping jika Backend hanya mengirim ID (1 = Admin, 2 = Staff)
  const getRoleName = (roleId) => {
    const roles = {
      1: 'Admin',
      2: 'Staff'
    };
    return roles[roleId] || 'Unknown';
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('/api/User');
      setEmployees(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Gagal mengambil data User:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleLogout = () => {
    localStorage.removeTransactions('token');
    navigate('/');
  };

  return (
    <div className="dashboard-wrapper">
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="sidebar-logo">BURGERLICIOUS</div>
        <div className="sidebar-menu">
          <div className="menu-item" onClick={() => navigate('/products')}>Products</div>
          <div className="menu-item" onClick={() => navigate('/transaksi')}>Transactions</div>
          <div className="menu-item active" onClick={() => navigate('/pegawai')}>Employees</div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">
        <div className="top-header">
          <span className="header-icon" title="Profile" onClick={() => navigate('/profile')}>👤</span>
          <span className="header-icon" title="Settings">⚙️</span>
        </div>

        {/* TOOLBAR */}
        <div className="toolbar">
          <input
            type="text"
            className="search-bar"
            placeholder="Search ID/Name/Email/Role..."
          />
          <div className="filter-group">
            <button className="btn-filter">🔍 Filter</button>
            <button className="btn-filter">↕️ Sort By</button>
            <button className="btn-filter" style={{ backgroundColor: '#FF4D6D', color: 'white', border: 'none' }}>+ Add User</button>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="table-container">
          {loading ? (
            <div className="loading-container" style={{ height: '300px' }}>
              {/* Pakai class spinner kamu di sini */}
              <div className="spinner"></div>
              <p>Load users data...</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Password</th>
                </tr>
              </thead>
              <tbody>
                {employees.length > 0 ? (
                  employees.map((users) => (
                    <tr key={users.id}>
                      <td>#{users.id}</td>
                      <td>{users.name}</td>
                      <td>********</td> {/* Keamanan: Jangan tampilkan password asli */}
                      <td>
                        <span className={`role-badge ${users.role_id === 1 ? 'admin' : 'staff'}`}>
                          {getRoleName(users.role_id)}
                        </span>
                      </td>
                      <td>
                        <button className="btn-edit">Edit</button>
                        <button className="btn-delete" style={{ marginLeft: '5px' }}>Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>Empty users data</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="pagination-container">
          <button className="btn-page">Prev</button>
          <button className="btn-page active">1</button>
          <button className="btn-page">Next</button>
        </div>
      </div>
    </div>
  );
};

export default UserPage;