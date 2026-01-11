import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

// Fungsi untuk membongkar isi token JWT agar bisa tahu Role User
const parseJwt = (token) => {
    try {
        if (!token) return null;
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
};

const ProductPage = () => {
    const navigate = useNavigate();

    // --- STATES ---
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('id');

    // States untuk Modals & Dropdowns
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

    // State untuk milih kolom yang mau tampil (Checkbox)
    const [visibleColumns, setVisibleColumns] = useState({
        id: true,
        name: true,
        price: true,
        stock: true
    });

    // States untuk Data Input
    const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '' });
    const [editingProduct, setEditingProduct] = useState(null);

    // States untuk Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 6;

    // LOGIKA AMBIL USER DARI TOKEN
    const token = localStorage.getItem('token');
    const user = parseJwt(token);
    const isAdmin = user?.role?.toLowerCase() === 'admin';
    console.log("Isi User dari Token:", user);

    // --- FUNCTIONS ---
    const fetchProducts = async (page = 1) => {
        try {
            const response = await axios.get('/api/products', {
                headers: { Authorization: `Bearer ${token}` },
                params: { page, limit: itemsPerPage, search: searchTerm }
            });
            const data = response.data.data ? response.data.data : response.data;
            setProducts(Array.isArray(data) ? data : []);
            setTotalItems(response.data.pagination?.totalItems || 0);
            setTotalPages(response.data.pagination?.totalPages || 1);
            setCurrentPage(response.data.pagination?.currentPage || 1);
            setLoading(false);
        } catch (err) {
            console.error("Fetch error:", err);
            setLoading(false);
            if (err.response?.status === 401) navigate('/');
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            await axios.post('h/api/products', newProduct, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Produk Berhasil Ditambah!");
            setShowAddModal(false);
            setNewProduct({ name: '', price: '', stock: '' });
            fetchProducts(currentPage);
        } catch (err) {
            alert("Gagal tambah produk!");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/products/${editingProduct.id}`, editingProduct, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Data diupdate!");
            setShowEditModal(false);
            fetchProducts(currentPage);
        } catch (err) {
            alert("Gagal update!");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Yakin hapus? 🥺")) {
            try {
                await axios.delete(`/api/products/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchProducts(currentPage);
            } catch (err) { alert("Gagal hapus!"); }
        }
    };

    const filteredProducts = Array.isArray(products) ? [...products]
        .sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'price') return a.price - b.price;
            if (sortBy === 'stock') return a.stock - b.stock;
            return a.id - b.id;
        }) : [];

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            fetchProducts(page);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    useEffect(() => {
        setCurrentPage(1);
        fetchProducts(1);
    }, [searchTerm]);

    return (
        <div className="dashboard-wrapper">
            {/* SIDEBAR */}
            <div className="sidebar">
                <div className="sidebar-logo">SUB-ATOMIC</div>
                <div className="sidebar-menu">
                    <div className="menu-item active">Products</div>
                    <div className="menu-item" onClick={() => navigate('/transaksi')}>Transactions</div>

                    {/* REVISI SIDEBAR: MENGGUNAKAN LOGIKA TOKEN */}
                    <div
                        className="menu-item"
                        onClick={() => {
                            // Cek apakah role mengandung kata 'admin' (tanpa peduli huruf besar/kecil)
                            const isAdmin = user?.role?.toLowerCase() === 'admin';

                            if (isAdmin) {
                                navigate('/pengguna');
                            } else {
                                alert("Akses ditolak: Anda bukan admin.");
                            }
                        }}
                        style={{
                            // Logika visual: Jika admin, opacity 1 (terang). Jika bukan, 0.5 (pudar)
                            opacity: (user?.role?.toLowerCase() === 'admin') ? 1 : 0.5,
                            cursor: (user?.role?.toLowerCase() === 'admin') ? 'pointer' : 'not-allowed',
                            color: (user?.role?.toLowerCase() === 'admin') ? '#333' : '#ccc'
                        }}
                    >
                        Users
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="main-content">
                <div className="top-header">
                    <span className="header-icon" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
                        👤 Profile
                    </span>

                    <div className="settings-container">
                        <span className="header-icon" onClick={() => setShowSettings(!showSettings)} style={{ cursor: 'pointer' }}>
                            ⚙️ Settings
                        </span>
                        {showSettings && (
                            <div className="dropdown-menu">
                                <div className="dropdown-item" onClick={() => navigate('/change-password')}>
                                    <span className="dropdown-icon">🔑</span> Change Password
                                </div>
                                <div className="dropdown-divider"></div>
                                <div className="dropdown-item logout-item" onClick={() => { localStorage.clear(); navigate('/') }}>
                                    <span className="dropdown-icon">🚪</span> Logout
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* TOOLBAR */}
                <div className="toolbar">
                    <div style={{ flex: 1 }}>
                        <input
                            type="text"
                            className="search-bar"
                            placeholder="🔍 Search product name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="label-style" style={{ margin: 0 }}>Sort:</span>
                            <select className="btn-filter" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                <option value="id">Default</option>
                                <option value="name">Name (A-Z)</option>
                                <option value="price">Price</option>
                                <option value="stock">Stock</option>
                            </select>
                        </div>

                        <div style={{ position: 'relative' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span className="label-style" style={{ margin: 0 }}>Filter:</span>
                                <button
                                    className="btn-filter"
                                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                >
                                    Select Columns ▼
                                </button>
                            </div>

                            {showFilterDropdown && (
                                <div className="dropdown-menu show" style={{ display: 'block', top: '45px' }}>
                                    <label className="dropdown-item" style={{ cursor: 'pointer' }}>
                                        <input type="checkbox" checked={visibleColumns.name}
                                            onChange={() => setVisibleColumns({ ...visibleColumns, name: !visibleColumns.name })} />
                                        Product Name
                                    </label>
                                    <label className="dropdown-item" style={{ cursor: 'pointer' }}>
                                        <input type="checkbox" checked={visibleColumns.price}
                                            onChange={() => setVisibleColumns({ ...visibleColumns, price: !visibleColumns.price })} />
                                        Price
                                    </label>
                                    <label className="dropdown-item" style={{ cursor: 'pointer' }}>
                                        <input type="checkbox" checked={visibleColumns.stock}
                                            onChange={() => setVisibleColumns({ ...visibleColumns, stock: !visibleColumns.stock })} />
                                        Stock
                                    </label>
                                </div>
                            )}
                        </div>

                        {/* Tombol Add Product hanya untuk admin */}
                        {isAdmin && (
                            <button className="btn-add" onClick={() => setShowAddModal(true)}>+ Add Product</button>
                        )}
                    </div>
                </div>

                {/* TABLE */}
                <div className="table-container">
                    {loading ? <div className="spinner"></div> : (
                        <table>
                            <thead>
                                <tr>
                                    {visibleColumns.id && <th>ID</th>}
                                    {visibleColumns.name && <th>Product Name</th>}
                                    {visibleColumns.price && <th>Price</th>}
                                    {visibleColumns.stock && <th>Stock</th>}
                                    {user.role === 'admin' && <th style={{ textAlign: 'center' }}>Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((item) => (
                                        <tr key={item.id}>
                                            {visibleColumns.id && <td>#{item.id}</td>}
                                            {visibleColumns.name && <td><strong>{item.name}</strong></td>}
                                            {visibleColumns.price && <td>Rp {Number(item.price).toLocaleString('id-ID')}</td>}
                                            {visibleColumns.stock && (
                                                <td>
                                                    <span className={`stock-badge ${item.stock < 5 ? 'low' : ''}`}>
                                                        {item.stock}
                                                    </span>
                                                </td>
                                            )}
                                            <td style={{ textAlign: 'center' }}>
                                                <div className="action-buttons">
                                                    {isAdmin && (
                                                        <>
                                                            <button className="btn-edit" onClick={() => { setEditingProduct(item); setShowEditModal(true) }}>Edit</button>
                                                            <button className="btn-delete" onClick={() => handleDelete(item.id)}>Delete</button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center' }}>No products found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* REVISI PAGINATION: PREV - ANGKA - NEXT */}
                {!loading && (
                    <div className="pagination-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '30px', gap: '8px', paddingBottom: '20px' }}>
                        <button
                            className="btn-pagination"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            style={{ padding: '8px 12px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                        >
                            Prev
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                className={`btn-pagination ${page === currentPage ? 'active' : ''}`}
                                onClick={() => handlePageChange(page)}
                                style={{
                                    padding: '8px 15px',
                                    backgroundColor: page === currentPage ? '#ff69b4' : '#fff',
                                    color: page === currentPage ? '#fff' : '#000',
                                    border: '1px solid #ff69b4',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            className="btn-pagination"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            style={{ padding: '8px 12px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/* MODAL ADD & EDIT TETAP SAMA SEPERTI SEBELUMNYA */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content pink-theme">
                        <div className="signup-header"><h2>Add New Product</h2></div>
                        <form onSubmit={handleAddProduct} style={{ marginTop: '20px' }}>
                            <div className="form-group">
                                <label>Product Name</label>
                                <input type="text" className="login-input" required onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Price (Rp)</label>
                                <input type="number" className="login-input" required onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Stock Amount</label>
                                <input type="number" className="login-input" required onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} />
                            </div>
                            <div className="profile-actions">
                                <button type="submit" className="btn-primary-pink">Save Product</button>
                                <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showEditModal && editingProduct && (
                <div className="modal-overlay">
                    <div className="modal-content pink-theme">
                        <div className="signup-header"><h2>Edit Product</h2></div>
                        <form onSubmit={handleUpdate} style={{ marginTop: '20px' }}>
                            <div className="form-group">
                                <label>Product Name</label>
                                <input type="text" className="login-input" value={editingProduct.name} required onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Price (Rp)</label>
                                <input type="number" className="login-input" value={editingProduct.price} required onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Stock Amount</label>
                                <input type="number" className="login-input" value={editingProduct.stock} required onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })} />
                            </div>
                            <div className="profile-actions">
                                <button type="submit" className="btn-primary-pink">Update Data</button>
                                <button type="button" className="btn-cancel" onClick={() => setShowEditModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductPage;