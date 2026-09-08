const { pool } = require('../config/db');

const getStoresForUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const { search = '', sortBy = 'name', sortOrder = 'asc' } = req.query;

        const allowedSortFields = ['name', 'address', 'overall_rating'];
        const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'name';
        const order = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

        let queryText = `
            SELECT s.id, s.name, s.email, s.address,
                   COALESCE(ROUND(AVG(r.rating)::numeric, 2), 0) as overall_rating,
                   COUNT(r.id) as total_ratings,
                   my_r.id as my_rating_id,
                   my_r.rating as my_rating
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            LEFT JOIN ratings my_r ON s.id = my_r.store_id AND my_r.user_id = $1
            WHERE 1=1
        `;
        const params = [userId];

        if (search) {
            params.push(`%${search.trim().toLowerCase()}%`);
            queryText += ` AND (LOWER(s.name) LIKE $${params.length} OR LOWER(s.address) LIKE $${params.length})`;
        }

        queryText += ` GROUP BY s.id, my_r.id, my_r.rating 
                       ORDER BY ${sortField === 'overall_rating' ? 'overall_rating' : 's.' + sortField} ${order}`;

        const result = await pool.query(queryText, params);
        return res.json({ stores: result.rows });
    } catch (err) {
        console.error('Get stores for user error:', err);
        return res.status(500).json({ message: 'Server error fetching store list' });
    }
};

const getStoreById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT s.id, s.name, s.email, s.address,
                    COALESCE(ROUND(AVG(r.rating)::numeric, 2), 0) as overall_rating,
                    COUNT(r.id) as total_ratings,
                    my_r.id as my_rating_id,
                    my_r.rating as my_rating
             FROM stores s
             LEFT JOIN ratings r ON s.id = r.store_id
             LEFT JOIN ratings my_r ON s.id = my_r.store_id AND my_r.user_id = $1
             WHERE s.id = $2
             GROUP BY s.id, my_r.id, my_r.rating`,
            [userId, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Store not found' });
        }

        return res.json({ store: result.rows[0] });
    } catch (err) {
        console.error('Get store details error:', err);
        return res.status(500).json({ message: 'Server error fetching store details' });
    }
};

const submitRating = async (req, res) => {
    try {
        const userId = req.user.id;
        const { storeId, rating } = req.body;

        if (!storeId) {
            return res.status(400).json({ message: 'Store ID is required' });
        }

        // Verify store exists
        const storeCheck = await pool.query('SELECT id FROM stores WHERE id = $1', [storeId]);
        if (storeCheck.rowCount === 0) {
            return res.status(404).json({ message: 'Store not found' });
        }

        // Check if rating already exists for this user and store
        const existing = await pool.query(
            'SELECT id FROM ratings WHERE user_id = $1 AND store_id = $2',
            [userId, storeId]
        );

        if (existing.rowCount > 0) {
            return res.status(400).json({ 
                message: 'You have already rated this store. Please modify your existing rating instead.' 
            });
        }

        const result = await pool.query(
            `INSERT INTO ratings (user_id, store_id, rating) 
             VALUES ($1, $2, $3) 
             RETURNING id, user_id, store_id, rating, created_at`,
            [userId, storeId, parseInt(rating, 10)]
        );

        return res.status(201).json({
            message: 'Rating submitted successfully',
            rating: result.rows[0]
        });
    } catch (err) {
        console.error('Submit rating error:', err);
        return res.status(500).json({ message: 'Server error submitting rating' });
    }
};

const modifyRating = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params; // rating id
        const { rating } = req.body;

        // Verify rating exists and belongs to this user
        const ratingCheck = await pool.query('SELECT id, user_id FROM ratings WHERE id = $1', [id]);
        if (ratingCheck.rowCount === 0) {
            return res.status(404).json({ message: 'Rating not found' });
        }

        if (ratingCheck.rows[0].user_id !== userId) {
            return res.status(403).json({ message: 'You are only authorized to modify your own rating' });
        }

        const result = await pool.query(
            `UPDATE ratings 
             SET rating = $1, updated_at = NOW() 
             WHERE id = $2 
             RETURNING id, user_id, store_id, rating, updated_at`,
            [parseInt(rating, 10), id]
        );

        return res.json({
            message: 'Rating updated successfully',
            rating: result.rows[0]
        });
    } catch (err) {
        console.error('Modify rating error:', err);
        return res.status(500).json({ message: 'Server error modifying rating' });
    }
};

const getMyRatings = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT r.id, r.store_id, r.rating, r.created_at, r.updated_at,
                    s.name as store_name, s.address as store_address
             FROM ratings r
             JOIN stores s ON r.store_id = s.id
             WHERE r.user_id = $1
             ORDER BY r.updated_at DESC`,
            [userId]
        );

        return res.json({ ratings: result.rows });
    } catch (err) {
        console.error('Get my ratings error:', err);
        return res.status(500).json({ message: 'Server error fetching user ratings' });
    }
};

module.exports = {
    getStoresForUser,
    getStoreById,
    submitRating,
    modifyRating,
    getMyRatings
};
