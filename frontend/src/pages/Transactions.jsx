import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const TransaksiPage = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [products, setProducts] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    
    // States untuk Search, Sort, & Filter Dropdown
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('latest');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    
    // State untuk memilih kolom yang tampil
    const [visibleColumns, setVisibleColumns] = useState({
        id: true,
        product: true,
        type: true,
        quantity: true,
        date: true
    });

    // State Data Baru
    const [newTransaction, setNewTransaction] = useState({ product_id: '', type: 'masuk', quantity: '' });

    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    // --- FUNCTIONS ---
    const fetchTransactions = async (page = 1) => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/transactions?page=${page}&limit=10`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTransactions(response.data.data || []); 
            setLoading(false);
        } catch (error) {
            console.error("Gagal mengambil data transaksi:", error);
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/api/products', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = response.data.data ? response.data.data : response.data;
            setProducts(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Gagal ambil produk:", err);
        }
    };

    const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
        // Bungkus data agar quantity dikirim sebagai angka
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
        fetchTransactions(); 
    } catch (err) {
        // Tampilkan pesan error dari backend jika ada (misal: "Stok tidak cukup")
        const errorMsg = err.response?.data?.message || "Gagal simpan transaksi!";
        alert(errorMsg);
    }
};

    const handleDelete = async (id) => {
        if (window.confirm("Hapus transaksi ini? (Hanya Admin) ⚠️")) {
            try {
                await axios.delete(`/api/transactions/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchTransactions();
            } catch (err) { alert("Akses ditolak atau server error."); }
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    // --- LOGIC: FILTER & SORT ---
    const filteredTransactions = transactions
        .filter(t => t.id.toString().includes(searchTerm) || t.product_name?.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            if (sortBy === 'latest') return new Date(b.created_at) - new Date(a.created_at);
            if (sortBy === 'qty-high') return b.quantity - a.quantity;
            if (sortBy === 'qty-low') return a.quantity - b.quantity;
            return b.id - a.id;
        });

    useEffect(() => { 
        fetchTransactions(); 
        fetchProducts();
    }, []);

    return (
        <div className="dashboard-wrapper">
            {/* SIDEBAR */}
            <div className="sidebar">
                <div className="sidebar-logo">BURGERLICIOUS</div>
                <div className="sidebar-menu">
                    <div className="menu-item" onClick={() => navigate('/products')}>Products</div>
                    <div className="menu-item active">Transactions</div>
                    <div className="menu-item" onClick={() => navigate('/pegawai')}>Employees</div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="main-content">
                <div className="top-header">
                    <span className="header-icon" onClick={() => navigate('/profile')} style={{cursor: 'pointer'}}>
                        👤 {user?.username || 'Profile'}
                    </span>
                    <div className="settings-container">
                        <span className="header-icon" onClick={() => setShowSettings(!showSettings)} style={{cursor: 'pointer'}}>⚙️ Settings</span>
                        {showSettings && (
                            <div className="dropdown-menu">
                                <div className="dropdown-item" onClick={() => navigate('/changepassword')}>🔑 Change Password</div>
                                <div className="dropdown-divider"></div>
                                <div className="dropdown-item logout-item" onClick={handleLogout}>🚪 Logout</div>
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
                            placeholder="🔍 Search ID or Product..." 
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="filter-group">
                        {/* SORT BY */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="label-style" style={{ margin: 0 }}>Sort:</span>
                            <select className="btn-filter" onChange={(e) => setSortBy(e.target.value)}>
                                <option value="latest">Terbaru</option>
                                <option value="qty-high">Qty Terbanyak</option>
                                <option value="qty-low">Qty Terendah</option>
                            </select>
                        </div>

                        {/* FILTER COLUMNS (Checkbox) */}
                        <div style={{ position: 'relative' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span className="label-style" style={{ margin: 0 }}>Filter:</span>
                                <button className="btn-filter" onClick={() => setShowFilterDropdown(!showFilterDropdown)}>
                                    Select Columns ▼
                                </button>
                            </div>
                            
                            {showFilterDropdown && (
                                <div className="dropdown-menu show" style={{ display: 'block', top: '45px', right: 0 }}>
                                    <label className="dropdown-item" style={{cursor:'pointer'}}>
                                        <input type="checkbox" checked={visibleColumns.id} onChange={() => setVisibleColumns({...visibleColumns, id: !visibleColumns.id})} /> ID Transaksi
                                    </label>
                                    <label className="dropdown-item" style={{cursor:'pointer'}}>
                                        <input type="checkbox" checked={visibleColumns.product} onChange={() => setVisibleColumns({...visibleColumns, product: !visibleColumns.product})} /> Product Name
                                    </label>
                                    <label className="dropdown-item" style={{cursor:'pointer'}}>
                                        <input type="checkbox" checked={visibleColumns.type} onChange={() => setVisibleColumns({...visibleColumns, type: !visibleColumns.type})} /> Type (IN/OUT)
                                    </label>
                                    <label className="dropdown-item" style={{cursor:'pointer'}}>
                                        <input type="checkbox" checked={visibleColumns.quantity} onChange={() => setVisibleColumns({...visibleColumns, quantity: !visibleColumns.quantity})} /> Quantity
                                    </label>
                                    <label className="dropdown-item" style={{cursor:'pointer'}}>
                                        <input type="checkbox" checked={visibleColumns.date} onChange={() => setVisibleColumns({...visibleColumns, date: !visibleColumns.date})} /> Date
                                    </label>
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
                                    <th>No</th>
                                    {visibleColumns.id && <th>ID</th>}
                                    {visibleColumns.product && <th>Product</th>}
                                    {visibleColumns.type && <th>Type</th>}
                                    {visibleColumns.quantity && <th>Quantity</th>}
                                    {visibleColumns.date && <th>Date</th>}
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        {visibleColumns.id && <td>#{item.id}</td>}
                                        {visibleColumns.product && <td>{item.product_name || `ID: ${item.product_id}`}</td>}
                                        {visibleColumns.type && (
                                            <td>
                                                <span className={`badge ${item.type === 'masuk' ? 'type-in' : 'type-out'}`}>
                                                    {item.type === 'masuk' ? 'IN' : 'OUT'}
                                                </span>
                                            </td>
                                        )}
                                        {visibleColumns.quantity && <td>{item.quantity}</td>}
                                        {visibleColumns.date && <td>{new Date(item.created_at).toLocaleString('id-ID')}</td>}
                                        <td>
                                            {user?.role === 'admin' ? (
                                                <button className="btn-delete" onClick={() => handleDelete(item.id)}>Delete</button>
                                            ) : (
                                                <button className="btn-edit" style={{opacity: 0.5}} disabled>Detail</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* MODAL ADD TRANSACTION */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content pink-theme">
                        <div className="signup-header">
                            <h2>Record Transaction</h2>
                        </div>
                        <form onSubmit={handleAddTransaction} style={{marginTop: '20px'}}>
                            <div className="form-group">
                                <label>Select Product</label>
                                <select required className="login-input"
                                    onChange={(e) => setNewTransaction({...newTransaction, product_id: e.target.value})}>
                                    <option value="">-- Choose Product --</option>
                                    {products.map(p => (
                                        <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Transaction Type</label>
                                <select className="login-input" value={newTransaction.type}
                                    onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})}>
                                    <option value="masuk">IN (Stock Masuk)</option>
                                    <option value="keluar">OUT (Stock Keluar)</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Quantity</label>
                                <input type="number" required className="login-input" placeholder="e.g. 10"
                                    onChange={(e) => setNewTransaction({...newTransaction, quantity: e.target.value})} />
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