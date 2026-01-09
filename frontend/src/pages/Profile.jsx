import React, { useState } from 'react';
import '../App.css';

const ProfilePage = () => {
  // 1. State untuk data user
  const [user, setUser] = useState({
    id: "USR-99",
    role: "Admin",
    username: "burger_queen",
    name: "Dara Ratu Avyana",
    email: "dara@burgerlicious.com",
    age: 21,
    password: "password123"
  });

  // 2. State untuk mengontrol mode Edit
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 3. Fungsi untuk menangani perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // 4. Fungsi tombol Save
  const handleSave = () => {
    setIsEditing(false); // Balikkan ke mode view
    alert("Changes Saved Successfully!");
    // Nanti di sini tempat panggil Axios.put ke backend
  };

  return (
    <div className="profile-wrapper">
      <div className="circle-top"></div>
      <div className="circle-bottom"></div>

      <div className="profile-container">
        <div className="profile-header">
          <h2 style={{ color: 'var(--pink-primary)' }}>My Profile</h2>
          <p>Burgerlicious Management System</p>
        </div>

        {/* Row ID, Role, Age */}
        <div style={{ display: 'flex', gap: '15px' }}>
          <div className="input-group">
            <label className="label-style">ID</label>
            <input className="input-field read-only" value={user.id} readOnly style={{ width: '95px' }} />
          </div>
          <div className="input-group">
            <label className="label-style">Role</label>
            <input className="input-field read-only" value={user.role} readOnly style={{ width: '95px' }} />
          </div>
          <div className="input-group">
            <label className="label-style">Age</label>
            <input 
              name="age"
              className={`input-field ${!isEditing ? 'read-only' : ''}`} 
              value={`${user.age} Tahun`} 
              readOnly={!isEditing}
              onChange={handleChange}
              style={{ width: '95px' }} 
            />
          </div>
        </div>

        {/* Username */}
        <div className="input-group">
          <label className="label-style">Username</label>
          <input 
            name="username"
            className={`input-field ${!isEditing ? 'read-only' : ''}`} 
            value={user.username} 
            readOnly={!isEditing}
            onChange={handleChange}
          />
        </div>

        {/* Password */}
        <div className="input-group">
          <label className="label-style">Password</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input 
              name="password"
              type={showPassword ? 'text' : 'password'} 
              className={`input-field ${!isEditing ? 'read-only' : ''}`} 
              style={{ width: '100%', paddingRight: '50px' }} 
              value={user.password} 
              readOnly={!isEditing}
              onChange={handleChange}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="btn-toggle-eye">
              {showPassword ? '🤐' : '😎'}
            </button>
          </div>
        </div>

        {/* Full Name */}
        <div className="input-group">
          <label className="label-style">Full Name</label>
          <input 
            name="name"
            className={`input-field ${!isEditing ? 'read-only' : ''}`} 
            value={user.name} 
            readOnly={!isEditing}
            onChange={handleChange}
          />
        </div>

        {/* Tombol Aksi */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          {!isEditing ? (
            <button className="btn-primary-pink" style={{ flex: 1 }} onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          ) : (
            <>
              <button className="btn-primary-pink" style={{ flex: 1, backgroundColor: '#6d5656' }} onClick={() => setIsEditing(false)}>
                Cancel
              </button>
              <button className="btn-primary-pink" style={{ flex: 1 }} onClick={handleSave}>
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;