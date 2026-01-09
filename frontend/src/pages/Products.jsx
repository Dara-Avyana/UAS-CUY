import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const ProductPage = () => {
  const navigate = useNavigate();
  
  // Data Dummy untuk Tabel
  const [products] = useState([
    { id: 1, name: "Cheese Burger", category: "Food", price: "Rp 35.000", stock: 50 },
    { id: 2, name: "Coca Cola", category: "Drink", price: "Rp 10.000", stock: 100 },
    { id: 3, name: "French Fries", category: "Snack", price: "Rp 15.000", stock: 30 },
  ]);

  return (
    <div className="dashboard-wrapper">
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="sidebar-logo">BURGERLICIOUS</div>
        <div className="sidebar-menu">
          <div className="menu-item active">Products</div>
          <div className="menu-item" onClick={() => navigate('/pegawai')}>Pegawai</div>
          <div className="menu-item" onClick={() => navigate('/transaksi')}>Transaksi</div>
          <div className="menu-item" onClick={() => navigate('/profile')}>My Profile</div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">
        {/* TOP HEADER */}
        <div className="top-header">
          <span className="header-icon" title="Profile" onClick={() => navigate('/profile')}>👤</span>
          <span className="header-icon" title="Settings">⚙️</span>
        </div>

        {/* TOOLBAR (SEARCH, FILTER, SORT, EDIT) */}
        <div className="toolbar">
        {/* Bagian Kiri: Search */}
        <div className="search-container">
            <input 
            type="text" 
            className="search-bar" 
            placeholder="Search for products, ID, or categories..." 
            />
        </div>

        {/* Bagian Kanan: Group Buttons */}
        <div className="action-group">
            <button className="btn-action">
            <span>🔍</span> Filter
            </button>
            
            <button className="btn-action">
            <span>↕️</span> Sort By
            </button>

            {/* Tombol Add/Edit Produk */}
            <button className="btn-action btn-add">
            <span>+</span> Add Product
            </button>
        </div>
        </div>

        {/* TABLE SECTION */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.price}</td>
                  <td>{item.stock}</td>
                  <td>
                    <button style={{marginRight: '5px', cursor: 'pointer'}}>Edit</button>
                    <button style={{color: 'red', cursor: 'pointer'}}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="pagination-container">
          <button className="btn-page">Prev</button>
          <button className="btn-page active" style={{backgroundColor: '#FF4D6D', color: 'white'}}>1</button>
          <button className="btn-page">2</button>
          <button className="btn-page">3</button>
          <button className="btn-page">Next</button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;