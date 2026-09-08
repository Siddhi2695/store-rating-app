import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Store, LogOut, KeyRound, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return <span className="badge badge-admin">Admin</span>;
      case 'STORE_OWNER':
        return <span className="badge badge-owner">Store Owner</span>;
      default:
        return <span className="badge badge-user">Normal User</span>;
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        <Store size={26} color="#6366f1" />
        <span>StoreRating</span>
      </Link>

      {user && (
        <div className="user-nav">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <User size={18} color="#94a3b8" />
            <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{user.name}</span>
            {getRoleBadge(user.role)}
          </div>

          <Link to="/change-password" className="btn btn-outline btn-sm">
            <KeyRound size={14} /> Password
          </Link>

          <button onClick={handleLogout} className="btn btn-secondary btn-sm">
            <LogOut size={14} /> Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
