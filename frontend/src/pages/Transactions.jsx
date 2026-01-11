import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

// 1. Fungsi Helper untuk ambil data dari Token
const parseJwt = (token) => {
    try {
        if (!token) return null;
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
};

const TransaksiPage = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = parseJwt(token); // Ambil role dari token

    // --- DATA STATES ---
    const [transactions, setTransactions] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // --- SERVER-SIDE STATES ---
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all'); 
    const [sortBy, setSortBy] = useState('created_at');
    const [order, setOrder] = useState('DESC');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 6;

    // --- UI STATES ---
    const [showSettings, setShowSettings] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [newTransaction, setNewTransaction] = useState({ product_id: '', type: 'masuk', quantity: '' });

    const [visibleColumns, setVisibleColumns] = useState({
        id: true,
        product: true,
        type: true,
        quantity: true,
        user: true,
        date: true
    });

    // --- FETCH DATA ---
    const fetchTransactions = useCallback(async (page = currentPage) => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/transactions`, {
                params: {
                    page: page,
                    limit: itemsPerPage, // Gunakan state
                    sort_by: sortBy,
                    order: order,
                    type: filterType === 'all' ? undefined : filterType,
                    search: searchTerm 
                },
                headers: { Authorization: `Bearer ${token}` }
            });

            setTransactions(response.data.data || []);
            setTotalPages(response.data.pagination?.totalPages || 1);
            setLoading(false);
        } catch (error) {
            console.error("Gagal ambil data transaksi:", error);
            setLoading(false);
        }
    }, [currentPage, filterType, sortBy, order, searchTerm, token, itemsPerPage]);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('/api/products', { headers: { Authorization: `Bearer ${token}` } });
            const data = res.data.data ? res.data.data : res.data;
            setProducts(Array.isArray(data) ? data : []);
        } catch (err) { console.error("Gagal ambil produk:", err); }
    };

    useEffect(() => {
        fetchTransactions();
        fetchProducts();
    }, [fetchTransactions]);

    // --- ACTIONS ---
    const handleAddTransaction = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = {
                ...newTransaction,
                product_id: parseInt(newTransaction.product_id),
                quantity: parseInt(newTransaction.quantity)
            };
            await axios.post('/api/transactions', dataToSend, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Transaksi berhasil dicatat!");
            setShowAddModal(false);
            setNewTransaction({ product_id: '', type: 'masuk', quantity: '' });
            setCurrentPage(1); // Selalu kembali ke halaman pertama
            fetchTransactions(1); // Ambil data terbaru di page 1
            fetchProducts(); // Update stok produk
        } catch (err) {
            alert(err.response?.data?.message || "Gagal simpan");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Hapus transaksi ini? (Hanya Admin) ⚠️")) {
            try {
                await axios.delete(`/api/transactions/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchTransactions();
            } catch (err) { alert("Akses ditolak."); }
        }
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            fetchTransactions(page);
        }
    };

    return (
        <div className="dashboard-wrapper">
            {/* SIDEBAR - DISAMAKAN DENGAN PRODUCT PAGE */}
            <div className="sidebar">
                <div className="sidebar-logo">SUB-ATOMIC</div>
                <div className="sidebar-menu">
                    <div className="menu-item" onClick={() => navigate('/products')}>Products</div>
                    <div className="menu-item active">Transactions</div>
                    <div
                        className={`menu-item ${user?.role === 'admin' ? '' : 'disabled-menu'}`}
                        onClick={() => user?.role === 'admin' ? navigate('/pengguna') : null}
                        style={{ 
                            opacity: user?.role === 'admin' ? 1 : 0.5, 
                            cursor: user?.role === 'admin' ? 'pointer' : 'not-allowed',
                            color: user?.role === 'admin' ? '#333' : '#ccc'
                        }}
                        title={user?.role === 'admin' ? undefined : 'Hanya bisa diakses oleh admin'}
                    >
                        Users
                    </div>
                </div>
            </div>

            <div className="main-content">
                <div className="top-header">
                    <span className="header-icon" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
                        👤 {user?.username || 'Profile'}
                    </span>
                    <div className="settings-container">
                        <span className="header-icon" onClick={() => setShowSettings(!showSettings)} style={{ cursor: 'pointer' }}>⚙️ Settings</span>
                        {showSettings && (
                            <div className="dropdown-menu">
                                <div className="dropdown-item" onClick={() => navigate('/changepassword')}>🔑 Change Password</div>
                                <div className="dropdown-divider"></div>
                                <div className="dropdown-item logout-item" onClick={() => { localStorage.clear(); navigate('/'); }}>🚪 Logout</div>
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
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        />
                    </div>

                    <div className="filter-group">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="label-style" style={{ margin: 0 }}>Sort:</span>
                            <select className="btn-filter" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                <option value="created_at">Date</option>
                                <option value="quantity">Quantity</option>
                                <option value="product_name">Product Name</option>
                            </select>
                        </div>

                        <div style={{ position: 'relative' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span className="label-style" style={{ margin: 0 }}>Filter:</span>
                                <button className="btn-filter" onClick={() => setShowFilterDropdown(!showFilterDropdown)}>
                                    Select Columns ▼
                                </button>
                            </div>
                            {showFilterDropdown && (
                                <div className="dropdown-menu show" style={{ display: 'block', top: '45px', right: 0 }}>
                                    {Object.keys(visibleColumns).map(col => (
                                        <label key={col} className="dropdown-item" style={{cursor:'pointer', textTransform: 'capitalize'}}>
                                            <input type="checkbox" checked={visibleColumns[col]} 
                                                onChange={() => setVisibleColumns({...visibleColumns, [col]: !visibleColumns[col]})} /> {col}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button className="btn-add" onClick={() => setShowAddModal(true)}>+ Add Transaction</button>
                    </div>
                </div>

                {/* TABLE */}
                <div className="table-container">
                    {loading ? <div className="spinner"></div> : (
                        <table>
                            <thead>
                                <tr>
                                    {visibleColumns.id && <th>ID</th>}
                                    {visibleColumns.product && <th>Product Name</th>}
                                    {visibleColumns.type && <th>Type</th>}
                                    {visibleColumns.quantity && <th>Quantity</th>}
                                    {visibleColumns.user && <th>User</th>}
                                    {visibleColumns.date && <th>Date</th>}
                                    {user?.role === 'admin' && <th style={{ textAlign: 'center' }}>Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.length > 0 ? (
                                    transactions.map((item) => (
                                        <tr key={item.id}>
                                            {visibleColumns.id && <td>#{item.id}</td>}
                                            {visibleColumns.product && <td><strong>{item.product_name}</strong></td>}
                                            {visibleColumns.type && (
                                                <td>
                                                    <span className={`badge ${item.type === 'masuk' ? 'type-in' : 'type-out'}`} 
                                                          style={{ backgroundColor: item.type === 'masuk' ? '#d4edda' : '#f8d7da', color: item.type === 'masuk' ? '#155724' : '#721c24', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                                                        {item.type?.toUpperCase()}
                                                    </span>
                                                </td>
                                            )}
                                            {visibleColumns.quantity && <td>{item.quantity}</td>}
                                            {visibleColumns.user && <td>{item.user_name}</td>}
                                            {visibleColumns.date && <td>{new Date(item.created_at).toLocaleString('id-ID')}</td>}
                                            {user?.role === 'admin' && (
                                                <td style={{ textAlign: 'center' }}>
                                                    <button className="btn-delete" onClick={() => handleDelete(item.id)}>Delete</button>
                                                </td>
                                                
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center' }}>No transactions found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* PAGINATION - DISAMAKAN DENGAN PRODUCT PAGE */}
                {!loading && (
                    <div className="pagination-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '30px', gap: '8px', paddingBottom: '20px' }}>
                        <button className="btn-pagination" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
                        
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

                        <button className="btn-pagination" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
                    </div>
                )}
            </div>

            {/* MODAL ADD */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content pink-theme">
                        <div className="signup-header"><h2>Record Transaction</h2></div>
                        <form onSubmit={handleAddTransaction} style={{ marginTop: '20px' }}>
                            <div className="form-group">
                                <label>Select Product</label>
                                <select required className="login-input" onChange={(e) => setNewTransaction({ ...newTransaction, product_id: e.target.value })}>
                                    <option value="">-- Choose Product --</option>
                                    {products.map(p => (
                                        <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Transaction Type</label>
                                <select className="login-input" value={newTransaction.type} onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}>
                                    <option value="masuk">IN (Stock Masuk)</option>
                                    <option value="keluar">OUT (Stock Keluar)</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Quantity</label>
                                <input type="number" required className="login-input" onChange={(e) => setNewTransaction({ ...newTransaction, quantity: e.target.value })} />
                            </div>
                            <div className="profile-actions">
                                <button type="submit" className="btn-primary-pink">Submit</button>
                                <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransaksiPage;