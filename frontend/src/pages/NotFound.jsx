import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
      <div className="card" style={{ maxWidth: '480px', width: '100%', padding: '3rem 2rem' }}>
        <AlertTriangle size={60} color="#f59e0b" style={{ margin: '0 auto 1.5rem' }} />
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>404</h1>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#f8fafc' }}>Page Not Found</h2>
        <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
          The page or route you are attempting to access does not exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary">
          <Home size={18} /> Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
