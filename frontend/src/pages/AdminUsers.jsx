import React, { useState, useEffect } from 'react';
import api from '../api/client';
import Modal from '../components/Modal';
import StarRating from '../components/StarRating';
import { Search, UserPlus, ArrowUpDown, Eye, AlertCircle } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Add User Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'USER'
  });
  const [formErrors, setFormErrors] = useState({});
  const [formGeneralError, setFormGeneralError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter, sortBy, sortOrder]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users', {
        params: { search, role: roleFilter, sortBy, sortOrder }
      });
      setUsers(res.data.users);
    } catch (err) {
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleViewUser = async (id) => {
    try {
      const res = await api.get(`/admin/users/${id}`);
      setSelectedUserDetail(res.data.user);
      setIsDetailModalOpen(true);
    } catch (err) {
      alert('Failed to load user details');
    }
  };

  const validateField = (name, value) => {
    let err = '';
    if (name === 'name') {
      const len = value.trim().length;
      if (len < 20 || len > 60) err = `Name must be 20-60 chars (currently ${len})`;
    } else if (name === 'address') {
      if (value.trim().length > 400) err = 'Address cannot exceed 400 chars';
    } else if (name === 'password') {
      if (value.length < 8 || value.length > 16) err = 'Password must be 8-16 chars';
      else if (!/[A-Z]/.test(value)) err = 'Must include at least 1 uppercase letter';
      else if (!/[^a-zA-Z0-9]/.test(value)) err = 'Must include at least 1 special character';
    } else if (name === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) err = 'Invalid email address format';
    }
    return err;
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const err = validateField(name, value);
    setFormErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    setFormGeneralError('');

    const nameErr = validateField('name', formData.name);
    const emailErr = validateField('email', formData.email);
    const passErr = validateField('password', formData.password);
    const addrErr = validateField('address', formData.address);

    if (nameErr || emailErr || passErr || addrErr) {
      setFormErrors({ name: nameErr, email: emailErr, password: passErr, address: addrErr });
      setFormGeneralError('Please resolve validation errors');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/admin/users', formData);
      setIsAddModalOpen(false);
      setFormData({ name: '', email: '', password: '', address: '', role: 'USER' });
      setFormErrors({});
      fetchUsers();
    } catch (err) {
      setFormGeneralError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN': return <span className="badge badge-admin">Admin</span>;
      case 'STORE_OWNER': return <span className="badge badge-owner">Store Owner</span>;
      default: return <span className="badge badge-user">User</span>;
    }
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Users Directory</h1>
          <p style={{ color: '#94a3b8' }}>View, search, filter, and add system users</p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary">
          <UserPlus size={18} /> Add New User
        </button>
      </div>

      <div className="filter-bar">
        <div className="search-input-wrap">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="form-control search-input"
            placeholder="Search by name, email, or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select
            className="form-control"
            style={{ width: '180px' }}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="ADMIN">ADMIN</option>
            <option value="STORE_OWNER">STORE OWNER</option>
            <option value="USER">NORMAL USER</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th className="sortable" onClick={() => handleSort('name')}>
                Name {sortBy === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th className="sortable" onClick={() => handleSort('email')}>
                Email {sortBy === 'email' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th>Address</th>
              <th className="sortable" onClick={() => handleSort('role')}>
                Role {sortBy === 'role' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: '#94a3b8' }}>Loading users...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: '#94a3b8' }}>No users match the search criteria</td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 600 }}>{u.name}</td>
                  <td>{u.email}</td>
                  <td style={{ color: '#94a3b8', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {u.address}
                  </td>
                  <td>{getRoleBadge(u.role)}</td>
                  <td>
                    <button onClick={() => handleViewUser(u.id)} className="btn btn-outline btn-sm">
                      <Eye size={14} /> Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New User">
        {formGeneralError && (
          <div className="alert alert-danger">
            <AlertCircle size={18} /> {formGeneralError}
          </div>
        )}
        <form onSubmit={handleAddUserSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name (20 to 60 characters)</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="e.g. System Administrator Account"
              value={formData.name}
              onChange={handleFormChange}
              required
            />
            {formErrors.name && <div className="form-error">{formErrors.name}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="newuser@storerating.com"
              value={formData.email}
              onChange={handleFormChange}
              required
            />
            {formErrors.email && <div className="form-error">{formErrors.email}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Password (8-16 chars, 1 uppercase, 1 special char)</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="e.g. SecurePass123!"
              value={formData.password}
              onChange={handleFormChange}
              required
            />
            {formErrors.password && <div className="form-error">{formErrors.password}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Address (max 400 characters)</label>
            <textarea
              name="address"
              className="form-control"
              rows={2}
              placeholder="Street Address..."
              value={formData.address}
              onChange={handleFormChange}
              required
            />
            {formErrors.address && <div className="form-error">{formErrors.address}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <select name="role" className="form-control" value={formData.role} onChange={handleFormChange}>
              <option value="USER">Normal User</option>
              <option value="STORE_OWNER">Store Owner</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={submitting}>
            {submitting ? 'Creating User...' : 'Create User'}
          </button>
        </form>
      </Modal>

      {/* User Details Modal */}
      <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="User Account Details">
        {selectedUserDetail && (
          <div>
            <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.25rem' }}>{selectedUserDetail.name}</div>
              <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{selectedUserDetail.email}</div>
              <div style={{ marginTop: '0.5rem' }}>{getRoleBadge(selectedUserDetail.role)}</div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <strong style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.25rem' }}>ADDRESS</strong>
              <p>{selectedUserDetail.address || 'N/A'}</p>
            </div>

            {selectedUserDetail.role === 'STORE_OWNER' && (
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <strong style={{ display: 'block', fontSize: '0.85rem', color: '#fbbf24', marginBottom: '0.5rem' }}>ASSIGNED STORE RATING OVERVIEW</strong>
                {selectedUserDetail.store ? (
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>{selectedUserDetail.store.name}</div>
                    <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{selectedUserDetail.store.address}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <StarRating rating={parseFloat(selectedUserDetail.store.overall_rating)} readOnly />
                      <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>({selectedUserDetail.store.rating_count} ratings)</span>
                    </div>
                  </div>
                ) : (
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>No store assigned to this owner yet.</p>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminUsers;
