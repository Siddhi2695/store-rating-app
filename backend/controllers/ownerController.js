const { pool } = require('../config/db');

const getOwnerDashboard = async (req, res) => {
    try {
        const ownerId = req.user.id;

        // Get store owned by this user
        const storeRes = await pool.query('SELECT id, name, email, address FROM stores WHERE owner_id = $1', [ownerId]);
        
        if (storeRes.rowCount === 0) {
            return res.json({ 
                hasStore: false, 
                message: 'No store has been assigned to your store owner account yet. Please contact an Admin.' 
            });
        }

        const store = storeRes.rows[0];

        // Get ratings summary for this store
        const statsRes = await pool.query(
            `SELECT COALESCE(ROUND(AVG(rating)::numeric, 2), 0) as average_rating,
                    COUNT(id) as total_ratings,
                    COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
                    COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
                    COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
                    COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
                    COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
             FROM ratings
             WHERE store_id = $1`,
            [store.id]
        );

        const stats = statsRes.rows[0];

        return res.json({
            hasStore: true,
            store,
            stats: {
                averageRating: parseFloat(stats.average_rating),
                totalRatings: parseInt(stats.total_ratings, 10),
                breakdown: {
                    5: parseInt(stats.five_star, 10),
                    4: parseInt(stats.four_star, 10),
                    3: parseInt(stats.three_star, 10),
                    2: parseInt(stats.two_star, 10),
                    1: parseInt(stats.one_star, 10)
                }
            }
        });
    } catch (err) {
        console.error('Owner dashboard error:', err);
        return res.status(500).json({ message: 'Server error fetching owner dashboard' });
    }
};

const getOwnerRatings = async (req, res) => {
    try {
        const ownerId = req.user.id;
        const { search = '', sortBy = 'created_at', sortOrder = 'desc' } = req.query;

        // Verify store exists for owner
        const storeRes = await pool.query('SELECT id FROM stores WHERE owner_id = $1', [ownerId]);
        if (storeRes.rowCount === 0) {
            return res.json({ ratings: [] });
        }
        const storeId = storeRes.rows[0].id;

        const allowedSortFields = ['user_name', 'user_email', 'rating', 'created_at'];
        const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
        const order = sortOrder.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

        let queryText = `
            SELECT r.id, r.rating, r.created_at, r.updated_at,
                   u.name as user_name, u.email as user_email
            FROM ratings r
            JOIN users u ON r.user_id = u.id
            WHERE r.store_id = $1
        `;
        const params = [storeId];

        if (search) {
            params.push(`%${search.trim().toLowerCase()}%`);
            queryText += ` AND (LOWER(u.name) LIKE $${params.length} OR LOWER(u.email) LIKE $${params.length})`;
        }

        queryText += ` ORDER BY ${sortField === 'user_name' ? 'u.name' : sortField === 'user_email' ? 'u.email' : 'r.' + sortField} ${order}`;

        const result = await pool.query(queryText, params);
        return res.json({ ratings: result.rows });
    } catch (err) {
        console.error('Get owner ratings error:', err);
        return res.status(500).json({ message: 'Server error fetching store ratings' });
    }
};

module.exports = {
    getOwnerDashboard,
    getOwnerRatings
};
