import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

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

    const token = localStorage.getItem('token');

    // --- FUNCTIONS ---
    const fetchProducts = async () => {
        try {
            const response = await axios.get('/api/products', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = response.data.data ? response.data.data : response.data;
            setProducts(Array.isArray(data) ? data : []);
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
            await axios.post('http://localhost:5000/api/products', newProduct, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Produk Berhasil Ditambah!");
            setShowAddModal(false);
            setNewProduct({ name: '', price: '', stock: '' });
            fetchProducts();
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
            fetchProducts();
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
                fetchProducts();
            } catch (err) { alert("Gagal hapus!"); }
        }
    };

    // --- LOGIC: FILTER & SORT ---
    const filteredProducts = Array.isArray(products) ? products
        .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'price') return a.price - b.price;
            if (sortBy === 'stock') return a.stock - b.stock;
            return a.id - b.id;
        }) : [];

    useEffect(() => { fetchProducts(); }, []);

    return (
        <div className="dashboard-wrapper">
            {/* SIDEBAR */}
            <div className="sidebar">
                <div className="sidebar-logo">BURGERLICIOUS</div>
                <div className="sidebar-menu">
                    <div className="menu-item active">Products</div>
                    <div className="menu-item" onClick={() => navigate('/transaksi')}>Transactions</div>
                    <div className="menu-item" onClick={() => navigate('/pegawai')}>Employees</div>
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
                                <div className="dropdown-item" onClick={() => navigate('/changepassword')}>
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
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        {/* DROPDOWN SORT */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="label-style" style={{ margin: 0 }}>Sort:</span>
                            <select className="btn-filter" onChange={(e) => setSortBy(e.target.value)}>
                                <option value="id">Default</option>
                                <option value="name">Name (A-Z)</option>
                                <option value="price">Price</option>
                                <option value="stock">Stock</option>
                            </select>
                        </div>

                        {/* DROPDOWN FILTER (Checkbox Columns) */}
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
                                    <label className="dropdown-item" style={{cursor:'pointer'}}>
                                        <input type="checkbox" checked={visibleColumns.name} 
                                            onChange={() => setVisibleColumns({...visibleColumns, name: !visibleColumns.name})} /> 
                                        Product Name
                                    </label>
                                    <label className="dropdown-item" style={{cursor:'pointer'}}>
                                        <input type="checkbox" checked={visibleColumns.price} 
                                            onChange={() => setVisibleColumns({...visibleColumns, price: !visibleColumns.price})} /> 
                                        Price
                                    </label>
                                    <label className="dropdown-item" style={{cursor:'pointer'}}>
                                        <input type="checkbox" checked={visibleColumns.stock} 
                                            onChange={() => setVisibleColumns({...visibleColumns, stock: !visibleColumns.stock})} /> 
                                        Stock
                                    </label>
                                </div>
                            )}
                        </div>

                        <button className="btn-add" onClick={() => setShowAddModal(true)}>+ Add Product</button>
                    </div>
                </div>

                {/* TABLE */}
                <div className="table-container">
                    {loading ? <div className="spinner"></div> : (
                        <table>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    {visibleColumns.id && <th>ID</th>}
                                    {visibleColumns.name && <th>Product Name</th>}
                                    {visibleColumns.price && <th>Price</th>}
                                    {visibleColumns.stock && <th>Stock</th>}
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((item, index) => (
                                        <tr key={item.id}>
                                            <td>{index + 1}</td>
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
                                            <td>
                                                <div className="action-buttons">
                                                    <button className="btn-edit" onClick={() => { setEditingProduct(item); setShowEditModal(true) }}>Edit</button>
                                                    <button className="btn-delete" onClick={() => handleDelete(item.id)}>Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center' }}>No products found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* MODAL ADD */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content pink-theme">
                        <div className="signup-header">
                            <h2>Add New Product</h2>
                        </div>
                        <form onSubmit={handleAddProduct} style={{ marginTop: '20px' }}>
                            <div className="form-group">
                                <label>Product Name</label>
                                <input type="text" className="login-input" placeholder="e.g. Cheese Burger" required
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Price (Rp)</label>
                                <input type="number" className="login-input" placeholder="e.g. 25000" required
                                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Stock Amount</label>
                                <input type="number" className="login-input" placeholder="e.g. 50" required
                                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} />
                            </div>
                            <div className="profile-actions">
                                <button type="submit" className="btn-primary-pink">Save Product</button>
                                <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL EDIT */}
            {showEditModal && editingProduct && (
                <div className="modal-overlay">
                    <div className="modal-content pink-theme">
                        <div className="signup-header">
                            <h2>Edit Product</h2>
                        </div>
                        <form onSubmit={handleUpdate} style={{ marginTop: '20px' }}>
                            <div className="form-group">
                                <label>Product Name</label>
                                <input type="text" className="login-input" value={editingProduct.name} required
                                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Price (Rp)</label>
                                <input type="number" className="login-input" value={editingProduct.price} required
                                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Stock Amount</label>
                                <input type="number" className="login-input" value={editingProduct.stock} required
                                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })} />
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