import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const TransaksiPage = () => {
  const navigate = useNavigate();
  
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fungsi mengambil data transaksi
  const fetchTransactions = async () => {
    try {
      // Pastikan endpoint ini sudah kamu buat di backend
      const response = await axios.get('/api/transaksi'); 
      setTransactions(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Gagal mengambil data transaksi:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="dashboard-wrapper">
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="sidebar-logo">BURGERLICIOUS</div>
        <div className="sidebar-menu">
          <div className="menu-item" onClick={() => navigate('/products')}>Products</div>
          <div className="menu-item active">Transaksi</div>
          <div className="menu-item" onClick={() => navigate('/pegawai')}>Pegawai</div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">
        <div className="top-header">
          <span className="header-icon" title="Profile" onClick={() => navigate('/profile')}>👤</span>
          <span className="header-icon" title="Settings">⚙️</span>
        </div>

        {/* TOOLBAR (SEARCH & FILTER) */}
        <div className="toolbar">
          <input 
            type="text" 
            className="search-bar" 
            placeholder="Search transaction here..." 
          />
          
          <div className="filter-group">
            <button className="btn-filter">🔍 Filter</button>
            <button className="btn-filter">↕️ Sort By</button>
            <button className="btn-filter" style={{backgroundColor: '#FF4D6D', color: 'white', border: 'none'}}>+ Add Transaction</button>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="table-container">
          {loading ? (
            <p style={{ textAlign: 'center', padding: '20px' }}>Loading transaksi...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product ID</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((item) => (
                    <tr key={item.id}>
                      <td>#{item.id}</td>
                      <td>{item.product_id}</td>
                      <td>
                        <span className={`badge ${item.type === 'masuk' ? 'type-in' : 'type-out'}`}>
                          {item.type}
                        </span>
                      </td>
                      <td>{item.quantity}</td>
                      <td>{new Date(item.created_at).toLocaleString('id-ID')}</td>
                      <td>
                        <button className="btn-edit">Detail</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>Belum ada transaksi</td>
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

export default TransaksiPage;