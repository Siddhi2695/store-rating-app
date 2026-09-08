const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const { JWT_SECRET } = require('../middleware/authMiddleware');

const register = async (req, res) => {
    try {
        const { name, email, password, address } = req.body;

        // Check if email already registered
        const existing = await pool.query('SELECT id FROM users WHERE LOWER(email) = LOWER($1)', [email.trim()]);
        if (existing.rowCount > 0) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new USER (signup is restricted to USER role only)
        const result = await pool.query(
            `INSERT INTO users (name, email, password, address, role) 
             VALUES ($1, $2, $3, $4, 'USER') 
             RETURNING id, name, email, address, role, created_at`,
            [name.trim(), email.trim(), hashedPassword, address ? address.trim() : '']
        );

        const newUser = result.rows[0];

        // Generate JWT token
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.status(201).json({
            message: 'User registered successfully',
            token,
            user: newUser
        });
    } catch (err) {
        console.error('Register error:', err);
        return res.status(500).json({ message: 'Server error during registration' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await pool.query(
            'SELECT id, name, email, password, address, role FROM users WHERE LOWER(email) = LOWER($1)',
            [email.trim()]
        );

        if (result.rowCount === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, name: user.name },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        delete user.password;

        return res.json({
            message: 'Login successful',
            token,
            user
        });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ message: 'Server error during login' });
    }
};

const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        const result = await pool.query('SELECT password FROM users WHERE id = $1', [userId]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2', [newHashedPassword, userId]);

        return res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error('Update password error:', err);
        return res.status(500).json({ message: 'Server error updating password' });
    }
};

const getMe = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, name, email, address, role, created_at FROM users WHERE id = $1',
            [req.user.id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.json({ user: result.rows[0] });
    } catch (err) {
        console.error('Get profile error:', err);
        return res.status(500).json({ message: 'Server error fetching profile' });
    }
};

module.exports = {
    register,
    login,
    updatePassword,
    getMe
};
