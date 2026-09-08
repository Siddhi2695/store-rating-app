import React, { useState, useEffect } from 'react';
import api from '../api/client';
import Modal from '../components/Modal';
import StarRating from '../components/StarRating';
import { Search, PlusCircle, AlertCircle, Store } from 'lucide-react';

const AdminStores = () => {
  const [stores, setStores] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [formGeneralError, setFormGeneralError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStores();
    fetchOwners();
  }, [search, sortBy, sortOrder]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/stores', {
        params: { search, sortBy, sortOrder }
      });
      setStores(res.data.stores);
    } catch (err) {
      console.error('Fetch stores error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOwners = async () => {
    try {
      const res = await api.get('/admin/users', { params: { role: 'STORE_OWNER' } });
      setOwners(res.data.users);
    } catch (err) {
      console.error('Fetch owners error:', err);
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

  const validateField = (name, value) => {
    let err = '';
    if (name === 'name') {
      const len = value.trim().length;
      if (len < 20 || len > 60) err = `Store Name must be 20-60 chars (currently ${len})`;
    } else if (name === 'address') {
      if (value.trim().length > 400) err = 'Address cannot exceed 400 chars';
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

  const handleAddStoreSubmit = async (e) => {
    e.preventDefault();
    setFormGeneralError('');

    const nameErr = validateField('name', formData.name);
    const emailErr = validateField('email', formData.email);
    const addrErr = validateField('address', formData.address);

    if (nameErr || emailErr || addrErr) {
      setFormErrors({ name: nameErr, email: emailErr, address: addrErr });
      setFormGeneralError('Please resolve validation errors');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/admin/stores', {
        name: formData.name,
        email: formData.email,
        address: formData.address,
        ownerId: formData.ownerId ? parseInt(formData.ownerId, 10) : null
      });
      setIsAddModalOpen(false);
      setFormData({ name: '', email: '', address: '', ownerId: '' });
      setFormErrors({});
      fetchStores();
    } catch (err) {
      setFormGeneralError(err.response?.data?.message || 'Failed to create store');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Store Directory & Ratings</h1>
          <p style={{ color: '#94a3b8' }}>Register new stores and assign store owners</p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary">
          <PlusCircle size={18} /> Register New Store
        </button>
      </div>

      <div className="filter-bar">
        <div className="search-input-wrap">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="form-control search-input"
            placeholder="Search stores by name, email, or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th className="sortable" onClick={() => handleSort('name')}>
                Store Name {sortBy === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th className="sortable" onClick={() => handleSort('email')}>
                Email {sortBy === 'email' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th className="sortable" onClick={() => handleSort('address')}>
                Address {sortBy === 'address' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th className="sortable" onClick={() => handleSort('overall_rating')}>
                Overall Rating {sortBy === 'overall_rating' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th>Assigned Owner</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: '#94a3b8' }}>Loading stores...</td>
              </tr>
            ) : stores.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: '#94a3b8' }}>No stores match the search criteria</td>
              </tr>
            ) : (
              stores.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600 }}>{s.name}</td>
                  <td>{s.email}</td>
                  <td style={{ color: '#94a3b8', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {s.address}
                  </td>
                  <td>
                    <StarRating rating={parseFloat(s.overall_rating)} readOnly />
                  </td>
                  <td>
                    {s.owner_name ? (
                      <span style={{ fontWeight: 500, color: '#fbbf24' }}>{s.owner_name}</span>
                    ) : (
                      <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Unassigned</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Store Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Register New Store">
        {formGeneralError && (
          <div className="alert alert-danger">
            <AlertCircle size={18} /> {formGeneralError}
          </div>
        )}
        <form onSubmit={handleAddStoreSubmit}>
          <div className="form-group">
            <label className="form-label">Store Name (20 to 60 characters)</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="e.g. Tech Superstore Flagship Center"
              value={formData.name}
              onChange={handleFormChange}
              required
            />
            {formErrors.name && <div className="form-error">{formErrors.name}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Store Contact Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="contact@store.com"
              value={formData.email}
              onChange={handleFormChange}
              required
            />
            {formErrors.email && <div className="form-error">{formErrors.email}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Store Physical Address (max 400 characters)</label>
            <textarea
              name="address"
              className="form-control"
              rows={3}
              placeholder="Complete Physical Address..."
              value={formData.address}
              onChange={handleFormChange}
              required
            />
            {formErrors.address && <div className="form-error">{formErrors.address}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Assign Store Owner (Optional)</label>
            <select
              name="ownerId"
              className="form-control"
              value={formData.ownerId}
              onChange={handleFormChange}
            >
              <option value="">Select a Store Owner...</option>
              {owners.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name} ({o.email})
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={submitting}>
            {submitting ? 'Registering Store...' : 'Register Store'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminStores;
