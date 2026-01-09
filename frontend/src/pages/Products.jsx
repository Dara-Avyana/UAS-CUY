import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // 1. Import Axios
import '../App.css';

const ProductPage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [language, setLanguage] = useState('UK'); // Default bahasa Inggris


    // 3. Fungsi untuk mengambil data dari Backend
    const fetchProducts = async () => {
        try {
            // Pastikan URL ini sesuai dengan yang kamu buat di Backend (misal port 5000)
            const response = await axios.get('http://localhost:5000/api/products');
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error("failed to retrieve data:", error);
            setLoading(false);
        }
    };

    const handleAddProduct = async (newData) => {
        try {
            await axios.post('http://localhost:5000/api/products', newData);
            alert("Data berhasil disimpan!");
            fetchProducts(); // Panggil ulang fungsi ambil data agar tabel update
        } catch (err) {
            console.error("Gagal simpan data");
        }
    };

    // --- DEFINISIKAN FUNGSI LOGOUT ---
    const handleLogout = () => {
        localStorage.removeproducts('token');
        navigate('/');
    };

    // 4. Jalankan fungsi fetch saat halaman pertama kali dibuka
    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="dashboard-wrapper">
            {/* SIDEBAR */}
            <div className="sidebar">
                <div className="sidebar-logo">BURGERLICIOUS</div>
                <div className="sidebar-menu">
                <div className="menu-item active" onClick={() => navigate('/products')}>Products</div>
                <div className="menu-item" onClick={() => navigate('/transaksi')}>Transactions</div>
                <div className="menu-item" onClick={() => navigate('/pegawai')}>Employees</div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="main-content">
                <div className="top-header">
                    <span className="header-icon" title="Profile" onClick={() => navigate('/profile')}>👤</span>

                    {/* Container Settings dengan Dropdown */}
                    <div className="settings-container" style={{ position: 'relative' }}>
                        <span
                            className="header-icon"
                            title="Settings"
                            onClick={() => setShowSettings(!showSettings)}
                            style={{ cursor: 'pointer' }}
                        >
                            ⚙️
                        </span>

                        {showSettings && (
                            <div className="dropdown-menu">
                                <hr className="dropdown-divider" />

                                <div className="dropdown-products logout-products" onClick={handleLogout}>
                                    <span className="dropdown-icon">🚪</span>
                                    <span>Logout</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* TOOLBAR (SEARCH & FILTER) */}
                <div className="toolbar">
                    <input
                        type="text"
                        className="search-bar"
                        placeholder="Search products here..."
                    />

                    <div className="filter-group">
                        <button className="btn-filter">🔍 Filter</button>
                        <button className="btn-filter">↕️ Sort By</button>
                        <button className="btn-filter" style={{ backgroundColor: '#FF4D6D', color: 'white', border: 'none' }}>+ Add Product</button>
                    </div>
                </div>

                {/* TABLE SECTION */}
                <div className="table-container">
                    {loading ? (
                        <div className="loading-container" style={{ height: '300px' }}>
                            {/* Pakai class spinner kamu di sini */}
                            <div className="spinner"></div>
                            <p>Load products data...</p>
                        </div>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Product Name</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length > 0 ? (
                                    products.map((products, index) => (
                                        <tr key={products.id}>
                                            <td>{index + 1}</td>
                                            <td>{products.name}</td>
                                            <td>{products.price}</td>
                                            <td>{products.stock}</td>
                                            <td>
                                                <button className="btn-edit">Edit</button>
                                                <button className="btn-delete">Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center' }}>Empty Products Data</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* PAGINATION */}
                <div className="pagination-container">
                    <button className="btn-page">Prev</button>
                    <button className="btn-page active">1</button>
                    <button className="btn-page">Next</button>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;