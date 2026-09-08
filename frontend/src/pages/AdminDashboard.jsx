import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { Users, Store, Star, PlusCircle, ArrowRight } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/dashboard');
      setStats(res.data);
    } catch (err) {
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Admin Overview Dashboard</h1>
          <p style={{ color: '#94a3b8' }}>System-wide metrics and user management control panel</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <p style={{ color: '#94a3b8' }}>Loading metrics...</p>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <Users size={26} />
              </div>
              <div>
                <div className="stat-value">{stats.totalUsers}</div>
                <div className="stat-label">Total System Users</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
                <Store size={26} />
              </div>
              <div>
                <div className="stat-value">{stats.totalStores}</div>
                <div className="stat-label">Registered Stores</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                <Star size={26} />
              </div>
              <div>
                <div className="stat-value">{stats.totalRatings}</div>
                <div className="stat-label">Submitted Ratings</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
            <div className="card card-hover">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <Users size={24} color="#6366f1" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>User Management</h3>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Create new accounts for Normal Users, Store Owners, or Admins. View details, search, and filter users.
              </p>
              <Link to="/admin/users" className="btn btn-primary btn-sm">
                Manage Users <ArrowRight size={16} />
              </Link>
            </div>

            <div className="card card-hover">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <Store size={24} color="#3b82f6" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Store Management</h3>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Register new stores, assign store owners, and monitor overall store average ratings.
              </p>
              <Link to="/admin/stores" className="btn btn-primary btn-sm">
                Manage Stores <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
