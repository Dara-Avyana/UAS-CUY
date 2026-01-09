import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const PegawaiPage = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
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
      const response = await axios.get('/api/pegawai'); 
      setEmployees(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Gagal mengambil data pegawai:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="dashboard-wrapper">
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="sidebar-logo">BURGERLICIOUS</div>
        <div className="sidebar-menu">
          <div className="menu-item" onClick={() => navigate('/products')}>Products</div>
          <div className="menu-item" onClick={() => navigate('/transaksi')}>Transaksi</div>
          <div className="menu-item active">Pegawai</div>
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
            placeholder="Cari nama pegawai..." 
          />
          <div className="filter-group">
            <button className="btn-filter">🔍 Filter</button>
            <button className="btn-filter">↕️ Sort By</button>
            <button className="btn-filter" style={{backgroundColor: '#FF4D6D', color: 'white', border: 'none'}}>+ Add Pegawai</button>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="table-container">
          {loading ? (
            <p style={{ textAlign: 'center', padding: '20px' }}>Loading data pegawai...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Password</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {employees.length > 0 ? (
                  employees.map((item) => (
                    <tr key={item.id}>
                      <td>#{item.id}</td>
                      <td>{item.name}</td>
                      <td>********</td> {/* Keamanan: Jangan tampilkan password asli */}
                      <td>
                        <span className={`role-badge ${item.role_id === 1 ? 'admin' : 'staff'}`}>
                          {getRoleName(item.role_id)}
                        </span>
                      </td>
                      <td>
                        <button className="btn-edit">Edit</button>
                        <button className="btn-delete" style={{marginLeft: '5px'}}>Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center' }}>Data pegawai kosong</td>
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

export default PegawaiPage;