const bcrypt = require('bcrypt');
const { pool } = require('../config/db');

const getDashboardStats = async (req, res) => {
    try {
        const usersCountRes = await pool.query('SELECT COUNT(*) FROM users');
        const storesCountRes = await pool.query('SELECT COUNT(*) FROM stores');
        const ratingsCountRes = await pool.query('SELECT COUNT(*) FROM ratings');

        return res.json({
            totalUsers: parseInt(usersCountRes.rows[0].count, 10),
            totalStores: parseInt(storesCountRes.rows[0].count, 10),
            totalRatings: parseInt(ratingsCountRes.rows[0].count, 10)
        });
    } catch (err) {
        console.error('Admin dashboard stats error:', err);
        return res.status(500).json({ message: 'Server error loading dashboard statistics' });
    }
};

const addUser = async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;

        const existing = await pool.query('SELECT id FROM users WHERE LOWER(email) = LOWER($1)', [email.trim()]);
        if (existing.rowCount > 0) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users (name, email, password, address, role) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING id, name, email, address, role, created_at`,
            [name.trim(), email.trim(), hashedPassword, address ? address.trim() : '', role]
        );

        return res.status(201).json({
            message: 'User created successfully',
            user: result.rows[0]
        });
    } catch (err) {
        console.error('Admin add user error:', err);
        return res.status(500).json({ message: 'Server error creating user' });
    }
};

const getUsers = async (req, res) => {
    try {
        const { search = '', role = '', sortBy = 'name', sortOrder = 'asc' } = req.query;

        const allowedSortFields = ['name', 'email', 'address', 'role', 'created_at'];
        const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'name';
        const order = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

        let queryText = `
            SELECT id, name, email, address, role, created_at 
            FROM users 
            WHERE 1=1
        `;
        const params = [];

        if (search) {
            params.push(`%${search.trim().toLowerCase()}%`);
            queryText += ` AND (LOWER(name) LIKE $${params.length} OR LOWER(email) LIKE $${params.length} OR LOWER(address) LIKE $${params.length})`;
        }

        if (role) {
            params.push(role);
            queryText += ` AND role = $${params.length}`;
        }

        queryText += ` ORDER BY ${sortField} ${order}`;

        const result = await pool.query(queryText, params);
        return res.json({ users: result.rows });
    } catch (err) {
        console.error('Admin get users error:', err);
        return res.status(500).json({ message: 'Server error fetching users' });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const userRes = await pool.query(
            'SELECT id, name, email, address, role, created_at, updated_at FROM users WHERE id = $1',
            [id]
        );

        if (userRes.rowCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = userRes.rows[0];

        // If user is STORE_OWNER, fetch their assigned store and store rating statistics
        if (user.role === 'STORE_OWNER') {
            const storeRes = await pool.query(
                `SELECT s.id, s.name, s.email, s.address, 
                        COALESCE(ROUND(AVG(r.rating)::numeric, 2), 0) as overall_rating,
                        COUNT(r.id) as rating_count
                 FROM stores s
                 LEFT JOIN ratings r ON s.id = r.store_id
                 WHERE s.owner_id = $1
                 GROUP BY s.id`,
                [id]
            );
            user.store = storeRes.rowCount > 0 ? storeRes.rows[0] : null;
        }

        return res.json({ user });
    } catch (err) {
        console.error('Admin get user by id error:', err);
        return res.status(500).json({ message: 'Server error fetching user details' });
    }
};

const addStore = async (req, res) => {
    try {
        const { name, email, address, ownerId } = req.body;

        const existing = await pool.query('SELECT id FROM stores WHERE LOWER(email) = LOWER($1)', [email.trim()]);
        if (existing.rowCount > 0) {
            return res.status(400).json({ message: 'Store with this email already exists' });
        }

        // Validate ownerId if provided
        let validOwnerId = null;
        if (ownerId) {
            const ownerCheck = await pool.query("SELECT id FROM users WHERE id = $1 AND role = 'STORE_OWNER'", [ownerId]);
            if (ownerCheck.rowCount === 0) {
                return res.status(400).json({ message: 'Assigned owner must be a user with STORE_OWNER role' });
            }
            validOwnerId = ownerId;
        }

        const result = await pool.query(
            `INSERT INTO stores (name, email, address, owner_id) 
             VALUES ($1, $2, $3, $4) 
             RETURNING id, name, email, address, owner_id, created_at`,
            [name.trim(), email.trim(), address.trim(), validOwnerId]
        );

        return res.status(201).json({
            message: 'Store added successfully',
            store: result.rows[0]
        });
    } catch (err) {
        console.error('Admin add store error:', err);
        return res.status(500).json({ message: 'Server error adding store' });
    }
};

const getStores = async (req, res) => {
    try {
        const { search = '', sortBy = 'name', sortOrder = 'asc' } = req.query;

        const allowedSortFields = ['name', 'email', 'address', 'overall_rating', 'created_at'];
        const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'name';
        const order = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

        let queryText = `
            SELECT s.id, s.name, s.email, s.address, s.owner_id,
                   u.name as owner_name, u.email as owner_email,
                   COALESCE(ROUND(AVG(r.rating)::numeric, 2), 0) as overall_rating,
                   COUNT(r.id) as rating_count
            FROM stores s
            LEFT JOIN users u ON s.owner_id = u.id
            LEFT JOIN ratings r ON s.id = r.store_id
            WHERE 1=1
        `;
        const params = [];

        if (search) {
            params.push(`%${search.trim().toLowerCase()}%`);
            queryText += ` AND (LOWER(s.name) LIKE $${params.length} OR LOWER(s.email) LIKE $${params.length} OR LOWER(s.address) LIKE $${params.length})`;
        }

        queryText += ` GROUP BY s.id, u.id ORDER BY ${sortField === 'overall_rating' ? 'overall_rating' : 's.' + sortField} ${order}`;

        const result = await pool.query(queryText, params);
        return res.json({ stores: result.rows });
    } catch (err) {
        console.error('Admin get stores error:', err);
        return res.status(500).json({ message: 'Server error fetching stores' });
    }
};

module.exports = {
    getDashboardStats,
    addUser,
    getUsers,
    getUserById,
    addStore,
    getStores
};
