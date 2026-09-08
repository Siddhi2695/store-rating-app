import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Store, Star, KeyRound } from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <aside className="sidebar">
      {user.role === 'ADMIN' && (
        <>
          <NavLink to="/admin" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Users size={18} /> Manage Users
          </NavLink>
          <NavLink to="/admin/stores" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Store size={18} /> Manage Stores
          </NavLink>
        </>
      )}

      {user.role === 'USER' && (
        <>
          <NavLink to="/dashboard" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Store size={18} /> Stores & Ratings
          </NavLink>
        </>
      )}

      {user.role === 'STORE_OWNER' && (
        <>
          <NavLink to="/owner" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={18} /> Store Dashboard
          </NavLink>
        </>
      )}

      <NavLink to="/change-password" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <KeyRound size={18} /> Change Password
      </NavLink>
    </aside>
  );
};

export default Sidebar;
