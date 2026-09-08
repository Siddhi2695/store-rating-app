require('dotenv').config();
const { pool } = require('./db');

async function testConnection() {
    try {
        const userRes = await pool.query('SELECT id, name, email, role FROM users');
        console.log('Users in database:', userRes.rows);
        
        const storeRes = await pool.query('SELECT id, name, email, address FROM stores');
        console.log('Stores in database:', storeRes.rows);

        const ratingRes = await pool.query('SELECT * FROM ratings');
        console.log('Ratings in database:', ratingRes.rows);

        console.log('Database verification successfully completed!');
        process.exit(0);
    } catch (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
}

testConnection();
