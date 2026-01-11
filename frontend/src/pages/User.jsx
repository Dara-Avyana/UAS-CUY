import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const UserPage = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // States untuk Modals & Dropdowns
  const [showSettings, setShowSettings] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [sortBy, setSortBy] = useState('id');
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    name: true,
    email: true,
    role: true
  });

  // States untuk Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;

  const token = localStorage.getItem('token');

  // FUNGSI UTAMA: Digabung antara Verifikasi Admin & Ambil Data
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Verifikasi Role Admin via /me
      const authRes = await axios.get('/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (authRes.data.role_name?.toLowerCase() !== 'admin') {
        alert("Akses Ditolak! Hanya Admin yang boleh masuk.");
        navigate('/products');
        return;
      }

      // 2. Ambil Data Pengguna dengan Query (Wajib UAS)
      const empRes = await axios.get('/api/users/all', {
        params: {
          page: currentPage,
          search: searchTerm,
          limit: itemsPerPage
        },
        headers: { Authorization: `Bearer ${token}` }
      });

      // Sesuaikan dengan format JSON dari backend kita sebelumnya
      setEmployees(empRes.data.data);
      setTotalPages(empRes.data.pagination.totalPages);

    } catch (error) {
      console.error("Gagal memuat data:", error);
      if (error.response?.status === 401) navigate('/');
    } finally {
      setLoading(false);
    }
  };

  // Jalankan fetchData setiap kali halaman atau pencarian berubah
  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm]);

  const sortedEmployees = Array.isArray(employees) ? [...employees]
  .sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'email') return a.email.localeCompare(b.email);
    if (sortBy === 'role') return a.role.localeCompare(b.role);
    return a.id - b.id;
  }) : [];

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

  return (
    <div className="dashboard-wrapper">
      <div className="sidebar">
        <div className="sidebar-logo">SUB-ATOMIC</div>
        <div className="sidebar-menu">
          <div className="menu-item" onClick={() => navigate('/products')}>Products</div>
          <div className="menu-item" onClick={() => navigate('/transaksi')}>Transactions</div>
          <div className="menu-item active">Users</div>
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
          <input
            type="text"
            className="search-bar"
            placeholder="🔍 Search by name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <div className="filter-group">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="label-style" style={{ margin: 0 }}>Sort:</span>
              <select className="btn-filter" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="id">Default</option>
                <option value="name">Name (A-Z)</option>
                <option value="email">Email</option>
                <option value="role">Role</option>
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
                    <input type="checkbox" checked={visibleColumns.id}
                      onChange={() => setVisibleColumns({ ...visibleColumns, id: !visibleColumns.id })} />
                    ID
                  </label>
                  <label className="dropdown-item" style={{ cursor: 'pointer' }}>
                    <input type="checkbox" checked={visibleColumns.name}
                      onChange={() => setVisibleColumns({ ...visibleColumns, name: !visibleColumns.name })} />
                    Name
                  </label>
                  <label className="dropdown-item" style={{ cursor: 'pointer' }}>
                    <input type="checkbox" checked={visibleColumns.email}
                      onChange={() => setVisibleColumns({ ...visibleColumns, email: !visibleColumns.email })} />
                    Email
                  </label>
                  <label className="dropdown-item" style={{ cursor: 'pointer' }}>
                    <input type="checkbox" checked={visibleColumns.role}
                      onChange={() => setVisibleColumns({ ...visibleColumns, role: !visibleColumns.role })} />
                    Role
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="table-container">
          {loading ? <div className="spinner"></div> : (
            <table>
              <thead>
                <tr>
                  {visibleColumns.id && <th>ID</th>}
                  {visibleColumns.name && <th>Name</th>}
                  {visibleColumns.email && <th>Email</th>}
                  {visibleColumns.role && <th>Role</th>}
                </tr>
              </thead>
              <tbody>
                {sortedEmployees.length > 0 ? (
                  sortedEmployees.map((u) => (
                    <tr key={u.id}>
                      {visibleColumns.id && <td>#{u.id}</td>}
                      {visibleColumns.name && <td>{u.name}</td>}
                      {visibleColumns.email && <td>{u.email}</td>}
                      {visibleColumns.role && <td><span className="badge">{u.role}</span></td>}
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4" style={{ textAlign: 'center' }}>No users found</td></tr>
                )}
              </tbody>
            </table>
          )}

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
      </div>
    </div>
  );
};

export default UserPage;