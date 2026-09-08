import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, Star, ShieldCheck, Users, BarChart3, ArrowRight, CheckCircle2, LogIn, UserPlus } from 'lucide-react';
import StarRating from '../components/StarRating';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)' }}>
      {/* Header Navigation */}
      <header className="navbar" id="landing-header">
        <div className="brand">
          <Store size={30} color="#6366f1" />
          <span style={{ fontSize: '1.4rem' }}>StoreRating</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link to="/login" className="btn btn-outline btn-sm" id="btn-header-login">
            <LogIn size={16} /> Sign In
          </Link>
          <Link to="/signup" className="btn btn-primary btn-sm" id="btn-header-signup">
            <UserPlus size={16} /> Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: '5rem 1.5rem', textAlign: 'center', maxWidth: '1100px', margin: '0 auto' }} id="hero-section">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '999px', color: '#a5b4fc', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1.5rem' }}>
          <Star size={16} fill="#fbbf24" color="#fbbf24" /> Trusted Store Rating & Review Platform
        </div>

        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.5rem', background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Discover Top Local Stores & Share Authentic Ratings
        </h1>

        <p style={{ fontSize: '1.15rem', color: '#94a3b8', maxWidth: '780px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
          Empowering customers with transparent store ratings while providing store owners with real-time feedback analytics. Built for admins, business owners, and shoppers.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
          <Link to="/signup" className="btn btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1.05rem' }} id="btn-hero-cta">
            Create Free Account <ArrowRight size={20} />
          </Link>
          <Link to="/login" className="btn btn-outline" style={{ padding: '0.9rem 2rem', fontSize: '1.05rem' }} id="btn-hero-login">
            Explore Demo Sign-In
          </Link>
        </div>

        {/* Feature Highlights Banner */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
          <div className="card" style={{ textAlign: 'left' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Users size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>For Normal Users</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Browse all registered stores, search by name or address, and submit 1-to-5 star ratings with immediate edit ability.
            </p>
          </div>

          <div className="card" style={{ textAlign: 'left' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <BarChart3 size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>For Store Owners</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Access your store dashboard to track average customer ratings, rating distribution, and individual customer feedback lists.
            </p>
          </div>

          <div className="card" style={{ textAlign: 'left' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>For Administrators</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Full system control panel to manage users, onboard new stores, assign store owners, and review live overall platform stats.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Credentials Section */}
      <section style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '4rem 1.5rem', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }} id="demo-credentials-section">
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>Try With Pre-Seeded Accounts</h2>
          <p style={{ color: '#94a3b8', marginBottom: '2.5rem' }}>Test any role immediately using our pre-configured demo credentials</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div className="card card-hover" style={{ border: '1px solid rgba(168, 85, 247, 0.3)' }}>
              <span className="badge badge-admin" style={{ marginBottom: '1rem' }}>Admin Account</span>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.25rem' }}>admin@storerating.com</div>
              <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1rem' }}>Password: AdminPass123!</div>
              <button onClick={() => navigate('/login')} className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                Sign In as Admin
              </button>
            </div>

            <div className="card card-hover" style={{ border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <span className="badge badge-owner" style={{ marginBottom: '1rem' }}>Store Owner Account</span>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.25rem' }}>owner@storerating.com</div>
              <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1rem' }}>Password: OwnerPass123!</div>
              <button onClick={() => navigate('/login')} className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                Sign In as Store Owner
              </button>
            </div>

            <div className="card card-hover" style={{ border: '1px solid rgba(99, 102, 241, 0.3)' }}>
              <span className="badge badge-user" style={{ marginBottom: '1rem' }}>Normal User Account</span>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.25rem' }}>user@storerating.com</div>
              <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1rem' }}>Password: UserPass123!</div>
              <button onClick={() => navigate('/login')} className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                Sign In as Normal User
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem', borderTop: '1px solid var(--border-color)' }} id="landing-footer">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <Store size={24} color="#6366f1" />
          <span style={{ fontWeight: 700, color: '#fff', fontSize: '1.1rem' }}>StoreRating Application</span>
        </div>
        <p style={{ marginBottom: '0.5rem' }}>
          Developed with ❤️ by <a href="https://github.com/Siddhi2695" target="_blank" rel="noreferrer" style={{ color: '#818cf8', fontWeight: 700, textDecoration: 'underline' }}>Siddhi Shendkar</a>
        </p>
        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
          Contact: <a href="mailto:shendkarsiddhi2695@gmail.com" style={{ color: '#a5b4fc' }}>shendkarsiddhi2695@gmail.com</a>
        </p>
        <p style={{ fontSize: '0.8rem', color: '#475569', marginTop: '1rem' }}>
          © {new Date().getFullYear()} StoreRating App. Built with React.js, Express, PostgreSQL, and Vite.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
