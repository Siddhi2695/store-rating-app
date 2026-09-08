import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Store, UserPlus, AlertCircle } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let err = '';
    if (name === 'name') {
      const len = value.trim().length;
      if (len < 20 || len > 60) {
        err = `Name must be 20-60 characters (currently ${len})`;
      }
    } else if (name === 'address') {
      if (value.trim().length > 400) {
        err = 'Address cannot exceed 400 characters';
      }
    } else if (name === 'password') {
      if (value.length < 8 || value.length > 16) {
        err = 'Password must be 8-16 characters';
      } else if (!/[A-Z]/.test(value)) {
        err = 'Password must contain at least one uppercase letter';
      } else if (!/[^a-zA-Z0-9]/.test(value)) {
        err = 'Password must contain at least one special character';
      }
    } else if (name === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
        err = 'Invalid email address format';
      }
    }
    return err;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const fieldErr = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldErr }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    // Perform validation on all fields
    const nameErr = validateField('name', formData.name);
    const emailErr = validateField('email', formData.email);
    const passErr = validateField('password', formData.password);
    const addrErr = validateField('address', formData.address);

    const newErrors = { name: nameErr, email: emailErr, password: passErr, address: addrErr };
    setErrors(newErrors);

    if (nameErr || emailErr || passErr || addrErr) {
      setGeneralError('Please resolve validation errors before submitting');
      return;
    }

    setSubmitting(true);
    try {
      await signup(formData.name, formData.email, formData.password, formData.address);
      navigate('/dashboard');
    } catch (err) {
      setGeneralError(err.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '520px' }}>
        <div className="auth-header">
          <div style={{ display: 'inline-flex', padding: '0.75rem', background: 'rgba(99, 102, 241, 0.15)', borderRadius: '14px', marginBottom: '1rem' }}>
            <Store size={32} color="#6366f1" />
          </div>
          <h2 className="auth-title">Create Normal User Account</h2>
          <p className="auth-subtitle">Join StoreRating to browse stores and submit ratings</p>
        </div>

        {generalError && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{generalError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name (20 to 60 characters)</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="e.g. Alexander Normal User Customer"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {errors.name ? (
              <div className="form-error">{errors.name}</div>
            ) : (
              <div className="form-hint">{formData.name.trim().length} / 60 characters</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="customer@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Password (8-16 chars, 1 uppercase, 1 special char)</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="e.g. UserPass123!"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Address (max 400 characters)</label>
            <textarea
              name="address"
              className="form-control"
              rows={3}
              placeholder="Enter complete street address..."
              value={formData.address}
              onChange={handleChange}
              required
            />
            {errors.address ? (
              <div className="form-error">{errors.address}</div>
            ) : (
              <div className="form-hint">{formData.address.trim().length} / 400 characters</div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={submitting}
          >
            <UserPlus size={18} /> {submitting ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#94a3b8' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 600 }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
