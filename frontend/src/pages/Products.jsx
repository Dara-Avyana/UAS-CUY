import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // 1. Import Axios
import '../App.css';

const ProductPage = () => {
    const navigate = useNavigate();

    // 2. State untuk menampung data dari Database (awalannya kosong [])
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // 3. Fungsi untuk mengambil data dari Backend
    const fetchProducts = async () => {
        try {
            // Pastikan URL ini sesuai dengan yang kamu buat di Backend (misal port 5000)
            const response = await axios.get('http://localhost:5000/api/products');
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Gagal ambil data:", error);
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
                    <div className="menu-item active">Products</div>
                    <div className="menu-item" onClick={() => navigate('/transaksi')}>Transaksi</div>
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
                placeholder="Search products here..." 
            />
            
            <div className="filter-group">
                <button className="btn-filter">🔍 Filter</button>
                <button className="btn-filter">↕️ Sort By</button>
                <button className="btn-filter" style={{backgroundColor: '#FF4D6D', color: 'white', border: 'none'}}>+ Add Product</button>
            </div>
            </div>

                {/* TABLE SECTION */}
                <div className="table-container">
                    {loading ? (
                        <p style={{ textAlign: 'center', padding: '20px' }}>Loading data...</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Product Name</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length > 0 ? (
                                    products.map((item, index) => (
                                        <tr key={item.id}>
                                            <td>{index + 1}</td>
                                            <td>{item.name}</td>
                                            <td>{item.category}</td>
                                            <td>{item.price}</td>
                                            <td>{item.stock}</td>
                                            <td>
                                                <button className="btn-edit">Edit</button>
                                                <button className="btn-delete">Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center' }}>Data Kosong</td>
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