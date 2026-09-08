import React, { useState, useEffect } from 'react';
import api from '../api/client';
import StarRating from '../components/StarRating';
import { Search, Star, Users, Store as StoreIcon, Calendar } from 'lucide-react';

const OwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    fetchRatings();
  }, [search, sortBy, sortOrder]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/owner/dashboard');
      setData(res.data);
    } catch (err) {
      console.error('Fetch owner dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRatings = async () => {
    try {
      const res = await api.get('/owner/ratings', {
        params: { search, sortBy, sortOrder }
      });
      setRatings(res.data.ratings);
    } catch (err) {
      console.error('Fetch owner ratings error:', err);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <p style={{ color: '#94a3b8' }}>Loading store owner dashboard...</p>
      </div>
    );
  }

  if (!data?.hasStore) {
    return (
      <div className="page-container">
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <StoreIcon size={48} color="#f59e0b" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Assigned Store</h2>
          <p style={{ color: '#94a3b8', maxWidth: '500px', margin: '0 auto' }}>
            {data?.message || 'Please contact an Administrator to assign your account to a store.'}
          </p>
        </div>
      </div>
    );
  }

  const { store, stats } = data;

  return (
    <div className="page-container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{store.name}</h1>
        <p style={{ color: '#94a3b8' }}>{store.address} • Contact: {store.email}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <Star size={28} />
          </div>
          <div>
            <div className="stat-value">{stats.averageRating.toFixed(1)} / 5.0</div>
            <div className="stat-label">Average Customer Rating</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}>
            <Users size={28} />
          </div>
          <div>
            <div className="stat-value">{stats.totalRatings}</div>
            <div className="stat-label">Total Rating Reviews</div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem' }}>Customer Reviews & Ratings</h2>

        <div className="filter-bar">
          <div className="search-input-wrap">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="form-control search-input"
              placeholder="Search by customer Name or Email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th className="sortable" onClick={() => handleSort('user_name')}>
                  Customer Name {sortBy === 'user_name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className="sortable" onClick={() => handleSort('user_email')}>
                  Customer Email {sortBy === 'user_email' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className="sortable" onClick={() => handleSort('rating')}>
                  Submitted Rating {sortBy === 'rating' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className="sortable" onClick={() => handleSort('created_at')}>
                  Submission Date {sortBy === 'created_at' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
              </tr>
            </thead>
            <tbody>
              {ratings.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', color: '#94a3b8' }}>
                    No rating reviews match your search filter
                  </td>
                </tr>
              ) : (
                ratings.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600 }}>{r.user_name}</td>
                    <td>{r.user_email}</td>
                    <td>
                      <StarRating rating={r.rating} readOnly />
                    </td>
                    <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                      {new Date(r.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
