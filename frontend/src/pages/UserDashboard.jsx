import React, { useState, useEffect } from 'react';
import api from '../api/client';
import StarRating from '../components/StarRating';
import Modal from '../components/Modal';
import { Search, Star, Edit3, PlusCircle, CheckCircle, AlertCircle } from 'lucide-react';

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Rating Modal state
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingError, setRatingError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStores();
  }, [search, sortBy, sortOrder]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const res = await api.get('/stores', {
        params: { search, sortBy, sortOrder }
      });
      setStores(res.data.stores);
    } catch (err) {
      console.error('Fetch stores error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRatingModal = (store) => {
    setSelectedStore(store);
    setRatingValue(store.my_rating || 5);
    setRatingError('');
    setIsRatingModalOpen(true);
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    setRatingError('');
    setSuccessMsg('');

    if (ratingValue < 1 || ratingValue > 5) {
      setRatingError('Rating must be an integer between 1 and 5');
      return;
    }

    setSubmitting(true);
    try {
      if (selectedStore.my_rating_id) {
        // Update existing rating
        await api.put(`/ratings/${selectedStore.my_rating_id}`, { rating: ratingValue });
        setSuccessMsg('Your rating has been updated successfully!');
      } else {
        // Submit new rating
        await api.post('/ratings', { storeId: selectedStore.id, rating: ratingValue });
        setSuccessMsg('Your rating has been submitted successfully!');
      }
      setIsRatingModalOpen(false);
      fetchStores();
    } catch (err) {
      setRatingError(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Explore Stores & Submit Ratings</h1>
        <p style={{ color: '#94a3b8' }}>Browse registered stores, view overall ratings, and rate your experience</p>
      </div>

      {successMsg && (
        <div className="alert alert-success">
          <CheckCircle size={18} /> {successMsg}
        </div>
      )}

      <div className="filter-bar">
        <div className="search-input-wrap">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="form-control search-input"
            placeholder="Search stores by Name or Address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => handleSortChange('name')}
            className={`btn btn-sm ${sortBy === 'name' ? 'btn-primary' : 'btn-outline'}`}
          >
            Name {sortBy === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
          </button>
          <button
            onClick={() => handleSortChange('overall_rating')}
            className={`btn btn-sm ${sortBy === 'overall_rating' ? 'btn-primary' : 'btn-outline'}`}
          >
            Rating {sortBy === 'overall_rating' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
          </button>
        </div>
      </div>

      {loading ? (
        <p style={{ color: '#94a3b8' }}>Loading store listings...</p>
      ) : stores.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem', color: '#94a3b8' }}>
          No stores match your search criteria.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {stores.map((s) => (
            <div key={s.id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fff' }}>
                  {s.name}
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.25rem', minHeight: '40px' }}>
                  {s.address}
                </p>

                <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.875rem 1rem', borderRadius: '10px', marginBottom: '1.25rem', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    OVERALL STORE RATING
                  </div>
                  <StarRating rating={parseFloat(s.overall_rating)} readOnly />
                </div>
              </div>

              <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>YOUR RATING</div>
                  {s.my_rating ? (
                    <div style={{ fontWeight: 600, color: '#fbbf24', fontSize: '0.95rem' }}>
                      ★ {s.my_rating} / 5
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Not Rated Yet</span>
                  )}
                </div>

                <button
                  onClick={() => handleOpenRatingModal(s)}
                  className={`btn btn-sm ${s.my_rating ? 'btn-outline' : 'btn-primary'}`}
                >
                  {s.my_rating ? (
                    <>
                      <Edit3 size={14} /> Modify Rating
                    </>
                  ) : (
                    <>
                      <PlusCircle size={14} /> Rate Store
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submit / Modify Rating Modal */}
      <Modal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        title={selectedStore?.my_rating ? `Modify Rating for ${selectedStore?.name}` : `Rate ${selectedStore?.name}`}
      >
        {ratingError && (
          <div className="alert alert-danger">
            <AlertCircle size={18} /> {ratingError}
          </div>
        )}

        <form onSubmit={handleRatingSubmit}>
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>
              Select a rating score between 1 (Poor) and 5 (Excellent):
            </p>
            <StarRating
              rating={ratingValue}
              onRatingChange={(val) => setRatingValue(val)}
              size={32}
            />
            <div style={{ marginTop: '1rem', fontSize: '1.5rem', fontWeight: 700, color: '#fbbf24' }}>
              {ratingValue} Stars
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
            {submitting ? 'Saving Rating...' : selectedStore?.my_rating ? 'Update Rating' : 'Submit Rating'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default UserDashboard;
