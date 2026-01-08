import React, { useState } from 'react';

const ProfilePage = () => {
  // Data user (Nanti dihubungkan ke Backend/Database)
  const [user] = useState({
    id: "USR-99",
    role: "Admin",
    username: "burger_queen",
    name: "Dara Ratu Avyana",
    email: "dara@burgerlicious.com",
    age: 21,
    password: "password-placeholder"
  });
  const [showPassword, setShowPassword] = useState(false);

  // --- STYLING (Auto Layout & Figma Theme) ---
  
  const wrapperStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#FFF5F7', // Warna pink sangat muda (latar Figma)
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Poppins', sans-serif"
  };

  // Elemen Dekoratif (Bola-bola di pojok)
  const circleTop = {
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    backgroundColor: '#FFD1DC',
    top: '-100px',
    right: '-50px',
    zIndex: 0
  };

  const circleBottom = {
    position: 'absolute',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    backgroundColor: '#FFE4E1',
    bottom: '-50px',
    left: '-50px',
    zIndex: 0
  };

  const containerStyle = {
    width: '90%',
    maxWidth: '450px',
    padding: '40px',
    backgroundColor: '#FFFFFF',
    borderRadius: '30px', // Corner radius besar khas Figma
    boxShadow: '0 15px 35px rgba(255, 182, 193, 0.3)',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    zIndex: 1, // Agar di depan bola-bola
    boxSizing: 'border-box',
    overflow: 'hidden'
  };

  const fieldStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  };

  const labelStyle = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#5D4037', // Warna coklat teks
    marginLeft: '5px'
  };

  const inputStyle = {
    padding: '12px 20px',
    borderRadius: '15px',
    border: '2px solid #F0F0F0',
    backgroundColor: '#F9F9F9',
    fontSize: '15px',
    outline: 'none',
    transition: '0.3s'
  };

  const readOnlyStyle = {
    ...inputStyle,
    backgroundColor: '#EEEEEE',
    color: '#999',
    cursor: 'not-allowed'
  };

  const buttonStyle = {
    marginTop: '10px',
    padding: '15px',
    borderRadius: '15px',
    border: 'none',
    backgroundColor: '#FF4D6D', // Warna pink cerah tombol
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 5px 15px rgba(255, 77, 109, 0.3)'
  };

  return (
    <div style={wrapperStyle}>
      {/* Dekorasi Latar Belakang */}
      <div style={circleTop}></div>
      <div style={circleBottom}></div>

      {/* Kotak Profile (Main Card) */}
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <h2 style={{ color: '#FF4D6D', margin: 0 }}>My Profile</h2>
          <p style={{ color: '#888', fontSize: '14px' }}>Burgerlicious Management System</p>
        </div>

        {/* User ID & Role (Read Only) */}
        <div style={{ display: 'flex', gap: '60px' }}>
          <div style={{ ...fieldStyle, width: '68px' }}>
            <label style={labelStyle}>ID</label>
            <input style={{ ...readOnlyStyle, width: '100%', textAlign: 'center' }} value={user.id} readOnly />
          </div>
          <div style={{ ...fieldStyle, width: '68px' }}>
            <label style={labelStyle}>Role</label>
            <input style={{ ...readOnlyStyle, width: '100%', textAlign: 'center' }} value={user.role} readOnly />
          </div>
          <div style={{ ...fieldStyle, width: '68px' }}>
            <label style={labelStyle}>Age</label>
            <input style={{ ...inputStyle, width: '100%', textAlign: 'center' }} value={`${user.age} Tahun`} />
          </div>
        </div>

        {/* Username */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Username</label>
          <input style={inputStyle} value={user.username} />
        {/* Password */}
        <div style={fieldStyle}>
        <label style={labelStyle}>Password</label>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input 
            // Jika showPassword true, tipe jadi "text" (kelihatan)
            // Jika false, tipe jadi "password" (bintang-bintang)
            type={showPassword ? 'text' : 'password'} 
            style={{ ...inputStyle, width: '100%', paddingRight: '50px' }} 
            value={user.password} 
            readOnly // Sementara readOnly sesuai data user
            />

            {/* Tombol Mata */}
        <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        style={{
            position: 'absolute',
            right: '15px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '18px',
            color: '#FF4D6D' // Warna pink tema Burgerlicious
        }}
        >
        {showPassword ? '🤐' : '😎'} 
        </button>
    </div>
</div>
        </div>

        {/* Nama Lengkap */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Full Name</label>
          <input style={inputStyle} value={user.name} />
        </div>

        {/* Email */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Email Address</label>
          <input style={inputStyle} type="email" value={user.email} />
        </div>

        <button 
          style={buttonStyle}
          onMouseOver={(e) => e.target.style.backgroundColor = '#E04360'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#FF4D6D'}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;